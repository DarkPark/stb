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
	ip     = require('ip').address(),
	title  = 'weinre  '.inverse;


// start or restart service
gulp.task('weinre', function ( done ) {
	var msg     = 'http://' + ip + ':' + config.port + '/client/#anonymous',
		hash    = new Array(msg.length + 1).join('-'),
		isReady = false,
		spawn, weinre;

	if ( config.active ) {
		// prepare
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

			done();
		});

		weinre.on('error', function () {
			log(title, 'FATAL ERROR'.red, '(check weinre is installed)');
		});

		weinre.stderr.on('data', function ( data ) {
			log(title, data.toString().trim().red);
		});

		weinre.stdout.on('data', function ( data ) {
			if ( !isReady ) {
				// first invoke
				isReady = true;

				log(title, hash);
				log(title, 'WEb INspector REmote is ready!'.bold);
				log(title, msg.green);
				log(title, hash);
			} else {
				data.toString().trim().split('\n').forEach(function ( line ) {
					log(title, line.trim().split(' weinre: ').pop());
				});
			}
		});

		// make sure to stop it
		process.on('exit', function () {
			weinre.kill();
		});
	} else {
		// just exit
		log(title, 'task is disabled'.grey);

		done();
	}
});
