#!/usr/bin/env node

/**
 * Files and directories structure initialization.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */

'use strict';

var gulp      = require('gulp'),
	gutil     = require('gulp-util'),
	cliParams = require('minimist')(process.argv.slice(2)),
	task;


//console.log(cliParams);

gulp.task('init', function () {
	console.log('init task');
});

// build everything and open main entry page
gulp.task('default', function () {
	console.log('default task');
});

// task specified by user to execute
task = gulp.tasks[cliParams['_'][0]];

// no command-line parameters
if ( !task ) {
	console.log('Available sub-commands:');
	// dump available tasks
	Object.keys(gulp.tasks).forEach(function ( name ) {
		console.log('\t* ' + gutil.colors.green(gulp.tasks[name].name));
	});

	return;
}

// exec selected task
gulp.start(task.name);
