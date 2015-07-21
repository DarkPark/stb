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

	// set default className if classList property empty or undefined
	config.className = config.className || 'modalBox';

	// parent init
	Component.call(this, config);

	// create $body if not provided
	if ( this.$node === this.$body ) {
		// create centered div
		this.$body = document.createElement('div');
		this.$body.className = 'body';
		// add table-cell wrapper
		this.$node.appendChild(document.createElement('div').appendChild(this.$body).parentNode);
	}


	if ( DEBUG ) {
		if ( !this.$body.classList.contains('body') ) { throw '$body node must have "body" token in className'; }
	}
}


// inheritance
ModalBox.prototype = Object.create(Component.prototype);
ModalBox.prototype.constructor = ModalBox;


// public
module.exports = ModalBox;
