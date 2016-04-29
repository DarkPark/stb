/**
 * Gulp main entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs   = require('fs'),
    path = require('path');


/**
 * Load all js modules from the given directory.
 *
 * @param {string} dir folder with modules
 */
function load ( dir ) {
    // may be missing
    if ( fs.existsSync(dir) ) {
        // get file list and walk through it
        require('fs').readdirSync(dir).forEach(function ( name ) {
            // make correct absolute path
            name = path.join(dir, name);
            // check file type
            if ( path.extname(name) === '.js' ) {
                require(name);
            }
        });
    }
}


// enable colors in console
require('tty-colors');


// general app paths
global.paths = {
    root:   process.env.PATH_ROOT   || __dirname,
    tasks:  process.env.PATH_TASKS  || path.join(__dirname, 'tasks'),
    app:    process.env.PATH_APP    || path.join(__dirname, 'app'),
    build:  process.env.PATH_BUILD  || path.join(__dirname, 'build'),
    config: process.env.PATH_CONFIG || path.join(__dirname, 'config')
};


// load tasks
load(global.paths.tasks);
