/**
 * Proxy js code execution from a desktop browser to STB.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
	gulp   = require('gulp'),
	gutil  = require('gulp-util'),
	config = require(path.join(__dirname, '..', 'lib', 'config'))('proxy'),
	title  = 'proxy   '.inverse;


gulp.task('proxy', function () {
	if ( config.active ) {
		require('code-proxy')(config);
		gutil.log(title, 'listening ...');
	}
});
