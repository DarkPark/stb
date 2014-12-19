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
 * @event List#click:item
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
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {number} config.size amount of visible items on a page
 *
 * @fires List#click:item
 */
function List ( config ) {
	var self = this,  // current execution context
		index = 0,
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
	this.activeItem = null;

	this.activeIndex = 0;

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

	// sanitize
	config = config || {};

	// parent init
	Component.call(this, config);

	// list items amount on page
	if ( config.size !== undefined ) {
		// @ifdef DEBUG
		if ( Number(config.size) !== config.size ) { throw 'config.size must be a number'; }
		// @endif

		this.size = config.size;
	}

	// horizontal or vertical
	if ( config.type !== undefined ) {
		// @ifdef DEBUG
		if ( Number(config.type) !== config.type ) { throw 'config.type must be a number'; }
		// @endif

		this.type = config.type;
	}

	// correct CSS class names
	this.$node.classList.add('list');

	// apply list of items
	if ( config.data !== undefined ) {
		// @ifdef DEBUG
		if ( !Array.isArray(config.data) ) { throw 'wrong config.data type'; }
		// @endif

		this.data = config.data;
	}

	// custom render method
	if ( config.render !== undefined ) {
		// @ifdef DEBUG
		if ( typeof config.render !== 'function' ) { throw 'wrong config.render type'; }
		// @endif

		this.render = config.render;
	}

	if ( this.type === this.TYPE_HORIZONTAL ) {
		this.$node.classList.add('horizontal');
	}

	//this.$body = document.createElement('ul');
	////this.$body.className = 'body';
	//this.$node.appendChild(this.$body);

	for ( i = 0; i < this.size; i++ ) {
		//item = document.createElement('li');
		item = document.createElement('div');
		item.index = i;
		item.className = 'item';
		//item.innerHTML = this.data[i];
		if ( this.data[i] !== undefined ) {
			this.render(item, this.data[i]);

			item.addEventListener('click', function ( event ) {
				self.activeIndex = this.index;
				self.focusItem(this);

				// notify
				self.emit('click:item', {$item: this, event: event});

				//event.stopPropagation();
				//self.activeItem.classList.remove('focus');
				//self.activeItem = this;
				//self.activeItem.classList.add('focus');
			});
		}
		//this.items.push(this.$body.appendChild(item));
		this.$body.appendChild(item);
	}

	if ( this.activeItem === null ) {
		this.activeItem = this.$body.firstChild;
		//this.activeIndex = 0;
		this.activeItem.classList.add('focus');
	}

	this.addListener('keydown', function ( event ) {
		//var tmp;

		if ( event.code === keys.ok ) {
			// notify
			self.emit('click:item', {$item: self.activeItem, event: event});
		}

		if ( (event.code === keys.up && self.type === self.TYPE_VERTICAL) || (event.code === keys.left && self.type === self.TYPE_HORIZONTAL) ) {
			if ( self.activeIndex > 0 ) {
				index--;

				if ( !self.focusPrev() ) {
					// move the last item to the begging
					//self.$body.insertBefore(self.items[self.items.length-1], self.items[0]);
					self.$body.insertBefore(self.$body.lastChild, self.$body.firstChild);

					//if ( config.render !== undefined ) {
					self.render(self.$body.firstChild, self.data[self.activeIndex - 1]);
					self.$body.firstChild.index = self.activeIndex - 1;
					//} else {
					//	self.$body.firstChild.innerHTML = self.data[self.activeIndex-1];
					//}

					//self.items.unshift(self.items.pop());
					//self.activeIndex++;
					self.focusPrev();
				}
			}
		}
		if ( (event.code === keys.down && self.type === self.TYPE_VERTICAL) || (event.code === keys.right && self.type === self.TYPE_HORIZONTAL) ) {
			if ( self.activeIndex < self.data.length - 1 ) {
				index++;

				if ( !self.focusNext() ) {
					// move the first item to the end
					//self.$body.appendChild(self.items[0]);
					self.$body.appendChild(self.$body.firstChild);

					//if ( config.render !== undefined ) {
					self.render(self.$body.lastChild, self.data[self.activeIndex + 1]);
					self.$body.lastChild.index = self.activeIndex + 1;
					//} else {
					//	self.$body.lastChild.innerHTML = self.data[self.activeIndex + 1];
					//}

					//self.items.push(self.items.shift());
					//self.activeIndex--;
					self.focusNext();
				}
			}
		}

		if ( event.code === keys.pageUp ) {
			//self.activeIndex = self.activeIndex - self.size - 1;
			//self.focusFirst();
			self.focusItem(self.$body.firstChild);
			self.activeIndex = self.activeItem.index;
		}
		if ( event.code === keys.pageDown ) {
			//self.activeIndex = self.activeIndex + self.size - 1;

			//self.focusLast();
			self.focusItem(self.$body.lastChild);
			self.activeIndex = self.activeItem.index;

			//for ( i = 0; i < self.size; i++ ) {
				//self.render()
			//}
		}

		// swap edge items
		//tmp = self.items[0];
		//self.items[0] = self.items[self.items.length-1];
		//self.items[self.items.length-1] = tmp;

		//for ( i = 0; i < self.size; i++ ) {
			//self.items[i].innerHTML = self.data[i+index];
		//}
		//self.activeItem.classList.remove('focus');
		//self.activeItem = self.items[Math.abs(index % self.items.length)];
		//self.activeItem.classList.add('focus');
	});

	this.$body.addEventListener('mousewheel', function ( event ) {
		var direction = event.wheelDeltaY > 0;

		debug.event(event);

		self.emit('keydown', {code: direction ? keys.up : keys.down});
	});
}


// inheritance
List.prototype = Object.create(Component.prototype);
List.prototype.constructor = List;


List.prototype.TYPE_VERTICAL   = 1;
List.prototype.TYPE_HORIZONTAL = 2;


List.prototype.moveNext = function () {

};


List.prototype.movePrev = function () {

};


List.prototype.renderPage = function () {

};

List.prototype.defaultRender = function ( $item, data ) {
	$item.innerHTML = data;
};


/**
 * Highlight the given DOM element as focused.
 * Remove focus from the previously focused item and generate associated event.
 *
 * @param {Node} $item element to focus
 *
 * @return {boolean} operation status
 *
 * @fires List#focus:item
 */
List.prototype.focusItem = function ( $item ) {
	var $prev = this.activeItem;

	// different element
	if ( $item !== undefined && $prev !== $item ) {
		// @ifdef DEBUG
		if ( !($item instanceof Node) ) { throw 'wrong $item type'; }
		if ( $item.parentNode !== this.$body ) { throw 'wrong $item parent element'; }
		// @endif

		// some item is focused already
		if ( $prev !== undefined ) {
			// @ifdef DEBUG
			if ( !($prev instanceof Node) ) { throw 'wrong $prev type'; }
			// @endif

			$prev.classList.remove('focus');
		}
		// reassign
		this.activeItem = $item;

		// correct CSS
		$item.classList.add('focus');

		/**
		 * Set focus to an element.
		 *
		 * @event List#focus:item
		 *
		 * @type {Object}
		 * @property {*} [prev] old/previous focused HTML element
		 * @property {*} [curr] new/current focused HTML element
		 */
		this.emit('focus:item', {prev: $prev, curr: $item});

		return true;
	}

	// nothing was done
	return false;
};


List.prototype.focusNext = function () {
	//if ( this.activeIndex < this.size - 1 ) {
	if ( this.activeItem !== this.$body.lastChild ) {
		this.activeIndex++;
		//console.log(this.activeIndex);
		//this.activeItem.classList.remove('focus');
		////this.activeItem = this.items[this.activeIndex];
		//this.activeItem = this.activeItem.nextSibling;
		//this.activeItem.classList.add('focus');

		return this.focusItem(this.activeItem.nextSibling);
	}
	return false;
};


List.prototype.focusPrev = function () {
	//if ( this.activeIndex > 0 ) {
	if ( this.activeItem !== this.$body.firstChild ) {
		this.activeIndex--;
		//console.log(this.activeIndex);
		//this.activeItem.classList.remove('focus');
		////this.activeItem = this.items[this.activeIndex];
		//this.activeItem = this.activeItem.previousSibling;
		//this.activeItem.classList.add('focus');

		return this.focusItem(this.activeItem.previousSibling);
	}
	return false;
};


//List.prototype.focusFirst = function () {
//	this.activeItem.classList.remove('focus');
//	this.activeItem = this.$body.firstChild;
//	this.activeItem.classList.add('focus');
//	this.activeIndex = this.activeItem.index;
//};

//List.prototype.focusLast = function () {
//	this.activeItem.classList.remove('focus');
//	this.activeItem = this.$body.lastChild;
//	this.activeItem.classList.add('focus');
//	this.activeIndex = this.activeItem.index;
//};


// public export
module.exports = List;
