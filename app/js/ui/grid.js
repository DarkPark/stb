/**
 * @module stb/ui/grid
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
	keys      = require('../keys');


/**
 * Base list implementation.
 *
 * @constructor
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {number} config.size amount of visible items on a page
 */
function Grid ( config ) {
	var self = this,
		index = 0,
		i, j, row, item;

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

	this.type = 0;

	/**
	 * Amount of visible items on a page.
	 *
	 * @type {number}
	 */
	this.size = 5;

	this.render = this.defaultRender;


	// sanitize
	config = config || {};

	//this.height = config.height || 3;

	//this.width  = config.width  || 5;

	// list items amount on page
	//this.size = config.size || this.size;

	//this.type = config.type || this.TYPE_VERTICAL;

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('grid');

	// apply hierarchy
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

	//if ( this.type === this.TYPE_HORIZONTAL ) {
	//	this.$node.classList.add('horizontal');
	//}

	//this.$body = document.createElement('ul');
	////this.$body.className = 'body';
	//this.$node.appendChild(this.$body);

	this.$body = document.createElement('table');

	this.$node.appendChild(this.$body);

	debug.log(this.data);

	for ( i = 0; i < this.data.length; i++ ) {
		row = this.$body.insertRow();
		for ( j = 0; j < this.data[i].length; j++ ) {
			item = row.insertCell(-1);
			item.x = j;
			item.y = i;
			item.className = 'cell';
			//console.log(i, j);
			//console.log(this.data[i][j]);
			var itemData = this.data[i][j];
			if ( typeof itemData === 'object' ) {
				item.innerHTML = itemData.value;
				item.colSpan = itemData.colSpan || 1;
				item.rowSpan = itemData.rowSpan || 1;
			} else {
				item.innerHTML = itemData;
			}
			//if ( this.data[i] !== undefined ) {
			//	this.render(item, this.data[i]);
			//
			//	item.addEventListener('click', function () {
			//		self.activeIndex = this.index;
			//		self.activeItem.classList.remove('focus');
			//		self.activeItem = this;
			//		self.activeItem.classList.add('focus');
			//	});
			//}
		}
		this.$body.appendChild(row);

		//this.items.push(this.$body.appendChild(item));
		//this.$body.appendChild(item);
	}


	this.activeItem = this.$body.rows[0].cells[0];
	this.$body.rows[0].cells[0].classList.add('focus');

	//if ( this.activeItem === null ) {
	//	this.activeItem = this.$body.firstChild;
	//	//this.activeIndex = 0;
	//	this.activeItem.classList.add('focus');
	//}

	this.addListener('keydown', function ( event ) {
		//var tmp;

		switch ( event.code ) {
			case keys.up:

				break;
			case keys.down:

				break;
			case keys.right:
				self.focusItem(self.activeItem.nextSibling);
				break;
			case keys.left:
				self.focusItem(self.activeItem.previousSibling);
				break;
		}

		/*if ( (event.code === keys.up && self.type === self.TYPE_VERTICAL) || (event.code === keys.left && self.type === self.TYPE_HORIZONTAL) ) {
			if ( self.activeIndex > 0 ) {
				index--;

				if ( !self.focusPrev() ) {
					// move the last item to the begging
					//self.$body.insertBefore(self.items[self.items.length-1], self.items[0]);
					self.$body.insertBefore(self.$body.lastChild, self.$body.firstChild);

					//if ( config.render !== undefined ) {
					self.render(self.$body.firstChild, self.data[self.activeIndex-1]);
					self.$body.firstChild.index = self.activeIndex-1;
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
			if ( self.activeIndex < self.data.length-1 ) {
				index++;

				if ( !self.focusNext() ) {
					// move the first item to the end
					//self.$body.appendChild(self.items[0]);
					self.$body.appendChild(self.$body.firstChild);

					//if ( config.render !== undefined ) {
					self.render(self.$body.lastChild, self.data[self.activeIndex+1]);
					self.$body.lastChild.index = self.activeIndex+1;
					//} else {
					//	self.$body.lastChild.innerHTML = self.data[self.activeIndex + 1];
					//}

					//self.items.push(self.items.shift());
					//self.activeIndex--;
					self.focusNext();
				}
			}
		}*/

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
Grid.prototype = Object.create(Component.prototype);
Grid.prototype.constructor = Grid;


Grid.prototype.TYPE_VERTICAL   = 1;
Grid.prototype.TYPE_HORIZONTAL = 2;


Grid.prototype.moveNext = function () {

};


Grid.prototype.movePrev = function () {

};


Grid.prototype.renderPage = function () {

};

Grid.prototype.defaultRender = function ( $item, data ) {
	$item.innerHTML = data;
};


/**
 * Highlight the given DOM element as focused.
 * Remove focus from the previously focused item.
 *
 * @param {Node} $item element to focus
 *
 * @return {boolean} operation status
 */
Grid.prototype.focusItem = function ( $item ) {
	var $prev = this.activeItem;

	// different element
	if ( $item !== undefined && $prev !== $item ) {
		// @ifdef DEBUG
		if ( !($item instanceof Node) ) { throw 'wrong $item type'; }
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

		// notify listeners
		this.emit('move', {prev: $prev, curr: $item});

		return true;
	}

	// nothing was done
	return false;
};


Grid.prototype.focusNext = function () {
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


Grid.prototype.focusPrev = function () {
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


//Grid.prototype.focusFirst = function () {
//	this.activeItem.classList.remove('focus');
//	this.activeItem = this.$body.firstChild;
//	this.activeItem.classList.add('focus');
//	this.activeIndex = this.activeItem.index;
//};

//Grid.prototype.focusLast = function () {
//	this.activeItem.classList.remove('focus');
//	this.activeItem = this.$body.lastChild;
//	this.activeItem.classList.add('focus');
//	this.activeIndex = this.activeItem.index;
//};


// public export
module.exports = Grid;
