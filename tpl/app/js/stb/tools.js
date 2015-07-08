/**
 * @module stb/tools
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';


/**
 * URL parsing tool
 * (c) Steven Levithan <stevenlevithan.com>
 * MIT License
 *
 * @param {string} str string to parse
 *
 * @return {string} result data
 */
function parseUri ( str ) {
	var o   = parseUri.options,
		m   = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
		uri = {},
		i   = 14;

	while ( i-- ) { uri[o.key[i]] = m[i] || ''; }

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ( $0, $1, $2 ) {
		if ( $1 ) { uri[o.q.name][$1] = $2; }
	});

	return uri;
}

parseUri.options = {
	strictMode: false,
	key       : ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
	q         : {
		name  : 'queryKey',
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser    : {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};


module.exports.parseUri = parseUri;


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


/**
 * Parse the given location search string into object.
 *
 * @param {string} query string to parse
 *
 * @return {Object} result data
 *
 * @example
 * console.log(parseQuery(document.location.search.substring(1)));
 * console.log(parseQuery('param=value&another_param=another_value'));
 */
module.exports.parseQuery = function ( query ) {
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
