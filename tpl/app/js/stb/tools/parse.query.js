/**
 * @module stb/tools
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';


/**
 * Parse the given location search string into object.
 *
 * @param {string} query string to parse
 *
 * @return {Object.<string, string>} result data
 *
 * @example
 * console.log(parseQuery(document.location.search.substring(1)));
 * console.log(parseQuery('param=value&another_param=another_value'));
 */
module.exports = function ( query ) {
    var data = {};

    // parse and fill the data
    query.split('&').forEach(function ( part ) {
        part = part.split('=');
        // valid number on params
        if ( part.length === 2 ) {
            data[part[0]] = decodeURIComponent(part[1]);
        }
    });

    return data;
};
