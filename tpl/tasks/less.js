/**
 * Compile all Less files into a set of css files with maps.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path       = require('path'),
	gulp       = require('gulp'),
	less       = require('gulp-less'),
	plumber    = require('gulp-plumber'),
	rename     = require('gulp-rename'),
	del        = require('del'),
	sourceMaps = require('gulp-sourcemaps'),
	minifyCSS  = require('gulp-minify-css');


/**
 * Get all vars and merge them in a single list to import in less.
 *
 * @param {number} resolution window height
 *
 * @return {Object} var list
 */
function prepare ( resolution ) {
	var mName   = path.join(global.paths.config, 'metrics.js'),
		vName   = path.join(global.paths.app, 'less', 'vars', resolution + '.js'),
		metrics = require(mName)[resolution],
		stbVars = require(vName),
		data    = {};

	// clear cache
	delete require.cache[mName];
	delete require.cache[vName];

	// clone metrics
	Object.keys(metrics).forEach(function ( name ) {
		data[name] = metrics[name];
	});

	// safe zone dimension
	// base dimension minus safe zone margins
	data.availHeight = data.height - data.availTop  - data.availBottom;
	data.availWidth  = data.width  - data.availLeft - data.availRight;

	// extend with stb vars
	Object.keys(stbVars).forEach(function ( name ) {
		data[name] = stbVars[name];
	});

	// application paths
	data.pathApp     = '"' + global.paths.app + '"';
	data.pathImg     = '"../img/' + resolution + '"';
	data.pathImgFull = '"' + path.join(global.paths.app, 'img', resolution.toString()) + '"';

	return data;
}


/**
 * Generate develop css files for the given graphical mode.
 *
 * @param {number} resolution window height
 *
 * @return {Object} result stream
 */
function develop ( resolution ) {
	var vars = prepare(resolution);

	// additional vars
	vars.mode = 'develop';

	return gulp.src(path.join(global.paths.app, 'less', resolution + '.less'))
		.pipe(plumber())
		.pipe(sourceMaps.init())
		.pipe(less({
			ieCompat: false,
			globalVars: vars
			//paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(rename('develop.' + resolution + '.css'))
		.pipe(sourceMaps.write('./'))
		.pipe(gulp.dest(path.join(global.paths.build, 'css')));
}


/**
 * Generate release css files for the given graphical mode.
 *
 * @param {number} resolution window height
 *
 * @return {Object} result stream
 */
function release ( resolution ) {
	var vars = prepare(resolution);

	// additional vars
	vars.mode = 'release';

	return gulp.src(path.join(global.paths.app, 'less', resolution + '.less'))
		.pipe(plumber())
		.pipe(less({
			ieCompat: false,
			globalVars: vars
			//paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(rename('release.' + resolution + '.css'))
		.pipe(minifyCSS({rebase: false}))
		.pipe(gulp.dest(path.join(global.paths.build, 'css')));
}


// remove all css files
gulp.task('less:clean', function ( done ) {
	del([path.join(global.paths.build, 'css', '**')], done);
});


// generate develop css files
gulp.task('less:develop:480',  function () { return develop( 480); });
gulp.task('less:develop:576',  function () { return develop( 576); });
gulp.task('less:develop:720',  function () { return develop( 720); });
gulp.task('less:develop:1080', function () { return develop(1080); });


// generate release css files
gulp.task('less:release:480',  function () { return release( 480); });
gulp.task('less:release:576',  function () { return release( 576); });
gulp.task('less:release:720',  function () { return release( 720); });
gulp.task('less:release:1080', function () { return release(1080); });


// generate all css files
gulp.task('less:develop', ['less:develop:480', 'less:develop:576', 'less:develop:720', 'less:develop:1080']);
gulp.task('less:release', ['less:release:480', 'less:release:576', 'less:release:720', 'less:release:1080']);


// generate all css files
gulp.task('less', ['less:develop', 'less:release']);
