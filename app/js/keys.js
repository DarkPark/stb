/**
 * Global list of non-printable control key codes.
 *
 * WARNING!!! All codes in this file (exclude 'volumeUp', 'volumeDown')
 * uses in window 'keydown' handler to prevent wrong 'keypress' firings.
 * If u add code into this file, 'keypress' event with this code will never fires.
 *
 *  Value | Description
 * -------|-------------
 *  +1000 | shift key pressed
 *  +2000 | alt key pressed
 *
 * @module stb/keys
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';


// public
module.exports = {
	back         : 8,    // Backspace
	'delete'     : 46,
	channelPrev  : 1009, // Shift+Tab
	channelNext  : 9,    // Tab
	ok           : 13,   // Enter
	exit         : 27,   // Esc
	up           : 38,   // UP ARROW
	down         : 40,   // DOWN ARROW
	left         : 37,   // LEFT ARROW
	right        : 39,   // RIGHT ARROW
	pageUp       : 33,   // Page Up
	pageDown     : 34,   // Page Down
	end          : 35,
	home         : 36,
	volumeUp     : 107,  // NUMPAD +
	volumeDown   : 109,  // NUMPAD -
	f1           : 112,  // F1
	f2           : 113,  // F2
	f3           : 114,  // F3
	f4           : 115,  // F4
	refresh      : 116,  // F5
	frame        : 117,  // F6
	phone        : 119,  // F8
	set          : 120,  // F9
	tv           : 121,  // F10
	menu         : 122,  // F11
	web          : 123,  // F12
	mic          : 2032,
	rewind       : 2066, // Alt+B
	forward      : 2070, // Alt+F
	app          : 2076, // Alt+L
	usbMounted   : 2080, // Alt+P
	usbUnmounted : 2081, // Alt+Q
	playPause    : 2082, // Alt+R
	stop         : 2083, // Alt+S
	power        : 2085, // Alt+U
	record       : 2087, // Alt+W
	info         : 2089, // Alt+Y
	mute         : 2192,
	clock        : 2032,
	audio        : 2071, // Alt+G
	keyboard     : 2076  // Alt+L
};
