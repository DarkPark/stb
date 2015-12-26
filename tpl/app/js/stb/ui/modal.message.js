/**
 * @module stb/ui/modal.message
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var ModalBox = require('./modal.box.js');


/**
 * Base modal window implementation.
 *
 * @constructor
 * @extends ModalBox
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 */
function ModalMessage ( config ) {
    // sanitize
    config = config || {};

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
    }

    // set default className if classList property empty or undefined
    config.className = 'modalMessage ' + (config.className || '');

    // parent constructor call
    ModalBox.call(this, config);

    this.$header  = this.$body.appendChild(document.createElement('div'));
    this.$content = this.$body.appendChild(document.createElement('div'));
    this.$footer  = this.$body.appendChild(document.createElement('div'));

    this.$header.className  = 'header';
    this.$content.className = 'content';
    this.$footer.className  = 'footer';

    this.$header.innerText  = 'header';
    this.$content.innerText = 'content';
    this.$footer.innerText  = 'footer';
}


// inheritance
ModalMessage.prototype = Object.create(ModalBox.prototype);
ModalMessage.prototype.constructor = ModalMessage;


if ( DEBUG ) {
    // expose to the global scope
    window.ComponentModalMessage = ModalMessage;
}


// public
module.exports = ModalMessage;
