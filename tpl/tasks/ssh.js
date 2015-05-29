/**
 * Remote access to the STB device.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
	gulp    = require('gulp'),
	log     = require('gulp-util').log,
	SSH2    = require('ssh2'),
	config  = require(path.join(global.paths.config, 'ssh')),
	appPort = require(path.join(global.paths.config, 'static')).port,
	appHost = require('ip').address(),
	title   = 'remote  '.inverse.yellow,
	stderr  = false;


if ( config.active ) {
	// make sure the default profile is set
	config.defaults = config.defaults || {};

	// profiles seems ok
	if ( config.profiles && typeof config.profiles === 'object' ) {
		// rework profiles to extend defaults with each profile values
		Object.keys(config.profiles).forEach(function ( profileName ) {
			// reworked profile placeholder
			var profile = Object.create(config.defaults);

			// overwrite the necessary properties
			Object.keys(config.profiles[profileName]).forEach(function ( key ) {
				if ( key in config.profiles[profileName] ) {
					profile[key] = config.profiles[profileName][key];
				}
			});

			// create associated task
			gulp.task('ssh:' + profileName, function ( done ) {
				// get connection instance
				var ssh = new SSH2();

				// prepare and execute
				ssh.on('ready', function () {
					log(title, 'Connection is ready'.bold);

					// substitute template vars
					profile.exec = profile.exec.replace(/%host%/g, appHost);
					profile.exec = profile.exec.replace(/%port%/g, appPort);

					// run
					ssh.exec(profile.exec, function ( err, stream ) {
						if ( err ) {
							throw err;
						}

						stream.on('exit', function ( code, signal ) {
							log('remote  '.bgRed, 'Stream: exit ' + ('(code: ' + code + ', signal: ' + signal + ')').grey);
						});
						stream.on('close', function () {
							log('remote  '.bgRed, 'Stream: close');
							ssh.end();
							done();
						});
						stream.on('data', function ( data ) {
							data.toString().split('\n').forEach(function ( line ) {
								if ( line ) {
									line = line.replace('DEBUG:: ', '');
									log(title, line);
								}
							});
						});

						if ( stderr ) {
							stream.stderr.on('data', function ( data ) {
								data.toString().split('\n').forEach(function ( line ) {
									if ( line ) {
										log(title, line);
									}
								});
							});
						}
					});
				}).connect(profile);
			});
		});
	}
}
