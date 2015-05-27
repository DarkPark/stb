/**
 * @module stb/ui/input
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
	keys      = require('../keys');


/**
 * Base input field implementation.
 * Has two types: text and password.
 * Password - replace real text with '*', but real text presents in the own property 'value'.
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
	// current execution context
	var self = this;

	// sanitize
	config = config || {};

	/**
	 * Text value of input.
	 *
	 * @type {string}
	 */
	this.value = '';

	/**
	 * Hint element with placeholder text.
	 *
	 * @type {Element}
	 */
	this.$placeholder = document.createElement('div');

	/**
	 * Caret element, which shows current cursor position.
	 *
	 * @type {Element}
	 */
	this.$caret = document.createElement('div');

	this.$caret.index = 0;

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

	// create $body if not provided
	if ( this.$node === this.$body ) {
		// insert text line
		this.$body = this.$node.appendChild(document.createElement('div'));

		// classes
		this.$body.className = 'body';
		this.$caret.className = 'caret';
		this.$placeholder.className = 'placeholder';

		// appends hint and caret to input
		this.$body.appendChild(this.$caret);
		this.$body.appendChild(this.$placeholder);
	}

	// correct CSS class names
	this.$node.classList.add('input');

	// component setup
	this.init(config);

	// custom navigation method
	// todo: reassign this.navigate in init
	if ( config.navigate !== undefined ) {
		if ( DEBUG ) {
			if ( typeof config.navigate !== 'function' ) { throw 'wrong config.navigate type'; }
		}
		// apply
		this.navigate = config.navigate;
	}

	// navigation by keyboard
	this.addListener('keydown', this.navigate);

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
 * Default method to move focus according to pressed keys.
 *
 * @param {Event} event generated event source of movement
 */
Input.prototype.navigateDefault = function ( event ) {
	switch ( event.code ) {
		case keys['delete']:
			this.removeChar(this.$caret.index);
			break;

		case keys.back:
			this.removeChar(this.$caret.index - 1);
			break;

		case keys.left:
			this.setCaretPosition(this.$caret.index - 1);
			break;

		case keys.right:
			this.setCaretPosition(this.$caret.index + 1);
			break;

		case keys.end:
		case keys.down:
			this.setCaretPosition(this.value.length);
			break;

		case keys.home:
		case keys.up:
			this.setCaretPosition(0);
			break;

		default:
			break;
	}
};


/**
 * Current active method to move focus according to pressed keys.
 * Can be redefined to provide custom navigation.
 *
 * @type {function}
 */
Input.prototype.navigate = Input.prototype.navigateDefault;


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} config init parameters (subset of constructor config params)
 */
Input.prototype.init = function ( config ) {
	// type passed
	if ( config.type !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.type) !== config.type ) { throw 'config.type must be a number'; }
			if ( config.type !== this.TYPE_TEXT && config.type !== this.TYPE_PASSWORD ) { throw 'config.type must be one of the TYPE_* constant'; }
		}
		// apply
		this.type = config.type;
	}

	// default value passed
	if ( config.value !== undefined ) {
		if ( DEBUG ) {
			if ( typeof config.value !== 'string' ) { throw 'config.value must be a string'; }
		}
		// apply
		this.setValue(config.value);
	}

	// hint
	if ( config.placeholder !== undefined ) {
		if ( DEBUG ) {
			if ( typeof config.placeholder !== 'string' ) { throw 'config.placeholder must be a string'; }
			if ( config.placeholder.length === 0 ) { throw 'config.placeholder must be not an empty string'; }
		}
		// apply
		this.$placeholder.innerText = config.placeholder;
	}
};


/**
 * Add given char to given position.
 * Also moving caret in every action.
 * Do nothing if position is < 0, or if index more or equals to length add char to the end.
 *
 * @param {string} char symbol to add
 * @param {number} [index=this.value.length] given position
 *
 * @fires module:stb/ui/input~Input#input
 */
Input.prototype.addChar = function ( char, index ) {
	var $char = document.createElement('div');

	index = (index === undefined) ? this.$caret.index : index;

	if ( DEBUG ) {
		if ( index < 0 ) { throw 'index must be more than 0 or equal to 0'; }
		if ( typeof char !== 'string' ) { throw 'char must be a string'; }
		if ( char.length !== 1 ) { throw 'char must be a string with length = 1'; }
	}

	// remove hint
	if ( this.value.length === 0 ) {
		this.$body.removeChild(this.$placeholder);
	}

	// settings class name for span which presents one symbol in virtual input
	$char.className = 'char';

	// insert char into value
	this.value = this.value.substring(0, index) + char + this.value.substring(index, this.value.length);

	// move caret
	++this.$caret.index;

	if ( this.type === this.TYPE_PASSWORD ) {
		$char.innerText = '*';
	} else if ( char === ' ' ) {
		$char.innerHTML = '&nbsp;';
	} else {
		$char.innerText = char;
	}

	if ( index >= this.value.length ) { // add char to the end, move caret to the end
		this.$body.appendChild($char);
		this.$body.appendChild(this.$caret);
	} else { // move caret before index, append span before caret
		this.$body.insertBefore(this.$caret, this.$body.children[index]);
		this.$body.insertBefore($char, this.$caret);
	}

	// there are some listeners
	if ( this.events['input'] !== undefined ) {
		// notify listeners
		this.emit('input', {value: this.value});
	}
};


/**
 * Remove char from given position.
 * Do nothing if index is out of the range (0, length).
 *
 * @param {number} [index=this.$caret.index - 1] index given position
 *
 * @fires module:stb/ui/input~Input#input
 */
Input.prototype.removeChar = function ( index ) {
	index = (index === undefined) ? this.$caret.index - 1 : index;
	// non-empty string
	if ( this.value.length > 0 ) {
		if ( DEBUG ) {
			if ( index < 0 ) { throw 'index must be a positive value'; }
			if ( index > this.value.length ) { throw 'index must be a less than or equal to total length'; }
		}

		if ( this.$caret.index === index && index < this.value.length ) {
			// remove char after caret
			this.$body.removeChild(this.$body.children[index + 1]);
		} else if ( this.$caret.index > index ) {
			// remove char before caret
			--this.$caret.index;
			this.$body.removeChild(this.$body.children[index]);
		}

		// cut one char from the value
		this.value = this.value.substring(0, index) + this.value.substring(index + 1, this.value.length);

		// there are some listeners
		if ( this.events['input'] !== undefined ) {
			// notify listeners
			this.emit('input', {value: this.value});
		}
	}

	// only hint
	if ( this.value.length === 0 ) {
		this.$body.appendChild(this.$placeholder);
	}
};


/**
 * Move caret to the given position.
 * Do nothing if index is out of the range (0, this.value.length).
 *
 * @param {number} index given position
 */
Input.prototype.setCaretPosition = function ( index ) {
	// check boundaries and current position
	if ( index >= 0 && index <= this.value.length && this.$caret.index !== index ) {
		// extract caret
		this.$body.removeChild(this.$caret);

		// apply
		if ( index === this.value.length ) {
			// add to the end
			this.$body.appendChild(this.$caret);
		} else {
			this.$body.insertBefore(this.$caret, this.$body.children[index]);
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
	var oldLength = this.value.length,
		newLength = value.length,
		i = 0,
		$char, diff;

	if ( DEBUG ) {
		if ( typeof value !== 'string' ) { throw 'value must be a string'; }
	}

	// non-empty string
	if ( newLength > 0 ) {
		// no hint
		if ( this.$placeholder.parentNode === this.$body ) {
			this.$body.removeChild(this.$placeholder);
		}

		// no cursor
		this.$body.removeChild(this.$caret);

		// value length has changed
		if ( newLength !== oldLength ) {
			diff = newLength - oldLength;

			// need to correct char divs amount
			if ( diff > 0 ) {
				// add missing chars
				for ( i = 0; i < diff; i++ ) {
					$char = this.$body.appendChild(document.createElement('div'));
					$char.className = 'char';
				}
			} else {
				// remove unnecessary chars
				for ( i = 0; i > diff; i-- ) {
					this.$body.removeChild(this.$body.lastChild);
				}
			}
		}

		// apply value
		for ( i = 0; i < newLength; i++ ) {
			$char = this.$body.children[i];

			if ( this.type === this.TYPE_PASSWORD ) {
				$char.innerHTML = '*';
			} else if ( value[i] === ' ' ) {
				$char.innerHTML = '&nbsp;';
			} else {
				$char.innerText = value[i];
			}
		}

		this.value = value;
		this.$caret.index = newLength;
		this.$body.appendChild(this.$caret);
	} else {
		// empty string
		this.value = '';
		this.$body.innerText = '';
		this.$body.appendChild(this.$caret);
		this.$body.appendChild(this.$placeholder);
	}

	// there are some listeners
	if ( this.events['input'] !== undefined ) {
		// notify listeners
		this.emit('input', {value: this.value});
	}
};


// public
module.exports = Input;
