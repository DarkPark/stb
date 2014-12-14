/**
 * @module stb/ui/modal.box
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Modal = require('./modal'),
	dom   = require('../dom');


/**
 * Base modal window implementation.
 *
 * @constructor
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 */
function ModalBox ( config ) {
	var body;

	// sanitize
	config = config || {};

	// parent init
	Modal.call(this, config);

	// correct CSS class names
	this.$node.classList.add('modalBox');

	// current inner node
	body = this.$body;

	body.appendChild(
		dom.tag('div', {className: 'cell'},
			this.$body = dom.tag('div', {className: 'content'}, 'qwe')
		)
	);
}


// inheritance
ModalBox.prototype = Object.create(Modal.prototype);
ModalBox.prototype.constructor = ModalBox;


// public export
module.exports = ModalBox;
