/**
 * Infomir target entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint new-cap: 0 */

// new way of string handling
// all strings are in UTF-16
// since stbapp 2.18
if ( window.gSTB && gSTB.SetNativeStringMode ) {
	gSTB.SetNativeStringMode(true);
}

// apply wrappers
window.addEventListener('load', function onload () {
	// require device event listener for stb target
	require('./events');
});
