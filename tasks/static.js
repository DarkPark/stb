/**
 * Serve files in the build directory.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */

'use strict';

var path   = require('path'),
	gulp   = require('gulp'),
	gutil  = require('gulp-util'),
	config = require(__dirname + '/../lib/config')('static'),
	title  = 'static: ';


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
					var msCurr = +new Date(),
						addr   = request.connection.remoteAddress,
						msDiff;

					if ( e ) {
						response.end();
					}

					if ( config.logging ) {
						msDiff = (msCurr-msInit).toString();
						msDiff = msDiff.slice(0,-3) + '\t' + gutil.colors.grey(msDiff.substr(-3));

						gutil.log(title, [
							msDiff,
							addr ? (addr === '127.0.0.1' ? addr : gutil.colors.cyan(addr)) : gutil.colors.red('[0.0.0.0]'),
							e ? gutil.colors.red(e.status) : (response.statusCode === 200 ? gutil.colors.green(response.statusCode) : gutil.colors.yellow(response.statusCode)),
							gutil.colors.grey(request.method),
							request.url.replace(/\//g, gutil.colors.grey('/'))
						].join('\t'));
					}
				});
			}).resume();
		}).listen(config.port).on('listening', function eventListenerListening () {
			var ip   = require('ip').address(),
				msg  = 'Serve directory ' + path.join(process.env.CWD, 'build') + ' at ' + 'http://' + ip + ':' + config.port + '/',
				hash = new Array(msg.length + 1).join('#');

			gutil.log(title, hash);
			gutil.log(title, gutil.colors.green(msg));
			gutil.log(title, hash);
		});
	}
});
