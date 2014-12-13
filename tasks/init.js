/**
 * Initial creation of all necessary files and folders.
 * Has smart conflict resolution mechanism.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp');


gulp.task('init', function () {
	// copy template files to the current dir
	gulp.src(__dirname + '/../tpl/**')
		.pipe(require('gulp-conflict')('./'))
		.pipe(gulp.dest('./'));

	// copy template files to the current dir
	gulp.src(__dirname + '/../config/**', {base: __dirname + '/../'})
		.pipe(require('gulp-conflict')('./'))
		.pipe(gulp.dest('./'));
});
