/**
 * WEb INspector REmote debugger server configuration.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

// public export
module.exports = {
	// turn on/off server
	active: true,

	// listening HTTP port to provide client interface
	port: 8080,

	// address to listen
	host: '-all-',

	// full logging
	logging: false,

	// debug servers session id
	name: 'anonymous'
};
