/**
 * @module stb/ui/progress.bar
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Base progress bar implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {number} [config.value=0] initial value
 * @param {number} [config.max=100] max progress value
 * @param {number} [config.min=0] min progress value
 *
 * @example
 * var pb = new ProgressBar({
 *     min: -100,
 *     max:  200,
 *     events: {
 *         done: function () {
 *             debug.log('ProgressBar: done');
 *         },
 *         change: function ( data ) {
 *             debug.log('ProgressBar: change to ' + data.curr + ' from ' + data.prev);
 *         }
 *     }
 * });
 */
function ProgressBar ( config ) {
	// sanitize
	config = config || {};

	/**
	 * Max progress value.
	 *
	 * @type {number}
	 */
	this.max = 100;

	/**
	 * Min progress value.
	 *
	 * @type {number}
	 */
	this.min = 0;

	/**
	 * Initial progress position.
	 *
	 * @type {number}
	 */
	this.value = 0;

	/**
	 * Value of the one percent step
	 *
	 * @type {number}
	 */
	this.step = 1;

	// assignment of configuration parameters if they were transferred
	if ( config.max !== undefined ) {
		// @ifdef DEBUG
		if ( Number(config.max) !== config.max ) { throw 'config.max value must be a number'; }
		// @endif

		this.max = config.max;
	}

	if ( config.min !== undefined ) {
		// @ifdef DEBUG
		if ( Number(config.min) !== config.min ) { throw 'config.min value must be a number'; }
		// @endif

		this.min = config.min;
	}

	if ( config.value !== undefined ) {
		// @ifdef DEBUG
		if ( Number(config.value) !== config.value ) { throw 'config.value must be a number'; }
		if ( config.value > this.max ) { throw 'config.value more than config.maximum'; }
		if ( config.value < this.min ) { throw 'config.value less than config.minimum'; }
		// @endif

		this.value = config.value;
	}

	// create $body if not passed
	if ( config.$body === undefined ) {
		config.$body = document.createElement('div');
	}

	this.step = Math.abs(this.max - this.min) / 100;

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('progressBar');
	this.$body.classList.add('value');

	// insert bar line
	this.$node.appendChild(this.$body);

	// init bar size, (this.min - this.value) - calculate distance from start
	this.$body.style.width = (Math.abs(this.min - this.value) / this.step) + '%';
}


// inheritance
ProgressBar.prototype = Object.create(Component.prototype);
ProgressBar.prototype.constructor = ProgressBar;


/**
 * Set position of the given value.
 * Does nothing in case when progress is end and passed value is more than max value.
 *
 * @param {number} value new value to set
 * @return {boolean} operation result
 *
 * @fires ProgressBar#done
 * @fires ProgressBar#change
 */
ProgressBar.prototype.set = function ( value ) {
	var prevValue = this.value;

	// value changed but in the given range
	if ( this.value !== value && value <= this.max && value >= this.min ) {
		// @ifdef DEBUG
		if ( Number(value) !== value ) { throw 'value must be a number'; }
		// @endif

		// set new value
		this.value = value;

		// get value in percents
		value = Math.abs(this.value - this.min) / this.step;

		if ( value === 100 ) {
			/**
			 * Set progress to its maximum value.
			 *
			 * @event ProgressBar#done
			 */
			this.emit('done');
		}

		// set progress bar width
		this.$body.style.width = value + '%';

		/**
		 * Update progress value.
		 *
		 * @event ProgressBar#change
		 *
		 * @type {Object}
		 * @property {number} [prev] old/previous progress value
		 * @property {number} [curr] new/current progress value
		 */
		this.emit('change', {curr: this.value, prev: prevValue});

		return true;
	}

	return false;
};


// public export
module.exports = ProgressBar;
