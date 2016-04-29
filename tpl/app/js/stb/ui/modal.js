/**
 * @module stb/ui/modal
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Base modal window implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 */
function Modal ( config ) {
    // sanitize
    config = config || {};

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
    }

    // set default className if classList property empty or undefined
    config.className = 'modal ' + (config.className || '');

    // parent constructor call
    Component.call(this, config);
}


// inheritance
Modal.prototype = Object.create(Component.prototype);
Modal.prototype.constructor = Modal;


if ( DEBUG ) {
    // expose to the global scope
    window.ComponentModal = Modal;
}


// public
module.exports = Modal;
