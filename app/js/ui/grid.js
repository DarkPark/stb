/**
 * @module stb/ui/grid
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
	keys      = require('../keys');


/**
 * Base grid/table implementation.
 *
 * For navigation map implementation and tests see {@link https://gist.github.com/DarkPark/8c0c2926bfa234043ed1}.
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
 *             [1,   2,  3, {value: '4;8;12;16', focus: true, rowSpan: 4}],
 *             [5,   6,  7],
 *             [9,  10, 11],
 *             [13, 14, {value: 15, disable: true}]
 *         ],
 *         render: function ( $item, data ) {
 *             $item.innerHTML = '<div>' + (data.value) + '</div>';
 *         },
 *         cycleX: false
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
	this.map = [];

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

	/**
	 * Current navigation map horizontal position.
	 *
	 * @type {number}
	 */
	this.focusX = 0;

	/**
	 * Current navigation map vertical position.
	 *
	 * @type {number}
	 */
	this.focusY = 0;


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
 * Make all the data items identical.
 * Wrap to objects if necessary and add missing properties.
 *
 * @param {Array[]} data user 2-dimensional array
 * @return {Array[]} reworked incoming data
 */
function normalize ( data ) {
	var i, j, item;

	// rows
	for ( i = 0; i < data.length; i++ ) {
		// cols
		for ( j = 0; j < data[i].length; j++ ) {
			// cell value
			item = data[i][j];
			// primitive value
			if ( typeof item !== 'object' ) {
				// wrap
				item = data[i][j] = {
					value: data[i][j]
				};
			}

			// always at least one row/col
			item.colSpan = item.colSpan || 1;
			item.rowSpan = item.rowSpan || 1;

			// @ifdef DEBUG
			if ( Number(item.colSpan) !== item.colSpan ) { throw 'item.colSpan must be a number'; }
			if ( Number(item.rowSpan) !== item.rowSpan ) { throw 'item.rowSpan must be a number'; }
			if ( item.colSpan <= 0 ) { throw 'item.colSpan should be positive'; }
			if ( item.rowSpan <= 0 ) { throw 'item.rowSpan should be positive'; }
			// @endif
		}
	}

	return data;
}


/**
 * Fill the given rectangle area with value.
 *
 * @param {Array[]} map link to navigation map
 * @param {number} x current horizontal position
 * @param {number} y current vertical position
 * @param {number} dX amount of horizontal cell to fill
 * @param {number} dY amount of vertical cell to fill
 * @param {*} value filling data
 */
function fill ( map, x, y, dX, dY, value ) {
	var i, j;

	// rows
	for ( i = y; i < y + dY; i++ ) {
		// expand map rows
		if ( map.length < i + 1 ) { map.push([]); }

		// compensate long columns from previous rows
		while ( map[i][x] !== undefined ) {
			x++;
		}

		// cols
		for ( j = x; j < x + dX; j++ ) {
			// expand map row cols
			if ( map[i].length < j + 1 ) { map[i].push(); }
			// fill
			map[i][j] = value;
			// apply coordinates for future mouse clicks
			if ( value.x === undefined ) { value.x = j; }
			if ( value.y === undefined ) { value.y = i; }
		}
	}
}


/**
 * Create a navigation map from incoming data.
 *
 * @param {Array[]} data user 2-dimensional array of objects
 * @return {Array[]} navigation map
 */
function map ( data ) {
	var result = [],
		i, j, item;

	// rows
	for ( i = 0; i < data.length; i++ ) {
		// cols
		for ( j = 0; j < data[i].length; j++ ) {
			// cell value
			item = data[i][j];
			// process a cell
			fill(result, j, i, item.colSpan, item.rowSpan, item.$item);
			// clear redundant info
			delete item.$item;
		}
	}

	return result;
}


/**
 * Mouse click event.
 *
 * @event module:stb/ui/grid~Grid#click:item
 *
 * @type {Object}
 * @property {Node} $item clicked HTML item
 * @property {Event} event click event data
 */


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} [config={}] init parameters (subset of constructor config params)
 */
Grid.prototype.init = function ( config ) {
	var self = this,
		draw = false,
		i, j,
		$row, $item, $table, $tbody, $focusItem,
		itemData,
		/**
		 * Cell mouse click handler.
		 *
		 * @param {Event} event click event data
		 *
		 * @this Node
		 *
		 * @fires module:stb/ui/grid~Grid#click:item
		 */
		onItemClick = function ( event ) {
			// allow to accept focus
			if ( this.data.disable !== true ) {
				// clicked item has the coordinates
				// of the associated item in the map
				//self.focusX = this.x;
				//self.focusY = this.y;

				// visualize
				//self.focusItem(self.map[self.focusY][self.focusX]);
				self.focusItem(this);

				// notify
				self.emit('click:item', {$item: this, event: event});
			}
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

		// new data is different
		if ( this.data !== config.data ) {
			this.data = config.data;
			// need to redraw table
			draw = true;
		}
	}

	// custom render method
	if ( config.render !== undefined ) {
		// @ifdef DEBUG
		if ( typeof config.render !== 'function' ) { throw 'wrong config.render type'; }
		// @endif

		// new render is different
		if ( this.render !== config.render ) {
			this.render = config.render;
			// need to redraw table
			draw = true;
		}
	}

	// @ifdef DEBUG
	if ( !Array.isArray(this.data) || !Array.isArray(this.data[0]) ) { throw 'wrong this.data'; }
	// @endif

	if ( !draw ) {
		// do not redraw table
		return;
	}

	$table = document.createElement('table');
	$tbody = document.createElement('tbody');

	$table.appendChild($tbody);

	// prepare user data
	this.data = normalize(this.data);

	// rows
	for ( i = 0; i < this.data.length; i++ ) {
		// dom
		$row = $tbody.insertRow();

		// cols
		for ( j = 0; j < this.data[i].length; j++ ) {
			// dom
			$item = $row.insertCell(-1);
			// additional params
			$item.className = 'item';

			// shortcut
			itemData = this.data[i][j];

			// for map
			itemData.$item = $item;

			// merge columns
			$item.colSpan = itemData.colSpan;

			// merge rows
			$item.rowSpan = itemData.rowSpan;

			// active cell
			if ( itemData.focus === true ) {
				// store and clean
				$focusItem = $item;
			}

			// disabled cell
			if ( itemData.disable === true ) {
				// apply CSS
				$item.classList.add('disable');
			}

			// visualize
			this.render($item, itemData);

			// save data link
			$item.data = itemData;

			// manual focusing
			$item.addEventListener('click', onItemClick);
		}
		// row is ready
		$tbody.appendChild($row);
	}

	// navigation map filling
	this.map = map(this.data);

	// clear all table
	this.$body.innerText = null;

	// everything is ready
	this.$body.appendChild($table);

	// apply focus
	if ( $focusItem !== undefined ) {
		// focus item was given in data
		this.focusItem($focusItem);
	} else {
		// just the first cell
		this.focusItem(this.map[0][0]);
	}
};


/**
 * Move focus to the given direction.
 *
 * @param {number} direction arrow key code
 *
 * @fires module:stb/ui/grid~Grid#cycle
 * @fires module:stb/ui/grid~Grid#overflow
 */
Grid.prototype.move = function ( direction ) {
	var x        = this.focusX,
		y        = this.focusY,
		move     = true,
		overflow = false,
		cycle    = false;

	// shift till full stop
	while ( move ) {
		// arrow keys
		switch ( direction ) {
			case keys.up:
				if ( y > 0 ) {
					// can go one step up
					y--;
				} else {
					if ( this.cycleY ) {
						// jump to the last row
						y = this.map.length - 1;
						cycle = true;
					} else {
						// grid edge
						overflow = true;
					}
				}
				break;

			case keys.down:
				if ( y < this.map.length - 1 ) {
					// can go one step down
					y++;
				} else {
					if ( this.cycleY ) {
						// jump to the first row
						y = 0;
						cycle = true;
					} else {
						// grid edge
						overflow = true;
					}
				}
				break;

			case keys.right:
				if ( x < this.map[y].length - 1 ) {
					// can go one step right
					x++;
				} else {
					if ( this.cycleX ) {
						// jump to the first column
						x = 0;
						cycle = true;
					} else {
						// grid edge
						overflow = true;
					}
				}
				break;

			case keys.left:
				if ( x > 0 ) {
					// can go one step left
					x--;
				} else {
					if ( this.cycleX ) {
						// jump to the last column
						x = this.map[y].length - 1;
						cycle = true;
					} else {
						// grid edge
						overflow = true;
					}
				}
				break;
		}

		// full cycle - has come to the start point
		if ( x === this.focusX && y === this.focusY ) {
			// full stop
			move = false;
		}

		// focus item has changed and it's not disabled
		if ( this.map[y][x] !== this.map[this.focusY][this.focusX] && this.map[y][x].data.disable !== true ) {
			// full stop
			move = false;
		}

		// the last cell in a row/col
		if ( overflow ) {
			// full stop
			move = false;
			// but it's disabled so need to go back
			if ( this.map[y][x].data.disable === true ) {
				// return to the start point
				x = this.focusX;
				y = this.focusY;
			}
		}
	}

	if ( cycle ) {
		/**
		 * Jump to the opposite side.
		 *
		 * @event module:stb/ui/grid~Grid#cycle
		 *
		 * @type {Object}
		 * @property {*} direction key code initiator of movement
		 */
		this.emit('cycle', {direction: direction});
	}

	if ( overflow ) {
		/**
		 * Attempt to go beyond the edge of the grid.
		 *
		 * @event module:stb/ui/grid~Grid#overflow
		 *
		 * @type {Object}
		 * @property {*} direction key code initiator of movement
		 */
		this.emit('overflow', {direction: direction});
	}

	// report
	debug.info(this.focusX + ' : ' + x, 'X old/new');
	debug.info(this.focusY + ' : ' + y, 'Y old/new');
	debug.info(cycle,  'cycle');
	debug.info(overflow, 'overflow');

	this.focusItem(this.map[y][x]);

	// correct coordinates
	// focusItem set approximate values
	this.focusX = x;
	this.focusY = y;
};


/**
 * Highlight the given DOM element as focused.
 * Remove focus from the previously focused item.
 *
 * @param {Node} $item element to focus
 * @param {number} $item.x the item horizontal position
 * @param {number} $item.y the item vertical position
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/ui/grid~Grid#focus:item
 * @fires module:stb/ui/grid~Grid#blur:item
 */
Grid.prototype.focusItem = function ( $item ) {
	var $prev = this.$focusItem;

	// different element
	if ( $item !== undefined && $prev !== $item && $item.data.disable !== true ) {
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

			/**
			 * Remove focus from an element.
			 *
			 * @event module:stb/ui/grid~Grid#blur:item
			 *
			 * @type {Object}
			 * @property {Node} $item previously focused HTML element
			 */
			this.emit('blur:item', {$item: $prev});
		}

		// draft coordinates
		this.focusX = $item.x;
		this.focusY = $item.y;

		// reassign
		this.$focusItem = $item;

		// correct CSS
		$item.classList.add('focus');

		/**
		 * Set focus to an element.
		 *
		 * @event module:stb/ui/grid~Grid#focus:item
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


// public export
module.exports = Grid;
