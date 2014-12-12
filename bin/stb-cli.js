#!/usr/bin/env node

/**
 * Files and directories structure initialization.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */

'use strict';

var gulp = require('gulp');


console.log('init');


// build everything and open main entry page
gulp.task('default', function () {
	console.log('default task');
});


gulp.start('default');
