/**
 * Main application entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';


var router = require('stb/router'),
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
