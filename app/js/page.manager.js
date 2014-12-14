/**
 * Base page implementation.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Collection = require('./collection'),
	Page = require('ui/page');


/**
 * @constructor
 *
 * @example
 * var pm = new PageManager();
 */
function PageManager () {
	// parent init
	Collection.call(this);

	this.history = [];
	this.current = null;

	// set connection
	Page.prototype.manager = this;
}


// inheritance
PageManager.prototype = Object.create(Collection.prototype);
PageManager.prototype.constructor = PageManager;


/**
 * Hide page.
 *
 * @param {Page} page component to hide
 */
PageManager.prototype.add = function ( page ) {
	var self = this;

	// valid input object
	if ( page instanceof Page ) {
		// parent call
		Collection.prototype.add.call(this, page);

		// set link
		//page.manager = this;

		// correct current pointer
		if ( page.active ) {
			this.current = page;
		}

		page.addListener('show', function eventListenerShow () {
			// new active is not the current
			if ( self.current !== page ) {
				// hide the currently visible page if any
				if ( self.current ) { self.current.hide(); }
				self.current = page;
				self.history.push(page);
			}
		});

		page.addListener('hide', function eventListenerHide () {
			// hide the currently visible page if any
			if ( self.history.length > 0 ) {
				self.current.hide();
			}
			self.current = page;
			self.history.pop();
		});

		return true;
	}

	return false;
};


/**
 * Show page.
 *
 * @param {Page} page component to show
 */
PageManager.prototype.show = function ( page ) {
	page.show();

	if ( !this.has(page) ) {
		this.add(page);
	}

	this.emit('show', {page: page});
};


/**
 * Hide page.
 *
 * @param {Page} page component to hide
 */
PageManager.prototype.hide = function ( page ) {
	page.hide();
	this.emit('hide', {page: page});
};


/**
 *
 */
PageManager.prototype.forward = function () {

	this.emit('forward', {});
};


/**
 *
 */
PageManager.prototype.backward = function () {

	this.emit('backward', {});
};


PageManager.prototype.moveUp = function () {

	this.emit('reorder', {});
};


PageManager.prototype.moveDown = function () {

	this.emit('reorder', {});
};


PageManager.prototype.moveTop = function () {

	this.emit('reorder', {});
};


PageManager.prototype.moveBottom = function () {

	this.emit('reorder', {});
};


// public export
module.exports = PageManager;
