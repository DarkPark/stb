/**
 * @module stb/ui/scroll.bar
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Base scroll bar implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {number} [config.value=0] initial thumb position
 * @param {number} [config.realSize=100] actual scroll size
 * @param {number} [config.viewSize=10] visible area size
 *
 * @example
 * var ScrollBar = require('stb/ui/scroll.bar'),
 *     scrollBar = new ScrollBar({
 *         viewSize: 5,
 *         realSize: 25,
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
	 * Visible area size.
	 *
	 * @type {number}
	 */
	this.viewSize = 10;

	/**
	 * Scroll area actual height or width (if scroll is horizontal).
	 *
	 * @type {number}
	 */
	this.realSize = 100;

	/**
	 * Scroll thumb position.
	 *
	 * @type {number}
	 */
	this.value = 0;

	/**
	 * Component orientation.
	 *
	 * @type {number}
	 */
	this.type = this.TYPE_VERTICAL;

	/**
	 * Geometry of the scroll thumb element.
	 *
	 * @type {ClientRect}
	 */
	this.thumbRect = null;

	/**
	 * Geometry of the scroll track element.
	 *
	 * @type {ClientRect}
	 */
	this.trackRect = null;

	// can't accept focus
	config.focusable = config.focusable || false;

	// parent init
	Component.call(this, config);

	// create $body if not provided
	if ( this.$node === this.$body ) {
		// insert thumb line
		this.$body = this.$node.appendChild(document.createElement('div'));
	}

	// horizontal or vertical
	if ( config.type !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.type) !== config.type ) { throw 'config.type must be a number'; }
		}
		// apply
		this.type = config.type;
	}

	// correct CSS class names
	this.$node.classList.add('scrollBar');
	this.$body.classList.add('thumb');

	if ( this.type === this.TYPE_HORIZONTAL ) {
		this.$node.classList.add('horizontal');
	}

	// component setup
	this.init(config);
}


// inheritance
ScrollBar.prototype = Object.create(Component.prototype);
ScrollBar.prototype.constructor = ScrollBar;


ScrollBar.prototype.TYPE_VERTICAL   = 1;
ScrollBar.prototype.TYPE_HORIZONTAL = 2;


/**
 * Init or re-init realSize/viewSize/value parameters.
 *
 * @param {Object} config init parameters (subset of constructor config params)
 */
ScrollBar.prototype.init = function ( config ) {
	config = config || {};

	if ( DEBUG ) {
		if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
		if ( typeof config !== 'object' ) { throw 'wrong config type'; }
	}

	// set actual scroll size
	if ( config.realSize !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.realSize) !== config.realSize ) { throw 'config.realSize value must be a number'; }
		}
		// apply
		this.realSize = config.realSize;
	}

	// set visible area size
	if ( config.viewSize !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.viewSize) !== config.viewSize ) { throw 'config.viewSize value must be a number'; }
			if ( config.viewSize <= 0 ) { throw 'config.viewSize value must be greater than 0'; }
		}
		// apply
		this.viewSize = config.viewSize;
	}

	// show or hide thumb
	if ( this.viewSize >= this.realSize ) {
		this.$body.classList.add('hidden');
	} else {
		this.$body.classList.remove('hidden');
	}

	// set thumb position
	if ( config.value !== undefined ) {
		// apply
		this.scrollTo(config.value);
	}

	// set thumb size
	if ( this.type === this.TYPE_VERTICAL ) {
		this.$body.style.height = (this.viewSize / this.realSize * 100) + '%';
	} else {
		this.$body.style.width = (this.viewSize / this.realSize * 100) + '%';
	}

	// geometry
	this.thumbRect = this.$body.getBoundingClientRect();
	this.trackRect = this.$node.getBoundingClientRect();
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
		if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
		if ( Number(value) !== value ) { throw 'value must be a number'; }
		if ( this.realSize > this.viewSize && value > this.realSize - this.viewSize ) { throw 'value is greater than this.realSize-this.viewSize'; }
		if ( value < 0 ) { throw 'value is less then 0'; }
	}

	// value has changed
	if ( this.value !== value ) {
		// track and thumb geometry was not set
		if ( this.thumbRect.height === 0 || this.thumbRect.width === 0 ) {
			// apply
			this.trackRect = this.$node.getBoundingClientRect();
			this.thumbRect = this.$body.getBoundingClientRect();
		}

		// set scroll bar width
		if ( this.type === this.TYPE_VERTICAL ) {
			this.$body.style.marginTop = ((this.trackRect.height - this.thumbRect.height) * value / (this.realSize - this.viewSize)) + 'px';
		} else {
			this.$body.style.marginLeft = ((this.trackRect.width - this.thumbRect.width) * value / (this.realSize - this.viewSize)) + 'px';
		}

		// there are some listeners
		if ( this.events['change'] !== undefined ) {
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
		}

		// is it the end?
		if ( value >= this.realSize ) {
			value = this.realSize;

			// there are some listeners
			if ( this.events['done'] !== undefined ) {
				/**
				 * Set scroll to its maximum value.
				 *
				 * @event module:stb/ui/scroll.bar~ScrollBar#done
				 */
				this.emit('done');
			}
		}

		// set new value
		this.value = value;

		return true;
	}

	// nothing was done
	return false;
};


// public
module.exports = ScrollBar;
