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

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		// init parameters checks
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
	}

	// can't accept focus
	config.focusable = config.focusable || false;

	// set default className if classList property empty or undefined
	config.className = 'panel ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);
}


// inheritance
Panel.prototype = Object.create(Component.prototype);
Panel.prototype.constructor = Panel;


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentPanel = Panel;
}


// public
module.exports = Panel;
