/**
 * @module stb/ui/list
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
	keys      = require('../keys');


/**
 * Mouse click event.
 *
 * @event module:stb/ui/list~List#click:item
 *
 * @type {Object}
 * @property {Node} $item clicked HTML item
 * @property {Event} event click event data
 */

/**
 * Base list implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object}  [config={}] init parameters (all inherited from the parent)
 * @param {Array}   [config.data=[]] component data to visualize
 * @param {number}  [config.size=5] amount of visible items on a page
 * @param {boolean} [config.cycle=true] allow or not to jump to the opposite side of a list when there is nowhere to go next
 *
 * @fires module:stb/ui/list~List#click:item
 *
 * @todo add events of going out of range
 */
function List ( config ) {
	var self = this,  // current execution context
		//index = 0,
		i, item;

	/**
	 * List of DOM elements representing the component lines.
	 *
	 * @type {Node[]}
	 */
	//this.items = [];

	/**
	 * Link to the currently focused DOM element.
	 *
	 * @type {Node}
	 */
	this.$focusItem = null;

	this.indexItem = 0;
	this.indexView = 0;

	/**
	 * Component data to visualize.
	 *
	 * @type {Array}
	 */
	this.data = [];

	this.type = this.TYPE_VERTICAL;

	/**
	 * Amount of visible items on a page.
	 *
	 * @type {number}
	 */
	this.size = 5;

	/**
	 * Method the build each list item content.
	 * Can be redefined to provide custom rendering.
	 *
	 * @type {function}
	 */
	this.render = this.defaultRender;

	/**
	 * Allow or not to jump to the opposite side of a list when there is nowhere to go next.
	 *
	 * @type {boolean}
	 */
	this.cycle = false;

	// sanitize
	config = config || {};

	// parent init
	Component.call(this, config);

	// horizontal or vertical
	if ( config.type !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.type) !== config.type ) { throw 'config.type must be a number'; }
		}

		this.type = config.type;
	}

	// correct CSS class names
	this.$node.classList.add('list');

	if ( this.type === this.TYPE_HORIZONTAL ) {
		this.$node.classList.add('horizontal');
	}

	//this.$body = document.createElement('ul');
	////this.$body.className = 'body';
	//this.$node.appendChild(this.$body);

	// component setup
	this.init(config);

	//if ( this.$focusItem === null ) {
	//	this.$focusItem = this.$body.firstChild;
	//	//this.activeIndex = 0;
	//	this.$focusItem.classList.add('focus');
	//}

	// navigation by keyboard
	this.addListener('keydown', function ( event ) {
		switch ( event.code ) {
			case keys.up:
			case keys.down:
			case keys.right:
			case keys.left:
			case keys.pageUp:
			case keys.pageDown:
			case keys.home:
			case keys.end:
				// cursor move only on arrow keys
				self.move(event.code);
				break;
			case keys.ok:
				// notify
				self.emit('click:item', {$item: self.$focusItem, event: event});
				break;
		}
	});

	// navigation by mouse
	this.$body.addEventListener('mousewheel', function ( event ) {
		// scrolling by Y axis
		if ( self.type === self.TYPE_VERTICAL && event.wheelDeltaY ) {
			self.move(event.wheelDeltaY > 0 ? keys.up : keys.down);
		}

		// scrolling by X axis
		if ( self.type === self.TYPE_HORIZONTAL && event.wheelDeltaX ) {
			self.move(event.wheelDeltaX > 0 ? keys.left : keys.right);
		}
	});
}


// inheritance
List.prototype = Object.create(Component.prototype);
List.prototype.constructor = List;


List.prototype.TYPE_VERTICAL   = 1;
List.prototype.TYPE_HORIZONTAL = 2;


/**
 * Fill the given cell with data.
 *
 * @param {Node} $item item DOM link
 * @param {*} data associated with this item data
 */
List.prototype.defaultRender = function ( $item, data ) {
	$item.innerText = data;
};


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} [config={}] init parameters (subset of constructor config params)
 */
List.prototype.init = function ( config ) {
	var self     = this,
		currSize = this.$body.children.length,
		/**
		 * Item mouse click handler.
		 *
		 * @param {Event} event click event data
		 *
		 * @this Node
		 *
		 * @fires module:stb/ui/list~List#click:item
		 */
		onClick  = function ( event ) {
			if ( this.data !== undefined ) {
				self.focusItem(this);
				// notify
				self.emit('click:item', {$item: this, event: event});
			}
			//self.$focusItem.index = this.index;
			//event.stopPropagation();
			//self.$focusItem.classList.remove('focus');
			//self.$focusItem = this;
			//self.$focusItem.classList.add('focus');
		},
		item, i;

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw 'wrong config type'; }
	}

	// apply cycle behaviour
	if ( config.cycle !== undefined ) { this.cycle = config.cycle; }

	// apply list of items
	if ( config.data !== undefined ) {
		if ( DEBUG ) {
			if ( !Array.isArray(config.data) ) { throw 'wrong config.data type'; }
		}

		this.data = config.data;
	}

	// custom render method
	if ( config.render !== undefined ) {
		if ( DEBUG ) {
			if ( typeof config.render !== 'function' ) { throw 'wrong config.render type'; }
		}

		this.render = config.render;
	}

	// list items amount on page
	if ( config.size !== undefined ) {
		if ( DEBUG ) {
			if ( Number(config.size) !== config.size ) { throw 'config.size must be a number'; }
			if ( config.size <= 0 ) { throw 'config.size should be positive'; }
		}

		this.size = config.size;
	}

	// geometry has changed or initial draw
	if ( this.size !== currSize ) {
		// non-empty list
		if ( currSize > 0 ) {
			// clear old items
			this.$body.innerText = null;
		}

		// create new items
		for ( i = 0; i < this.size; i++ ) {
			//item = document.createElement('li');
			item = document.createElement('div');
			item.index = i;
			item.className = 'item';
			//item.innerText = this.data[i];
			//if ( this.data[i] !== undefined ) {
				//this.render(item, this.data[i]);

			item.addEventListener('click', onClick);
			//}
			//this.items.push(this.$body.appendChild(item));
			this.$body.appendChild(item);
		}
	}

	this.renderView();
};

List.prototype.moveNext = function () {

};


List.prototype.movePrev = function () {

};


List.prototype.renderView = function () {
	var index, $item, i, data;

	for ( i = 0; i < this.size; i++ ) {
		index = this.indexView + i;
		$item = this.$body.children[i];
		data  = this.data[index];

		if ( data !== undefined ) {
			$item.data = data;
			$item.index = index;
			this.render($item, data);
		} else {
			$item.data = $item.index = undefined;
			$item.innerHTML = '.';
		}
	}
};


//List.prototype.renderPage = function () {
//	var $item, i;
//
//	for ( i = 0; i < this.size; i++ ) {
//		$item = this.$body.children[i];
//		if ( $item.index !== undefined && this.data[$item.index] !== undefined ) {
//			$item.data = this.data[$item.index];
//			this.render($item, this.data[$item.index]);
//		}
//	}
//};


/**
 * Jump to the opposite side.
 *
 * @event module:stb/ui/list~List#cycle
 *
 * @type {Object}
 * @property {number} direction key code initiator of movement
 */

/**
 * Attempt to go beyond the edge of the list.
 *
 * @event module:stb/ui/list~List#overflow
 *
 * @type {Object}
 * @property {number} direction key code initiator of movement
 */


/**
 * Move focus to the given direction.
 *
 * @param {number} direction arrow key code
 */
List.prototype.move = function ( direction ) {
	//switch ( direction ) {
	//	case keys.up:
	//
	//		break;
	//	case keys.down:
	//
	//		break;
	//	case keys.right:
	//
	//		break;
	//	case keys.left:
	//
	//		break;
	//}
	//
	//return;

	if ( (direction === keys.up && this.type === this.TYPE_VERTICAL) || (direction === keys.left && this.type === this.TYPE_HORIZONTAL) ) {
		// still can go backward
		if ( this.$focusItem && this.$focusItem.index > 0 ) {
			//index--;

			if ( this.$focusItem === this.$body.firstChild ) {
				this.indexView -= 1;
				this.renderView();
			} else {
				this.focusItem(this.$focusItem.previousSibling);
			}

			/*if ( !this.focusPrev() ) {
				// move the last item to the begging
				//this.$body.insertBefore(this.items[this.items.length-1], this.items[0]);
				this.$body.insertBefore(this.$body.lastChild, this.$body.firstChild);

				//if ( config.render !== undefined ) {
				this.render(this.$body.firstChild, this.data[this.$focusItem.index - 1]);
				this.$body.firstChild.index = this.$focusItem.index - 1;
				//this.$body.firstChild.data  = this.data[this.$focusItem.index];
				//} else {
				//	this.$body.firstChild.innerText = this.data[this.activeIndex-1];
				//}

				//this.items.unshift(this.items.pop());
				//this.activeIndex++;
				this.focusPrev();
			}*/
		} else {
			// already at the beginning
			if ( this.cycle ) {
				// jump to the end of the list
				this.move(keys.end);
				// notify
				this.emit('cycle', {direction: direction});
			} else {
				// notify
				this.emit('overflow', {direction: direction});
			}
		}
	}
	if ( (direction === keys.down && this.type === this.TYPE_VERTICAL) || (direction === keys.right && this.type === this.TYPE_HORIZONTAL) ) {
		// still can go forward
		if ( this.$focusItem && this.$focusItem.index < this.data.length - 1 ) {
			//index++;

			if ( this.$focusItem === this.$body.lastChild ) {
				this.indexView += 1;
				this.renderView();
			} else {
				this.focusItem(this.$focusItem.nextSibling);
			}

			/*if ( !this.focusNext() ) {
				// move the first item to the end
				//this.$body.appendChild(this.items[0]);
				this.$body.appendChild(this.$body.firstChild);

				//if ( config.render !== undefined ) {
				this.render(this.$body.lastChild, this.data[this.$focusItem.index + 1]);
				this.$body.lastChild.index = this.$focusItem.index + 1;
				//this.$body.firstChild.data  = this.data[this.$focusItem.index];
				//} else {
				//	this.$body.lastChild.innerText = this.data[this.activeIndex + 1];
				//}

				//this.items.push(this.items.shift());
				//this.activeIndex--;
				this.focusNext();
			}*/
		} else {
			// already at the beginning
			if ( this.cycle ) {
				// jump to the beginning of the list
				this.move(keys.home);
				// notify
				this.emit('cycle', {direction: direction});
			} else {
				// notify
				this.emit('overflow', {direction: direction});
			}
		}
	}

	if ( direction === keys.pageUp ) {
		//this.activeIndex = this.activeIndex - this.size - 1;
		//this.focusFirst();

		//if ( this.indexView > this.size ) {
			this.indexView -= this.size - 1;
			this.renderView();
		//}


		this.focusItem(this.$body.firstChild);
		//this.$focusItem.index = this.$focusItem.index;
	}
	if ( direction === keys.pageDown ) {
		//this.activeIndex = this.activeIndex + this.size - 1;

		//this.focusLast();

		//if ( this.indexView < data.length - this.size ) {
			this.indexView += this.size - 1;
			this.renderView();
		//}

		this.focusItem(this.$body.lastChild);
		//this.$focusItem.index = this.$focusItem.index;

		//for ( i = 0; i < this.size; i++ ) {
		//this.render()
		//}
	}

	if ( direction === keys.home ) {
		this.indexView = 0;
		this.renderView();
		this.focusItem(this.$body.firstChild);
	}
	if ( direction === keys.end ) {
		this.indexView = this.data.length - this.size;
		this.renderView();
		this.focusItem(this.$body.lastChild);
	}
};


/**
 * Highlight the given DOM element as focused.
 * Remove focus from the previously focused item and generate associated event.
 *
 * @param {Node} $item element to focus
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/ui/list~List#focus:item
 * @fires module:stb/ui/list~List#blur:item
 */
List.prototype.focusItem = function ( $item ) {
	var $prev = this.$focusItem;

	// different element
	if ( $item !== undefined && $prev !== $item ) {
		if ( DEBUG ) {
			if ( !($item instanceof Node) ) { throw 'wrong $item type'; }
			if ( $item.parentNode !== this.$body ) { throw 'wrong $item parent element'; }
		}

		// some item is focused already
		if ( $prev !== null ) {
			if ( DEBUG ) {
				if ( !($prev instanceof Node) ) { throw 'wrong $prev type'; }
			}

			// style
			$prev.classList.remove('focus');

			/**
			 * Remove focus from an element.
			 *
			 * @event module:stb/ui/list~List#blur:item
			 *
			 * @type {Object}
			 * @property {Node} $item previously focused HTML element
			 */
			this.emit('blur:item', {$item: $prev});
		}
		// reassign
		this.$focusItem = $item;

		this.$focusItem.data = this.data[this.$focusItem.index];

		// correct CSS
		$item.classList.add('focus');

		/**
		 * Set focus to an element.
		 *
		 * @event module:stb/ui/list~List#focus:item
		 *
		 * @type {Object}
		 * @property {Node} $prev old/previous focused HTML element
		 * @property {Node} $curr new/current focused HTML element
		 */
		this.emit('focus:item', {$prev: $prev, $curr: $item});

		return true;
	}

	// nothing was done
	return false;
};


List.prototype.focusNext = function () {
	//if ( this.activeIndex < this.size - 1 ) {
	if ( this.$focusItem !== this.$body.lastChild ) {
		//this.activeIndex++;
		//console.log(this.activeIndex);
		//this.$focusItem.classList.remove('focus');
		////this.$focusItem = this.items[this.activeIndex];
		//this.$focusItem = this.$focusItem.nextSibling;
		//this.$focusItem.classList.add('focus');

		return this.focusItem(this.$focusItem.nextSibling);
	}
	return false;
};


List.prototype.focusPrev = function () {
	//if ( this.activeIndex > 0 ) {
	if ( this.$focusItem !== this.$body.firstChild ) {
		//this.activeIndex--;
		//console.log(this.activeIndex);
		//this.$focusItem.classList.remove('focus');
		////this.$focusItem = this.items[this.activeIndex];
		//this.$focusItem = this.$focusItem.previousSibling;
		//this.$focusItem.classList.add('focus');

		return this.focusItem(this.$focusItem.previousSibling);
	}
	return false;
};


//List.prototype.focusFirst = function () {
//	this.$focusItem.classList.remove('focus');
//	this.$focusItem = this.$body.firstChild;
//	this.$focusItem.classList.add('focus');
//	this.activeIndex = this.$focusItem.index;
//};

//List.prototype.focusLast = function () {
//	this.$focusItem.classList.remove('focus');
//	this.$focusItem = this.$body.lastChild;
//	this.$focusItem.classList.add('focus');
//	this.activeIndex = this.$focusItem.index;
//};


// public export
module.exports = List;
