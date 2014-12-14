/**
 * @module stb/ui/modal.message
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var ModalBox = require('./modal.box.js'),
	dom      = require('../dom');


/**
 * Base modal window implementation.
 *
 * @constructor
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

	this.$body.appendChild(
		dom.tag('div', {className: 'cell'},
			this.$header = dom.tag('div', {className: 'header'},  this.constructor.name),
			this.$body   = dom.tag('div', {className: 'content'}, this.constructor.name),
			this.$footer = dom.tag('div', {className: 'footer'},  this.constructor.name)
		)
	);
}


// inheritance
ModalMessage.prototype = Object.create(ModalBox.prototype);
ModalMessage.prototype.constructor = ModalMessage;


// public export
module.exports = ModalMessage;
