/**
 * Infomir target entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';


// new way of string handling
// all strings are in UTF-16
gSTB.SetNativeStringMode(true);

// apply wrappers
window.addEventListener('load', function onload () {
	// require device event listener for stb target
	require('./events');
});
