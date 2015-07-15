/**
 * @module stb/component
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Emitter = require('./emitter'),
	router  = require('./router'),
	counter = 0;


/**
 * Base component implementation.
 *
 * Visual element that can handle sub-components.
 * Each component has a DOM element container $node with a set of classes:
 * "component" and some specific component class names depending on the hierarchy, for example "page".
 * Each component has a unique ID given either from $node.id or from data.id. If not given will generate automatically.
 *
 * @constructor
 * @extends Emitter
 *
 * @param {Object} [config={}] init parameters
 * @param {Element} [config.id] component unique identifier (generated if not set)
 * @param {Element} [config.$node] DOM element/fragment to be a component outer container
 * @param {Element} [config.$body] DOM element/fragment to be a component inner container (by default is the same as $node)
 * @param {Element} [config.$content] DOM element/fragment to be appended to the $body
 * @param {Component} [config.parent] link to the parent component which has this component as a child
 * @param {Array.<Component>} [config.children=[]] list of components in this component
 * @param {Object.<string, function>} [config.events={}] list of event callbacks
 * @param {boolean} [config.visible=true] component initial visibility state flag
 * @param {boolean} [config.focusable=true] component can accept focus or not
 *
 * @fires module:stb/component~Component#click
 *
 * @example
 * var component = new Component({
 *     $node: document.getElementById(id),
 *     events: {
 *         click: function () { ... }
 *     }
 * });
 * component.add( ... );
 * component.focus();
 */
function Component ( config ) {
	// current execution context
	var self = this;

	/**
	 * Component visibility state flag.
	 *
	 * @readonly
	 * @type {boolean}
	 */
	this.visible = true;

	/**
	 * Component can accept focus or not.
	 *
	 * @type {boolean}
	 */
	this.focusable = true;

	/**
	 * DOM outer handle.
	 *
	 * @type {Element}
	 */
	this.$node = null;

	/**
	 * DOM inner handle.
	 * In simple cases is the same as $node.
	 *
	 * @type {Element}
	 */
	this.$body = null;

	if ( DEBUG ) {
		/**
		 * Link to the page owner component.
		 * It can differ from the direct parent.
		 * Should be used only in debug.
		 *
		 * @type {Page}
		 */
		//this.page = null;
	}

	/**
	 * Link to the parent component which has this component as a child.
	 *
	 * @type {Component}
	 */
	this.parent = null;

	/**
	 * List of all children components.
	 *
	 * @type {Component[]}
	 */
	this.children = [];


	// sanitize
	config = config || {};

	if ( DEBUG ) {
		if ( typeof config !== 'object' ) { throw 'wrong config type'; }
	}

	// parent init
	Emitter.call(this, config.data);

	// outer handle
	if ( config.$node !== undefined ) {
		if ( DEBUG ) {
			if ( !(config.$node instanceof Element) ) { throw 'wrong config.$node type'; }
		}
		// apply
		this.$node = config.$node;
	} else {
		// empty div in case nothing is given
		this.$node = document.createElement('div');
	}

	// inner handle
	if ( config.$body !== undefined ) {
		if ( DEBUG ) {
			if ( !(config.$body instanceof Element) ) { throw 'wrong config.$body type'; }
		}
		// apply
		this.$body = config.$body;
	} else {
		// inner and outer handlers are identical
		this.$body = this.$node;
	}

	// inject given content into inner component part
	if ( config.$content !== undefined ) {
		if ( DEBUG ) {
			if ( !(config.$content instanceof Element) ) { throw 'wrong config.$content type'; }
		}
		// apply
		this.$body.appendChild(config.$content);
	}

	// correct CSS class names
	this.$node.classList.add('component');

	// apply hierarchy
	if ( config.parent !== undefined ) {
		if ( DEBUG ) {
			if ( !(config.parent instanceof Component) ) { throw 'wrong config.parent type'; }
		}
		// apply
		config.parent.add(this);
	}

	// set link to the page owner component
	//if ( config.page !== undefined ) {
	//	if ( DEBUG ) {
	//		if ( !(config.page instanceof Component) ) { throw 'wrong config.page type'; }
	//	}
    //	// apply
	//	this.page = config.page;
	//}

	// apply given visibility
	if ( config.visible === false ) {
		// default state is visible
		this.hide();
	}

	// can't accept focus
	if ( config.focusable === false ) {
		this.focusable = false;
	}

	// apply given events
	if ( config.events !== undefined ) {
		// no need in assert here (it is done inside the addListeners)
		this.addListeners(config.events);
	}

	// apply component id if given, generate otherwise
	this.id = config.id || this.$node.id || 'id' + counter++;

	if ( DEBUG ) {
		// expose inner ID to global scope
		window[self.id] = self.$node;
	}

	// apply the given children components
	if ( config.children ) {
		if ( DEBUG ) {
			if ( !Array.isArray(config.children) ) { throw 'wrong config.children type'; }
		}
		// apply
		this.add.apply(this, config.children);
	}

	// component activation by mouse
	this.$node.addEventListener('click', function ( event ) {
		// left mouse button
		if ( event.button === 0 ) {
			// activate if possible
			self.focus();

			// there are some listeners
			if ( self.events['click'] !== undefined ) {
				/**
				 * Mouse click event.
				 *
				 * @event module:stb/component~Component#click
				 *
				 * @type {Object}
				 * @property {Event} event click event data
				 */
				self.emit('click', {event: event});
			}

			// not prevented
			//if ( !event.stop ) {
			//	// activate if possible
			//	self.focus();
			//}
		}

		if ( DEBUG ) {
			// middle mouse button
			if ( event.button === 1 ) {
				debug.inspect(self, 0);
				debug.info('"window.link" or "' + self.id + '.component"', 'this component is now available in global scope');
				window.link = self;
				self.$node.classList.toggle('wired');
			}
		}

		event.stopPropagation();
	});

	if ( DEBUG ) {
		// expose a link
		this.$node.component = this.$body.component = this;
		this.$node.title = 'component ' + this.constructor.name + '.' + this.id + ' (outer)';
		this.$body.title = 'component ' + this.constructor.name + '.' + this.id + ' (inner)';
	}

	// @todo remove or implement
	// navigation by keyboard
	//this.addListener('keydown', this.navigateDefault);
}


// inheritance
Component.prototype = Object.create(Emitter.prototype);
Component.prototype.constructor = Component;


/**
 * Default method to move focus according to pressed keys.
 *
 * @todo remove or implement
 *
 * @param {Event} event generated event source of movement
 */
/*Component.prototype.navigateDefault = function ( event ) {
	switch ( event.code ) {
		case keys.up:
		case keys.down:
		case keys.right:
		case keys.left:
			// notify listeners
			this.emit('overflow');
			break;
	}
};*/


/**
 * Current active method to move focus according to pressed keys.
 * Can be redefined to provide custom navigation.
 *
 * @todo remove or implement
 *
 * @type {function}
 */
/*Component.prototype.navigate = Component.prototype.navigateDefault;*/


/**
 * Add a new component as a child.
 *
 * @param {...Component} [child] variable number of elements to append
 *
 * @files Component#add
 *
 * @example
 * panel.add(
 *     new Button( ... ),
 *     new Button( ... )
 * );
 */
Component.prototype.add = function ( child ) {
	var i;

	// walk through all the given elements
	for ( i = 0; i < arguments.length; i++ ) {
		child = arguments[i];

		if ( DEBUG ) {
			if ( !(child instanceof Component) ) { throw 'wrong child type'; }
		}

		// apply
		this.children.push(child);
		child.parent = this;

		//if ( DEBUG ) {
		//	// apply page for this and all children recursively
		//	child.setPage(this.page);
		//}

		// correct DOM parent/child connection if necessary
		if ( child.$node !== undefined && child.$node.parentNode === null ) {
			this.$body.appendChild(child.$node);
		}

		// there are some listeners
		if ( this.events['add'] !== undefined ) {
			/**
			 * A child component is added.
			 *
			 * @event module:stb/component~Component#add
			 *
			 * @type {Object}
			 * @property {Component} child new component added
			 */
			this.emit('add', {item: child});
		}

		debug.log('component ' + this.constructor.name + '.' + this.id + ' new child: ' + child.constructor.name + '.' + child.id);
	}
};


//if ( DEBUG ) {
//	Component.prototype.setPage = function ( page ) {
//		this.page = page;
//
//		this.children.forEach(function ( child ) {
//			child.setPage(page);
//		});
//	};
//}


/**
 * Delete this component and clear all associated events.
 *
 * @fires module:stb/component~Component#remove
 */
Component.prototype.remove = function () {
	var page = router.current;

	// really inserted somewhere
	if ( this.parent ) {
		if ( DEBUG ) {
			if ( !(this.parent instanceof Component) ) { throw 'wrong this.parent type'; }
		}

		// active at the moment
		if ( page.activeComponent === this ) {
			this.blur();
			this.parent.focus();
		}
		this.parent.children.splice(this.parent.children.indexOf(this), 1);
	}

	// remove all children
	this.children.forEach(function ( child ) {
		if ( DEBUG ) {
			if ( !(child instanceof Component) ) { throw 'wrong child type'; }
		}

		child.remove();
	});

	this.removeAllListeners();
	this.$node.parentNode.removeChild(this.$node);

	// there are some listeners
	if ( this.events['remove'] !== undefined ) {
		/**
		 * Delete this component.
		 *
		 * @event module:stb/component~Component#remove
		 */
		this.emit('remove');
	}

	debug.log('component ' + this.constructor.name + '.' + this.id + ' remove', 'red');
};


/**
 * Activate the component.
 * Notify the owner-page and apply CSS class.
 *
 * @param {Object} data custom data which passed into handlers
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/component~Component#focus
 */
Component.prototype.focus = function ( data ) {
	var activePage = router.current,
		activeItem = activePage.activeComponent;

	//if ( DEBUG ) {
	//	if ( this.page !== activePage ) {
	//		console.log(this, this.page, activePage);
	//		throw 'attempt to focus an invisible component';
	//	}
	//}

	// this is a visual component on a page
	// not already focused and can accept focus
	if ( this.focusable && this !== activeItem ) {
		// notify the current active component
		if ( activeItem ) { activeItem.blur(); }

		/* eslint consistent-this: 0 */

		// apply
		activePage.activeComponent = activeItem = this;
		activeItem.$node.classList.add('focus');

		// there are some listeners
		if ( activeItem.events['focus'] !== undefined ) {
			/**
			 * Make this component focused.
			 *
			 * @event module:stb/component~Component#focus
			 */
			activeItem.emit('focus', data);
		}

		debug.log('component ' + this.constructor.name + '.' + this.id + ' focus');

		return true;
	}

	// nothing was done
	return false;
};


/**
 * Remove focus.
 * Change page.activeComponent and notify subscribers.
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/component~Component#blur
 */
Component.prototype.blur = function () {
	var activePage = router.current,
		activeItem = activePage.activeComponent;

	// this is the active component
	if ( this === activeItem ) {
		this.$node.classList.remove('focus');
		activePage.activeComponent = null;

		// there are some listeners
		if ( this.events['blur'] !== undefined ) {
			/**
			 * Remove focus from this component.
			 *
			 * @event module:stb/component~Component#blur
			 */
			this.emit('blur');
		}

		debug.log('component ' + this.constructor.name + '.' + this.id + ' blur', 'grey');

		return true;
	}

	// nothing was done
	return false;
};


/**
 * Make the component visible and notify subscribers.
 *
 * @param {Object} data custom data which passed into handlers
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/component~Component#show
 */
Component.prototype.show = function ( data ) {
	// is it hidden
	if ( !this.visible ) {
		// correct style
		this.$node.classList.remove('hidden');
		// flag
		this.visible = true;

		// there are some listeners
		if ( this.events['show'] !== undefined ) {
			/**
			 * Make the component visible.
			 *
			 * @event module:stb/component~Component#show
			 */
			this.emit('show', data);
		}

		return true;
	}

	// nothing was done
	return true;
};


/**
 * Make the component hidden and notify subscribers.
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/component~Component#hide
 */
Component.prototype.hide = function () {
	// is it visible
	if ( this.visible ) {
		// correct style
		this.$node.classList.add('hidden');
		// flag
		this.visible = false;

		// there are some listeners
		if ( this.events['hide'] !== undefined ) {
			/**
			 * Make the component hidden.
			 *
			 * @event module:stb/component~Component#hide
			 */
			this.emit('hide');
		}

		return true;
	}

	// nothing was done
	return true;
};


// public
module.exports = Component;
