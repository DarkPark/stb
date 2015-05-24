/**
 * Serve files in the build directory.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
	gulp   = require('gulp'),
	log    = require('gulp-util').log,
	glr    = require('gulp-livereload'),
	config = require(path.join(global.paths.config, 'static')),
	title  = 'static  '.inverse;


gulp.task('static', function ( done ) {
	var files, msInit;

	if ( config.active ) {
		// rfc 2616 compliant HTTP static file server
		files  = new (require('node-static').Server)(global.paths.build, {cache: false});
		msInit = +new Date();

		require('http').createServer(function createServer ( request, response ) {
			request.addListener('end', function eventListenerEnd () {
				// static files
				files.serve(request, response, function serve ( e ) {
					var msCurr  = +new Date(),
						address = request.connection.remoteAddress || '[0.0.0.0]'.red,
						status  = response.statusCode === 200 ? response.statusCode.toString().green : response.statusCode.toString().yellow,
						msDiff;

					if ( e ) {
						response.end();
					}

					if ( config.logging ) {
						msDiff = (msCurr - msInit).toString();
						msDiff = msDiff.slice(0, -3) + '\t' + msDiff.substr(-3).toString().grey;

						log(title, [
							'',
							msDiff,
							address,
							e ? e.status.red : status,
							request.method.grey,
							request.url.replace(/\//g, '/'.grey)
						].join('\t'));
					}
				});
			}).resume();
		}).listen(config.port).on('listening', function eventListenerListening () {
			var ip   = require('ip').address(),
				msg  = 'Serve build directory ' + global.paths.build,
				hash = new Array(msg.length + 1).join('-');

			log(title, hash);
			log(title, msg.bold);
			log(title, 'release: ' + ('http://' + ip + ':' + config.port + '/').green);
			log(title, 'develop: ' + ('http://' + ip + ':' + config.port + '/develop.html').green);
			log(title, hash);

			done();
		});

		if ( config.livereload ) {
			glr.listen({quiet: true});

			// reload
			gulp.watch([path.join(global.paths.build, '**', '*.{html,js,css}')]).on('change', function ( file ) {
				// report
				log('watch   '.bgCyan.black, 'reload ' + ('./' + path.relative(global.paths.build, file.path)).bold);
				// reload
				glr.changed(file);
			});
		}
	} else {
		// just exit
		log(title, 'task is disabled');
	}
});
