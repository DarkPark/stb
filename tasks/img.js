/**
 * All the tasks to remove and copy all images.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	del     = require('del');


gulp.task('img:clean:develop', function ( done ) {
	del(['./build/develop/' + process.env.target + '/img/**'], done);
});


gulp.task('img:clean:release', function ( done ) {
	del(['./build/release/' + process.env.target + '/img/**'], done);
});


gulp.task('img:clean', ['img:clean:develop', 'img:clean:release']);


gulp.task('img:develop', ['img:clean:develop'], function () {
	return gulp
		.src(['./app/img/**', '!./app/img/**/readme.md'], {base: './app/'})
		.pipe(plumber())
		.pipe(gulp.dest('./build/develop/' + process.env.target));
});


gulp.task('img:release', ['img:clean:release'], function () {
	return gulp
		.src(['./app/img/**', '!./app/img/**/readme.md'], {base: './app/'})
		.pipe(plumber())
		.pipe(gulp.dest('./build/release/' + process.env.target));
});


gulp.task('img', ['img:develop', 'img:release']);
