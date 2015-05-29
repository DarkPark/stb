/**
 * Proxy js code execution from a desktop browser to STB.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
	gulp   = require('gulp'),
	log    = require('gulp-util').log,
	config = require(path.join(global.paths.config, 'proxy')),
	title  = 'proxy   '.inverse;


// start call redirection
gulp.task('proxy', function ( done ) {
	if ( config.active ) {
		// start
		require('code-proxy')(config);
	} else {
		// just exit
		log(title, 'task is disabled'.grey);

		done();
	}
});
