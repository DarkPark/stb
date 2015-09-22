/**
 * @module stb/ui/layer.item
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Layer item implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 *
 * @example
 * var LayerItem = require('stb/ui/layer.item'),
 *     layer = new LayerItem({
 *         $node: document.getElementById('someId'),
 *         children: [
 *             new Panel({
 *                 $node: document.getElementById('anotherId')
 *             })
 *         ],
 *         events: {
 *             'move:top': function ( event ) {
 *                 this.children[0].$body.innerText = event.data;
 *                 this.children[0].focus();
 *             }
 *         }
 *     });
 *
 * page.add(layer);
 */
function LayerItem ( config ) {
	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
		if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
	}


	/**
	 * Component z-index value.
	 * @type {(boolean|number)}
	 */
	this.zIndex = false;

	// can't accept focus
	config.focusable = config.focusable || false;

	// hidden by default
	config.visible = config.visible || false;

	// set default className if classList property empty or undefined
	config.className = 'layerItem ' + (config.className || '');

	// parent constructor call
	Component.call(this, config);
}


// inheritance
LayerItem.prototype = Object.create(Component.prototype);
LayerItem.prototype.constructor = LayerItem;


if ( DEBUG ) {
	// expose to the global scope
	window.ComponentLayerItem = LayerItem;
}


/**
 * Move layer up in the order of the list.
 * Does nothing if layer already at top.
 *
 * @param {object} [data] data for layer
 *
 * @return {boolean} apply result
 *
 * @fires module:stb/ui/layer.item~LayerItem#move:up
 * @fires module:stb/ui/layer.list~LayerList#item:change
 */
LayerItem.prototype.moveUp = function ( data ) {
	if ( DEBUG ) {
		if ( !this.parent ) { throw new Error(__filename + ': no parent for layer item'); }
		if ( this.parent.constructor.name !== 'LayerList' ) { throw new Error(__filename + ': no parent for layer item'); }
	}

	if ( typeof this.zIndex === 'number' ) {
		// z-index was provided
		if ( this.zIndex < ( this.parent.children.length - 1 + this.parent.zIndex ) ) {
			this.parent.map[this.zIndex] = this.parent.map[this.zIndex + 1];
			this.parent.map[this.zIndex].$node.style.zIndex = this.zIndex;
			this.parent.map[this.zIndex].zIndex = this.zIndex;
			++this.zIndex;
			this.$node.style.zIndex = this.zIndex;
			this.parent.map[this.zIndex] = this;

			if ( this.events['move:up'] ) {
				this.emit('move:up', {data: data});
			}

			if ( this.parent.events['item:change'] ) {
				this.emit('item:change', {state: 'move:up', component: this});
			}

			return true;
		}
	} else if ( this.$node.nextSibling ) {
		// logic with DOM level manipulation
		// not in the end

		if ( this.$node.nextSibling === this.parent.$body.lastChild ) {
			// penultimate element
			this.parent.$body.appendChild(this.$node);
		} else {
			this.parent.$body.insertBefore(this.$node, this.$node.nextSibling.nextSibling);
		}


		if ( this.events['move:up'] ) {
			this.emit('move:up', {data: data});
		}

		if ( this.parent.events['item:change'] ) {
			this.parent.emit('item:change', {state: 'move:up', component: this});
		}

		return true;
	}

	return false;
};


/**
 * Move layer down in the order of the list.
 * Does nothing if layer already at bottom.
 *
 * @param {object} [data] data for layer
 *
 * @return {boolean} apply result
 *
 * @fires module:stb/ui/layer.item~LayerItem#move:down
 * @fires module:stb/ui/layer.list~LayerList#item:change
 */
LayerItem.prototype.moveDown = function ( data ) {
	if ( DEBUG ) {
		if ( !this.parent ) { throw new Error(__filename + ': no parent for layer item'); }
		if ( this.parent.constructor.name !== 'LayerList' ) { throw new Error(__filename + ': no parent for layer item'); }
	}

	if ( typeof this.zIndex === 'number' ) {
		// z-index was provided
		if ( this.zIndex > this.parent.zIndex ) {
			this.parent.map[this.zIndex] = this.parent.map[this.zIndex - 1];
			this.parent.map[this.zIndex].$node.style.zIndex = this.zIndex;
			this.parent.map[this.zIndex].zIndex = this.zIndex;
			--this.zIndex;
			this.$node.style.zIndex = this.zIndex;
			this.parent.map[this.zIndex] = this;

			if ( this.events['move:up'] ) {
				this.emit('move:up', {data: data});
			}

			if ( this.parent.events['item:change'] ) {
				this.emit('item:change', {state: 'move:down', component: this});
			}

			return true;
		}
	} else if ( this.$node.previousSibling ) {
		// logic with DOM level manipulation
		// not in the start

		this.parent.$body.insertBefore(this.$node, this.$node.previousSibling);

		if ( this.events['move:down'] ) {
			this.emit('move:down', {data: data});
		}

		if ( this.parent.events['item:change'] ) {
			this.parent.emit('item:change', {state: 'move:down', component: this});
		}

		return true;
	}

	return false;
};


/**
 * Move layer to the top of the layers list.
 * Does nothing if layer already at bottom.
 *
 * @param {object} [data] data for layer
 *
 * @return {boolean} apply result
 *
 * @fires module:stb/ui/layer.item~LayerItem#move:top
 * @fires module:stb/ui/layer.list~LayerList#item:change
 */
LayerItem.prototype.moveTop = function ( data ) {
	var i, size;

	if ( DEBUG ) {
		if ( !this.parent ) { throw new Error(__filename + ': no parent for layer item'); }
		if ( this.parent.constructor.name !== 'LayerList' ) { throw new Error(__filename + ': no parent for layer item'); }
	}

	if ( typeof this.zIndex === 'number' ) {
		// z-index was provided
		debug.info([this.zIndex, this.parent.children.length, this.parent.zIndex]);

		if ( this.zIndex < ( this.parent.children.length + this.parent.zIndex - 1 ) ) {
			// not on the top

			// loop through the layers which are upper then current
			for ( i = this.zIndex, size = this.parent.zIndex + this.parent.children.length - 1; i < size; ++i ) {
				debug.log('moving layer from ' + (i + 1) + ' to ' + i + ' zIndex');
				this.parent.map[i] = this.parent.map[i + 1];
				this.parent.map[i].$node.style.zIndex = i;
				this.parent.map[i].zIndex = i;
			}
			this.zIndex = this.parent.children.length + this.parent.zIndex - 1;
			this.$node.style.zIndex = this.zIndex;
			this.parent.map[this.zIndex] = this;

			if ( this.events['move:top'] ) {
				this.emit('move:top', {data: data});
			}

			if ( this.parent.events['item:change'] ) {
				this.emit('item:change', {state: 'move:top', component: this});
			}

			return true;
		}
	} else if ( this.$node !== this.parent.$body.lastChild ) {
		// logic with DOM level manipulation
		// not in the end

		this.parent.$body.appendChild(this.$node);

		if ( this.events['move:top'] ) {
			this.emit('move:top', {data: data});
		}

		if ( this.parent.events['item:change'] ) {
			this.parent.emit('item:change', {state: 'move:top', component: this});
		}

		return true;
	}

	return false;
};


/**
 * Move layer to the bottom of the layers list.
 * Does nothing if layer already at top.
 *
 * @param {object} [data] data for layer
 *
 * @return {boolean} apply result
 *
 * @fires module:stb/ui/layer.item~LayerItem#move:bottom
 * @fires module:stb/ui/layer.list~LayerList#item:change
 */
LayerItem.prototype.moveBottom = function ( data ) {
	var i, size;

	if ( DEBUG ) {
		if ( !this.parent ) { throw new Error(__filename + ': no parent for layer item'); }
		if ( this.parent.constructor.name !== 'LayerList' ) { throw new Error(__filename + ': no parent for layer item'); }
	}

	if ( typeof this.zIndex === 'number' ) {
		// z-index was provided

		if ( this.zIndex > this.parent.zIndex ) {
			// not on the top

			// loop through the layers which are below then current
			for ( i = this.zIndex, size = this.parent.zIndex; i > size; --i ) {
				debug.log('moving layer from ' + (i - 1) + ' to ' + i + ' zIndex');
				this.parent.map[i] = this.parent.map[i - 1];
				this.parent.map[i].$node.style.zIndex = i;
				this.parent.map[i].zIndex = i;
			}
			this.zIndex = this.parent.zIndex;
			this.$node.style.zIndex = this.zIndex;
			this.parent.map[this.zIndex] = this;

			if ( this.events['move:bottom'] ) {
				this.emit('move:bottom', {data: data});
			}

			if ( this.parent.events['item:change'] ) {
				this.emit('item:change', {state: 'move:bottom', component: this});
			}

			return true;
		}
	} else if ( this.$node !== this.parent.$body.firstChild ) {
		// logic with DOM level manipulation
		// not at the start

		this.parent.$body.insertBefore(this.$node, this.parent.$body.firstChild);

		if ( this.events['move:bottom'] ) {
			this.emit('move:bottom', {data: data});
		}

		if ( this.parent.events['item:change'] ) {
			this.parent.emit('item:change', {state: 'move:bottom', component: this});
		}

		return true;
	}

	return false;
};


// public
module.exports = LayerItem;
