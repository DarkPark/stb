/**
 * @module stb/ui/footer
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
    Page = require('./page'),
    keys = require('../keys'),
    dom = require('../dom');


/**
 * Footer.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} config={} init parameters
 * @param {Object} config.parent parent page
 * @param {boolean} [config.visible] visibility flag
 * @param {Object} [config.buttons] buttons config
 * @param {Object || boolean} [config.buttons.f1] f1 button config, if false button will be hidden
 * @param {string} [config.buttons.f1.title] f1 button title
 * @param {Function} [config.buttons.f1.action] f1 button press (click) action
 *
 *
 * page.footer = new Footer({
 *        parent: page,
 *        data: {
 *            f1: false,
 *            f2: {title: 'start', action: function () {}},
 *            f4: {title: 'end'} // button f3 will stay in same state
 *        }
 *    });
 * page.add(page.footer);
 */
function Footer ( config ) {
    var self;

    // sanitize
    config = config || {};

    if ( DEBUG ) {
        if ( !config.parent || !(config.parent instanceof Page) ) { throw new Error(__filename + ': wrong or empty config.parent'); }
    }

    // can't accept focus
    config.focusable = false;
    // set default className if classList property empty or undefined
    config.className = 'footer ' + (config.className || '');
    // hide by default
    config.visible = config.visible || false;
    // create centered div
    config.$body = document.createElement('div');
    config.$body.className = 'body';

    // parent constructor call
    Component.call(this, config);

    this.buttons = {
        menu: {visibility: false},
        info: {visibility: false},
        f1: {visibility: false},
        f2: {visibility: false},
        f3: {visibility: false},
        f4: {visibility: false}
    };

    this.$node.appendChild(dom.tag('table', {},
        dom.tag('tr', {},
            dom.tag('td', {},
                this.buttons.menu.$node = dom.tag('div', {className: 'icon menu'})
            ),
            dom.tag('td', {className: 'central'},
                this.$wrapper = dom.tag('div', {className: 'wrapper hidden'},
                    dom.tag('div', {className: 'left'}),
                    this.buttons.f1.$node = dom.tag('div', {className: 'button hidden'},
                        dom.tag('div', {className: 'f1'}, 'F1'),
                        dom.tag('div', {className: 'title'})
                    ),
                    this.buttons.f2.$node = dom.tag('div', {className: 'button hidden'},
                        dom.tag('div', {className: 'f2'}, 'F2'),
                        dom.tag('div', {className: 'title'})
                    ),
                    this.buttons.f3.$node = dom.tag('div', {className: 'button hidden'},
                        dom.tag('div', {className: 'f3'}, 'F3'),
                        dom.tag('div', {className: 'title'})
                    ),
                    this.buttons.f4.$node = dom.tag('div', {className: 'button hidden'},
                        dom.tag('div', {className: 'f4'}, 'F4'),
                        dom.tag('div', {className: 'title'})
                    ),
                    dom.tag('div', {className: 'right'})
                )
            ),
            dom.tag('td', {},
                this.buttons.info.$node = dom.tag('div', {className: 'icon info'})
            )
        )
    ));

    this.init(config.data);

    self = this;

    this.parent.addListener('keydown', function ( event ) {
        switch ( event.code ) {
            case keys.f1:
                if ( typeof self.buttons.f1.action === 'function' && self.buttons.f1.visibility ) {
                    self.buttons.f1.action();
                }
                break;
            case keys.f2:
                if ( typeof self.buttons.f2.action === 'function' && self.buttons.f2.visibility ) {
                    self.buttons.f2.action();
                }
                break;
            case keys.f3:
                if ( typeof self.buttons.f3.action === 'function' && self.buttons.f3.visibility ) {
                    self.buttons.f3.action();
                }
                break;
            case keys.f4:
                if ( typeof self.buttons.f4.action === 'function' && self.buttons.f4.visibility ) {
                    self.buttons.f4.action();
                }
                break;
            case keys.menu:
                if ( typeof self.buttons.menu.action === 'function' && self.buttons.menu.visibility ) {
                    self.buttons.menu.action();
                }
                break;
            case keys.info:
                if ( self.$wrapper.classList.contains('hidden') ) {
                    self.$wrapper.classList.remove('hidden');
                } else {
                    self.$wrapper.classList.add('hidden');
                }
                break;
        }
    });
}


// inheritance
Footer.prototype = Object.create(Component.prototype);
Footer.prototype.constructor = Footer;


/**
 * Redefine buttons
 *
 * @param {Object} [config] buttons config
 * @param {Object} [config.f1] f1 button config, if false button will be hidden
 * @param {Object} [config.f1.title] f1 button title
 * @param {Object} [config.f1.action] f1 button press (click) action
 *
 * page.Footer.init({
 *            f1: false, // hide f1
 *            menu: true, // show menu
 *            info: true,
 *            f2: {title: 'start', action: function () {}},
 *            f4: {title: 'end'} // show f4 (if it was hidden) and set new title
 *    });
 */
Footer.prototype.init = function ( config ) {
    var item;

    config = config || {};

    for ( item in config ) {
        if ( config.hasOwnProperty(item) && this.buttons[item] !== undefined ) {
            if ( !!config[item] !== this.buttons[item].visibility ) {
                if ( this.buttons[item].visibility = !!config[item] ) {
                    this.buttons[item].$node.classList.remove('hidden');
                } else {
                    this.buttons[item].$node.classList.add('hidden');
                }
            }
            if ( config[item].action !== undefined ) {
                this.buttons[item].action = config[item].action;
                this.buttons[item].$node.onclick = config[item].action;
            }
            if ( item !== 'info' && item !== 'menu' ) {
                if ( config[item].title !== undefined && config[item].title !== this.buttons[item].$node.children[1].innerHTML ) {
                    this.buttons[item].$node.children[1].innerHTML = config[item].title;
                }
            }
        }
    }

    if ( !this.buttons.menu.visibility && !this.buttons.f1.visibility && !this.buttons.f2.visibility && !this.buttons.f3.visibility && !this.buttons.f4.visibility ) {
        this.hide();
    } else {
        this.show();
    }
};


// public
module.exports = Footer;
