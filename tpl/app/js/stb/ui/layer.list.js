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
 * var LayerList = require('stb/ui/layer.list'),
 *     layerList = new LayerList({
 *         $node: window.someElementId,
 *         children: [
 *             new LayerItem({
 *                 $node: window.anotherElementId
 *             })
 *         ]
 *     });
 *
 * page.add(layerList);
 */
function LayerList ( config ) {
    // sanitize
    config = config || {};

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
    }

    /**
     * z-index to layer items map.
     *
     * @type {Array}
     */
    this.map = [];

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


/**
 * Add a new component(s) as a child.
 */
LayerList.prototype.add = function () {
    var i, child;

    // parent invoke
    Component.prototype.add.apply(this, arguments);

    // walk through all the given elements
    for ( i = 0; i < arguments.length; i++ ) {
        child = arguments[i];

        // rework map and indexes
        child.$node.style.zIndex = this.map.length;
        this.map[this.map.length] = child;
    }
};


if ( DEBUG ) {
    // expose to the global scope
    window.ComponentLayerList = LayerList;
}


// public
module.exports = LayerList;
