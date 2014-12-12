#!/usr/bin/env node

/**
 * Files and directories structure initialization.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */

'use strict';

var path      = require('path'),
	gulp      = require('gulp'),
	gutil     = require('gulp-util'),
	cliParams = require('minimist')(process.argv.slice(2)),
	task;


// set env vars for current working dir
// and the dir with stb-cli package
process.env.CWD = process.cwd();
process.env.STB = path.normalize(__dirname + '/..');

// iterates over the specified directory requiring each file
require('fs').readdirSync(path.join(process.env.STB, 'tasks')).forEach(function ( name ) {
	require(path.join(process.env.STB, 'tasks', name));
});

// task specified by user to execute
task = gulp.tasks[cliParams['_'][0]];

// no command-line parameters
if ( !task ) {
	console.log('Available sub-commands:');
	// dump available tasks
	Object.keys(gulp.tasks).forEach(function ( name ) {
		console.log('  * ' + gutil.colors.green(gulp.tasks[name].name));
	});

	return;
}

// exec selected task
gulp.start(task.name);
