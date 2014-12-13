/**
 * Gulp main entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	eslint  = require('gulp-eslint');


gulp.task('lint', function () {
	return gulp
		.src([
			'./bin/**/*.js',
			'./config/**/*.js',
			'./lib/**/*.js',
			'./tasks/**/*.js',
			'./tpl/**/*.js'
		])
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format());
});
