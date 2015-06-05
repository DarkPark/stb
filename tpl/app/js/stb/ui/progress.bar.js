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
 * var ProgressBar = require('stb/ui/progress.bar'),
 *     progressBar = new ProgressBar({
 *         min: -100,
 *         max:  200,
 *         events: {
 *             done: function () {
 *                 debug.log('ProgressBar: done');
 *             },
 *             change: function ( data ) {
 *                 debug.log('ProgressBar: change to ' + data.curr + ' from ' + data.prev);
 *             }
 *         }
 *     });
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

	// can't accept focus
	config.focusable = config.focusable || false;

	// parent init
	Component.call(this, config);

	// create $body if not provided
	if ( this.$node === this.$body ) {
		// insert bar line
		this.$body = this.$node.appendChild(document.createElement('div'));
	}

	// correct CSS class names
	this.$node.classList.add('progressBar');
	this.$body.classList.add('value');

	// component setup
	this.init(config);
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
 * @fires module:stb/ui/progress.bar~ProgressBar#done
 * @fires module:stb/ui/progress.bar~ProgressBar#change
 */
ProgressBar.prototype.set = function ( value ) {
	var prevValue = this.value;

	if ( DEBUG ) {
		if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
	}

	// value changed but in the given range
	if ( this.value !== value && value <= this.max && value >= this.min ) {
		if ( DEBUG ) {
			if ( Number(value) !== value ) { throw 'value must be a number'; }
		}

		// set new value
		this.value = value;

		// get value in percents
		value = Math.abs(this.value - this.min) / this.step;

		if ( value === 100 ) {
			// there are some listeners
			if ( this.events['done'] !== undefined ) {
				/**
				 * Set progress to its maximum value.
				 *
				 * @event module:stb/ui/progress.bar~ProgressBar#done
				 */
				this.emit('done');
			}
		}

		// set progress bar width
		this.$body.style.width = value + '%';

		// there are some listeners
		if ( this.events['change'] !== undefined ) {
			/**
			 * Update progress value.
			 *
			 * @event module:stb/ui/progress.bar~ProgressBar#change
			 *
			 * @type {Object}
			 * @property {number} prev old/previous progress value
			 * @property {number} curr new/current progress value
			 */
			this.emit('change', {curr: this.value, prev: prevValue});
		}

		return true;
	}

	return false;
};


/**
 * Init or re-init current max or/and min or/and value.
 *
 * @param {Object} config init parameters (subset of constructor config params)
 */
ProgressBar.prototype.init = function ( config ) {
	if ( DEBUG ) {
		if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
		if ( typeof config !== 'object' ) { throw 'wrong config type'; }
	}

	// set max progress value
	if ( config.max !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.max) !== config.max ) { throw 'config.max value must be a number'; }
		}
		// apply
		this.max = config.max;
	}

	// set min progress value
	if ( config.min !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.min) !== config.min ) { throw 'config.min value must be a number'; }
		}
		// apply
		this.min = config.min;
	}

	if ( DEBUG ) {
		if ( this.min >= this.max ) { throw 'this.min value must be less than this.max'; }
	}

	// set actual progress value
	if ( config.value !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.value) !== config.value ) { throw 'config.value must be a number'; }
			if ( config.value > this.max ) { throw 'config.value more than config.maximum'; }
			if ( config.value < this.min ) { throw 'config.value less than config.minimum'; }
		}
		// apply
		this.value = config.value;
	}

	this.step = Math.abs(this.max - this.min) / 100;

	// init bar size, (this.min - this.value) - calculate distance from start
	this.$body.style.width = (Math.abs(this.min - this.value) / this.step) + '%';
};


// public
module.exports = ProgressBar;
