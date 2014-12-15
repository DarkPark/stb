#!/usr/bin/env node

/**
 * Files and directories structure initialization.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs        = require('fs'),
	path      = require('path'),
	gulp      = require('gulp'),
	gutil     = require('gulp-util'),
	chalk     = require('chalk'),
	cliParams = require('minimist')(process.argv.slice(2)),
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

	// total hack due to poor error management in orchestrator
	gulp.on('err', function () {
		failed = true;
		gutil.log('Error');
	});

	gulp.on('task_start', function (e) {
		// TODO: batch these
		// so when 5 tasks start at once it only logs one time with all 5
		gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');
	});

	gulp.on('task_stop', function (e) {
		gutil.log(
			'Finished', '\'' + chalk.cyan(e.task) + '\'',
			'after', chalk.magenta(e.hrDuration)
		);
	});

	gulp.on('task_err', function (e) {
		//var msg = formatError(e);
		gutil.log(
			'\'' + chalk.cyan(e.task) + '\'',
			chalk.red('errored after'),
			chalk.magenta(e.hrDuration)
		);
		gutil.log(e);
	});

	gulp.on('task_not_found', function (err) {
		gutil.log(
			chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
		);
		gutil.log('Please check the documentation for proper gulpfile formatting');
		process.exit(1);
	});


	// exec selected task
	gulp.start(task.name);
}


//console.log(__dirname + '/../node_modules/.bin/gulp');
//
//// run process
//var child = require('child_process').spawn(
//	__dirname + '/../node_modules/.bin/gulp',
//	['-e', __dirname + '/../gulpfile.js', cliParams['_'][0]]
//);
//
////child.on('close', done);
//child.on('error', function reportError () {
//	console.log('FATAL ERROR: gulp failed to start!');
//});
//
//child.stderr.on('data', function reportStdErr ( data ) {
//	console.log(data);
//});
//child.stdout.on('data', function reportStdOut ( data ) {
//	console.log(data);
//});
