/**
 * Main application entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */

'use strict';

require('stb/shims');

var router = require('stb/router'),
	keys   = require('stb/keys'),
	app    = require('stb/app');


// apply screen size, position and margins
//app.setScreen(require('../../config/metrics')[screen.height]);


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
