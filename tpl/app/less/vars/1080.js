/**
 * Less variables specific for this resolution.
 * All values for this resolution are normally created from 720p by multiplying by 1.5.
 * It's possible to correct some individual values if necessary before exporting.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var vars = require('./720'),
    data = {};


// multiply by 1.5 all vars
Object.keys(vars).forEach(function ( name ) {
    data[name] = vars[name] * 1.5;
});


// public
module.exports = data;
