/**
 * Tasks to remove and copy all images.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
	gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	del     = require('del');


// remove all images
gulp.task('img:clean', function ( done ) {
	del([path.join(global.paths.build, 'img', '**', '*')], done);
});


// remove and copy
gulp.task('img', ['img:clean'], function () {
	return gulp
		.src([path.join(global.paths.app, 'img', '**', '*')])
		.pipe(plumber())
		.pipe(gulp.dest(path.join(global.paths.build, 'img')));
});
