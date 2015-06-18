/**
 * Gettext localization configuration.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

// public
module.exports = {
	// turn on/off localization support
	active: false,

	// list of languages to generate localization files for
	languages: ['ru'],

	// Specifies the encoding of the input files.
	// This option is needed only if some untranslated message strings or their corresponding comments
	// contain non-ASCII characters.
	// @flag --from-code=name
	fromCode: 'UTF-8',

	// Place comment blocks starting with tag and preceding keyword lines in the output file.
	// Without a tag, the option means to put all comment blocks preceding keyword lines in the output file.
	// Note that comment blocks supposed to be extracted must be adjacent to keyword lines.
	// @flag --add-comments[=tag]
	addComments: 'gettext',

	// Write the .po file using indented style.
	// @flag --indent
	indent: false,

	// Write "#: filename:line" lines.
	// @flag --no-location
	noLocation: true,

	// Do not break long message lines.
	// Message lines whose width exceeds the output page width will not be split into several lines.
	// Only file reference lines which are wider than the output page width will be split.
	// @flag --no-wrap
	noWrap: true,

	// Generate sorted output.
	// Note that using this option makes it much harder for the translator to understand each message’s context.
	// @flag --sort-output
	sortOutput: true,

	// Sort output by file location.
	// @flag --sort-by-file
	sortByFile: false,

	// Increase verbosity level.
	// @flag --verbose
	verbose: false
};
