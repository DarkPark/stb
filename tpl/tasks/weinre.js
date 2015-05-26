/**
 * WEb INspector REmote debugger server.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
	gulp   = require('gulp'),
	log    = require('gulp-util').log,
	config = require(path.join(global.paths.config, 'weinre')),
	title  = 'weinre  '.inverse;


// start or restart service
gulp.task('weinre', function () {
	var spawn, weinre;

	if ( config.active ) {
		spawn = require('child_process').spawn;
		//TODO: make it work on Windows
		weinre = spawn(path.join(global.paths.root, 'node_modules', '.bin', 'weinre'), [
			'--httpPort',  config.port,
			'--boundHost', config.host,
			'--verbose',   config.logging.toString(),
			'--debug',     config.logging.toString()
		]);

		weinre.on('exit', function () {
			log(title, 'process terminated'.red);
		});

		weinre.on('error', function () {
			log(title, 'FATAL ERROR'.red, '(check weinre is installed)');
		});

		weinre.stderr.on('data', function ( data ) {
			log(title, data.toString().trim().red);
		});

		weinre.stdout.on('data', function ( data ) {
			data.toString().trim().split('\n').forEach(function ( line ) {
				log(title, line.trim().split(' weinre: ').pop());
			});
		});

		process.on('SIGINT', function () {
			weinre.kill();
			console.log(' weinre exit');

			// graceful shutdown
			process.exit();
		});
	} else {
		// just exit
		log(title, 'task is disabled');
	}
});
