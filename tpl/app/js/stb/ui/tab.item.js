/**
 * @module stb/ui/tab.item
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Tab item implementation.
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

	/**
	 * Tab state.
	 *
	 * @type {boolean}
	 */
	this.isActive = false;

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
 * Set top active tab.
 *
 * @param {object} [data] data for tab
 *
 * @return {boolean} apply result
 *
 * @fires module:stb/ui/tab.item~TabItem#activate
 * @fires module:stb/ui/tab.list~TabList#item:change
 */
TabItem.prototype.activate = function ( data ) {
	var prev = null;

	if ( this.isActive ) {
		return false;
	}

	if ( DEBUG ) {
		if ( !this.parent ) {
			throw new Error(__filename + ': no parent for tab item');
		}
		if ( this.parent.constructor.name !== 'TabList' ) {
			throw new Error(__filename + ': no parent for tab item');
		}
	}

	if ( this.parent.current ) {
		prev = this.parent.current;
		prev.isActive = false;
		prev.$node.classList.remove('active');
	}

	this.isActive = true;

	this.$node.classList.add('active');

	this.parent.current = this;

	if ( this.events['activate'] ) {
		this.emit('activate', {data: data});
	}

	if ( this.parent.events['item:change'] ) {
		this.parent.emit('item:change', {prev: prev, curr: this});
	}

	return true;
};


// public
module.exports = TabItem;
