/**
 * Additional dev events.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var request = require('stb/request'),
	dom     = require('stb/dom'),
	data    = require('stb/app').data,
	util    = require('util'),
	grid    = require('./grid'),
	storage = require('./storage');


// additional top-level key handler
window.addEventListener('load', function developEventListenerLoad () {
	// export to globals
	window.$develop = document.querySelector('body > div.develop');

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
			changeScreenDimension(data.screen.width, data.screen.height);
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
			if ( !data.host ) {
				window.horde.unleash({nb: 500});
			}
			break;

		// numpad 7
		case 103:
			if ( !data.host ) {
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
 * Apply the given screen geometry and reload the page
 * @param {number} width
 * @param {number} height
 */
function changeScreenDimension ( width, height ) {
	debug.log(util.format('switch to %sx%s and reload', width, height), 'red');

	// save
	storage.set('screen.height', height);
	storage.set('screen.width',  width);

	// clear screen to indicate reload
	document.body.innerHTML = null;
	window.location.reload(true);
}
