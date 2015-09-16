/**
 * @module stb/ui/layer.list
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Layer list implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {number} [config.zIndex] if you need z-index layer logic, provide config.zIndex to the constructor
 *
 * @example
 * var LayerList = require('stb/ui/layer.list'),
 *     ll = new LayerList({
 *         $node: window.someElementId,
 *         children: [
 *             new LayerItem({
 *                 $node: document.anotherElementId
 *             })
 *         ]
 *     });
 *
 * page.add(ll);
 */
function LayerList ( config ) {
	var self = this;

	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
		if ( config.current && config.current.constructor.name !== 'LayerItem' ) { throw new Error(__filename + ': wrong config.current type'); }
	}

	/**
	 * z-index value.
	 * @type {(boolean|number)}
	 */
	this.zIndex = false;

	/**
	 * Hash table for z-index layers.
	 * @type {Array}
	 */
	this.map = {};

	// navigation
	if ( typeof config.zIndex === 'number' ) {
		// apply
		this.zIndex = config.zIndex;

		if ( config.children ) {
			// if children provided, setup their z-index
			config.children.forEach(function ( item, index ) {
				item.zIndex = index + self.zIndex;
				item.$node.style.zIndex = item.zIndex;
				self.map[item.zIndex] = item;
			});
		}
	}

	// can't accept focus
	config.focusable = config.focusable || false;

	// set default className if classList property empty or undefined
	config.className = 'layerList ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);

	if ( typeof this.zIndex === 'number' ) {
		// setup z-index property to each children
		this.addListener('add', function ( event ) {
			event.item.zIndex = this.children.length + this.zIndex - 1;
			event.item.$node.style.zIndex = event.item.zIndex;
			debug.info(event.item.zIndex, 'adding layer with z index');
			self.map[event.item.zIndex] = event.item;
		});
	}
}


// inheritance
LayerList.prototype = Object.create(Component.prototype);
LayerList.prototype.constructor = LayerList;


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentLayerList = LayerList;
}


// public
module.exports = LayerList;
