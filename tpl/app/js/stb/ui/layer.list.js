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
 *
 * @example
 * var LayerList = require('stb/ui/tab.list'),
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
	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
		if ( config.current && config.current.constructor.name !== 'LayerItem' ) { throw new Error(__filename + ': wrong config.current type'); }
	}

	// can't accept focus
	config.focusable = config.focusable || false;

	// set default className if classList property empty or undefined
	config.className = 'layerList ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);
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
