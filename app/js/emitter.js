/**
 * @module stb/emitter
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';


/**
 * Base Events Emitter implementation.
 *
 * @see http://nodejs.org/api/events.html
 * @constructor
 */
function Emitter () {
	/**
	 * Inner hash table for event names and linked callbacks.
	 * Manual editing should be avoided.
	 *
	 * @member {Object.<string, function[]>}
	 *
	 * @example
	 * {
	 *     click: [
	 *         function click1 () { ... },
	 *         function click2 () { ... }
	 *     ],
	 *     keydown: [
	 *         function () { ... }
	 *     ]
	 * }
	 **/
	this.events = {};
}


Emitter.prototype = {
	/**
	 * Bind an event to the given callback function.
	 * The same callback function can be added multiple times for the same event name.
	 *
	 * @param {string} name event identifier
	 * @param {function} callback function to call on this event
	 *
	 * @example
	 * var obj = new Emitter();
	 * obj.addListener('click', function ( data ) { ... });
	 * // one more click handler
	 * obj.addListener('click', function ( data ) { ... });
	 */
	addListener: function ( name, callback ) {
		if ( DEBUG ) {
			if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
			if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
			if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
		}

		// initialization may be required
		this.events[name] = this.events[name] || [];
		// append this new event to the list
		this.events[name].push(callback);
	},


	/**
	 * Add a one time listener for the event.
	 * This listener is invoked only the next time the event is fired, after which it is removed.
	 *
	 * @param {string} name event identifier
	 * @param {function} callback function to call on this event
	 */
	once: function ( name, callback ) {
		// current execution context
		var self = this;

		if ( DEBUG ) {
			if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
			if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
			if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
		}

		// initialization may be required
		this.events[name] = this.events[name] || [];
		// append this new event to the list
		this.events[name].push(function onceWrapper ( data ) {
			callback(data);
			self.removeListener(name, onceWrapper);
		});
	},


	/**
	 * Apply multiple listeners at once.
	 *
	 * @param {Object} callbacks event names with callbacks
	 *
	 * @example
	 * var obj = new Emitter();
	 * obj.addListeners({click: function ( data ) {}, close: function ( data ) {}});
	 */
	addListeners: function ( callbacks ) {
		var name;

		if ( DEBUG ) {
			if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
			if ( typeof callbacks !== 'object' ) { throw 'wrong callbacks type'; }
			if ( Object.keys(callbacks).length === 0 ) { throw 'no callbacks given'; }
		}

		// valid input
		if ( typeof callbacks === 'object' ) {
			for ( name in callbacks ) {
				if ( callbacks.hasOwnProperty(name) ) {
					this.addListener(name, callbacks[name]);
				}
			}
		}
	},


	/**
	 * Remove all instances of the given callback.
	 *
	 * @param {string} name event identifier
	 * @param {function} callback function to remove
	 *
	 * @example
	 * obj.removeListener('click', func1);
	 */
	removeListener: function ( name, callback ) {
		if ( DEBUG ) {
			if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
			if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
			if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
			if ( this.events[name] && !Array.isArray(this.events[name]) ) { throw 'corrupted inner data'; }
		}

		// the event exists and should have some callbacks
		if ( this.events[name] !== undefined ) {
			// rework the callback list to exclude the given one
			this.events[name] = this.events[name].filter(function callbacksFilter ( fn ) { return fn !== callback; });
			// event has no more callbacks so clean it
			if ( this.events[name].length === 0 ) {
				// as if there were no listeners at all
				this.events[name] = undefined;
			}
		}
	},


	/**
	 * Remove all callbacks for the given event name.
	 * Without event name clears all events.
	 *
	 * @param {string} [name] event identifier
	 *
	 * @example
	 * obj.removeAllListeners('click');
	 * obj.removeAllListeners();
	 */
	removeAllListeners: function ( name ) {
		if ( DEBUG ) {
			if ( arguments.length !== 0 && (typeof name !== 'string' || name.length === 0) ) { throw 'wrong or empty name'; }
		}

		// check input
		if ( arguments.length === 0 ) {
			// no arguments so remove everything
			this.events = {};
		} else if ( name ) {
			if ( DEBUG ) {
				if ( this.events[name] !== undefined ) { throw 'event is not removed'; }
			}

			// only name is given so remove all callbacks for the given event
			// but object structure modification should be avoided
			this.events[name] = undefined;
		}
	},


	/**
	 * Execute each of the listeners in the given order with the supplied arguments.
	 *
	 * @param {string} name event identifier
	 * @param {Object} [data] options to send
	 *
	 * @todo consider use context
	 *
	 * @example
	 * obj.emit('init');
	 * obj.emit('click', {src:panel1, dst:panel2});
	 *
	 * // it's a good idea to emit event only when there are some listeners
	 * if ( this.events['click'] !== undefined ) {
	 *     this.emit('click', {event: event});
	 * }
	 */
	emit: function ( name, data ) {
		var event = this.events[name],
			i;

		if ( DEBUG ) {
			if ( arguments.length < 1 ) { throw 'wrong arguments number'; }
			if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
		}

		// the event exists and should have some callbacks
		if ( event !== undefined ) {
			if ( DEBUG ) {
				if ( !Array.isArray(event) ) { throw 'wrong event type'; }
			}

			for ( i = 0; i < event.length; i++ ) {
				if ( DEBUG ) {
					if ( typeof event[i] !== 'function' ) { throw 'wrong event callback type'; }
				}

				// invoke the callback with parameters
				// http://jsperf.com/function-calls-direct-vs-apply-vs-call-vs-bind/6
				event[i].call(this, data);
			}
		}
	}
};


// public
module.exports = Emitter;
