/**
 * @module "stb/ui/check.box"
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
	keys      = require('../keys'),
	groups    = {};  // set of groups with linked components


/**
 * Base check box implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {boolean} [config.value=false] initial state
 * @param {string} [config.group] group name to work synchronously with other checkboxes
 *
 * @example
 * var CheckBox = require('stb/ui/check.box'),
 *     checkBox = new CheckBox({
 *         value: true,
 *         group: 'lang'
 *     });
 */
function CheckBox ( config ) {
	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		// init parameters checks
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
		if ( config.group     && typeof config.group     !== 'string' ) { throw new Error(__filename + ': wrong or empty config.group'); }
	}

	// set default className if classList property empty or undefined
	config.className = 'checkBox ' + (config.className || '');

	// state
	this.value = !!config.value;

	// correct init styles
	if ( this.value ) {
		config.className += ' checked';
	}

	// parent constructor call
	Component.call(this, config);

	// group name to work synchronously with other checkboxes
	this.group = null;

	// apply hierarchy
	if ( config.group ) {
		// save
		this.group = config.group;

		// fill groups data
		if ( groups[config.group] === undefined ) {
			groups[config.group] = [this];
		} else {
			groups[config.group].push(this);
		}
	}
}


// inheritance
CheckBox.prototype = Object.create(Component.prototype);
CheckBox.prototype.constructor = CheckBox;


/**
 * List of all default event callbacks.
 *
 * @type {Object.<string, function>}
 */
CheckBox.prototype.defaultEvents = {
	/**
	 * Default method to handle mouse click events.
	 */
	click: function () {
		// invert state
		this.set(!this.value);
	},

	/**
	 * Default method to handle keyboard keydown events.
	 *
	 * @param {Event} event generated event
	 */
	keydown: function ( event ) {
		// emulate click
		if ( event.code === keys.ok ) {
			this.set(!this.value);
		}
	}
};


/**
 * Set the given state.
 * Does nothing in case the value is already as necessary.
 *
 * @param {boolean} value new value to set
 * @return {boolean} operation status
 *
 * @fires module:"stb/ui/check.box~CheckBox#change"
 */
CheckBox.prototype.set = function ( value ) {
	var i, l;

	if ( DEBUG ) {
		if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	}

	if ( this.value !== value ) {
		// going to be turned on and assigned to some group
		if ( !this.value && this.group !== null ) {
			// unset all checkboxes in this group
			for ( i = 0, l = groups[this.group].length; i < l; i++ ) {
				groups[this.group][i].set(false);
			}
		}

		// set new value
		this.value = !this.value;

		// set visible changes
		this.$node.classList.toggle('checked');

		// there are some listeners
		if ( this.events['change'] ) {
			/**
			 * Update progress value.
			 *
			 * @event module:stb/ui/check.box~CheckBox#change
			 *
			 * @type {Object}
			 * @property {boolean} value current check state
			 */
			this.emit('change', {value: this.value});
		}

		return true;
	}

	// nothing was done
	return false;
};


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentCheckBox = CheckBox;
}


// public
module.exports = CheckBox;
