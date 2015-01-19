/**
 * @module stb/ui/button
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Base button implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {string} [config.value] button caption text (generated if not set)
 * @param {string} [config.icon] button icon name
 *
 * @example
 * var Button = require('stb/ui/button'),
 *     button = new Button({
 *         $node: document.getElementById(id),
 *         value: 'Apply changes'
 *     });
 */
function Button ( config ) {
	// current execution context
	var self = this;

	// sanitize
	config = config || {};

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('button');

	// set title
	if ( config.value !== undefined ) {
		this.$body.innerText = config.value;
	} else {
		this.$body.innerText = this.constructor.name + '.' + this.id;
	}

	if ( config.icon ) {
		self.$node.classList.add('icon');
		self.$node.classList.add('icon-' + config.icon);
	}

	this.addListener('keydown', function ( event ) {
		if ( event.code === 13 ) {
			// there are some listeners
			if ( self.events['click'] !== undefined ) {
				/**
				 * Mouse click event emulation.
				 *
				 * @event module:stb/ui/button~Button#click
				 *
				 * @type {Object}
				 * @property {Event} event click event data
				 */
				self.emit('click', {event: event});
			}
		}
	});

	this.addListener('click', function () {
		//console.log(this);
		self.$node.classList.add('click');
		setTimeout(function () {
			self.$node.classList.remove('click');
		}, 200);
	});
}


// inheritance
Button.prototype = Object.create(Component.prototype);
Button.prototype.constructor = Button;


// public export
module.exports = Button;
