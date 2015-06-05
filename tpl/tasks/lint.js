/**
 * Analyse JavaScript code for potential errors and problems.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
	gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	eslint  = require('gulp-eslint'),
	log     = require('gulp-util').log;


gulp.task('lint', function () {
	return gulp
		.src([
			path.join(global.paths.app,    'js', '**', '*.js'),
			path.join(global.paths.config, '**', '*.js'),
			path.join(global.paths.tasks,  '**', '*.js')
		])
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format('stylish', function ( result ) {
			// make nice output
			result.split('\n').forEach(function ( line ) {
				log('eslint  '.bgRed, line + ''.reset);
			});
		}));
});
