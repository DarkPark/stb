/**
 * @module stb/ui/input
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 */

'use strict';

var Component = require('stb/component'),
	keys      = require('stb/keys');


/**
 * Base input implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {string} [config.value='text'] input text value
 * @param {string} [config.placeholder='password'] placeholder text value
 *
 * @example
 * var Input = require('stb/ui/input'),
 *     input = new Input({
 *         placeholder: 'input password'
 *         events: {
 *             change: function ( event ) {
 *                 debug.log(event.value);
 *             }
 *         }
 *     });
 */
function Input ( config ) {
	var self = this;
	// sanitize
	config = config || {};

	/**
	 * Scroll area height or if scroll is horizontal its width.
	 *
	 * @type {number}
	 */
	this.value = '';

	/**
	 *
	 * @type {string}
	 */
	this.placeholder = '';

	/**
	 * Caret element, which shows current cursor position.
	 *
	 * @type {HTMLElement}
	 */
	this.$caret = document.createElement('span');

	/**
	 * Input type, now available only text and password.
	 * Different logic with different types.
	 * TYPE_TEXT - normal input.
	 * TYPE_PASSWORD - hidden input, all chars replaced with '*', but real value is located in 'this.value'.
	 *
	 * @type {number}
	 */
	this.type = this.TYPE_TEXT;

	// parent init
	Component.call(this, config);

	this.$caret.index = 0;

	// type passed
	if ( config.type !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.type) !== config.type ) { throw 'config.type must be a number'; }
			if ( config.type !== this.TYPE_TEXT && config.type !== this.TYPE_PASSWORD ) { throw 'config.type must be one of the TYPE_* constant'; }
		}
		this.type = config.type;
	}

	// default value passed
	if ( config.value !== undefined ) {
		this.setValue(config.value);
	}

	if ( config.placeholder !== undefined ) {
		if ( DEBUG ) {
			if ( typeof config.placeholder !== 'string' ) { throw 'placeholder must be a string'; }
			if ( config.placeholder.length === 0 ) { throw 'placeholder must be not an empty string'; }
		}
		this.placeholder = config.placeholder;
	}

	// correct CSS class names
	this.$node.classList.add('input');
	this.$caret.classList.add('caret');

	//if ( this.value.length === 0 && this.placeholder.length > 0 ) { // set placeholder
	//	//this.$body.innerText = this.placeholder;
	//} else {
	//	// appends caret to input
	//	//this.$body.appendChild(this.$caret);
	//}

	this.addListener('keydown', function ( event ) {
		switch ( event.code ) {
			case keys['delete']:
				self.removeChar(self.$caret.index);
				break;

			case keys.back:
				self.removeChar(self.$caret.index - 1);
				break;

			case keys.left:
				self.moveCaret(self.$caret.index - 1);
				break;

			case keys.right:
				self.moveCaret(self.$caret.index + 1);
				break;

			case keys.end:
			case keys.down:
				self.moveCaret(self.value.length);
				break;

			case keys.home:
			case keys.up:
				self.moveCaret(0);
				break;

			default:
				break;
		}
	});

	this.addListener('keypress', function ( event ) {
		self.addChar(String.fromCharCode(event.keyCode), self.$caret.index);
	});
}


// inheritance
Input.prototype = Object.create(Component.prototype);
Input.prototype.constructor = Input;

// input types
Input.prototype.TYPE_TEXT     = 0;
Input.prototype.TYPE_PASSWORD = 1;


/**
 * Add given char to given position.
 * Do nothing if position is < 0, or if index more or equals to length add char to the end.
 *
 * @param {string} char symbol to add
 * @param {number} [index=this.value.length] given position
 */
Input.prototype.addChar = function ( char, index ) {
	var span;

	index = (index === undefined) ? this.value.length : index;

	if ( DEBUG ) {
		if ( index < 0 ) { throw 'index must be more than 0 or equal to 0'}
		if ( typeof char !== 'string' ) { throw 'char must be a string'}
	}

	if ( this.value.length === 0 && this.placeholder.length > 0 ) { // remove placeholder
		this.$body.innerText = '';
		this.$body.appendChild(this.$caret);
	}

	span = document.createElement('span');
	span.className = 'char';
	if ( this.type === this.TYPE_TEXT ) {
		if ( char === ' ' ) {
			span.innerHTML = '&nbsp;';
		} else {
			span.innerText = char;
		}
	} else { // input type is TYPE_PASSWORD
		span.innerText = '*';
	}
	if ( index >= this.value.length ) {
		this.$body.appendChild(span);
		this.$body.appendChild(this.$caret);
	} else {
		this.$body.insertBefore(this.$caret, this.$body.children.item(index));
		this.$body.insertBefore(span, this.$caret);
	}
	++this.$caret.index;
	this.value = this.value.substring(0, index) + char + this.value.substring(index, this.value.length);

	// there are some listeners
	if ( this.events['change'] !== undefined ) {
		// notify listeners
		this.emit('change', {value: this.value});
	}
};


/**
 * Remove char from given index.
 * Do nothing if index is out of the range (0, length).
 *
 * @param {number} [index=this.value.length] given position
 */
Input.prototype.removeChar = function ( index ) {
	index = (index === undefined) ? this.value.length : index;

	// remove char if exists
	if ( index >= 0 && index <= this.value.length && this.value.length > 0 ) {
		if ( this.$caret.index === index && index < this.value.length ) {
			this.$body.removeChild(this.$body.children.item(index + 1));
		} else if ( this.$caret.index > index ) {
			--this.$caret.index;
			this.$body.removeChild(this.$body.children.item(index));
		}
		this.value = this.value.substring(0, index) + this.value.substring(index + 1, this.value.length);

		// there are some listeners
		if ( this.events['change'] !== undefined ) {
			// notify listeners
			this.emit('change', {value: this.value});
		}
	}
	if ( this.value.length === 0 && this.placeholder.length > 0 ) {
		if ( this.$caret.parentNode !== null ) {
			this.$body.removeChild(this.$caret);
		}
		this.$body.innerText = this.placeholder;
	}
};


/**
 * Move caret to the given index
 * Do nothing if index is out of the range (0, length).
 *
 * @param {number} index given position
 */
Input.prototype.moveCaret = function ( index ) {
	if ( index >= 0 && index <= this.value.length ) {
		if ( index === this.value.length ) { // add to the end
			this.$body.appendChild(this.$caret);
		} else if ( this.$caret.index < index ) { // move right
			this.$body.insertBefore(this.$caret, this.$body.children.item(index + 1));
		} else { // move left
			this.$body.insertBefore(this.$caret, this.$body.children.item(index));
		}
		this.$caret.index = index;
	}
};


/**
 * Setting new text value of the input field.
 *
 * @param {string} value given string value
 */
Input.prototype.setValue = function ( value ) {
	var len = value.length,
		i;

	if ( DEBUG ) {
		if ( typeof value !== 'string' ) { throw 'value must be a string'; }
	}
	if ( len > 0 ) {
		this.$caret.index = 0;
		while ( this.$body.firstChild ) {
			this.$body.removeChild(this.$body.firstChild);
		}
		this.value = '';
	}
	for ( i = 0; i < len; ++i ) {
		this.addChar(value[i], this.value.length);
	}
};


// public export
module.exports = Input;
