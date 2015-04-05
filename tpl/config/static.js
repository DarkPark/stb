/**
 * HTTP static server configuration.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

// public
module.exports = {
	// turn on/off server
	active: true,

	// listening HTTP port to serve project files
	port: 8000,

	// static file server cache activation
	// false to disable of amount of seconds to cache
	cache: false,

	// full logging
	logging: true,

	// enable automatic reload on file changes mode
	livereload: true
};
