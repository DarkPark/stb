/**
 * @module stb/component
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Emitter = require('./emitter'),
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
 *
 * @param {Object} [config={}] init parameters
 * @param {Node} config.id component unique identifier
 * @param {Node} config.$node DOM element/fragment to be a component outer container
 * @param {Node} config.$body DOM element/fragment to be a component inner container (by default is the same as $node)
 * @param {Node} config.$content DOM element/fragment to be appended to the $body
 * @param {Component} config.parent link to the parent component which has this component as a child
 * @param {Array.<Component>} config.children list of components in this component
 * @param {Object.<string, function>} config.events list of event callbacks
 * @param {string} config.class CSS class name
 *
 * @example
 * var component = new Component({
 *     $node: document.getElementById(id),
 *     events: {
 *         click: function () { ... }
 *     },
 *     class: 'modern'
 * });
 * component.add( ... );
 * component.focus();
 *
 * @todo find a solution to solve missing page link
 */
function Component ( config ) {
	var self = this,
		i, len;

	/**
	 * DOM outer handle.
	 *
	 * @type {Node}
	 */
	this.$node = null;

	/**
	 * DOM inner handle.
	 * In simple cases is the same as $node.
	 *
	 * @type {Node}
	 */
	this.$body = null;

	/**
	 * Link to the page owner component.
	 * It can differ from the direct parent.
	 *
	 * @type {Page}
	 */
	this.page = null;

	/**
	 * Link to the parent component which has this component as a child.
	 *
	 * @type {Component}
	 */
	this.parent = null;

	/**
	 * List of all children components.
	 *
	 * @type {Collection}
	 */
	this.children = [];


	// sanitize
	config = config || {};
	// @ifdef DEBUG
	if ( typeof config !== 'object' ) { throw 'wrong config type'; }
	// @endif

	// parent init
	Emitter.call(this, config.data);

	// outer handle
	if ( config.$node !== undefined ) {
		// @ifdef DEBUG
		if ( !(config.$node instanceof Node) ) { throw 'wrong config.$node type'; }
		// @endif

		this.$node = config.$node;
	} else {
		// empty div in case nothing is given
		this.$node = document.createElement('div');
	}

	// inner handle
	if ( config.$body !== undefined ) {
		// @ifdef DEBUG
		if ( !(config.$body instanceof Node) ) { throw 'wrong config.$body type'; }
		// @endif

		this.$body = config.$body;
	} else {
		// inner and outer handlers are identical
		this.$body = this.$node;
	}

	// inject given content into inner component part
	if ( config.$content !== undefined ) {
		// @ifdef DEBUG
		if ( !(config.$content instanceof Node) ) { throw 'wrong config.$content type'; }
		// @endif

		this.$body.appendChild(config.$content);
	}

	// correct CSS class names
	this.$node.classList.add('component');

	// apply additional CSS class name
	if ( config['class'] !== undefined ) {
		// @ifdef DEBUG
		if ( typeof config['class'] !== 'string' || config['class'].length === 0 ) { throw 'wrong config.class type or empty value'; }
		// @endif

		this.$node.classList.add(config['class']);
	}

	// apply hierarchy
	if ( config.parent !== undefined ) {
		// @ifdef DEBUG
		if ( !(config.parent instanceof Component) ) { throw 'wrong config.parent type'; }
		// @endif

		config.parent.add(this);
	}

	// set link to the page owner component
	if ( config.page !== undefined ) {
		// @ifdef DEBUG
		if ( !(config.page instanceof Component) ) { throw 'wrong config.page type'; }
		// @endif

		this.page = config.page;
	}

	// apply given events
	if ( config.events !== undefined ) {
		// no need in assert here (it is done inside the addListeners)
		this.addListeners(config.events);
	}

	// apply component id if given, generate otherwise
	this.id = config.id || this.$node.id || 'id' + counter++;

	// apply the given children components
	if ( config.children ) {
		// @ifdef DEBUG
		if ( !Array.isArray(config.children) ) { throw 'wrong config.children type'; }
		// @endif

		for ( i = 0, len = config.children.length; i < len; i++ ) {
			this.add(config.children[i]);
		}
	}

	// component activation by mouse
	this.$node.addEventListener('click', function ( event ) {
		// left mouse button
		if ( event.button === 0 ) {
			self.focus();
			self.emit('click');
		}

		// @ifdef DEBUG
		// middle mouse button
		if ( event.button === 1 ) {
			console.log(self);
		}
		// @endif

		event.stopPropagation();
	});

	// @ifdef DEBUG
	// expose a link
	this.$node.component = this.$body.component = this;
	this.$node.title = 'component ' + this.constructor.name + '.' + this.id + ' (outer)';
	this.$body.title = 'component ' + this.constructor.name + '.' + this.id + ' (inner)';
	// @endif
}


// inheritance
Component.prototype = Object.create(Emitter.prototype);
Component.prototype.constructor = Component;


/**
 * Add a new component as a child.
 *
 * @param {...Component} [child] variable number of elements to append
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

		// @ifdef DEBUG
		if ( !(child instanceof Component) ) { throw 'wrong child type'; }
		// @endif

		// apply
		this.children.push(child);
		child.parent = this;
		child.page   = this.page;

		// correct DOM parent/child connection if necessary
		if ( child.$node !== undefined && child.$node.parentNode === null ) {
			this.$body.appendChild(child.$node);
		}

		// notify listeners
		this.emit('add', {item: child});

		// @ifdef DEBUG
		console.log('component ' + this.constructor.name + '.' + this.id + ' new child: ' + child.constructor.name + '.' + child.id);
		// @endif
	}
};


/**
 * Delete this component and clear all associated events.
 *
 * @todo add recursive removal of all children
 */
Component.prototype.remove = function () {
	// inserted somewhere
	if ( this.parent ) {
		// active at the moment
		if ( this.page.activeComponent === this ) {
			this.blur();
			this.parent.focus();
		}
		this.parent.children.splice(this.parent.children.indexOf(this), 1);
	}
	// clear
	this.clear();
	this.removeAllListeners();
	this.$node.parentNode.removeChild(this.$node);

	// notify listeners
	this.emit('remove');

	debug.log('component ' + this.constructor.name + '.' + this.id + ' remove', 'red');
};


/**
 * Activate the component.
 * Notify the owner-page and apply CSS class.
 *
 * @return {boolean} operation status
 */
Component.prototype.focus = function () {
	var current = this.page.activeComponent;

	// this is a visual component on a page
	// and not already focused
	if ( this.page && this !== current ) {
		// notify the current active component
		if ( current ) { current.blur(); }

		// apply
		this.page.activeComponent = current = this;
		current.$node.classList.add('focus');

		// notify listeners
		current.emit('focus');

		debug.log('component ' + this.constructor.name + '.' + this.id + ' focus');

		return true;
	}

	return false;
};


/**
 * Remove focus.
 * Change page.activeComponent and notify subscribers.
 *
 * @return {boolean} operation status
 */
Component.prototype.blur = function () {
	// this is the active component
	if ( this.page && this === this.page.activeComponent ) {
		this.$node.classList.remove('focus');
		this.page.activeComponent = null;

		// notify listeners
		this.emit('blur');

		debug.log('component ' + this.constructor.name + '.' + this.id + ' blur', 'grey');

		return true;
	}

	return false;
};


// public export
module.exports = Component;
