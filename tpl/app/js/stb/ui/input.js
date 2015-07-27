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
 * @param {string} [config.type=Input.TYPE_TEXT] input type
 * @param {string} [config.direction='ltr'] symbol direction ('rtl' - right to left, 'ltr' - left to right)
 *
 * @example
 * var Input = require('stb/ui/input'),
 *     input = new Input({
 *         placeholder: 'input password'
 *         events: {
 *             input: function ( event ) {
 *                 debug.log(event.value);
 *             }
 *         }
 *     });
 */
function Input ( config ) {
	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		// init parameters checks
		if ( config.className && typeof config.className !== 'string'   ) { throw new Error(__filename + ': wrong or empty config.className'); }
	}

	/**
	 * Text value of input.
	 *
	 * @type {string}
	 */
	this.value = '';

	/**
	 * Input type, now available only text and password.
	 * Different logic with different types.
	 * TYPE_TEXT - normal input.
	 * TYPE_PASSWORD - hidden input, all chars replaced with '*', but real value is located in 'this.value'.
	 *
	 * @type {number}
	 */
	this.type = this.TYPE_TEXT;

	// set default className if classList property empty or undefined
	config.className = 'input ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);

	// insert text line
	this.$line = this.$body.appendChild(document.createElement('div'));
	// correct class
	this.$line.className = 'line';

	// element to show current cursor position
	this.$caret = this.$line.appendChild(document.createElement('div'));
	// correct class
	this.$caret.className = 'caret';

	// hint element with placeholder text
	this.$placeholder = this.$line.appendChild(document.createElement('div'));
	// correct class
	this.$placeholder.className = 'placeholder';

	// setup caret index
	this.$caret.index = 0;

	// component setup
	this.init(config);
}


// inheritance
Input.prototype = Object.create(Component.prototype);
Input.prototype.constructor = Input;

// input types
Input.prototype.TYPE_TEXT     = 0;
Input.prototype.TYPE_PASSWORD = 1;


/**
 * List of all default event callbacks.
 *
 * @type {Object.<string, function>}
 */
Input.prototype.defaultEvents = {
	/**
	 * Default method to handle keyboard keypress events.
	 *
	 * @param {Event} event generated event
	 */
	keypress: function ( event ) {
		this.addChar(String.fromCharCode(event.keyCode), this.$caret.index);
	},

	/**
	 * Default method to handle keyboard keydown events.
	 *
	 * @param {Event} event generated event
	 */
	keydown: function ( event ) {
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
	}
};


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} config init parameters (subset of constructor config params)
 */
Input.prototype.init = function ( config ) {
	if ( DEBUG ) {
		if ( config.type && Number(config.type) !== config.type ) { throw new Error(__filename + ': config.type must be a number'); }
		if ( config.type && config.type !== this.TYPE_TEXT && config.type !== this.TYPE_PASSWORD ) { throw new Error(__filename + ': config.type must be one of the TYPE_* constant'); }
		if ( config.value && typeof config.value !== 'string' ) { throw new Error(__filename + ': config.value must be a string'); }
		if ( config.placeholder && typeof config.placeholder !== 'string' ) { throw new Error(__filename + ': config.placeholder must be a string'); }
		if ( config.direction && typeof config.direction !== 'string' ) { throw new Error(__filename + ': config.direction must be a string'); }
		if ( config.direction && config.direction !== 'ltr' && config.direction !== 'rtl' ) { throw new Error(__filename + ': config.direction wrong value'); }
	}

	// type passed
	if ( config.type ) {
		// apply
		this.type = config.type;
	}

	// default value passed
	if ( config.value ) {
		// apply
		this.setValue(config.value);
	}

	// hint
	if ( config.placeholder ) {
		// apply
		this.$placeholder.innerText = config.placeholder;
	}

	// char direction
	this.$line.dir = config.direction || 'ltr';
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
		if ( index < 0 ) { throw new Error(__filename + ': index must be more than 0 or equal to 0'); }
		if ( typeof char !== 'string' ) { throw new Error(__filename + ': char must be a string'); }
		if ( char.length !== 1 ) { throw new Error(__filename + ': char must be a string with length = 1'); }
	}

	// remove hint
	if ( this.value.length === 0 ) {
		this.$line.removeChild(this.$placeholder);
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
		this.$line.appendChild($char);
		this.$line.appendChild(this.$caret);
	} else { // move caret before index, append span before caret
		this.$line.insertBefore(this.$caret, this.$line.children[index]);
		this.$line.insertBefore($char, this.$caret);
	}

	// there are some listeners
	if ( this.events['input'] ) {
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
	var prevValue = this.value;

	index = (index === undefined) ? this.$caret.index - 1 : index;
	// non-empty string
	if ( this.value.length > 0 ) {
		if ( DEBUG ) {
			if ( index < 0 ) { throw new Error(__filename + ': index must be a positive value'); }
			if ( index > this.value.length ) { throw new Error(__filename + ': index must be a less than or equal to total length'); }
		}

		if ( this.$caret.index === index && index < this.value.length ) {
			// remove char after caret
			this.$line.removeChild(this.$line.children[index + 1]);
		} else if ( this.$caret.index > index ) {
			// remove char before caret
			--this.$caret.index;
			this.$line.removeChild(this.$line.children[index]);
		}

		// cut one char from the value
		this.value = this.value.substring(0, index) + this.value.substring(index + 1, this.value.length);

		// there are some listeners and value was changed
		if ( this.events['input'] && prevValue !== this.value ) {
			// notify listeners
			this.emit('input', {value: this.value});
		}
	}

	// only hint
	if ( this.value.length === 0 ) {
		this.$line.appendChild(this.$placeholder);
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
		this.$line.removeChild(this.$caret);

		// apply
		if ( index === this.value.length ) {
			// add to the end
			this.$line.appendChild(this.$caret);
		} else {
			this.$line.insertBefore(this.$caret, this.$line.children[index]);
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
		if ( typeof value !== 'string' ) { throw new Error(__filename + ': value must be a string'); }
	}

	// return if no changes
	if ( value === this.value ) {
		return;
	}

	// non-empty string
	if ( newLength > 0 ) {
		// no hint
		if ( this.$placeholder.parentNode === this.$line ) {
			this.$line.removeChild(this.$placeholder);
		}

		// no cursor
		this.$line.removeChild(this.$caret);

		// value length has changed
		if ( newLength !== oldLength ) {
			diff = newLength - oldLength;

			// need to correct char divs amount
			if ( diff > 0 ) {
				// add missing chars
				for ( i = 0; i < diff; i++ ) {
					$char = this.$line.appendChild(document.createElement('div'));
					$char.className = 'char';
				}
			} else {
				// remove unnecessary chars
				for ( i = 0; i > diff; i-- ) {
					this.$line.removeChild(this.$line.lastChild);
				}
			}
		}

		// apply value
		for ( i = 0; i < newLength; i++ ) {
			$char = this.$line.children[i];

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
		this.$line.appendChild(this.$caret);
	} else {
		// empty string
		this.value = '';
		this.$line.innerText = '';
		this.$line.appendChild(this.$caret);
		this.$line.appendChild(this.$placeholder);
	}

	// there are some listeners
	if ( this.events['input'] ) {
		// notify listeners
		this.emit('input', {value: this.value});
	}
};


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentInput = Input;
}


// public
module.exports = Input;
