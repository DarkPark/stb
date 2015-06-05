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

	// parent init
	ModalBox.call(this, config);

	// correct CSS class names
	this.$node.classList.add('modalMessage');

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


// public
module.exports = ModalMessage;
