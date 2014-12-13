/**
 * WEb INspector REmote debugger server.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp   = require('gulp'),
	gutil  = require('gulp-util'),
	config = require(__dirname + '/../lib/config')('weinre'),
	title  = 'weinre: ';


gulp.task('weinre', function () {
	var spawn, weinre;

	if ( config.active ) {
		spawn  = require('child_process').spawn;
		weinre = spawn('weinre', [
			'--httpPort',  config.port,
			'--boundHost', config.host,
			'--verbose',   config.logging.toString(),
			'--debug',     config.logging.toString()
		]);

		weinre.on('exit', function () {
			gutil.log(title, gutil.colors.red('process terminated'));
		});

		weinre.on('error', function () {
			gutil.log(title, gutil.colors.red('FATAL ERROR'), '(check weinre is globally installed)');
		});

		weinre.stderr.on('data', function ( data ) {
			gutil.log(title, gutil.colors.red(data.toString().trim()));
		});

		weinre.stdout.on('data', function ( data ) {
			data.toString().trim().split('\n').forEach(function ( line ) {
				gutil.log(title, line.trim().split(' weinre: ').pop());
			});
		});
	}
});
