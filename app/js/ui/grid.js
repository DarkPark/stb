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
 *         render: function ( $cell, data ) {
 *             $cell.innerHTML = '<div>' + (data.value) + '</div>';
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
	this.cells = [];

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
 * $cell.data can contain the old data (from the previous render).
 *
 * @param {Node} $cell item DOM link
 * @param {*} data associated with this item data
 */
Grid.prototype.defaultRender = function ( $cell, data ) {
	$cell.innerText = data.value;
};


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} [config={}] init parameters (subset of constructor config params)
 */
Grid.prototype.init = function ( config ) {
	var self     = this,
		i, j,
		$row, $cell, $table, $tbody,
		cellData,
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
	if ( this.cells.length > 0 ) {
		this.cells = [];
		this.$body.innerText = '';
	}

	// rows
	for ( i = 0; i < this.data.length; i++ ) {
		// dom
		$row = $tbody.insertRow();
		// navigation map filling
		this.cells.push([]);

		// cols
		for ( j = 0; j < this.data[i].length; j++ ) {
			// dom
			$cell = $row.insertCell(-1);
			// additional params
			$cell.x = j;
			$cell.y = i;
			$cell.className = 'cell';

			// shortcut
			cellData = this.data[i][j];

			// cell data type
			if ( typeof cellData === 'object' ) {
				// merge columns
				if ( cellData.colSpan !== undefined ) {
					// @ifdef DEBUG
					if ( Number(cellData.colSpan) !== cellData.colSpan ) { throw 'cellData.colSpan must be a number'; }
					if ( cellData.colSpan <= 0 ) { throw 'cellData.colSpan should be positive'; }
					// @endif

					// apply and clean
					$cell.colSpan = cellData.colSpan;
					delete cellData.colSpan;
				}

				// merge rows
				if ( cellData.rowSpan !== undefined ) {
					// @ifdef DEBUG
					if ( Number(cellData.rowSpan) !== cellData.rowSpan ) { throw 'cellData.rowSpan must be a number'; }
					if ( cellData.rowSpan <= 0 ) { throw 'cellData.rowSpan should be positive'; }
					// @endif

					// apply and clean
					$cell.rowSpan = cellData.rowSpan;
					delete cellData.rowSpan;
				}
			} else {
				// wrap value
				cellData = this.data[i][j] = {
					value: this.data[i][j]
				};
			}

			// visualize
			this.render($cell, cellData);

			// save data link
			$cell.data = cellData;

			// navigation map filling
			this.cells[i][j] = $cell;

			$cell.addEventListener('click', onClick);
		}
		// row is ready
		$tbody.appendChild($row);
	}

	// everything is ready
	this.$body.appendChild($table);
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
			if ( this.cells[y - 1] ) {
				// can go one step up
				this.focusItem(this.cells[y - 1][x]);
			} else if ( this.cycleY ) {
				// jump to the last row
				this.focusItem(this.cells[this.cells.length - 1][x]);
			}
			break;
		case keys.down:
			if ( this.cells[y + 1] ) {
				// can go one step down
				this.focusItem(this.cells[y + 1][x]);
			} else if ( this.cycleY ) {
				// jump to the first row
				this.focusItem(this.cells[0][x]);
			}
			break;
		case keys.right:
			if ( this.cells[y][x + 1] ) {
				// can go one step right
				this.focusItem(this.cells[y][x + 1]);
			} else if ( this.cycleX ) {
				// jump to the first column
				this.focusItem(this.cells[y][0]);
			}
			break;
		case keys.left:
			if ( this.cells[y][x - 1] ) {
				// can go one step left
				this.focusItem(this.cells[y][x - 1]);
			} else if ( this.cycleX ) {
				// jump to the last column
				this.focusItem(this.cells[y][this.cells[y].length - 1]);
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
