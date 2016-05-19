/**
 * @module stb/ui/footer
 // @author Fedotov <d.fedotov@infomir.com>
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
 * @param {Array} [config.data] buttons config
 * @param {Object} [config.data.type] button type
 * @param {string} [config.data.title] button title
 * @param {Function} [config.data.action] button press (click) action
 *
 * @example
 * page.footer = new Footer({
 *        parent: page,
 *        data: [
 *            {type: 'info'},
 *            {type: 'menu', action: function () {}},
 *            {type: 'f1', title: 'stop', action: function () {}},
 *            {type: 'f2', title: 'start', action: function () {}},
 *            {type: 'f4', title: 'end', action: function () {}}
 *        ]
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

    this.tabs = [];

    this.tab = 0;

    this.$node.appendChild(dom.tag('table', {},
        dom.tag('tr', {},
            dom.tag('td', {},
                dom.tag('div', {className: 'icon menu'})
            ),
            dom.tag('td', {className: 'central'},
                this.tabs[0] = dom.tag('div', {className: 'wrapper hidden'},
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'}))
                ),
                this.tabs[1] = dom.tag('div', {className: 'wrapper hidden'},
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'}))
                ),
                this.tabs[2] = dom.tag('div', {className: 'wrapper hidden'},
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'}))
                ),
                this.tabs[3] = dom.tag('div', {className: 'wrapper hidden'},
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'}))
                )
            ),
            dom.tag('td', {},
                this.$info = dom.tag('div', {className: 'icon info'})
            )
        )
    ));

    this.init(config.data);

    self = this;

    this.parent.addListener('keydown', function ( event ) {
        var currTab = self.tabs[self.tab];

        switch ( event.code ) {
            case keys.f1:
                if ( currTab.f1 && typeof currTab.f1.action === 'function' ) { currTab.f1.action(); }
                break;
            case keys.f2:
                if ( currTab.f2 && typeof currTab.f2.action === 'function' ) { currTab.f2.action(); }
                break;
            case keys.f3:
                if ( currTab.f3 && typeof currTab.f3.action === 'function' ) { currTab.f3.action(); }
                break;
            case keys.f4:
                if ( currTab.f4 && typeof currTab.f4.action === 'function' ) { currTab.f4.action(); }
                break;
            case keys.menu:
                if ( currTab.menu && typeof currTab.menu.action === 'function' ) { currTab.menu.action(); }
                break;
            case keys.info:
                if ( currTab.classList.contains('hidden') ) {
                    currTab.classList.remove('hidden');
                } else {
                    currTab.classList.add('hidden');
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
 * @param {Array} [config] buttons config
 * @param {Object} [config.type] f1 button config, if false button will be hidden
 * @param {Object} [config.title] f1 button title
 * @param {Object} [config.action] f1 button press (click) action
 *
 * @example
 * page.Footer.init([
 *            {type: 'info'},
 *            {type: 'menu', action: function () {}},
 *            {type: 'f1', title: 'stop', action: function () {}},
 *            {type: 'f2', title: 'start', action: function () {}},
 *            {type: 'f4', title: 'end', action: function () {}}
 *    ]);
 */
Footer.prototype.init = function ( config ) {
    var visible = !this.tabs[this.tab].classList.contains('hidden'),
        tab = 0,
        i;

    config = config || [];
    this.tabs[this.tab].classList.add('hidden');
    this.$info.classList.add('hidden');
    config.forEach(function ( item ) { if ( ['f1', 'f2', 'f3', 'f4'].indexOf(item.type) !== -1 ) { tab++; } });
    this.tab = tab === 0 ? 0 : tab - 1;
    tab = 0;

    for ( i = 0; i < config.length; i++ ) {
        if ( DEBUG ) {
            if ( ['f1', 'f2', 'f3', 'f4', 'menu', 'info'].indexOf(config[i].type) === -1 ) {
                throw new Error(__filename + ': allowed footer buttons are: f1, f2, f3, f4, menu, info');
            }
        }
        if ( config[i].type === 'info' ) {
            this.$info.classList.remove('hidden'); // info button has only visibility flag
            continue;
        }
        this.tabs[this.tab][config[i].type] = {action: config[i].action};
        if ( config[i].type === 'menu' ) { continue; } // menu button has only action
        this.tabs[this.tab].children[tab].children[0].className = 'iconImg ' + config[i].type;
        this.tabs[this.tab].children[tab].children[1].innerText = config[i].title;
        tab++;
    }
    if ( visible ) { this.tabs[this.tab].classList.remove('hidden'); }
};


// public
module.exports = Footer;
