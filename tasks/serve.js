/**
 * Main entry point.
 * Rebuild everything, start all watchers and servers.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var //path    = require('path'),
	gulp    = require('gulp'),
	gutil   = require('gulp-util'),
	//config = require(path.join(__dirname, '..', 'lib', 'config'))('static'),
	cliParams = require('minimist')(process.argv.slice(2));
	//plumber = require('gulp-plumber'),
	//del     = require('del')


gulp.task('develop', [
	'lint', 'img:develop', 'jade:develop', 'less:develop', 'webpack:develop', 'static', 'weinre', 'proxy', 'logger'
], function () {
	// build
	gulp.watch(['./app/jade/**/*.jade'], ['jade:develop']);
	gulp.watch(['./app/less/**/*.less', './app/less/vars/*.js', './config/metrics.js'], ['less:develop']);
});


gulp.task('release', ['lint', 'img:release', 'jade:release', 'less:release', 'webpack:release']);


// build everything and open main entry page
gulp.task('serve', ['develop', 'release'], function () {
	// manage gulp from command line
	//var runtime = require('gulp-runtime');
	//runtime.setPrompt('');
    //
	//// runtime reload of changed tasks
	//gulp.watch([__filename, './tasks/**/*.js'], function ( file ) {
	//	// clear cache
	//	runtime.require(file.path, {reload: true});
	//	gutil.log('runtime:', gutil.colors.green('reloaded ') + file.path);
	//});

	// popup browser if not prevented
	if ( !cliParams.noopen ) {
		require('open')('http://localhost:8000/');
		// report
		gutil.log(
			'runtime:', 'Root page was opened in the default browser. Use "' +
			gutil.colors.green('gulp --noopen') + '" to prevent this.'
		);
	}
});
