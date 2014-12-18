/**
 * @module stb/ui/panel
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Base panel implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 *
 * @example
 * var header = new Panel();
 * page.add(header);
 * header.add(
 *     new Button(),
 *     new Button(),
 *     new Button()
 * );
 */
function Panel ( config ) {
	// sanitize
	config = config || {};

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('panel');
}


// inheritance
Panel.prototype = Object.create(Component.prototype);
Panel.prototype.constructor = Panel;


// public export
module.exports = Panel;
