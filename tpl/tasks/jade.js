/**
 * Compile HTML files from Jade sources.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
	gulp    = require('gulp'),
	jade    = require('gulp-jade'),
	plumber = require('gulp-plumber'),
	rename  = require('gulp-rename'),
	del     = require('del'),
	pkgInfo = require(path.join(global.paths.root, 'package.json'));


// remove all html files
gulp.task('jade:clean', function ( done ) {
	del([
		path.join(global.paths.build, 'index.html'),
		path.join(global.paths.build, 'develop.html')
	], done);
});


// generate html files
gulp.task('jade:develop', function () {
	return gulp
		.src(path.join(global.paths.app, 'jade', 'main.jade'))
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
			locals: {
				develop: true,
				title:   '[develop] ' + pkgInfo.name,
				version: pkgInfo.version
			}
		}))
		.pipe(rename('develop.html'))
		.pipe(gulp.dest(global.paths.build));
});


// generate html files
gulp.task('jade:release', function () {
	return gulp
		.src(path.join(global.paths.app, 'jade', 'main.jade'))
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
			locals: {
				develop: false,
				title:   '[release] ' + pkgInfo.name,
				version: pkgInfo.version
			}
		}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest(global.paths.build));
});


// generate all html files
gulp.task('jade', ['jade:develop', 'jade:release']);
