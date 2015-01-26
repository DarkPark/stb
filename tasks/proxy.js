/**
 * Proxy js code execution from a desktop browser to STB.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
	gulp   = require('gulp'),
	log    = require('../lib/log'),
	config = require(path.join(process.env.CWD, 'config', 'proxy')),
	title  = 'proxy   '.inverse;


gulp.task('proxy', function () {
	if ( config.active ) {
		require('code-proxy')(config);
		log(title, 'listening ...');
	}
});
