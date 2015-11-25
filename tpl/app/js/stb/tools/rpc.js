/**
 * @author Aleynikov Boris <alynikov.boris@gmail.com>
 */

'use strict';

var Emitter   = require('../emitter'),
	msgId     = 1,
	callbacks = {},
	connection;

/**
 * Base ws rpc json connection implementation
 * JSON-RPC version 2.0 compatible
 *
 * @constructor
 *
 * @param {string} url server url
 */
function RPC ( url ) {
	var self = this;

	// parent constructor call
	Emitter.call(this);

	connection = new WebSocket(url);

	if ( DEBUG ) { this.connection = connection; } // allow direct access if dev mode

	connection.onopen = function ( event ) {
		if ( typeof self.onOpen === 'function' ) { self.onOpen(event); }
	};
	connection.onclose = function ( event ) {
		if ( typeof self.onClose === 'function' ) { self.onClose(event); }
	};
	connection.onerror = function ( event ) {
		if ( typeof self.onError === 'function' ) { self.onError(event); }
	};
	connection.onmessage = function ( event ) {
		var message = event.data,
			event;

		//debug.log('server said:' + message);
		try {
			message = JSON.parse(message);
			if ( message.id && !message.method ) { // answer mode: answer from server for your request
				if ( message.id in callbacks ) {
					callbacks[message.id](message.error, message.result);
					delete callbacks[message.id];
				} else {
					debug.log('no callback registered for this id');
				}
			} else if ( !message.id && message.method ) { // notification mode: some notification from server
				self.emit(message.method, message.params);
			} else if ( message.id && message.method ) {  // execution mode: run this method and report to server
				event = {
					done: function ( error, result ) {
						connection.send(JSON.stringify({error: error, result: result, id: message.id}));
						//debug.log('we said:' + JSON.stringify({error: error, result: result, id: message.id}));
					}
				};
				if ( message.params ) { event.params = message.params; }
				self.emit(message.method, event);
			}
		} catch ( e ) {
			debug.log('error websocket response');
		}
	};
}

// inheritance
RPC.prototype = Object.create(Emitter.prototype);
RPC.prototype.constructor = RPC;


/**
 * Use it to send data to server
 *
 * @param {string} method resource
 * @param {*} [params] data to send
 * @param {Function} [callback] callback for response
 */
RPC.prototype.send = function ( method, params, callback ) {
	var reqBody = {jsonrpc: '2.0', method: method};

	if ( params ) { reqBody.params = params; }
	// if callback not set use notification mode
	if ( callback && typeof callback === 'function' ) {
		reqBody.id = ++msgId;
		callbacks[msgId] = callback;
	}
	connection.send(JSON.stringify(reqBody));
	//debug.log('we said:' + JSON.stringify(reqBody));
};

/**
 * use it to close connection
 */
RPC.prototype.close = function () {
	connection.close();
};

RPC.prototype.onOpen = null;

RPC.prototype.onClose = null;

RPC.prototype.onError = null;


module.exports = RPC;
