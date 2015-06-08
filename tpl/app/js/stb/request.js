/**
 * Ajax request wrapper.
 *
 * @module stb/request
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var request = {},
	defaults = {
		method    : 'GET',  // HTTP method to use, such as "GET", "POST", "PUT", "DELETE", etc.
		async     : true,   // whether or not to perform the operation asynchronously
		headers   : {},     // list of HTTP request headers
		type      : 'text', // "", "arraybuffer", "blob", "document", "json", "text"
		data      : null,   // data to send (plain object)
		timeout   : 30000,  // amount of milliseconds a request can take before being terminated
		onload    : null,   // callback when the request has successfully completed
		onerror   : null,   // callback when the request has failed
		ontimeout : null    // callback when the author specified timeout has passed before the request could complete
	},
	defaultsKeys = Object.keys(defaults);


/**
 * Main method to send ajax requests.
 *
 * @param {string} url address
 * @param {Object} options Plain object with call parameters
 * @return {XMLHttpRequest|Boolean} false in case of wrong params
 *
 * @example
 * TODO: add
 */
request.ajax = function ( url, options ) {
	var i, headersKeys, client;

	// init
	options = options || {};
	// valid non-empty string
	if ( url && (typeof url === 'string' || url instanceof String) && url.length > 0 ) {
		// plain object is given as param
		if ( options && typeof options === 'object') {
			// extend with default options
			for ( i = 0; i < defaultsKeys.length; i++ ) {
				// in case not redefined
				if ( options[defaultsKeys[i]] === undefined ) {
					options[defaultsKeys[i]] = defaults[defaultsKeys[i]];
				}
			}
		}

		client = new XMLHttpRequest();
		// init a request
		client.open(options.method, url, options.async);

		// apply the given headers
		if ( options.headers && typeof options.headers === 'object') {
			headersKeys = Object.keys(options.headers);
			for ( i = 0; i < headersKeys.length; i++ ) {
				client.setRequestHeader(headersKeys[i], options.headers[headersKeys[i]]);
			}
		}

		// set response type and timeout
		client.responseType = options.type;
		client.timeout      = options.timeout;

		// callbacks
		if ( options.onload && typeof options.onload === 'function' ) {
			client.onload = function onload () {
				options.onload.call(this, this.response || this.responseText, this.status);
			};
		}
		client.onerror   = options.onerror;
		client.ontimeout = options.ontimeout;

		// actual request
		//client.send(this.encode(options.data));
		client.send(options.data ? JSON.stringify(options.data) : null);

		return client;
	}
	return false;
};


/**
 * Serializes the given data for sending to the server via ajax call.
 *
 * @param {Object} data Plain object to serialize
 * @return {string} null if no data to encode
 *
 * @example
 * TODO: add
 */
request.encode = function ( data ) {
	var result = [],
		i, keys;

	// input plain object validation
	if ( data && typeof data === 'object') {
		keys = Object.keys(data);
		// apply encoding
		for ( i = 0; i < keys.length; i++ ) {
			result.push(encodeURIComponent(keys[i]) + '=' + encodeURIComponent(data[keys[i]]));
		}
		// build the list of params
		if ( result.length > 0 ) {
			return result.join('&');
		}
	}
	return null;
};


// public
module.exports = request;
