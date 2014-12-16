#!/usr/bin/env node

/**
 * Files and directories structure initialization.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs         = require('fs'),
	path       = require('path'),
	gulp       = require('gulp'),
	gutil      = require('gulp-util'),
	chalk      = require('chalk'),
	prettyTime = require('pretty-hrtime'),
	cliParams  = require('minimist')(process.argv.slice(2)),
	task;


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

// set env vars for current working dir
// and the dir with this stb package
process.env.CWD = process.cwd();
process.env.STB = path.join(__dirname, '..');


// logging for gulp
gulp.on('err', function () {
	gutil.log('Error');
});

gulp.on('task_start', function ( error ) {
	gutil.log('Starting', chalk.cyan(error.task) + '...');
});

gulp.on('task_stop', function (e) {
	gutil.log(
		'Finished', chalk.cyan(e.task),
		'after', chalk.magenta(prettyTime(e.hrDuration))
	);
});

gulp.on('task_err', function ( error ) {
	gutil.log(
		chalk.cyan(error.task),
		chalk.red('errored after'),
		chalk.magenta(prettyTime(error.hrDuration))
	);
	console.log(error);
});

gulp.on('task_not_found', function ( error ) {
	console.log(error);
	throw 'task was not found';
});


// try to load base gulp tasks
load(path.join(process.env.STB, 'tasks'));

// task specified by user to execute
task = gulp.tasks[cliParams['_'][0]];

// no command-line parameters
if ( !task ) {
	console.log('Available sub-commands:');
	// dump available tasks
	Object.keys(gulp.tasks).forEach(function ( name ) {
		console.log('  * ' + gutil.colors.green(gulp.tasks[name].name));
	});
} else {
	// exec selected task
	gulp.start(task.name);
}
