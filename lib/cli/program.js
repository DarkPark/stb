/**
 * Parse arguments and run.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs      = require('fs'),
	path    = require('path'),
	gulp    = require('gulp'),
	program = require('commander'),
	pkgInfo = require('../../package.json'),
	targets = ['infomir', 'browser'];


/**
 * Process the given command and forward it to gulp.
 *
 * @param {Object} command the task executed at the moment
 */
function execCommand ( command ) {
	var name;

	// save link to this command
	// to use inside some tasks
	program.currCommnand = command;

	// default platform
	process.env.target = 'infomir';
	// user set it explicitly
	if ( command.target ) {
		// sanitize
		command.target = command.target.toLowerCase();
		// target is allowed
		if ( targets.indexOf(command.target) !== -1 ) {
			// change platform target
			process.env.target = command.target;
		}
	}

	// don't use both develop and release flags at once
	if ( command.develop && command.release ) {
		delete command.develop;
		delete command.release;
	}

	// build gulp task name
	name = command['_name'] +
		(command.clean ? ':clean' : '') +
		(command.develop ? ':develop' : '') +
		(command.release ? ':release' : '');

	// first run or root of the project
	if ( name === 'init' || fs.existsSync(path.join(process.env.CWD, 'package.json')) ) {
		// exec selected task
		gulp.start(name);
	} else {
		console.log('Wrong current directory!\nThis command should be executed only in the root directory of the project.'.red);
	}
}


program
	.version(pkgInfo.version)
	.usage('<command> [options]');

program
	.command('doc')
	.description('open STB documentation in the default web browser')
	.action(execCommand);

program
	.command('init')
	.description('initial creation of all necessary files and folders')
	.action(execCommand);

program
	.command('serve')
	.description('main entry point - rebuild everything, start all watchers and servers')
	.option('-n, --no-open', 'suppress a browser opening')
	.option('-s, --ssh [profile]', 'connect to the STB device by SSH protocol and activate one of the profiles [develop]')
	.option('-t, --target [name]', 'compile application for a specific target platform [infomir]')
	.action(execCommand);

program
	.command('develop')
	.description('run all development tasks')
	.option('-t, --target [name]', 'compile application for a specific target platform [infomir]')
	.action(execCommand);

program
	.command('release')
	.description('run all production tasks')
	.option('-t, --target [name]', 'compile application for a specific target platform [infomir]')
	.action(execCommand);

program
	.command('lint')
	.description('analyse JavaScript code for potential errors and problems (temporarily unavailable)')
	.action(execCommand);

program
	.command('static')
	.description('serve files in the build directory')
	.action(execCommand);

program
	.command('proxy')
	.description('proxy js code execution from a desktop browser to STB')
	.action(execCommand);

program
	.command('logger')
	.description('WebSocket server to translate log messages from STB to a desktop console')
	.action(execCommand);

program
	.command('weinre')
	.description('WEb INspector REmote debugger server')
	.action(execCommand);

program
	.command('img')
	.description('execute all the tasks to remove and copy all images')
	.option('-c, --clean', 'remove all images')
	.option('-r, --release', 'affect only release files')
	.option('-d, --develop', 'affect only develop files')
	.action(execCommand);

program
	.command('jade')
	.description('compile all HTML files from Jade sources')
	.option('-c, --clean', 'only remove generated HTML files')
	.option('-r, --release', 'affect only release files')
	.option('-d, --develop', 'affect only develop files')
	.action(execCommand);

program
	.command('less')
	.description('compile all Less files into a set of css files with maps')
	.option('-c, --clean', 'remove all generated CSS and source-map files')
	.option('-r, --release', 'affect only release files')
	.option('-d, --develop', 'affect only develop files')
	.action(execCommand);

program
	.command('webpack')
	.description('compile all CommonJS modules into a single js file')
	.option('-c, --clean', 'remove all JavaScript compiled files')
	.option('-r, --release', 'affect only release files')
	.option('-d, --develop', 'affect only develop files')
	.option('-t, --target [name]', 'compile application for a specific target platform [infomir]')
	.action(execCommand);

// extend default help info
program.on('--help', function () {
	console.log('  Examples:');
	console.log('');
	console.log('    $ stb jade --help');
	console.log('    $ stb less --clean --develop');
	console.log('    $ stb serve --no-open');
	console.log('    $ stb serve --ssh release');
	console.log('    $ stb serve --target infomir');
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
