/**
 * @module stb/ui/scroll.bar
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 */

'use strict';

var Component = require('stb/component');


/**
 * Base scroll bar implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {number} [config.value=0] initial value
 * @param {number} [config.max=100] max scroll value
 * @param {number} [config.min=0] min scroll value
 *
 * @example
 * var ScrollBar = require('stb/ui/scroll.bar'),
 *     scrollBar = new ScrollBar({
 *         min: -100,
 *         max:  200,
 *         events: {
 *             done: function () {
 *                 debug.log('ScrollBar: done');
 *             },
 *             change: function ( data ) {
 *                 debug.log('ScrollBar: change to ' + data.curr + ' from ' + data.prev);
 *             }
 *         }
 *     });
 */
function ScrollBar ( config ) {
	// sanitize
	config = config || {};

	/**
	 * Scroll area height or if scroll is horizontal its width.
	 *
	 * @type {number}
	 */
	this.max = 100;

	/**
	 * Min scroll value.
	 *
	 * @type {number}
	 */
	this.min = 0;

	/**
	 * Initial scroll position.
	 *
	 * @type {number}
	 */
	this.value = 0;

	//this.

	this.type = ScrollBar.TYPE_VERTICAL;

	/**
	 * Coefficient between scroll bar height and real content height.
	 *
	 * @type {number}
	 */
	this.ratio = 1;

	// can't accept focus
	this.focusable = false;

	// parent init
	Component.call(this, config);

	// create $body if not provided
	if ( this.$node === this.$body ) {
		// insert bar line
		this.$body = this.$node.appendChild(document.createElement('div'));
	}

	// correct CSS class names
	this.$node.classList.add('scrollBar');
	this.$body.classList.add('value');

	// component setup
	this.init(config);
}


// inheritance
ScrollBar.prototype = Object.create(Component.prototype);
ScrollBar.prototype.constructor = ScrollBar;

ScrollBar.TYPE_VERTICAL = 1;
ScrollBar.TYPE_HORIZONTAL = 2;


/**
 * Init or re-init current max or/and min or/and value.
 *
 * @param {Object} config init parameters
 * @param {number} [config.value=0] initial value
 * @param {number} [config.max=100] max scroll value
 * @param {number} [config.min=0] min scroll value
 */
ScrollBar.prototype.init = function ( config ) {
	config = config || {};

	if ( DEBUG ) {
		if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
		if ( typeof config !== 'object' ) { throw 'wrong config type'; }
	}

	// assignment of configuration parameters if they were transferred
	if ( config.max !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.max) !== config.max ) { throw 'config.max value must be a number'; }
		}

		this.max = config.max;
	}

	if ( config.min !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.min) !== config.min ) { throw 'config.min value must be a number'; }
		}

		this.min = config.min;
	} if ( this.type === ScrollBar.TYPE_VERTICAL ) {
		this.min = this.$node.offsetHeight;
	} else {
		this.min = this.$node.offsetWidth;
	}

	this.ratio = Math.abs(this.min / this.max);

	if ( config.value !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.value) !== config.value ) { throw 'config.value must be a number'; }
			if ( this.type === ScrollBar.TYPE_VERTICAL ) {
				if ( config.value > (this.$node.offsetHeight * this.ratio) ) { throw 'config.value more than scroll bar height'; }
			} else {
				if ( config.value > (this.$node.offsetWidth * this.ratio) ) { throw 'config.value more than scroll bar width'; }
			}
			if ( config.value < this.min ) { throw 'config.value less than config.minimum'; }
		}

		this.value = config.value;
	} else {
		// set value to min
		this.value = this.value === 0 ? this.min : this.value;
	}

	// init bar size, classes, setup distance from start
	if ( this.type === ScrollBar.TYPE_VERTICAL ) {
		this.$node.classList.add('vertical');
		this.$body.style.height = (this.$node.offsetHeight * this.ratio) + 'px';
		this.$body.style.top = ((this.value - this.min) * this.ratio) + 'px';
	} else {
		this.$node.classList.add('horizontal');
		this.$body.style.width = (this.$node.offsetWidth * this.ratio) + 'px';
		this.$body.style.left = ((this.value - this.min) * this.ratio) + 'px';
	}
};


/**
 * Set position of the given value.
 * Does nothing in case when scroll is in the end and passed value is more than scroll bar length.
 *
 * @param {number} value new value to set
 * @return {boolean} operation result
 *
 * @fires module:stb/ui/scroll.bar~ScrollBar#done
 * @fires module:stb/ui/scroll.bar~ScrollBar#change
 */
ScrollBar.prototype.scrollTo = function ( value ) {
	if ( DEBUG ) {
		if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
	}

	// value changed but in the given range
	if ( this.value !== value && value <= this.max && value >= this.min ) {
		if ( DEBUG ) {
			if ( Number(value) !== value ) { throw 'value must be a number'; }
		}


		if ( value >= this.max ) {
			value = this.max;
			/**
			 * Set scroll to its maximum value.
			 *
			 * @event module:stb/ui/scroll.bar~ScrollBar#done
			 */
			this.emit('done');
		}

		// set scroll bar width
		if ( this.type === ScrollBar.TYPE_VERTICAL ) {
			this.$body.style.top = ((value - this.min) * this.ratio) + 'px';
		} else {
			this.$body.style.left = ((value - this.min) * this.ratio) + 'px';
		}

		/**
		 * Update scroll value.
		 *
		 * @event module:stb/ui/scroll.bar~ScrollBar#change
		 *
		 * @type {Object}
		 * @property {number} prev old/previous scroll value
		 * @property {number} curr new/current scroll value
		 */
		this.emit('change', {curr: value, prev: this.value});
		// set new value
		this.value = value;

		return true;
	}

	return false;
};


// public export
module.exports = ScrollBar;
