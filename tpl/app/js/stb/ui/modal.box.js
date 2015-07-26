/**
 * @module stb/ui/modal.box
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Base modal window implementation.
 *
 * @constructor
 * @extends Modal
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 */
function ModalBox ( config ) {
	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		// init parameters checks
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
	}

	// set default className if classList property empty or undefined
	config.className = 'modalBox ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);

	// create $body if not provided
	if ( this.$node === this.$body ) {
		// create centered div
		this.$body = document.createElement('div');
		this.$body.className = 'body';
		// add table-cell wrapper
		this.$node.appendChild(document.createElement('div').appendChild(this.$body).parentNode);
	}
}


// inheritance
ModalBox.prototype = Object.create(Component.prototype);
ModalBox.prototype.constructor = ModalBox;


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentModalBox = ModalBox;
}


// public
module.exports = ModalBox;
