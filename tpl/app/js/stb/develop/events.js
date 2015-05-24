/**
 * Additional dev events.
 *
 * @module stb/develop/events
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var util    = require('util'),
	app     = require('../app'),
	request = require('../request'),
	dom     = require('../dom'),
	grid    = require('./grid'),
	storage = require('./storage');


// additional top-level key handler
window.addEventListener('load', function developEventListenerLoad () {
	// export to globals div for develop HTML elements
	window.$develop = document.body.appendChild(document.createElement('div'));
	window.$develop.className = 'develop';

	grid.init();

	if ( storage.get('grid.active') ) {
		grid.show();
	}

	// stress-testing
	window.gremlins = require('gremlins.js/gremlins.min.js');
	window.horde    = window.gremlins.createHorde();
});


// additional top-level key handler
window.addEventListener('keydown', function developEventListenerKeydown ( event ) {
	switch ( event.keyCode ) {
		// numpad 0
		case 96:
			debug.log('full document reload', 'red');
			location.hash = '';
			location.reload();
			break;

		// numpad 1
		case 97:
			// NTSC
			changeScreenDimension(720, 480);
			break;

		// numpad 2
		case 98:
			// PAL
			changeScreenDimension(720, 576);
			break;

		// numpad 3
		case 99:
			// 720p
			changeScreenDimension(1280, 720);
			break;

		// numpad 4
		case 100:
			// 1080p
			changeScreenDimension(1920, 1080);
			break;

		// numpad 5
		case 101:
			// debug grid
			if ( grid.active ) {
				grid.hide();
			} else {
				grid.show();
			}
			debug.log('show grid: ' + grid.active, 'red');
			storage.set('grid.active', grid.active);
			break;

		// numpad 6
		case 102:
			// stress-testing for emulation
			window.horde.unleash({nb: 500});
			break;

		// numpad 7
		case 103:
			if ( !app.data.host ) {
				debug.log('SpyJS in this mode is available only on STB devices.', 'red');
			} else {
				// SpyJS enable/disable
				if ( !storage.get('spyjs.active') ) {
					// try to "ping" proxy server
					request.ajax(document.location.protocol + '//' + location.hostname + ':3546', {
						method: 'get',
						onload: function () {
							// proxy seems ready
							//isSpyJs = true;
							storage.set('spyjs.active', true);
							debug.log('SpyJS: enable', 'red');
							debug.log('SpyJS: set proxy to ' + location.hostname + ':' + 3546);

							gSTB.SetWebProxy(location.hostname, 3546, '', '', '');
							location.reload();
						},
						onerror: function () {
							debug.log('SpyJS: no connection (check SpyJS is started on the server)', 'red');
						}
					});
				} else {
					//isSpyJs = false;
					storage.set('spyjs.active', false);
					gSTB.ResetWebProxy();
					debug.log('SpyJS: disable', 'red');
					location.reload();
				}
			}
			break;

		// numpad 8
		case 104:
			// FireBug Lite
			debug.log('firebug-lite activation', 'red');
			document.head.appendChild(dom.tag('script', {
				type: 'text/javascript',
				src: 'http://getfirebug.com/firebug-lite.js#startOpened',
				onload: function () {
					debug.log('firebug-lite ready ...', 'green');
				},
				onerror: function ( error ) {
					debug.inspect(error);
				}
			}));
			break;

		// numpad .
		case 110:
			// CSS reload
			debug.log('CSS reload', 'red');
			// get through all css links
			Array.prototype.slice.call(document.head.getElementsByTagName('link')).forEach(function forEachLink ( tag ) {
				// get base name, modify and apply
				tag.href = tag.href.split('?')[0] + '?' + (+new Date());
			});
			break;
	}
});


/**
 * Apply the given screen geometry and reload the page.
 *
 * @param {number} width screen param
 * @param {number} height screen param
 */
function changeScreenDimension ( width, height ) {
	// check if it's necessary
	if ( Number(storage.get('screen.height')) !== height ) {
		// yes
		debug.log(util.format('switch to %sx%s', width, height), 'red');

		// save in case of document reload
		storage.set('screen.height', height);
		storage.set('screen.width',  width);

		// hide content to avoid raw HTML blinking
		document.body.style.display = 'none';

		// apply new metrics
		app.setScreen(require('../../../../config/metrics')[height]);

		// restore visibility
		document.body.style.display = '';
	} else {
		// not really
		debug.log('no resolution change: new and current values are identical', 'red');
	}
}
