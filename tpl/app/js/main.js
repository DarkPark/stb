/**
 * Main application entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var app    = require('stb/app'),
	router = require('stb/router');


app.addListeners({
	// event
	load: function load () {
		// set pages
		router.init([
			require('./pages/init')
		]);
	}
});

app.addListeners({
	// all resources are loaded
	load: function load () {
		// set pages
		router.init([
			require('./pages/init')
		]);
	},

	// everything is ready
	done: function done () {
		// go to the main page when necessary
		/* router.navigate('pageMain'); */
	}
});


// new way of string handling
// all strings are in UTF-16
//gSTB.SetNativeStringMode(true);
