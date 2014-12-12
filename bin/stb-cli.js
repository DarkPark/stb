#!/usr/bin/env node

/**
 * Files and directories structure initialization.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */

'use strict';

var gulp      = require('gulp'),
	cliParams = require('minimist')(process.argv.slice(2));


console.log(cliParams);

gulp.task('init', function () {
	console.log('init task');
});

// build everything and open main entry page
gulp.task('default', function () {
	console.log('default task');
});

console.log(gulp);

gulp.start('default');
