/**
 * @module stb/ui/widget
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Base widget implementation.
 *
 * A part-screen top-level layer that can operate as an independent separate entity.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {boolean} [config.visible=false] component initial visibility state flag
 * @param {boolean} [config.focusable=false] component can accept focus or not
 *
 * @example
 * var Widget = require('stb/ui/widget'),
 *     widget = new Widget({
 *         $node: document.getElementById(id)
 *     });
 *
 * // somewhere
 * widget.show();
 */
function Widget ( config ) {
	// sanitize
	config = config || {};

	// can't accept focus
	config.focusable = config.focusable || false;

	// hidden
	config.visible = config.visible || false;

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('widget');
}


// inheritance
Widget.prototype = Object.create(Component.prototype);
Widget.prototype.constructor = Widget;


// public
module.exports = Widget;
