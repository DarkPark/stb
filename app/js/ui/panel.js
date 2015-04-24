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
 * var Panel = require('stb/ui/panel'),
 *     panel = new Panel({
 *         $node: document.getElementById('someId'),
 *         children: [
 *             new Panel({
 *                 $node: document.getElementById('anotherId')
 *             })
 *         ]
 *     });
 *
 * panel.add(
 *     new Button(),
 *     new Button(),
 *     new Button()
 * );
 *
 * page.add(panel);
 */
function Panel ( config ) {
	// sanitize
	config = config || {};

	// can't accept focus
	config.focusable = config.focusable || false;

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('panel');
}


// inheritance
Panel.prototype = Object.create(Component.prototype);
Panel.prototype.constructor = Panel;


// public
module.exports = Panel;
