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

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('modal');
}


// inheritance
Modal.prototype = Object.create(Component.prototype);
Modal.prototype.constructor = Modal;


// public
module.exports = Modal;
