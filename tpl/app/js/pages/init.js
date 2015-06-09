/**
 * Loading page implementation.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var id   = 'pageInit',
	Page = require('../stb/ui/page'),
	page = new Page({$node: document.getElementById(id)});


// public
module.exports = page;
