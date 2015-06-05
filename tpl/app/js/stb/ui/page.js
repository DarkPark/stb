/**
 * Page is the main component to build user interface.
 * Page is an area filling the whole screen.
 * There can be only one active page visible at the same time.
 *
 * Active/visible state of a page is managed by the `router` module.
 *
 * A page can contain other components.
 *
 * @module stb/ui/page
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Base page implementation.
 *
 * A full-screen top-level layer that can operate as an independent separate entity.
 * It is added to the document body on creation if not already linked.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 *
 * @example
 * var Page = require('stb/ui/page'),
 *     page = new Page({
 *         $node: document.getElementById(id)
 *     });
 *
 * page.addListener('show', function show () {
 *     // page is visible now
 * });
 */
function Page ( config ) {
	/**
	 * Page visibility/active state flag.
	 *
	 * @readonly
	 * @type {boolean}
	 */
	this.active = false;

	/**
	 * Link to the currently active component with focus.
	 *
	 * @readonly
	 * @type {Component}
	 */
	this.activeComponent = null;

	// sanitize
	config = config || {};

	// parent init
	Component.call(this, config);

	// correct CSS class names
	this.$node.classList.add('page');

	// state flag
	this.active = this.$node.classList.contains('active');

	// correct DOM parent/child connection if necessary
	if ( this.$node.parentNode === null ) {
		document.body.appendChild(this.$node);
	}

	// always itself
	this.page = this;
}


// inheritance
Page.prototype = Object.create(Component.prototype);
Page.prototype.constructor = Page;


// public
module.exports = Page;
