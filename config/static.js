/**
 * HTTP static server configuration.
 *
 * @namespace
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */
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
