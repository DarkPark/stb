/**
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */

'use strict';

/* eslint-disable */


if ( !window.requestAnimationFrame ) {
    // shim layer with setTimeout fallback
    window.requestAnimationFrame =
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function ( callback ) {
            window.setTimeout(callback, 1000 / 60);
        };
}
