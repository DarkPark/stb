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
 *     tabs = new TabList({
 *         $node: window.someElementId,
 *         children: [
 *             new Panel({
 *                 $node: document.anotherElementId
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
 * page.add(tabs);
 */
function TabList ( config ) {
	// sanitize
	config = config || {};

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

	if ( config.current ) {
		config.current.activate();
	}
}


// inheritance
TabList.prototype = Object.create(Component.prototype);
TabList.prototype.constructor = TabList;


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentTabList = TabList;
}


// public
module.exports = TabList;
