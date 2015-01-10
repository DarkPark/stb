/**
 * Setup gulp tasks.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs         = require('fs'),
	path       = require('path'),
	gulp       = require('gulp'),
	log        = require('../log'),
	prettyTime = require('pretty-hrtime');


/**
 * Load all js modules from the given directory.
 *
 * @param {string} dir folder with modules
 */
function load ( dir ) {
	// may be missing
	if ( fs.existsSync(dir) ) {
		// get file list and walk through it
		require('fs').readdirSync(dir).forEach(function ( name ) {
			// make correct absolute path
			name = path.join(dir, name);
			// check file type
			if ( path.extname(name) === '.js' ) {
				require(name);
			}
		});
	}
}


// logging for gulp
gulp.on('err', function () {
	log('Error');
});


gulp.on('task_start', function ( info ) {
	log('Starting'.green.inverse, info.task.cyan, ' ...');
});


gulp.on('task_stop', function ( info ) {
	log(
		'Finished'.green.inverse, info.task.cyan,
		'after', prettyTime(info.hrDuration).magenta
	);
});


gulp.on('task_err', function ( error ) {
	log(
		error.task.cyan,
		'errored after'.red,
		prettyTime(error.hrDuration).magenta
	);
	console.log(error);
});


gulp.on('task_not_found', function ( error ) {
	console.log(error);
	throw 'task was not found';
});


// try to load base gulp tasks
load(path.join(process.env.STB, 'tasks'));
