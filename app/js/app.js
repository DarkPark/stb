/**
 * @module stb/app
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Model  = require('./model'),
	router = require('./router'),
	app, linkCSS;


require('stb/shims');


/**
 * @instance
 * @type {Model}
 */
app = new Model({
	/**
	 * Enable logging and debugging flag set by debug module at runtime.
	 *
	 * @type {boolean}
	 */
	debug: false,

	/**
	 * True if executed on the STB device, set by debug module at runtime.
	 *
	 * @type {boolean}
	 */
	host: true,

	/**
	 * Screen geometry and margins.
	 *
	 * @type {Object}
	 * @property {number} height Total screen height
	 * @property {number} width Total screen width
	 * @property {number} availTop top safe zone margin
	 * @property {number} availRight right safe zone margin
	 * @property {number} availBottom bottom safe zone margin
	 * @property {number} availLeft left safe zone margin
	 * @property {number} availHeight safe zone height
	 * @property {number} availWidth safe zone width
	 */
	screen: null,

	/**
	 * Timestamps data.
	 *
	 * @type {Object}
	 * @property {number} init application initialization time (right now)
	 * @property {number} load document onload event
	 * @property {number} done onload event sent and processed
	 */
	time: {
		init: +new Date(),
		load: 0,
		done: 0
	}
});


/**
 * Set crops, total, content size and link the corresponding CSS file.
 *
 * @param {Object} metrics screen params specific to resolution
 *
 * @return {boolean} operation status
 */
app.setScreen = function ( metrics ) {
	if ( DEBUG ) {
		if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
	}

	if ( metrics ) {
		if ( DEBUG ) {
			if ( typeof metrics !== 'object' ) { throw 'wrong metrics type'; }
		}

		// calculate and extend
		metrics.availHeight = metrics.height - (metrics.availTop + metrics.availBottom);
		metrics.availWidth  = metrics.width - (metrics.availLeft + metrics.availRight);

		// set max browser window size
		window.moveTo(0, 0);
		window.resizeTo(metrics.width, metrics.height);

		// already was initialized
		if ( linkCSS && linkCSS instanceof HTMLLinkElement ) {
			// remove all current CSS styles
			document.head.removeChild(linkCSS);
		}

		// load CSS file base on resolution
		linkCSS = document.createElement('link');
		linkCSS.rel  = 'stylesheet';
		linkCSS.href = 'css/' + metrics.height + '.css';
		document.head.appendChild(linkCSS);

		// provide global access
		this.data.screen = metrics;

		return true;
	}

	// nothing has applied
	return false;
};


// apply screen size, position and margins
app.setScreen(require('metrics')[screen.height]);


/**
 * The load event is fired when a resource and its dependent resources have finished loading.
 *
 * Control flow:
 *   1. Global handler.
 *   2. Each page handler.
 *   3. Application DONE event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/load
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('load', function globalEventListenerLoad ( event ) {
	var path;

	debug.event(event);

	// time mark
	app.data.time.load = event.timeStamp;

	// global handler
	// there are some listeners
	if ( app.events[event.type] !== undefined ) {
		// notify listeners
		app.emit(event.type, event);
	}

	// local handler on each page
	router.pages.forEach(function forEachPages ( page ) {
		debug.log('component ' + page.constructor.name + '.' + page.id + ' load', 'green');

		// there are some listeners
		if ( page.events[event.type] !== undefined ) {
			// notify listeners
			page.emit(event.type, event);
		}
	});

	// go to the given page if set
	if ( location.hash ) {
		path = router.parse(location.hash);
		router.navigate(path.name, path.data);
	}

	// time mark
	app.data.time.done = +new Date();

	// everything is ready
	// and there are some listeners
	if ( app.events['done'] !== undefined ) {
		// notify listeners
		app.emit('done', event);
	}
});


/**
 * The unload event is fired when the document or a child resource is being unloaded.
 *
 * Control flow:
 *   1. Each page handler.
 *   2. Global handler.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/unload
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('unload', function globalEventListenerUnload ( event ) {
	debug.event(event);

	// global handler
	// there are some listeners
	if ( app.events[event.type] !== undefined ) {
		// notify listeners
		app.emit(event.type, event);
	}

	// local handler on each page
	router.pages.forEach(function forEachPages ( page ) {
		// there are some listeners
		if ( page.events[event.type] !== undefined ) {
			// notify listeners
			page.emit(event.type, event);
		}
	});
});


///**
// * The hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL that follows the # symbol, including the # symbol).
// * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/hashchange
// */
//window.addEventListener('hashchange', function globalEventListenerHashChange ( event ) {
//	//var page, data;
//
//	console.log(event);
//	router.emit('change');
//
//	//debug.event(event);
//	//debug.inspect(event);
//    //
//	//app.emit(event.type, event);
//
//	//app.parseHash();
//
////	data = document.location.hash.split('/');
////
////	// the page is given
////	if ( data.length > 0 && (page = decodeURIComponent(data.shift().slice(1))) ) {
////		// the page params are given
////		if ( data.length > 0 ) {
////			data = data.map(decodeURIComponent);
////		}
////
////		app.emit(event.type, {page: page, data: data});
////	}
//});


/**
 * The error event is fired when a resource failed to load.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/error
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('error', function globalEventListenerError ( event ) {
	debug.event(event);
});


/**
 * The keydown event is fired when a key is pressed down.
 * Set event.stop to true in order to prevent bubbling.
 *
 * Control flow:
 *   1. Current active component on the active page.
 *   2. Current active page itself.
 *   3. Application.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keydown
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('keydown', function globalEventListenerKeydown ( event ) {
	var page = router.current;

	if ( DEBUG ) {
		if ( page === null || page === undefined ) { throw 'app should have at least one page'; }
	}

	// filter phantoms
	if ( event.keyCode === 0 ) { return; }

	// combined key code
	event.code = event.keyCode;

	// apply key modifiers
	if ( event.shiftKey ) { event.code += 1000; }
	if ( event.altKey )   { event.code += 2000; }

	debug.event(event);

	// current component handler
	if ( page.activeComponent && page.activeComponent !== page ) {
		// component is available and not page itself
		if ( page.activeComponent.events[event.type] !== undefined ) {
			// there are some listeners
			page.activeComponent.emit(event.type, event);
		}
	}

	// page handler
	if ( !event.stop ) {
		// not prevented
		if ( page.events[event.type] !== undefined ) {
			// there are some listeners
			page.emit(event.type, event);
		}
	}

	// global app handler
	if ( !event.stop ) {
		// not prevented
		if ( app.events[event.type] !== undefined ) {
			// there are some listeners
			app.emit(event.type, event);
		}
	}
});


/**
 * The keypress event is fired when press a printable character.
 * Delivers the event only to activeComponent at active page.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keypress
 *
 * @param {Event} event generated object with event data
 * @param {string} event.char entered character
 */
window.addEventListener('keypress', function ( event ) {
	var page = router.current;

	if ( DEBUG ) {
		if ( page === null || page === undefined ) { throw 'app should have at least one page'; }
	}

	//debug.event(event);

	// current component handler
	if ( page.activeComponent && page.activeComponent !== page ) {
		// component is available and not page itself
		if ( page.activeComponent.events[event.type] !== undefined ) {
			// there are some listeners
			page.activeComponent.emit(event.type, event);
		}
	}
});


/**
 * The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a single element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/click
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('click', function globalEventListenerClick ( event ) {
	debug.event(event);
});


/**
 * The contextmenu event is fired when the right button of the mouse is clicked (before the context menu is displayed),
 * or when the context menu key is pressed (in which case the context menu is displayed at the bottom left of the focused
 * element, unless the element is a tree, in which case the context menu is displayed at the bottom left of the current row).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/contextmenu
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('contextmenu', function globalEventListenerContextmenu ( event ) {
	debug.event(event);

	if ( !DEBUG ) {
		// disable right click in release mode
		event.preventDefault();
	}
});


///**
// * The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated.
// * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
// */
//window.addEventListener('wheel', function globalEventListenerWheel ( event ) {
//	var page = router.current;
//
//	debug.event(event);
//
//	event.preventDefault();
//	event.stopPropagation();
//
//	// local handler
//	if ( page ) {
//		if ( page.activeComponent && page.activeComponent !== page ) {
//			page.activeComponent.emit(event.type, event);
//		}
//
//		if ( !event.stop ) {
//			// not prevented
//			page.emit(event.type, event);
//		}
//	}
//});


// public export
module.exports = app;
