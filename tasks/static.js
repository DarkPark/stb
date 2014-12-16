/**
 * Serve files in the build directory.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
	gulp   = require('gulp'),
	gutil  = require('gulp-util'),
	glr    = require('gulp-livereload'),
	config = require(path.join(__dirname, '..', 'lib', 'config'))('static'),
	title  = 'static  '.inverse;


gulp.task('static', function () {
	var files, msInit;

	if ( config.active ) {
		// rfc 2616 compliant HTTP static file server
		files  = new (require('node-static').Server)('./build', {cache: false});
		msInit = +new Date();

		require('http').createServer(function createServer ( request, response ) {
			request.addListener('end', function eventListenerEnd () {
				// static files
				files.serve(request, response, function serve ( e ) {
					var msCurr  = +new Date(),
						address = request.connection.remoteAddress,
						msDiff;

					if ( e ) {
						response.end();
					}

					if ( config.logging ) {
						msDiff = (msCurr - msInit).toString();
						msDiff = msDiff.slice(0, -3) + '\t' + msDiff.substr(-3).toString().grey;

						gutil.log(title, [
							msDiff,
							address ? (address === '127.0.0.1' ? address : address.cyan) : '[0.0.0.0]'.red,
							e ? e.status.red : (response.statusCode === 200 ? response.statusCode.toString().green : response.statusCode.toString().yellow),
							request.method.grey,
							request.url.replace(/\//g, '/'.grey)
						].join('\t'));
					}
				});
			}).resume();
		}).listen(config.port).on('listening', function eventListenerListening () {
			var ip   = require('ip').address(),
				msg  = 'Serve directory ' + path.join(process.env.CWD, 'build') + ' at ' + 'http://' + ip + ':' + config.port + '/',
				hash = new Array(msg.length + 1).join('#');

			gutil.log(title, hash);
			gutil.log(title, msg.green);
			gutil.log(title, hash);
		});

		if ( config.livereload ) {
			glr.listen({silent: true});

			// reload
			gulp.watch(['./build/**/*.{html,js,css}']).on('change', function ( file ) {
				// report
				gutil.log('watch   '.bgMagenta.white, 'reload ' + ('./' + path.relative(process.env.CWD, file.path)).bold);
				// reload
				glr.changed(file);
			});
		}
	}
});
