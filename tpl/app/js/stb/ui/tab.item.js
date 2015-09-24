/**
 * @module stb/ui/tab.item
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Tab item implementation.
 * This component has redefined methods 'show' and 'hide', use them to show/hide tab.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 *
 * @example
 * var TabItem = require('stb/ui/tab.item'),
 *     tab = new TabItem({
 *         $node: document.getElementById('someId'),
 *         children: [
 *             new Panel({
 *                 $node: document.getElementById('anotherId')
 *             })
 *         ],
 *         events: {
 *             activate: function ( event ) {
 *                 this.children[0].$body.innerText = event.data;
 *                 this.children[0].focus();
 *             }
 *         }
 *     });
 *
 * page.add(tab);
 */
function TabItem ( config ) {
	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) {
			throw new Error(__filename + ': wrong config type');
		}
		if ( config.className && typeof config.className !== 'string' ) {
			throw new Error(__filename + ': wrong or empty config.className');
		}
	}

	// can't accept focus
	config.focusable = config.focusable || false;

	// set default className if classList property empty or undefined
	config.className = 'tabItem ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);
}


// inheritance
TabItem.prototype = Object.create(Component.prototype);
TabItem.prototype.constructor = TabItem;


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentTabItem = TabItem;
}


/**
 * Make the tab visible, i.e. set active tab, and notify subscribers.
 * Hide previous visible tab if exists.
 *
 * @param {Object} data custom data which passed into handlers
 *
 * @return {boolean} apply result
 *
 * @fires module:stb/component~Component#show
 */
Component.prototype.show = function ( data ) {
	var prev;

	// is it hidden
	if ( !this.visible ) {
		if ( DEBUG ) {
			if ( !this.parent ) { throw new Error(__filename + ': no parent for tab item'); }
			if ( this.parent.constructor.name !== 'TabList' ) { throw new Error(__filename + ': no parent for tab item'); }
		}

		if ( this.parent.current ) {
			prev = this.parent.current;
			prev.hide();
		}
		// correct style
		this.$node.classList.remove('hidden');
		// flag
		this.visible = true;
		// make link
		this.parent.current = this;

		// there are some listeners
		if ( this.events['show'] ) {
			/**
			 * Make the component visible.
			 *
			 * @event module:stb/component~Component#show
			 */
			this.emit('show', data);
		}

		return true;
	}

	// nothing was done
	return false;
};


/**
 * Make the tab hidden and notify subscribers.
 *
 * @return {boolean} apply result
 *
 * @fires module:stb/component~Component#hide
 */
Component.prototype.hide = function () {
	// is it visible
	if ( this.visible ) {
		if ( DEBUG ) {
			if ( !this.parent ) { throw new Error(__filename + ': no parent for tab item'); }
			if ( this.parent.constructor.name !== 'TabList' ) { throw new Error(__filename + ': no parent for tab item'); }
		}

		// correct style
		this.$node.classList.add('hidden');
		// flag
		this.visible = false;
		// remove link
		this.parent.current = null;

		// there are some listeners
		if ( this.events['hide'] ) {
			/**
			 * Make the component hidden.
			 *
			 * @event module:stb/component~Component#hide
			 */
			this.emit('hide');
		}

		return true;
	}

	// nothing was done
	return false;
};


// public
module.exports = TabItem;
