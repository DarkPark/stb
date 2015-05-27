/**
 * Monitor files and rebuild.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path = require('path'),
	gulp = require('gulp');


// rebuild everything on file changes
gulp.task('watch', function () {
	// detect any js file change
	gulp.watch([
		path.join(global.paths.config, '**', '*.js'),
		path.join(global.paths.tasks, '**', '*.js')
	]).on('change', function (file) {
		// clear cache
		delete require.cache[file.path];
	});

	// img
	gulp.watch([
		path.join(global.paths.app, 'img', '**', '*')
	], ['img:develop']);

	// webpack
	gulp.watch([
		path.join(global.paths.app, 'js', '**', '*.js'),
		path.join(global.paths.config, 'app.js')
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
