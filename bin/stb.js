#!/usr/bin/env node

/**
 * CLI main entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
	program = require('commander'),
	ncp     = require('ncp').ncp,
	pathApp = process.cwd(),
	pathStb = path.join(__dirname, '..'),
	pkgInfo = require('../package.json');


/**
 * Copy files/folders handler.
 *
 * @param {Object} error copy error data
 */
function errorHandler ( error ) {
	if ( error ) {
		console.error(error);
	}
}


program
	.version(pkgInfo.version)
	.usage('<command> [options]');

program
	.command('init')
	.description('initial creation of all necessary files and folders')
	.action(function () {
		// copy everything
		ncp(path.join(pathStb, 'tpl'), pathApp, errorHandler);
		ncp(path.join(pathStb, '.eslintrc'), path.join(pathApp, '.eslintrc'), errorHandler);
		ncp(path.join(pathStb, 'license.md'), path.join(pathApp, 'license.md'), errorHandler);
		ncp(path.join(pathStb, '.editorconfig'), path.join(pathApp, '.editorconfig'), errorHandler);
		ncp(path.join(pathStb, '.gitattributes'), path.join(pathApp, '.gitattributes'), errorHandler);
	});

program
	.command('update')
	.description('update framework js/less/task files')
	.option('-j, --javascript', 'proceed with application javascript files')
	.option('-l, --less', 'proceed with application less files')
	.option('-t, --tasks', 'proceed with application tasks files')
	.action(function ( options ) {
		if ( options.javascript ) {
			ncp(path.join(pathStb, 'tpl', 'app', 'js',   'stb'), path.join(pathApp, 'app',   'js', 'stb'), errorHandler);
			console.log('+ javascript files');
		}

		if ( options.less ) {
			ncp(path.join(pathStb, 'tpl', 'app', 'less', 'stb'), path.join(pathApp, 'app', 'less', 'stb'), errorHandler);
			console.log('+ less files');
		}

		if ( options.tasks ) {
			ncp(path.join(pathStb, 'tpl', 'tasks'), path.join(pathApp, 'tasks'), errorHandler);
			console.log('+ tasks files');
		}
	});

// extend default help info
program.on('--help', function () {
	console.log('  Examples:');
	console.log('');
	console.log('    $ stb --help');
	console.log('    $ stb init');
	console.log('');
});

// parse and invoke commands when defined
program.parse(process.argv);

// no options were given
if ( !program.args.length ) {
	// show help and exit
	program.help();
}


// public
module.exports = program;

