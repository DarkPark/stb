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
 * @extends Component
 *
 * @param {Object}   [config={}] init parameters (all inherited from the parent)
 * @param {Array[]}  [config.data=[]] component data to visualize
 * @param {function} [config.render] method to build each grid cell content
 * @param {boolean}  [config.cycleX=true] allow or not to jump to the opposite side of line when there is nowhere to go next
 * @param {boolean}  [config.cycleY=true] allow or not to jump to the opposite side of column when there is nowhere to go next
 *
 * @example
 * var Grid = require('stb/ui/grid'),
 *     grid = new Grid({
 *         data: [
 *             [1,   2,  3,  4],
 *             [5,   6,  7,  8],
 *             [9,  10, 11, 12],
 *             [13, 14, 15, 16]
 *         ],
 *         render: function ( $item, data ) {
 *             $item.innerHTML = '<div>' + (data.value) + '</div>';
 *         }
 *     });
 */
function Grid ( config ) {
	// current execution context
	var self = this;

	/**
	 * List of DOM elements representing the component cells.
	 * Necessary for navigation calculations.
	 *
	 * @type {Node[][]}
	 */
	this.items = [];

	/**
	 * Link to the currently focused DOM element.
	 *
	 * @type {Node}
	 */
	this.$focusItem = null;

	/**
	 * Component data to visualize.
	 *
	 * @type {Array[]}
	 */
	this.data = [];

	/**
	 * Method to build each grid cell content.
	 * Can be redefined to provide custom rendering.
	 *
	 * @type {function}
	 */
	this.render = this.defaultRender;

	/**
	 * Allow or not to jump to the opposite side of line when there is nowhere to go next.
	 *
	 * @type {boolean}
	 */
	this.cycleX = true;

	/**
	 * Allow or not to jump to the opposite side of column when there is nowhere to go next.
	 *
	 * @type {boolean}
	 */
	this.cycleY = true;


	// sanitize
	config = config || {};

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('grid');

	// component setup
	this.init(config);

	// navigation by keyboard
	this.addListener('keydown', function ( event ) {
		switch ( event.code ) {
			case keys.up:
			case keys.down:
			case keys.right:
			case keys.left:
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
		if ( event.wheelDeltaY ) {
			self.move(event.wheelDeltaY > 0 ? keys.up : keys.down);
		}

		// scrolling by X axis
		if ( event.wheelDeltaX ) {
			self.move(event.wheelDeltaX > 0 ? keys.left : keys.right);
		}
	});
}


// inheritance
Grid.prototype = Object.create(Component.prototype);
Grid.prototype.constructor = Grid;


/**
 * Fill the given cell with data.
 * $item.data can contain the old data (from the previous render).
 *
 * @param {Node} $item item DOM link
 * @param {*} data associated with this item data
 */
Grid.prototype.defaultRender = function ( $item, data ) {
	$item.innerText = data.value;
};


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} [config={}] init parameters (subset of constructor config params)
 */
Grid.prototype.init = function ( config ) {
	var self = this,
		i, j,
		$row, $item, $table, $tbody, $focusItem,
		itemData,
		onClick = function ( event ) {
			// visualize
			self.focusItem(this);

			// notify
			self.emit('click:item', {$item: this, event: event});
		};

	// @ifdef DEBUG
	if ( typeof config !== 'object' ) { throw 'wrong config type'; }
	// @endif

	// apply cycle behaviour
	if ( config.cycleX !== undefined ) { this.cycleX = config.cycleX; }
	if ( config.cycleY !== undefined ) { this.cycleY = config.cycleY; }

	// apply data
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

	// @ifdef DEBUG
	if ( !Array.isArray(this.data) || !Array.isArray(this.data[0]) ) { throw 'wrong this.data'; }
	// @endif

	$table = document.createElement('table');
	$tbody = document.createElement('tbody');

	$table.appendChild($tbody);

	// reset if necessary
	if ( this.items.length > 0 ) {
		this.items = [];
		this.$body.innerText = '';
	}

	// rows
	for ( i = 0; i < this.data.length; i++ ) {
		// dom
		$row = $tbody.insertRow();
		// navigation map filling
		this.items.push([]);

		// cols
		for ( j = 0; j < this.data[i].length; j++ ) {
			// dom
			$item = $row.insertCell(-1);
			// additional params
			$item.x = j;
			$item.y = i;
			$item.className = 'item';

			// shortcut
			itemData = this.data[i][j];

			// cell data type
			if ( typeof itemData === 'object' ) {
				// merge columns
				if ( itemData.colSpan !== undefined ) {
					// @ifdef DEBUG
					if ( Number(itemData.colSpan) !== itemData.colSpan ) { throw 'itemData.colSpan must be a number'; }
					if ( itemData.colSpan <= 0 ) { throw 'itemData.colSpan should be positive'; }
					// @endif

					// apply and clean
					$item.colSpan = itemData.colSpan;
					delete itemData.colSpan;
				}

				// merge rows
				if ( itemData.rowSpan !== undefined ) {
					// @ifdef DEBUG
					if ( Number(itemData.rowSpan) !== itemData.rowSpan ) { throw 'itemData.rowSpan must be a number'; }
					if ( itemData.rowSpan <= 0 ) { throw 'itemData.rowSpan should be positive'; }
					// @endif

					// apply and clean
					$item.rowSpan = itemData.rowSpan;
					delete itemData.rowSpan;
				}

				// merge rows
				if ( itemData.focus !== undefined ) {
					// store and clean
					$focusItem = $item;
					delete itemData.focus;
				}
			} else {
				// wrap value
				itemData = this.data[i][j] = {
					value: this.data[i][j]
				};
			}

			// visualize
			this.render($item, itemData);

			// save data link
			$item.data = itemData;

			// navigation map filling
			this.items[i][j] = $item;

			$item.addEventListener('click', onClick);
		}
		// row is ready
		$tbody.appendChild($row);
	}

	// everything is ready
	this.$body.appendChild($table);

	// apply focus
	if ( $focusItem !== undefined ) {
		// focus item was given in data
		this.focusItem($focusItem);
	} else {
		// just the first cell
		this.focusItem(this.items[0][0]);
	}
};


/**
 * Move focus to the given direction.
 *
 * @param {number} direction arrow key code
 */
Grid.prototype.move = function ( direction ) {
	var x = this.$focusItem.x,
		y = this.$focusItem.y;

	switch ( direction ) {
		case keys.up:
			if ( this.items[y - 1] ) {
				// can go one step up
				this.focusItem(this.items[y - 1][x]);
			} else if ( this.cycleY ) {
				// jump to the last row
				this.focusItem(this.items[this.items.length - 1][x]);
			}
			break;
		case keys.down:
			if ( this.items[y + 1] ) {
				// can go one step down
				this.focusItem(this.items[y + 1][x]);
			} else if ( this.cycleY ) {
				// jump to the first row
				this.focusItem(this.items[0][x]);
			}
			break;
		case keys.right:
			if ( this.items[y][x + 1] ) {
				// can go one step right
				this.focusItem(this.items[y][x + 1]);
			} else if ( this.cycleX ) {
				// jump to the first column
				this.focusItem(this.items[y][0]);
			}
			break;
		case keys.left:
			if ( this.items[y][x - 1] ) {
				// can go one step left
				this.focusItem(this.items[y][x - 1]);
			} else if ( this.cycleX ) {
				// jump to the last column
				this.focusItem(this.items[y][this.items[y].length - 1]);
			}
			break;
	}
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
	var $prev = this.$focusItem;

	// different element
	if ( $item !== undefined && $prev !== $item ) {
		// @ifdef DEBUG
		if ( !($item instanceof Node) ) { throw 'wrong $item type'; }
		if ( $item.parentNode.parentNode.parentNode.parentNode !== this.$body ) { throw 'wrong $item parent element'; }
		// @endif

		// some item is focused already
		if ( $prev !== null ) {
			// @ifdef DEBUG
			if ( !($prev instanceof Node) ) { throw 'wrong $prev type'; }
			// @endif

			// style
			$prev.classList.remove('focus');

			// notify
			this.emit('blur:item', {$item: $prev});
		}
		// reassign
		this.$focusItem = $item;

		this.$focusItem.data = this.data[$item.y][$item.x];

		// correct CSS
		$item.classList.add('focus');

		/**
		 * Set focus to an element.
		 *
		 * @event module:stb/ui/grid~Grid#focus:item
		 *
		 * @type {Object}
		 * @property {*} [$prev] old/previous focused HTML element
		 * @property {*} [$curr] new/current focused HTML element
		 */
		this.emit('focus:item', {$prev: $prev, $curr: $item});

		return true;
	}

	// nothing was done
	return false;
};


// public export
module.exports = Grid;
