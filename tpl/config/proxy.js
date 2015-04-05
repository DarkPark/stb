/**
 * Code-proxy server configuration.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

// public
module.exports = {
	// turn on/off server
	active: true,

	// listening HTTP port to serve proxy files
	portHttp: 8800,

	// listening WebSocket port to serve requests
	portWs: 8900,

	// time between connection/sending attempts (in ms)
	retryDelay: 100,

	// amount of connection/sending attempts before give up
	retryLimit: 30,

	// full logging
	logging: false,

	// session name
	name: 'anonymous',

	// use localStorage to get/save requests data
	cache: true
};
