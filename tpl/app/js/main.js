/**
 * Main application entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var app    = require('./stb/app'),
	router = require('./stb/router');


app.addListeners({
	// all resources are loaded
	load: function load () {
		// set pages
		router.init([
			require('./pages/init'),
			require('./pages/main')
		]);
	},

	// everything is ready
	done: function done () {
		// go to the main page when necessary
		router.navigate('pageMain');
	}
});
