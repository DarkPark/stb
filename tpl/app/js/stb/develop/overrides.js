/**
 * Develop enhancements.
 *
 * @author Igor Zaporozhets <deadbyelpy@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */

'use strict';


// links to the origin
var getElementById = document.getElementById,
	querySelector  = document.querySelector;


// improved error output when working with selection elements by id
document.getElementById = function ( id ) {
	var el = getElementById.call(document, id);

	if ( !el ) { throw new Error(__filename + ': no element with id ' + id); }

	return el;
};

document.querySelector = function ( selector ) {
	var el = querySelector.call(document, selector);

	if ( !el ) { throw new Error(__filename + ': no element with selector: ' + selector); }

	return el;
};
