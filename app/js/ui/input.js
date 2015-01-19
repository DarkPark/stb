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
 *             'char:add': function ( event ) {
 *                 debug.log( event.char, event.index, event.length );
 *             },
 *             'char:remove': function ( event ) {
 *                 debug.log( event.char, event.index, event.length );
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
	 * @type {number}
	 */
	this.length = 0;

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

	// type passed
	if ( config.type !== undefined ) {
		this.type = config.type;
	}

	// default value passed
	if ( config.value !== undefined ) {
		this.setValue(config.value);
	}

	if ( config.placeholder !== undefined ) {
		this.placeholder = config.placeholder;
	}

	// correct CSS class names
	this.$node.classList.add('input');
	this.$caret.classList.add('caret');

	if ( this.value.length === 0 && this.placeholder.length > 0 ) {
		this.$body.innerText = this.placeholder;
	} else {
		// appends caret to input
		this.$body.appendChild(this.$caret);
	}

	// init first index
	if ( !this.$caret.index ) {
		this.$caret.index = 0;
	}

	this.addListener('keydown', function ( event ) {
		switch ( event.code ) {
			case 46: // keys.delete
				self.removeChar(self.$caret.index + 1);
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
				self.moveCaret(self.length);
				break;

			case keys.home:
				self.moveCaret(0);
				break;

			default: break;
		}
	});

	this.addListener('keypress', function ( event ) {
		self.addChar(String.fromCharCode(event.code), self.$caret.index);
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
 * @param char symbol to add
 * @param index given position
 */
Input.prototype.addChar = function ( char, index ) {
	var span;

	index = index || this.length;

	if ( this.length === 0 && this.placeholder.length > 0 ) {
		this.$body.innerText = '';
		this.$body.appendChild(this.$caret);
	}

	if ( index >= 0 ) {
		span = document.createElement('span');
		span.className = 'char';
		this.value += char;
		if ( this.type === Input.TYPE_TEXT ) {
			span.innerText = char;
		} else { // input type is TYPE_PASSWORD
			span.innerText = '*';
		}
		if ( index >= this.length ) {
			this.$body.appendChild(span);
			this.$body.appendChild(this.$caret);
		} else {
			this.$body.insertBefore(this.$caret, this.$body.children.item(index));
			this.$body.insertBefore(span, this.$caret);
		}
		span.index = index;
		++this.$caret.index;
		++this.length;
		this.emit('char:add', {char: char, index: index, length: this.length})
	}
};


/**
 * Remove char from given index.
 * Do nothing if index is out of the range (0, length).
 *
 * @param index given position
 */
Input.prototype.removeChar = function ( index ) {
	var char = this.value.charAt(index);

	index = index || this.length;

	if ( index >= 0 && index <= this.length ) {
		if ( this.$caret.index === this.length ) {
			--this.$caret.index;
		}
		--this.length;
		this.value = this.value.substr(0, this.length);
		this.$body.removeChild(this.$body.children.item(this.length));
		this.emit('char:remove', {char: char, index: index, length: this.length})
	}
	if ( this.length === 0 && this.placeholder.length > 0 ) {
		this.$body.removeChild(this.$caret);
		this.$body.innerText = this.placeholder;
	}
};


/**
 * Move caret to the given index
 * Do nothing if index is out of the range (0, length).
 *
 * @param index given position
 */
Input.prototype.moveCaret = function ( index ) {
	if ( index >= 0 && index <= this.length ) {
		if ( index === this.length ) {
			this.$body.appendChild(this.$caret);
		} else if ( this.$caret.index < index ) {
			this.$body.insertBefore(this.$caret, this.$body.children.item(index + 1));
		} else {
			this.$body.insertBefore(this.$caret, this.$body.children.item(index));
		}
		this.$caret.index = index;
	}
};



Input.prototype.setValue = function ( value ) {
	var len = value.length,
		i;

	if ( DEBUG ) {
		if ( typeof value !== 'string' ) { throw 'value must be a string'; }
	}
	if ( len > 0 ) {
		this.length = 0;
		this.$caret.index = 0;
		this.value = '';
		while ( this.$body.firstChild ) {
			this.$body.removeChild(this.$body.firstChild);
		}
	}
	for( i = 0; i < len; ++i ) {
		this.addChar(value[i], this.length);
	}
};

// public export
module.exports = Input;
