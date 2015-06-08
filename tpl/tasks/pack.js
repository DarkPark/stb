/**
 * Pack a specific build into zip archive.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
	util    = require('util'),
	gulp    = require('gulp'),
	log     = require('gulp-util').log,
	plumber = require('gulp-plumber'),
	zip     = require('gulp-zip'),
	del     = require('del'),
	pkgInfo = require(path.join(global.paths.root, 'package.json')),
	zipName = 'build.%s.%s.%s.zip',
	title   = 'pack    '.inverse;


// remove all pack zip files
gulp.task('pack:clean', function ( done ) {
	del([path.join(global.paths.root, util.format(zipName, '*', '*', '*'))], done);
});


// create archive
gulp.task('pack:develop', function () {
	var outName = util.format(zipName, pkgInfo.name, pkgInfo.version, 'develop');

	log(title, 'create archive: ' +  outName.bold);

	return gulp.src([
			path.join(global.paths.build, 'font', '**', '*'),
			path.join(global.paths.build, 'img', '**', '*'),
			path.join(global.paths.build, 'css', 'develop.*'),
			path.join(global.paths.build, 'js',  'develop.*'),
			path.join(global.paths.build, 'develop.html')
		], {base: global.paths.build})
		.pipe(plumber())
		.pipe(zip(outName))
		.pipe(gulp.dest(global.paths.root));
});


// create archive
gulp.task('pack:release', function () {
	var outName = util.format(zipName, pkgInfo.name, pkgInfo.version, 'release');

	log(title, 'create archive: ' +  outName.bold);

	return gulp.src([
			path.join(global.paths.build, 'font', '**', '*'),
			path.join(global.paths.build, 'img', '**', '*'),
			path.join(global.paths.build, 'css', 'release.*'),
			path.join(global.paths.build, 'js',  'release.*'),
			path.join(global.paths.build, 'index.html')
		], {base: global.paths.build})
		.pipe(plumber())
		.pipe(zip(outName))
		.pipe(gulp.dest(global.paths.root));
});


// create all archives
gulp.task('pack', ['pack:develop', 'pack:release']);
