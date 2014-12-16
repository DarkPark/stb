/**
 * WebSocket server to translate log messages from STB to a desktop console.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
	gulp   = require('gulp'),
	gutil  = require('gulp-util'),
	ws     = require('ws'),
	config = require(path.join(__dirname, '..', 'lib', 'config'))('logger'),
	title  = 'logger: '.yellow;


gulp.task('logger', function () {
	var wss;

	if ( config.active ) {
		// WebSocket server creation
		wss = new ws.Server({port: config.port});
		// incoming
		wss.on('connection', function ( socket ) {
			gutil.log(title, 'connected');

			socket.on('message', function ( data ) {
				var messages = JSON.parse(data);
				if ( Array.isArray(messages) ) {
					messages.forEach(function ( message ) {
						gutil.log(title, message);
					});
				}
			});
		});
		// report
		wss.on('listening', function () {
			gutil.log(title, 'listening ...');
		});
	}
});
