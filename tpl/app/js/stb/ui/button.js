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
 * @param {string} [config.icon=false] button icon name
 *
 * @example
 * var Button = require('stb/ui/button'),
 *     button = new Button({
 *         $node: document.getElementById(id),
 *         icon: 'menu'
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

	// not a custom content
	if ( this.$node === this.$body ) {
		// so everything should be prepared here

		if ( config.icon ) {
			if ( DEBUG ) {
				if ( typeof config.icon !== 'string' || config.icon.length === 0 ) { throw 'wrong or empty config.icon'; }
			}

			// insert icon
			this.$icon = this.$node.appendChild(document.createElement('div'));
			this.$icon.className = 'icon ' + config.icon;
		}

		if ( config.value !== undefined ) {
			if ( DEBUG ) {
				if ( typeof config.value !== 'string' || config.value.length === 0 ) { throw 'wrong or empty config.value'; }
			}

			// insert caption placeholder
			this.$body = this.$node.appendChild(document.createElement('div'));
			this.$body.classList.add('text');
			// fill it
			this.$body.innerText = config.value;
		}
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


// public
module.exports = Button;
