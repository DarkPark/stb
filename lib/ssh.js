/**
 * Remote access to the STB device.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var util    = require('util'),
	SSH2    = require('ssh2'),
	log     = require('./log'),
	cfgSsh  = require('./config')('ssh'),
	cfgHttp = require('./config')('static'),
	command = require('./cli/program').currCommnand,
	title   = 'remote  '.inverse.yellow,
	conn, config;


if ( cfgSsh.active ) {
	// make sure the default profile is set
	cfgSsh.defaults = cfgSsh.defaults || {};

	// extend profiles
	if ( cfgSsh.profiles && typeof cfgSsh.profiles === 'object' ) {
		Object.keys(cfgSsh.profiles).forEach(function ( profileName ) {
			var data = Object.create(cfgSsh.defaults);

			// overwrite the necessary properties
			Object.keys(cfgSsh.profiles[profileName]).forEach(function ( key ) {
				if ( key in cfgSsh.profiles[profileName] ) {
					data[key] = cfgSsh.profiles[profileName][key];
				}
			});

			cfgSsh.profiles[profileName] = data;
		});
	}

	// profile is given and valid
	if ( command.ssh && (config = cfgSsh.profiles[command.ssh]) ) {
		// init
		conn = new SSH2();

		conn.on('ready', function () {
			log(title, 'Connection is ready');

			conn.exec(util.format(config.exec, require('ip').address(), cfgHttp.port, config.url), function ( err, stream ) {
				if ( err ) {
					throw err;
				}

				stream.on('exit', function ( code, signal ) {
					log('remote  '.bgRed, 'Stream: exit ' + ('(code: ' + code + ', signal: ' + signal + ')').grey);
				});
				stream.on('close', function () {
					log('remote  '.bgRed, 'Stream: close');
					conn.end();
				});
				stream.on('data', function ( data ) {
					data.toString().split('\n').forEach(function ( line ) {
						if ( line ) {
							line = line.replace('DEBUG:: ', '');
							log(title, line);
						}
					});
				});
				stream.stderr.on('data', function ( data ) {
					data.toString().split('\n').forEach(function ( line ) {
						/*if ( line ) {
							log(title, line);
						}*/
					});
				});
			});
		}).connect({
			host: config.host,
			port: config.port,
			username: config.user,
			password: config.pass
			//privateKey: require('fs').readFileSync(config.key || require('path').join(process.env.HOME || process.env.USERPROFILE, '.ssh', 'id_rsa'))
		});
	}
}
