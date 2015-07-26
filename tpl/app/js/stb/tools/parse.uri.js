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
 * @return {Object.<string, string>} result data
 */
function parseUri ( str ) {
	var o   = parseUri.options,
		m   = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
		uri = {},
		i   = 14;

	while ( i-- ) { uri[o.key[i]] = m[i] || ''; }

	uri[o.q.name] = {};

	/* eslint no-unused-vars: 0 */
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


module.exports = parseUri;
