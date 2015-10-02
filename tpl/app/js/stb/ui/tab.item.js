/**
 * @module stb/ui/tab.item
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Tab item implementation.
 * This component has redefined methods 'show' and 'hide', use them to switch between tabs.
 * All tab items are created invisible by default.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 *
 * @example
 * var TabItem = require('stb/ui/tab.item'),
 *     tabItem = new TabItem({
 *         $node: window.someId,
 *         children: [
 *             new Panel({
 *                 $node: window.anotherId
 *             })
 *         ],
 *         events: {
 *             show: function ( event ) {
 *                 // tab was activated
 *             },
 *             hide: function ( event ) {
 *                 // tab was hidden
 *             }
 *         }
 *     });
 *
 * tabList.add(tabItem);
 */
function TabItem ( config ) {
	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
	}

	// can't accept focus
	config.focusable = config.focusable || false;

	// set default className if classList property empty or undefined
	config.className = 'tabItem hidden ' + (config.className || '');

	// prevent parent hiding
	config.visible = null;

	// parent constructor call
	Component.call(this, config);

	this.visible = false;
}


// inheritance
TabItem.prototype = Object.create(Component.prototype);
TabItem.prototype.constructor = TabItem;


/**
 * Make the tab visible, i.e. set active tab, and notify subscribers.
 * Hide previous visible tab if exists.
 *
 * @param {Object} [data] custom data which passed into handlers
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/ui/tab.item~TabItem#show
 */
TabItem.prototype.show = function ( data ) {
	var prev = null;

	if ( DEBUG ) {
		if ( !this.parent ) { throw new Error(__filename + ': no parent for tab item'); }
		if ( this.parent.constructor.name !== 'TabList' ) { throw new Error(__filename + ': wrong parent for tab item'); }
		if ( this.parent.current && !(this.parent.current instanceof TabItem) ) { throw new Error(__filename + ': wrong current tab item type'); }
	}

	// is it hidden
	if ( !this.visible ) {
		// hide previous tab
		if ( this.parent.current ) {
			prev = this.parent.current;
			prev.hide(data);
		}

		Component.prototype.show.call(this, data);
		this.parent.current = this;

		/*// there are some listeners
		if ( this.parent.events['switch'] ) {
			this.parent.emit('switch', {prev: prev, curr: this});
		}*/

		return true;
	}

	// nothing was done
	return true;
};


/**
 * Make the tab hidden and notify subscribers.
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/ui/tab.item~TabItem#hide
 */
TabItem.prototype.hide = function () {
	if ( DEBUG ) {
		if ( !this.parent ) { throw new Error(__filename + ': no parent for tab item'); }
		if ( this.parent.constructor.name !== 'TabList' ) { throw new Error(__filename + ': wrong parent for tab item'); }
		if ( this.parent.current && !(this.parent.current instanceof TabItem) ) { throw new Error(__filename + ': wrong current tab item type'); }
	}

	if ( Component.prototype.hide.call(this) ) {
		this.parent.current = null;

		return true;
	}

	// nothing was done
	return true;
};


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentTabItem = TabItem;
}


// public
module.exports = TabItem;
