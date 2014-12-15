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


// new way of string handling
// all strings are in UTF-16
//gSTB.SetNativeStringMode(true);
