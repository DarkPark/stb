/**
 * @module stb/stack
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Emitter = require('./emitter');


/**
 * Simple observable stack implementation.
 *
 * @constructor
 * @extends Emitter
 *
 * @param {Object} [data={}] init attributes
 *
 * @example
 * var stack1 = new Stack(),
 *     stack2 = new Stack([1, 2, 3]);
 */
function Stack ( data ) {
    /**
     * Current top stack element.
     *
     * @readonly
     * @type {Object}
     */
    this.current = null;

    /**
     * List of all stack elements.
     *
     * @readonly
     * @type {Object[]}
     */
    this.data = data || [];

    if ( DEBUG ) {
        if ( typeof this !== 'object' ) { throw new Error(__filename + ': must be constructed via new'); }
        if ( !Array.isArray(this.data) ) { throw new Error(__filename + ': wrong data type'); }
    }

    // parent constructor call
    Emitter.call(this);
}


// inheritance
Stack.prototype = Object.create(Emitter.prototype);
Stack.prototype.constructor = Stack;


/**
 * Add new element to the stack event.
 *
 * @event module:stb/stack~Stack#push
 *
 * @type {Object}
 * @property {*} prev previous top element
 * @property {*} curr current top element
 */

/**
 * Add new element to the stack.
 *
 * @param {Object} data new element
 *
 * @fires module:stb/stack~Stack#push
 *
 * @example
 * stack.push(123);
 * stack.push('abc');
 * stack.push({foo: 'bar'});
 */
Stack.prototype.push = function ( data ) {
    var prev = this.current;

    // apply
    this.data.push(data);

    // link
    this.current = data;

    // there are some listeners
    if ( this.events['push'] ) {
        // notify listeners
        this.emit('push', {prev: prev, curr: this.current});
    }
};


/**
 * Remove current top element from the stack event.
 *
 * @event module:stb/stack~Stack#pop
 *
 * @type {Object}
 * @property {*} prev previous top element
 * @property {*} curr current top element
 */

/**
 * Remove current top element from the stack.
 *
 * @return {*} removed element
 *
 * @fires module:stb/stack~Stack#pop
 *
 * @example
 * var item = stack.pop();
 */
Stack.prototype.pop = function () {
    var prev = null;

    // there are some pages in the stack
    if ( this.data.length > 0 ) {
        // remove the current
        prev = this.data.pop();

        // set top element
        this.current = this.data.length > 0 ? this.data[this.data.length - 1] : null;

        // there are some listeners
        if ( this.events['pop'] ) {
            // notify listeners
            this.emit('pop', {prev: prev, curr: this.current});
        }
    }

    return prev;
};


if ( DEBUG ) {
    // expose to the global scope
    window.Stack = Stack;
}


// public
module.exports = Stack;
