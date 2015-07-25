/**
 * Logger.
 *
 * @module stb/develop/debug
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint new-cap: 0 */

var host      = require('../app').data.host,
	config    = require('../../../../config/logger'),
	util      = require('util'),
	buffer    = [],
	timeMarks = {},  // storage for timers (debug.time, debug.timeEnd)
	socket;


// enable colors in console
require('tty-colors');


(function connect () {
	if ( !config.active || !host ) {
		return;
	}

	socket = new WebSocket('ws://' + location.hostname + ':' + config.port);

	socket.onclose = function () {
		setTimeout(function () {
			connect();
		}, 5000);
	};
})();


/**
 * Wrapper to dump message locally and remotely.
 *
 * @param {string} message data to output and send
 */
function log ( message ) {
	gSTB.Debug(message);
	buffer.push(message);
	if ( socket && socket.readyState === socket.OPEN ) {
		socket.send(JSON.stringify(buffer));
		buffer = [];
	}
}


/**
 * Global object to output logs
 * @namespace
 * @global
 */
module.exports = window.debug = {

	/**
	 * Check condition and warn if not match.
	 *
	 * @param {boolean} condition should be true if okay
	 * @param {string} title description of the problem
	 */
	assert: function ( condition, title ) {
		if ( !condition ) {
			if ( host ) {
				log(('Assertion failed: ' + title).red);
			} else {
				console.assert(condition, title);
			}
		}
	},


	/**
	 * Print a plain colored string.
	 *
	 * @param {*} message data to output
	 * @param {string} [color='black'] colour to set
	 */
	log: function ( message, color ) {
		message = (message + '') || '(empty message)';
		if ( host ) {
			log(message[color || 'white']);
		} else {
			console.log('%c%s', 'color:' + (color || 'black'), message);
		}
	},


	/**
	 * Print the given var with caption.
	 *
	 * @param {*} data data to output
	 * @param {string} [title] optional caption
	 */
	info: function ( data, title ) {
		var type = Object.prototype.toString.call(data).match(/\s([a-zA-Z]+)/)[1].toLowerCase(),
			args;

		if ( host ) {
			// prepare
			if ( data instanceof Object || Array.isArray(data) ) {
				// complex object
				data = data.nodeName ? data.outerHTML : JSON.stringify(data, null, 4);
			}
			// combine all together and print result
			log((type === 'error' ? type.red : type.green) + '\t' + (title ? title.bold + ':\t'.green : '') + data);
		} else {
			args = ['color:' + (type === 'error' ? 'red' : 'green'), type];
			if ( title ) {
				args.unshift('%c%s\t%c%s\t');
				args.push('color:grey');
				args.push(title);
			} else {
				args.unshift('%c%s\t');
			}
			args.push(data);
			// output
			console.log.apply(console, args);
		}
	},


	/**
	 * Print the given complex var with level restriction.
	 *
	 * @param {*} data data to output
	 * @param {number} [depth=0] amount of sub-levels to print
	 */
	inspect: function ( data, depth ) {
		if ( host ) {
			log('inspect:\n' + util.inspect(data, {depth: depth === undefined ? 3 : depth, colors: true}));
		} else {
			console.log(data);
		}
	},


	/**
	 * Print the given event object in some special way.
	 *
	 * @param {Event} data event object
	 */
	event: function ( data ) {
		var type  = data.type.toUpperCase(),
			color = type === 'ERROR' ? 'red' : 'green',
			text  = ('Event ' + type[color]).bold;

		if ( host ) {
			switch ( type ) {
				case 'KEYDOWN':
					text = text +
					'\tctrl' [data.ctrlKey  ? 'green' : 'grey'] +
					' alt'  [data.altKey   ? 'green' : 'grey'] +
					' shift'[data.shiftKey ? 'green' : 'grey'] +
					'\t' + data.keyCode + '\t' + data.code + '\t' + (data.keyIdentifier || '').green;
					break;
				case 'KEYPRESS':
					text = text +
					'\tctrl' [data.ctrlKey  ? 'green' : 'grey'] +
					' alt'  [data.altKey   ? 'green' : 'grey'] +
					' shift'[data.shiftKey ? 'green' : 'grey'] +
					'\t' + data.keyCode + '\t' + (data.keyIdentifier || '').green + '\t' + String.fromCharCode(data.keyCode);
					break;
				case 'MOUSEMOVE':
					text = text +
					'\tctrl' [data.ctrlKey  ? 'green' : 'grey'] +
					' alt'  [data.altKey   ? 'green' : 'grey'] +
					' shift'[data.shiftKey ? 'green' : 'grey'] +
					'\t' + data.x + ':' + data.y;
					break;
				case 'CLICK':
					text = text +
					'\tctrl' [data.ctrlKey  ? 'green' : 'grey'] +
					' alt'  [data.altKey   ? 'green' : 'grey'] +
					' shift'[data.shiftKey ? 'green' : 'grey'] +
					'\t' + data.x + ':' + data.y;
					break;
				case 'ERROR':
					text = text +
						'\t' + data.filename +
						' (' + data.lineno + ':' + data.colno + ')' +
						' ' + data.message;
					break;
			}
			log(text);
		} else {
			switch ( type ) {
				case 'KEYDOWN':
				case 'KEYPRESS':
					console.log('%o\t%c%s %c%s %c%s %c%s %c%s\t%s\t%c%s', data, 'color:' + color + ';font-weight:bold', type,
						'color:' + (data.ctrlKey  ? 'green' : 'lightgrey'), 'ctrl',
						'color:' + (data.altKey   ? 'green' : 'lightgrey'), 'alt',
						'color:' + (data.shiftKey ? 'green' : 'lightgrey'), 'shift',
						'color:black', data.keyCode, data.code || '', 'color:green', data.keyIdentifier
					);
					break;
				default:
					console.log('%o\t%c%s', data, 'color:' + color + ';font-weight:bold', type);
			}
		}
	},


	/**
	 * Use to do some development-specific actions which are removed in release mode.
	 *
	 * @param {function} cb callback to execute
	 *
	 * @example
	 * debug.stub(function () {
	 *     alert('This is visible only in debug mode!');
	 * });
	 * // it's also possible to use simple expression:
	 * // link the current scope var with global
	 * // useful for dev only
	 * debug.stub(window.app = this);
	 */
	stub: function ( cb ) {
		if ( typeof cb === 'function' ) {
			cb();
		}
	},


	/**
	 * Start specific timer.
	 * Use to calculate time of some actions.
	 *
	 * @param {string} [name=''] timer group name
	 * @param {string} [title=''] timer individual mark caption
	 *
	 * @example
	 * debug.time('request');
	 * // some processing...
	 * debug.time('request');
	 * // prints 'time: +20ms'
	 * // some processing...
	 * debug.time('request', 'ready');
	 * // prints 'time (ready): +40ms'
	 * // some processing...
	 * debug.time('request', 'done');
	 * // prints 'time (done): +60ms'
	 */
	time: function ( name, title ) {
		var time = +new Date();

		// sanitize
		name  = name  || '';
		title = title || '';

		// is this mark exist
		if ( timeMarks[name] ) {
			// already set
			debug.log((name || 'time') + (title ? ' (' + title + ')' : '') + ': +' + (time - timeMarks[name].last) + 'ms', 'blue');
		} else {
			// create a new mark
			timeMarks[name] = {init: time};
		}

		// update with the current value
		timeMarks[name].last = time;
	},


	/**
	 * End specific timer.
	 * Use to calculate time of some actions.
	 *
	 * @param {string} [name=''] timer name
	 * @param {string} [title='total'] timer mark caption
	 *
	 * @example
	 * debug.time();
	 * // some processing...
	 * debug.timeEnd();
	 * // prints 'time (total): 934ms'
	 *
	 * @example
	 * debug.time('request');
	 * // some processing...
	 * debug.timeEnd('request', 'done');
	 * // prints 'request (done): 934ms'
	 */
	timeEnd: function ( name, title ) {
		var time = +new Date();

		// sanitize
		name  = name  || '';
		title = title || 'total';

		// is this mark exist
		if ( timeMarks[name] ) {
			debug.log((name || 'time') + ' (' + title + '): ' + (time - timeMarks[name].init) + 'ms', 'blue');

			delete timeMarks[name];
		} else {
			throw new Error(__filename + ': no started timer for "' + name + '"');
		}
	}

};
