/**
 * Less variables specific for PAL video resolution.
 * NTSC and PAL resolutions have the same width. The height rate is 1.2.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var vars = require('./480');


// public
module.exports = {
	buttonHeight:   vars.buttonHeight * 1.2,
	buttonPaddingX: vars.buttonPaddingX,
	buttonPaddingY: vars.buttonPaddingY * 1.2,

	checkBoxWidth:  vars.checkBoxWidth,
	checkBoxHeight: vars.checkBoxHeight * 1.2,

	fontSize: vars.fontSize,

	gridItemPaddingX: vars.gridItemPaddingX,
	gridItemPaddingY: vars.gridItemPaddingY * 1.2,

	inputFontSize: vars.inputFontSize,
	inputHeight:   vars.inputHeight * 1.2,
	inputWidth:    vars.inputWidth,
	inputBorder:   vars.inputBorder,
	inputPaddingX: vars.inputPaddingX,
	inputPaddingY: vars.inputPaddingY * 1.2,

	listItemHeight:   vars.listItemHeight * 1.2,
	listItemPaddingX: vars.listItemPaddingX,
	listItemPaddingY: vars.listItemPaddingY * 1.2,

	panelPaddingX: vars.panelPaddingX,
	panelPaddingY: vars.panelPaddingY * 1.2,

	progressBarHeight: vars.progressBarHeight * 1.2,

	scrollBarWidth:  vars.scrollBarWidth,
	scrollBarHeight: vars.scrollBarHeight * 1.2
};
