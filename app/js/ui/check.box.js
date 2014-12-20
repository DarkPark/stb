/**
 * @module stb/ui/check.box
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
	keys      = require('../keys'),
	groups    = {};


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
 * var cb = new CheckBox({value:true});
 */
function CheckBox ( config ) {
	// current execution context
	var self = this;

	// sanitize
	config = config || {};

	/**
	 * Initial state.
	 *
	 * @type {boolean}
	 */
	this.value = !!config.value;

	/**
	 * Group name to work synchronously with other checkboxes.
	 *
	 * @type {string}
	 */
	this.group = null;

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('checkBox');

	// correct init styles
	if ( this.value ) {
		this.$node.classList.add('checked');
	}

	// apply hierarchy
	if ( config.group !== undefined ) {
		// @ifdef DEBUG
		if ( typeof config.group !== 'string' || config.group.length === 0 ) { throw 'wrong or empty config.group'; }
		// @endif

		// save
		this.group = config.group;

		// fill groups data
		if ( groups[config.group] === undefined ) {
			groups[config.group] = [this];
		} else {
			groups[config.group].push(this);
		}
	}

	// invert on mouse click or enter
	this.addListeners({
		click: function () {
			self.set(!self.value);
		},
		keydown: function ( event ) {
			if ( event.code === keys.ok ) {
				self.set(!self.value);
			}
		}
	});
}


// inheritance
CheckBox.prototype = Object.create(Component.prototype);
CheckBox.prototype.constructor = CheckBox;


/**
 * Set the given state.
 * Does nothing in case the value is already as necessary.
 *
 * @param {boolean} value new value to set
 * @return {boolean} operation status
 *
 * @fires CheckBox#change
 */
CheckBox.prototype.set = function ( value ) {
	var i, l;

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

		/**
		 * Update progress value.
		 *
		 * @event ProgressBar#change
		 *
		 * @type {Object}
		 * @property {boolean} value current check state
		 */
		this.emit('change', {value: this.value});

		return true;
	}

	return false;
};


// public export
module.exports = CheckBox;
