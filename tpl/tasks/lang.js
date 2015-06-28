/**
 * Tasks to work with gettext localization files.
 *
 * Arguments description:      https://www.gnu.org/software/gettext/manual/html_node/xgettext-Invocation.html
 * Header entries description: https://www.gnu.org/software/gettext/manual/html_node/Header-Entry.html
 * Plural-forms parameter:     https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs      = require('fs'),
	path    = require('path'),
	gulp    = require('gulp'),
	log     = require('gulp-util').log,
	exec    = require('child_process').exec,
	config  = require(path.join(global.paths.config, 'lang')),
	pkgInfo = require(path.join(global.paths.root, 'package.json')),
	title   = 'lang    '.inverse;


function po2js ( poFile, jsonFile ) {
	var jsonDir  = path.join(global.paths.build, 'lang'),
		po       = require('gettext-parser').po.parse(fs.readFileSync(poFile, {encoding: 'utf8'})),
		contexts = po.translations,
		result   = {
			meta: {
				charset:  po.charset,
				project:  po.headers['project-id-version'],
				language: po.headers.language,
				plural:   ''
			},
			data: {}
		};

	if ( po.headers['plural-forms'] ) {
		result.meta.plural = po.headers['plural-forms'].split('plural=').pop().replace(';', '');
	}

	// fill items
	Object.keys(contexts).sort().forEach(function ( contextName ) {
		result.data[contextName] = result.data[contextName] || {};

		Object.keys(contexts[contextName]).sort().forEach(function ( msgId ) {
			if ( msgId ) {
				if ( contexts[contextName][msgId].msgid_plural ) {
					result.data[contextName][msgId] = contexts[contextName][msgId].msgstr;
				} else {
					result.data[contextName][msgId] = contexts[contextName][msgId].msgstr[0];
				}
			}
		});

	});

	if ( !fs.existsSync(jsonDir) ) {
		fs.mkdirSync(jsonDir);
	}

	// store js file
	fs.writeFileSync(jsonFile, JSON.stringify(result, null, '\t'), {encoding:'utf8'});
	return result;
}


function msginit ( langName, potFile, poFile, callback ) {
	var title  = 'msginit '.inverse,
		params = [
			'msginit',
			'--input="'  + potFile  + '"',
			'--output="' + poFile   + '"',
			'--locale="' + langName + '"',
			'--no-translator'
		],
		command;

	// optional flags
	if ( config.noWrap ) { params.push('--no-wrap'); }

	// final exec line
	command = params.join(' ');

	// print
	if ( config.verbose ) { log(title, command.yellow); }

	exec(command, function ( error, stdout, stderr ) {
		if ( error ) {
			log(title, error.toString().trim().red);
		} else {
			(stdout + stderr).trim().split('\n').forEach(function ( line ) {
				log(title, line);
			});

			// Content-Type: text/plain; charset=UTF-8
			fs.writeFileSync(poFile,
				fs.readFileSync(poFile, {encoding:'utf8'}).replace(
					'Content-Type: text/plain; charset=ASCII',
					'Content-Type: text/plain; charset=UTF-8'
				)
			);
		}
		callback(error);
	});
}


function msgmerge ( langName, potFile, poFile, callback ) {
	var title    = 'msgmerge'.inverse,
		msgmerge = [
			'msgmerge',
			'--update',
			'--verbose'
		],
		command;

	// optional flags
	if ( config.indent     ) { msgmerge.push('--indent'); }
	if ( config.noLocation ) { msgmerge.push('--no-location'); }
	if ( config.noWrap     ) { msgmerge.push('--no-wrap'); }
	if ( config.sortOutput ) { msgmerge.push('--sort-output'); }
	if ( config.sortByFile ) { msgmerge.push('--sort-by-file'); }

	// merge
	msgmerge.push(poFile);
	msgmerge.push(potFile);

	// final exec line
	command = msgmerge.join(' ');

	if ( config.verbose ) {
		log(title, command.yellow);
	}

	exec(command, function ( error, stdout, stderr ) {
		/* eslint no-unused-vars: 0 */

		if ( error ) {
			log(title, error.toString().trim().red);
		} else {
			log(title, langName.toUpperCase().green + ': ' + stderr.trim().split('\n')[1]);
		}
		callback(error);
	});
}


function xgettext ( callback ) {
	var srcFile = path.join(global.paths.build, 'js', 'develop.js'),
		dstFile = path.join(global.paths.app, 'lang', 'messages.pot'),
		title   = 'xgettext'.inverse,
		params  = [
			'xgettext',
			'--output="' + dstFile + '"',
			'--language="JavaScript"',
			'--from-code="' + config.fromCode + '"',
			'--package-name="' + pkgInfo.name + '"',
			'--package-version="' + pkgInfo.version + '"',
			'--msgid-bugs-address="' + (pkgInfo.author.email ? pkgInfo.author.email : pkgInfo.author) + '"'
		],
		command;

	// optional flags
	if ( config.indent      ) { params.push('--indent'); }
	if ( config.noLocation  ) { params.push('--no-location'); }
	if ( config.noWrap      ) { params.push('--no-wrap'); }
	if ( config.sortOutput  ) { params.push('--sort-output'); }
	if ( config.sortByFile  ) { params.push('--sort-by-file'); }
	if ( config.addComments ) { params.push('--add-comments="' + config.addComments + '"'); }

	// input file
	params.push(srcFile);

	// final exec line
	command = params.join(' ');

	if ( config.verbose ) {
		log(title, command.yellow);
	}

	exec(command, function ( error, stdout, stderr ) {
		if ( error ) {
			log(title, error.toString().trim().red);
			return callback(error);
		}

		if ( stdout ) {
			stdout.trim().split('\n').forEach(function ( line ) {
				log(title, line);
			});
		}

		if ( stderr ) {
			stderr.trim().split('\n').forEach(function ( line ) {
				log(title, line.red);
			});
		}

		log(title, 'Created ' + dstFile + '.');

		callback(error, dstFile);
	});
}


// extracts translatable strings
gulp.task('lang', function ( done ) {
	if ( config.active ) {
		xgettext(function ( error, potFile ) {
			var runCount = 0,
				fnDone   = function ( poFile, jsonFile ) {
					runCount++;

					po2js(poFile, jsonFile);

					if ( runCount >= config.languages.length ) {
						done();
					}
				};

			if ( error ) {
				return done();
			}

			config.languages.forEach(function ( langName ) {
				var poFile   = path.join(global.paths.app,   'lang', langName + '.po'),
					jsonFile = path.join(global.paths.build, 'lang', langName + '.json');

				if ( fs.existsSync(poFile) ) {
					// merge existing pot and po files
					msgmerge(langName, potFile, poFile, function () {
						fnDone(poFile, jsonFile);
					});
				} else {
					// create a new lang file
					msginit(langName, potFile, poFile, function () {
						fnDone(poFile, jsonFile);
					});
				}
			});
		});
	} else {
		// just exit
		log(title, 'task is disabled'.grey);

		done();
	}
});
