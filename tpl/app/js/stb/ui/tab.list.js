/**
 * @module stb/ui/tab.list
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Tab list implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 *
 * @example
 * var TabList = require('stb/ui/tab.list'),
 *     tabList = new TabList({
 *         $node: window.someElementId,
 *         children: [
 *             new TabItem({
 *                 $node: window.anotherElementId
 *             })
 *         ],
 *         events: {
 *             'item:change': function ( event ) {
 *                 if ( event.prev ) {
 *                     event.prev.callSomeFunctionAfterHiding();
 *                 }
 *                 htmlElement.innerText = event.curr.someTitleAttribute
 *             }
 *         }
 *     });
 *
 * page.add(tabList);
 */
function TabList ( config ) {
	// sanitize
	config = config || {};

	/**
	 * Active at the moment tab item.
	 *
	 * @type {TabItem}
	 */
	this.current = null;

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
		if ( config.current && config.current.constructor.name !== 'TabItem' ) { throw new Error(__filename + ': wrong config.current type'); }
	}

	// can't accept focus
	config.focusable = config.focusable || false;

	// set default className if classList property empty or undefined
	config.className = 'tabList ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);

	// make some tab active
	if ( config.current ) {
		config.current.show();
	}
}


// inheritance
TabList.prototype = Object.create(Component.prototype);
TabList.prototype.constructor = TabList;


/**
 * Insert tab into specific index.
 * If index not provided, insert tab into the end.
 *
 * @param tab
 * @param index
 */
TabList.prototype.insert = function ( tab, index ) {
	var prevIndex;

	if ( DEBUG ) {
		if ( tab.constructor.name !== 'TabItem' ) { throw 'not a tab'; }
	}

	prevIndex = this.children.indexOf(tab);

	if ( prevIndex !== -1 ) {
		this.children.splice(prevIndex, 1);
		this.$body.removeChild(tab.$node);
	}

	debug.log('insert tab into ' + index);

	if ( index === this.children.length ) {
		this.$body.appendChild(tab.$node);
	} else {
		this.$body.insertBefore(tab.$node, this.$body.children[index]);
	}
	this.children.splice(index, 0, tab);

	if ( !tab.parent ) {
		tab.parent = this;
	}
};


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentTabList = TabList;
}


// public
module.exports = TabList;
