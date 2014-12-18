/**
 * Initial creation of all necessary files and folders.
 * Has smart conflict resolution mechanism.
 * Installs all necessary package dependencies.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs    = require('fs'),
	npm   = require('npm'),
	path  = require('path'),
	gulp  = require('gulp');


gulp.task('init', function ( done ) {
	// copy template files to the current dir
	gulp.src([process.env.STB + '/tpl/**', process.env.STB + '/.eslintrc', process.env.STB + '/.editorconfig'])
		.pipe(require('gulp-conflict')('./'))
		.pipe(gulp.dest('./'))
		.on('end', function () {
			// copy config files to the current dir
			gulp.src(process.env.STB + '/config/**', {base: process.env.STB})
				.pipe(require('gulp-conflict')('./'))
				.pipe(gulp.dest('./'))
				.on('end', function () {
					// manual empty dirs creation
					fs.mkdirSync('./build/develop');
					fs.mkdirSync('./build/release');
					fs.mkdirSync('./build/develop/css');
					fs.mkdirSync('./build/release/css');

					done();

					npm.load({loaded: false}, function ( error ) {
						var config = require(path.join(process.env.CWD, 'package.json')),
							pkgSet = [];

						if ( error ) {
							console.log(error);
							return;
						}

						// section is present
						if ( typeof config.dependencies === 'object' ) {
							// build package name@version list
							Object.keys(config.dependencies).forEach(function ( name ) {
								pkgSet.push(name + '@' + config.dependencies[name]);
							});

							// there are some packages to install
							if ( pkgSet.length > 0 ) {
								console.log('\ninstalling dependencies ...'.green);

								// do the installation
								npm.commands.install(pkgSet, function ( error ) {
									if ( error ) {
										console.log(error);
									} else {
										console.log('done'.green);
									}
								});
								npm.on('log', function ( message ) {
									// log the progress of the installation
									console.log(message);
								});
							}
						}
					});
				});
		});
});
