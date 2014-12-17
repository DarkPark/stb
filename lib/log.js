/**
 * Dump data to console.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

module.exports = function () {
	var date  = new Date(),
		timeH = date.getHours(),
		timeM = date.getMinutes(),
		timeS = date.getSeconds(),
		args  = Array.prototype.slice.call(arguments);

	args.unshift('[' + (
		(timeH < 10 ? '0' : '') + timeH + ':' +
		(timeM < 10 ? '0' : '') + timeM + ':' +
		(timeS < 10 ? '0' : '') + timeS
	).grey + ']');
	console.log.apply(console, args);
};
