/**
 * Monitor files and rebuild.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint no-unused-vars: 0 */

var path = require('path'),
	gulp = require('gulp');


// rebuild everything on file changes
gulp.task('watch', function ( done ) {
	// img
	gulp.watch([
		path.join(global.paths.app, 'img', '**', '*')
	], ['img:develop']);

	// webpack
	gulp.watch([
		path.join(global.paths.app, 'js', '**', '*.js'),
		path.join(global.paths.config, 'app.js'),
		path.join(global.paths.config, 'metrics.js')
	], ['webpack:develop']);

	// jade
	gulp.watch([
		path.join(global.paths.app, 'jade', '**', '*.jade')
	], ['jade:develop']);

	// less
	gulp.watch([
		path.join(global.paths.app, 'less', '**', '*.{less,js}'),
		path.join(global.paths.config, 'metrics.js')
	], ['less:develop']);
});
