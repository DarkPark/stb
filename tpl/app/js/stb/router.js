/**
 * Singleton for page navigation with history.
 *
 * All page modules should be in the directory `app/js/pages`.
 * Page module name and the corresponding file name should be the same.
 *
 * Include module to start working:
 *
 * ```js
 * var router = require('stb/router');
 * ```
 *
 * Init with page modules:
 *
 * ```js
 * router.data([
 *     require('./pages/init'),
 *     require('./pages/main'),
 *     require('./pages/help')
 * ]);
 * ```
 *
 * Each page has its ID. The same ID should be used in HTML.
 *
 * Make some page active/visible by its ID:
 *
 * ```js
 * router.navigate('pageMain');
 * ```
 *
 * This will hide the current page, activate the `pageMain` page and put it in the tail of the history list.
 *
 * All subscribers of the current and `pageMain` page will be notified with `show/hide` events.
 *
 * Also the router emits `navigate` event to all subscribers.
 *
 *
 * To get to the previous active page use:
 *
 * ```js
 * router.back();
 * ```
 *
 * The module also has methods to parse location hash address and serialize it back:
 *
 * ```js
 * router.parse('#pageMain/some/additional/data');
 * router.stringify('pageMain', ['some', 'additional', 'data']);
 * ```
 *
 * Direct modification of the URL address should be avoided.
 * The methods `router.navigate` and `router.back` should be used instead.
 *
 * @module stb/router
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Emitter = require('./emitter'),
	router;


/**
 * @instance
 * @type {Emitter}
 */
router = new Emitter();


/**
 * Current active/visible page.
 *
 * @readonly
 * @type {Page}
 */
router.current = null;


/**
 * List of all visited pages.
 *
 * @readonly
 * @type {Page[]}
 */
router.history = [];


/**
 * List of all stored pages.
 *
 * @readonly
 * @type {Page[]}
 */
router.pages = [];


/**
 * Hash table of all pages ids with links to pages.
 *
 * @readonly
 * @type {Object.<string, Page>}
 */
router.ids = {};


/**
 * Set router data event.
 *
 * @event module:stb/router#init
 *
 * @type {Object}
 * @property {Page[]} pages new page list
 */

/**
 * Clear and fill the router with the given list of pages.
 *
 * @param {Page[]} pages list of pages to add
 * @return {boolean} operation status
 *
 * @fires module:stb/router#init
 */
router.init = function ( pages ) {
	var i, l, item;

	if ( pages !== undefined ) {
		if ( DEBUG ) {
			if ( !Array.isArray(pages) ) { throw 'wrong pages type'; }
		}

		// reset page list
		this.pages = [];

		// apply list
		this.pages = pages;

		// extract ids
		for ( i = 0, l = pages.length; i < l; i++ ) {
			item = pages[i];
			this.ids[item.id] = item;

			// find the currently active page
			if ( item.active ) {
				this.current = item;
			}
		}

		// there are some listeners
		if ( this.events['init'] !== undefined ) {
			// notify listeners
			this.emit('init', {pages: pages});
		}

		return true;
	}

	return false;
};


/**
 * Extract the page name and data from url hash.
 *
 * @param {string} hash address hash part to parse
 *
 * @return {{name: string, data: string[]}} parsed data
 *
 * @example
 * router.parse('#main/some/additional/data');
 * // execution result
 * {name: 'main', data: ['some', 'additional', 'data']}
 */
router.parse = function ( hash ) {
	var page = {
			name : '',
			data : []
		};

	// get and decode all parts
	page.data = hash.split('/').map(decodeURIComponent);
	// the first part is a page id
	// everything else is optional path
	page.name = page.data.shift().slice(1);

	return page;
};


/**
 * Convert the given page name and its data to url hash.
 *
 * @param {string} name page name
 * @param {string[]} [data=[]] page additional parameters
 *
 * @return {string} url hash
 *
 * @example
 * router.stringify('main', ['some', 'additional', 'data']);
 * // execution result
 * '#main/some/additional/data'
 */
router.stringify = function ( name, data ) {
	// validation
	data = Array.isArray(data) ? data : [];

	// encode all parts
	name = encodeURIComponent(name);
	data = data.map(encodeURIComponent);
	// add encoded name to the beginning
	data.unshift(name);

	// build an uri
	return data.join('/');
};


/**
 * Make the given inactive/hidden page active/visible.
 * Pass some data to the page and trigger the corresponding event.
 *
 * @param {Page} page item to show
 * @param {*} [data] data to send to page
 *
 * @return {boolean} operation status
 */
router.show = function ( page, data ) {
	// page available and can be hidden
	if ( page && !page.active ) {
		// apply visibility
		page.$node.classList.add('active');
		page.active  = true;
		this.current = page;

		// there are some listeners
		if ( page.events['show'] !== undefined ) {
			// notify listeners
			page.emit('show', {page: page, data: data});
		}

		debug.log('component ' + page.constructor.name + '.' + page.id + ' show', 'green');

		return true;
	}

	// nothing was done
	return false;
};


/**
 * Make the given active/visible page inactive/hidden and trigger the corresponding event.
 *
 * @param {Page} page item to hide
 *
 * @return {boolean} operation status
 */
router.hide = function ( page ) {
	// page available and can be hidden
	if ( page && page.active ) {
		// apply visibility
		page.$node.classList.remove('active');
		page.active  = false;
		this.current = null;

		// there are some listeners
		if ( page.events['hide'] !== undefined ) {
			// notify listeners
			page.emit('hide', {page: page});
		}

		debug.log('component ' + page.constructor.name + '.' + page.id + ' hide', 'grey');

		return true;
	}

	// nothing was done
	return false;
};


/**
 * Browse to a page with the given name.
 * Do nothing if the name is invalid. Otherwise hide the current, show new and update history.
 *
 * @param {string} name page id
 * @param {Array} [data] options to pass to the page on show
 *
 * @return {boolean} operation status
 */
router.navigate = function ( name, data ) {
	var pageFrom = this.current,
		pageTo   = this.ids[name];

	if ( DEBUG ) {
		if ( router.pages.length > 0 ) {
			if ( !pageTo || typeof pageTo !== 'object' ) { throw 'wrong pageTo type'; }
			if ( !('active' in pageTo) ) { throw 'missing field "active" in pageTo'; }
		}
	}

	// valid not already active page
	if ( pageTo && !pageTo.active ) {
		debug.log('router.navigate: ' + name, pageTo === pageFrom ? 'grey' : 'green');

		// update url
		location.hash = this.stringify(name, data);

		// apply visibility
		this.hide(this.current);
		this.show(pageTo, data);

		// there are some listeners
		if ( this.events['navigate'] !== undefined ) {
			// notify listeners
			this.emit('navigate', {from: pageFrom, to: pageTo});
		}

		// store
		this.history.push(pageTo);

		return true;
	}

	debug.log('router.navigate: ' + name, 'red');

	// nothing was done
	return false;
};


/**
 * Go back one step in the history.
 * If there is no previous page, does nothing.
 *
 * @return {boolean} operation status
 */
router.back = function () {
	var pageFrom, pageTo;

	debug.log('router.back', this.history.length > 1 ? 'green' : 'red');

	// there are some pages in the history
	if ( this.history.length > 1 ) {
		// remove the current
		pageFrom = this.history.pop();

		// new tail
		pageTo = this.history[this.history.length - 1];

		// valid not already active page
		if ( pageTo && !pageTo.active ) {
			// update url
			location.hash = pageTo.id;

			// apply visibility
			this.hide(this.current);
			this.show(pageTo);

			// there are some listeners
			if ( this.events['navigate'] !== undefined ) {
				// notify listeners
				this.emit('navigate', {from: pageFrom, to: pageTo});
			}

			return true;
		}
	}

	// nothing was done
	return false;
};


// public
module.exports = router;
