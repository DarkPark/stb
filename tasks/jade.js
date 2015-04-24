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
	pkgName = path.join(process.env.CWD, 'package.json');


gulp.task('jade:clean:develop', function ( done ) {
	del('./build/develop/index.html', done);
});


gulp.task('jade:clean:release', function ( done ) {
	del('./build/release/index.html', done);
});


gulp.task('jade:clean', ['jade:clean:develop', 'jade:clean:release']);


gulp.task('jade:develop', function () {
	var pkgInfo = require(pkgName);

	return gulp
		.src('./app/jade/main.jade')
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
			locals: {
				develop: true,
				title  : 'develop :: ' + pkgInfo.name,
				version: pkgInfo.version
			}
		}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./build/develop/'));
});


gulp.task('jade:release', function () {
	var pkgInfo = require(pkgName);

	return gulp
		.src('./app/jade/main.jade')
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
			locals: {
				develop: false,
				title  : 'release :: ' + pkgInfo.name,
				version: pkgInfo.version
			}
		}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./build/release/'));
});


gulp.task('jade', ['jade:develop', 'jade:release']);
