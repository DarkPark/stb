/**
 * Tasks to work with gettext localization files.
 *
 * Arguments description:      https://www.gnu.org/software/gettext/manual/html_node/xgettext-Invocation.html
 * Header entries description: https://www.gnu.org/software/gettext/manual/html_node/Header-Entry.html
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs      = require('fs'),
	path    = require('path'),
	gulp    = require('gulp'),
	pofile  = require('pofile'),
	log     = require('gulp-util').log,
	exec    = require('child_process').exec,
	config  = require(path.join(global.paths.config, 'lang')),
	pkgInfo = require(path.join(global.paths.root, 'package.json')),
	title   = 'xgettext'.inverse;


function po2js ( poFile, jsFile ) {
	var count  = 0,
		items  = {},
		result = [
			'/**',
			' * automatically generated gettext localization dictionary',
			' * do not edit manually, correction will be lost'
		],
		itemsSorted = {},
		po = pofile.parse(fs.readFileSync(poFile, {encoding: 'utf8'})),
		itemsSum = 0,
		fuzzyCount = 0,
		title   = 'po2js   '.inverse,
		keyList, overwritten;

	// absolute path
	//poFile = path.resolve(poFile.trim());
	// get localization
	// dump name
	log(title, 'file:\t'.cyan + poFile + '\t' + po.items.length.toString().green);

	// apply for the first po file
	if ( count === 0 ) {
		jsFile = jsFile || (path.dirname(poFile) + path.sep + path.basename(poFile, '.po') + '.js');
		result.push(' * @name '     + po.headers['Project-Id-Version']);
		result.push(' * @language ' + po.headers['Language']);
		result.push(' */');
	}
	count++;

	//console.log(po);

	// fill items
	po.items.forEach(function ( item ) {
		// skip commented
		if ( item.obsolete === true ) {
			return;
		}

		if ( item.flags.fuzzy ) {
			fuzzyCount++;
		}

		// find duplicates
		if ( items[item.msgid] && items[item.msgid] !== item.msgstr[0] ) {
			log(title, '\toverwritten: '.red + item.msgid + ' (old: "' + items[item.msgid] + '" new: "' + item.msgstr[0] + '")');
		}
		items[item.msgid] = item.msgstr[0];
	});
	itemsSum = itemsSum + po.items.length;

	keyList = Object.keys(items);
	overwritten = itemsSum - keyList.length;
// sorting by key names
	keyList.sort().forEach(function ( key ) {
		if ( itemsSorted[key] ) {
			log(title, '\toverwritten:' + key);
		}
		itemsSorted[key] = items[key];
	});
	result.push('gettext.load(' + JSON.stringify(itemsSorted, null, 4) + ');');

// and save
	log(title, 'build:\t'.cyan + jsFile.bold + '\t' + keyList.length.toString().green + '\tfuzzy:' + fuzzyCount.toString()[fuzzyCount ? 'red' : 'green'] + (overwritten ? ' (total overwritten: ' + overwritten + ')' : ''));

// store js file
	fs.writeFileSync(jsFile, result.join('\n'), {encoding:'utf8'});
}

// extracts translatable strings
gulp.task('lang', function ( done ) {
	var srcFile  = path.join(global.paths.build, 'js', 'develop.js'),
		dstFile  = path.join(global.paths.app, 'lang', 'messages.pot'),
		runCount = 0,
		xgettext = [
			'xgettext',
			'--output="' + dstFile + '"',
			'--language="JavaScript"',
			'--from-code="' + config.fromCode + '"',
			'--package-name="' + pkgInfo.name + '"',
			'--package-version="' + pkgInfo.version + '"',
			'--msgid-bugs-address="' + (pkgInfo.author.email ? pkgInfo.author.email : pkgInfo.author) + '"'
		],
		command;

	//xgettext.push('--omit-header');

	if ( fs.existsSync(dstFile) ) {
		// only update if present
		//xgettext.push('--join-existing');
		//xgettext.push('--omit-header');
	}

	// optional flags
	if ( config.indent      ) { xgettext.push('--indent'); }
	if ( config.noLocation  ) { xgettext.push('--no-location'); }
	if ( config.noWrap      ) { xgettext.push('--no-wrap'); }
	if ( config.sortOutput  ) { xgettext.push('--sort-output'); }
	if ( config.sortByFile  ) { xgettext.push('--sort-by-file'); }
	if ( config.addComments ) { xgettext.push('--add-comments="' + config.addComments + '"'); }

	// input file
	xgettext.push(srcFile);

	// final exec line
	command = xgettext.join(' ');

	if ( config.verbose ) {
		log(title, command.yellow);
	}

	exec(command, function ( error, stdout, stderr ) {
		if ( error ) {
			log(title, error.toString().trim().red);
			done();
			return;
		}

		log(title, 'done');

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

		config.languages.forEach(function ( langName ) {
			var langFile = path.join(global.paths.app, 'lang', langName + '.po'),
				jsFile = path.join(global.paths.build, 'js', langName + '.js'),
				title    = 'msgmerge'.inverse,
				msgmerge = [
					'msgmerge',
					'--update',
					'--verbose'
				];

			if ( !fs.existsSync(langFile) ) {
				// clone messages
				fs.writeFileSync(langFile,
					fs.readFileSync(dstFile, {encoding:'utf8'}).replace(
						'Content-Type: text/plain; charset=CHARSET\\n',
						'Content-Type: text/plain; charset=UTF-8\\n'
					).replace(
						'Language: \\n',
						'Language: ' + langName + '\\n'
					)
				);
			}

			// optional flags
			if ( config.indent     ) { msgmerge.push('--indent'); }
			if ( config.noLocation ) { msgmerge.push('--no-location'); }
			if ( config.noWrap     ) { msgmerge.push('--no-wrap'); }
			if ( config.sortOutput ) { msgmerge.push('--sort-output'); }
			if ( config.sortByFile ) { msgmerge.push('--sort-by-file'); }

			// merge
			msgmerge.push(langFile);
			msgmerge.push(dstFile);

			// final exec line
			command = msgmerge.join(' ');

			exec(command, function ( error, stdout, stderr ) {
				runCount++;

				if ( config.verbose ) {
					log(title, command.yellow);
				}

				if ( error ) {
					log(title, error.toString().trim().red);
				} else {
					log(title, langName.toUpperCase().green + ' :: ' + stderr.trim().split('\n')[1]);

					po2js(langFile, jsFile);
				}

				if ( runCount >= config.languages.length ) {
					done();
				}
			});
		});
	});
});
