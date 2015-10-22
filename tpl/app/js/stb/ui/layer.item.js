/**
 * @module stb/ui/layer.item
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Layer item implementation.
 * All layer items are created visible by default.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 *
 * @example
 * var LayerItem = require('stb/ui/layer.item'),
 *     layerItem = new LayerItem({
 *         $node: window.someId,
 *         children: [
 *             new Panel({
 *                 $node: window.anotherId
 *             })
 *         ],
 *         events: {
 *             'move:top': function ( event ) {
 *                 this.children[0].$body.innerText = event.data;
 *                 this.children[0].focus();
 *             }
 *         }
 *     });
 *
 * layerList.add(layerItem);
 */
function LayerItem ( config ) {
	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
	}

	// can't accept focus
	config.focusable = config.focusable || false;

	// set default className if classList property empty or undefined
	config.className = 'layerItem ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);
}


// inheritance
LayerItem.prototype = Object.create(Component.prototype);
LayerItem.prototype.constructor = LayerItem;


/**
 * Delete this component and clear all associated events.
 */
LayerItem.prototype.remove = function () {
	var map    = this.parent.map,
		zIndex = this.$node.style.zIndex,
		mapSize, i;

	// remove
	map.splice(zIndex, 1);

	// reindex
	for ( i = 0, mapSize = map.length; i < mapSize; i++ ) { map[i].$node.style.zIndex = i; }

	// parent invoke
	Component.prototype.remove.call(this);

	/*// there are some listeners
	if ( this.parent.events['change'] ) {
		// notify listeners
		this.emit('change', {state: 'remove', item: this});
	}*/
};


/**
 * Move layer by the given shift value.
 *
 * @private
 *
 * @param {number} shift direction and shift size
 * @param {string} type movement type
 *
 * @fires module:stb/ui/layer.item~LayerItem#move
 */
LayerItem.prototype.move = function ( shift, type ) {
	var map     = this.parent.map,
		mapSize = map.length,
		zIndex  = Number(this.$node.style.zIndex),
		i;

	if ( arguments.length !== 2 ) { throw new Error(__filename + ': wrong arguments number'); }
	if ( Number(shift) !== shift ) { throw new Error(__filename + ': shift must be a number'); }
	if ( typeof type !== 'string' || type.length === 0 ) { throw new Error(__filename + ': wrong or empty type'); }

	// move
	map.splice(zIndex, 1);
	map.splice(zIndex + shift, 0, this);

	// reindex
	for ( i = 0; i < mapSize; i++ ) { map[i].$node.style.zIndex = i; }

	// there are some listeners
	if ( this.events['move'] ) {
		// notify listeners
		this.emit('move', {shift: shift, type: type});
	}

	/*// there are some listeners
	if ( this.parent.events['change'] ) {
		// notify listeners
		this.emit('change', {state: event, item: this});
	}*/
};


/**
 * Move layer up in the order of the list.
 *
 * @param {number} [step=1] shift size
 */
LayerItem.prototype.moveUp = function ( step ) {
	this.move(step || 1, 'up');
};


/**
 * Move layer down in the order of the list.
 *
 * @param {number} [step=-1] shift size
 */
LayerItem.prototype.moveDown = function ( step ) {
	this.move(-step || -1, 'down');
};


/**
 * Move layer to the top of the layers list.
 */
LayerItem.prototype.moveTop = function () {
	this.move(this.parent.map.length, 'top');
};


/**
 * Move layer to the bottom of the layers list.
 */
LayerItem.prototype.moveBottom = function () {
	this.move(-this.$node.style.zIndex, 'bottom');
};


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentLayerItem = LayerItem;
}


// public
module.exports = LayerItem;
