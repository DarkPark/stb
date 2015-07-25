/**
 * @module stb/ui/button
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
	keys      = require('../keys');


/**
 * Base button implementation.
 *
 * Has global options:
 *     Button.prototype.clickDuration - time to apply "click" class, does not apply if 0
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
 *     btnSimple, btnIcon, btnDetached;
 *
 * btnSimple = new Button({
 *     $node: document.getElementById('btnSimple'),
 *     value: 'Simple button'
 * });
 *
 * btnIcon = new Button({
 *     $node: document.getElementById('btnIcon'),
 *     icon: 'menu'
 *     value: 'Button with icon'
 * });
 *
 * btnDetached = new Button({
 *     value: 'Button not added to the page',
 *     className: 'wide'
 * });
 */
function Button ( config ) {
	// current execution context
	var self = this;

	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': ' + 'component: wrong config type'); }
		// init parameters checks
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': ' + 'wrong or empty config.className'); }
		if ( config.icon      && typeof config.icon      !== 'string' ) { throw new Error(__filename + ': ' + 'wrong or empty config.icon'); }
		if ( config.value     && typeof config.value     !== 'string' ) { throw new Error(__filename + ': ' + 'wrong or empty config.value'); }
	}

	// set default className if classList property empty or undefined
	config.className = 'button ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);

	// optional dom
	if ( config.icon ) {
		// insert icon
		this.$icon = this.$body.appendChild(document.createElement('div'));
		this.$icon.className = 'icon ' + config.icon;
	}

	// insert caption placeholder
	this.$text = this.$body.appendChild(document.createElement('div'));
	this.$text.classList.add('text');

	if ( config.value ) {
		// fill it
		this.$text.innerText = config.value;
	}

	this.addListener('keydown', function ( event ) {
		if ( event.code === keys.ok ) {
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

	if ( this.clickDuration ) {
		// apply "click" class only if necessary
		this.addListener('click', function () {
			self.$node.classList.add('click');

			setTimeout(function () {
				self.$node.classList.remove('click');
			}, this.clickDuration);
		});
	}
}


// inheritance
Button.prototype = Object.create(Component.prototype);
Button.prototype.constructor = Button;


// time to apply "click" class, does not apply if 0
Button.prototype.clickDuration = 200;


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentButton = Button;
}


// public
module.exports = Button;
