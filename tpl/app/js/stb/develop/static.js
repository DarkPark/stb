/**
 * Static files reload on change.
 *
 * @module stb/develop/static
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var dom    = require('../dom'),
	config = require('../../../../config/static');


// livereload activation
if ( config.livereload ) {
	// load external script
	document.head.appendChild(dom.tag('script', {
		type: 'text/javascript',
		src: '//' + location.hostname + ':35729/livereload.js'
	}));
}
