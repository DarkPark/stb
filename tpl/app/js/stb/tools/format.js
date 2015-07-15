/**
 * @module stb/tools
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';


/**
 * Do string substitution according to the given format.
 * http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
 *
 * @param {string} format string substitution format
 *
 * @return {string} result data
 *
 * @example
 * format('This is a {0}', 'cat');
 * format('This is a {0} and a {1}', 'cat', 'dog');
 * format('This is a {0} and a {1} and another {0}', 'cat', 'dog');
 */
module.exports.format = function ( format ) {
	var args = Array.prototype.slice.call(arguments, 1);

	return format.replace(/{(\d+)}/g, function ( match, number ) {
		return args[number] !== undefined ? args[number] : match;
	});
};
