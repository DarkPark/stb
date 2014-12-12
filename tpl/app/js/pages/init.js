/**
 * Loading page implementation.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */

'use strict';

var id   = 'pageInit',
	Page = require('stb/ui/page'),
	page = new Page({
		$node: document.getElementById(id)
	});


// public export
module.exports = page;
