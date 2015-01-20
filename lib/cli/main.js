/**
 * Main command-line entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path = require('path');


// set env vars for current working dir
// and the dir with this stb package
process.env.CWD = process.cwd();
process.env.STB = path.join(__dirname, '..', '..');


// enable colors in console
require('tty-colors');

// setup gulp tasks
require('./gulp');

// parse arguments and run
require('./program');


/*var runtime = new require('runtime').create('gulp', {
	input: process.stdin,
	output: process.stdout
});

runtime.setPrompt('');

runtime.set(function rootHandle ( argv ) {
	if ( argv[0] ) {
		console.log(' (press tab to see completion)');
		console.log(' type `createServer` <port> to create a server');
		console.log(' Note: default port is', this.config('port'));
	}
	this.prompt();
});*/
