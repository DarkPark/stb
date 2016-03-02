/**
 * @module stb/ui/modal.message
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Modal window implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {Object} [config.title] message title
 * @param {Object} [config.className] message classname
 * @param {Object} [config.icon] icon at header
 * @param {Object} [config.children] content (inherited from the parent)
 *
 *
 * page.modalMessage = new ModalMessage({
 *        title: 'My Title',
 *        icon: 'star',
 *        children: [new Button({value: 'Create'})]
 *    });
 * page.add(page.modalBox);
 * page.modalBox.show();
 *
 */
function ModalMessage ( config ) {
    // sanitize
    config = config || {};

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.icon && typeof config.icon !== 'string' ) { throw new Error(__filename + ': wrong or empty config.icon'); }
        if ( config.title && typeof config.title !== 'string' ) { throw new Error(__filename + ': wrong or empty config.icon'); }
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
        if ( config.$body ) { throw new Error(__filename + ': config.$body should not be provided in ModalBox manually'); }
    }

    // set default className if classList property empty or undefined
    config.className = 'modalMessage ' + (config.className || '');

    // create centered div
    config.$body = document.createElement('div');
    config.$body.className = 'body';

    // parent constructor call
    Component.call(this, config);

    // add table-cell wrappers
    this.$node.appendChild(document.createElement('div'));
    this.$node.firstChild.appendChild(document.createElement('div'));

    // add header div
    this.$header = document.createElement('div');
    this.$header.className = 'header';

    // insert caption placeholder
    this.$text = this.$header.appendChild(document.createElement('div'));
    this.$text.classList.add('text');
    this.$text.innerText = config.title || '';

    // optional icon
    if ( config.icon ) {
        // insert icon
        this.$icon = this.$header.appendChild(document.createElement('div'));
        this.$icon.className = 'icon ' + config.icon;
    }

    // add to dom
    this.$node.firstChild.firstChild.appendChild(this.$header);
    this.$node.firstChild.firstChild.appendChild(this.$body);
}


// inheritance
ModalMessage.prototype = Object.create(Component.prototype);
ModalMessage.prototype.constructor = ModalMessage;


if ( DEBUG ) {
    // expose to the global scope
    window.ComponentModalMessage = ModalMessage;
}


// public
module.exports = ModalMessage;
