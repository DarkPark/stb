/**
 * @module stb/ui/check.box
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
	keys      = require('../keys');


/**
 * Base check box implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {string} config.value initial state
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

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('checkBox');

	// correct init styles
	if ( this.value ) {
		this.$node.classList.add('checked');
	}

	// invert on mouse click or enter
	this.addListeners({
		click: function () {
			self.check(!self.value);
		},
		keydown: function ( event ) {
			if ( event.code === keys.ok ) {
				self.check(!self.value);
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
CheckBox.prototype.check = function ( value ) {
	if ( this.value !== value ) {
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
		this.emit('check', {value: this.value});

		return true;
	}

	return false;
};


// public export
module.exports = CheckBox;
