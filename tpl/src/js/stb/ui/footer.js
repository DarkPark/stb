/**
 * @module stb/ui/footer
 // @author Fedotov <d.fedotov@infomir.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
    Page = require('./page'),
    keys = require('../keys'),
    dom = require('../dom'),
    classes = {
        '8': 'back',
        '46': 'delete',
        '1009': 'channelPrev',
        '9': 'channelNext',
        '13': 'ok',
        '27': 'exit',
        '38': 'up',
        '40'  : 'down',
        '37'  : 'left',
        '39'  : 'right',
        '33'  : 'pageUp',
        '34'  : 'pageDown',
        '35'  : 'end',
        '36'  : 'home',
        '107' : 'volumeUp',
        '109' : 'volumeDown',
        '108' : 'f1',
        '20' : 'f2',
        '21' : 'f3',
        '22' : 'f4',
        '116' : 'refresh',
        '117' : 'frame',
        '119' : 'phone',
        '120' : 'set',
        '121' : 'tv',
        '122' : 'menu',
        '123' : 'web',
        '2032': 'mic',
        '2066': 'rewind',
        '2070': 'forward',
        '2076': 'app',
        '2080': 'usbMounted',
        '2081': 'usbUnmounted',
        '71': 'playPause',
        '2083': 'stop',
        '2085': 'power',
        '2087': 'record',
        '2089': 'info',
        '2192': 'mute',
        '2071': 'audio'
    };


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
 *     parent: page,
 *     data: [
 *         {code: 122, action: function () {}},
 *         {code: 112, title: 'stop', action: function () {}},
 *         {code: 113, title: 'start', action: function () {}},
 *         {code: 115, title: 'end', action: function () {}}
 *     ]
 * });
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

    this.tabs = [
        {$body: null, codes: {}}, {$body: null, codes: {}}, {$body: null, codes: {}}, {$body: null, codes: {}}
    ];

    this.tab = 0;

    this.$node.appendChild(dom.tag('table', {},
        dom.tag('tr', {},
            dom.tag('td', {},
                this.$menu = dom.tag('div', {className: 'icon menu'})
            ),
            dom.tag('td', {className: 'central'},
                this.tabs[0].$body = dom.tag('div', {className: 'wrapper hidden'},
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'}))
                ),
                this.tabs[1].$body = dom.tag('div', {className: 'wrapper hidden'},
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'}))
                ),
                this.tabs[2].$body = dom.tag('div', {className: 'wrapper hidden'},
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'}))
                ),
                this.tabs[3].$body = dom.tag('div', {className: 'wrapper hidden'},
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'})),
                    dom.tag('div', {className: 'button'}, dom.tag('div', {className: 'iconImg'}), dom.tag('div', {className: 'title'}))
                )
            ),
            dom.tag('td', {}//,
                //this.$info = dom.tag('div', {className: 'icon info'})
            )
        )
    ));

    this.init(config.data);

    self = this;

    this.parent.addListener('keydown', function ( event ) {
        var currTab = self.tabs[self.tab];

        if ( self.visible ) {
            if ( currTab.codes[event.code] && typeof currTab.codes[event.code].action === 'function' ) {
                currTab.codes[event.code].action();
            }
            //            if ( event.code === keys.info && self.$info.style.display !== 'none' ) {
            //                if ( currTab.$body.classList.contains('hidden') ) {
            //                    currTab.$body.classList.remove('hidden');
            //                } else {
            //                    currTab.$body.classList.add('hidden');
            //                }
            //            }
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
 *     {code: 122, action: function () {}},
 *     {code: 112, title: 'stop', action: function () {}},
 *     {code: 113, title: 'start', action: function () {}},
 *     {code: 115, title: 'end', action: function () {}}
 * ]);
 */
Footer.prototype.init = function ( config ) {
    var tab = 1,
        //visible = !this.tabs[this.tab].$body.classList.contains('hidden'),
        i;

    config = config || [];

    this.tabs[this.tab].$body.classList.add('hidden');
    this.$menu.style.visibility = 'hidden';

    for ( i = 0; i < config.length; i++ ) {
        if ( config[i].code === keys.menu ) {
            tab++;
            break;
        }
    }
    if ( DEBUG ) {
        if ( config.length - tab > 3 ) { throw new Error(__filename + ': only 4 buttons allowed in footer'); }
    }
    this.tab = config.length - tab >= 0 ? config.length - tab : 0;
    this.tabs[this.tab].codes = {}; // reset actions
    tab = 0;

    for ( i = 0; i < config.length; i++ ) {
        this.tabs[this.tab].codes[config[i].code] = {action: config[i].action};
        if ( config[i].code === keys.menu ) { // menu button has only action
            this.$menu.style.visibility = 'inherit';
            continue;
        }
        this.tabs[this.tab].$body.children[tab].children[0].className = 'iconImg ' + (classes[config[i].code] || '');
        this.tabs[this.tab].$body.children[tab].children[1].innerText = config[i].title;
        tab++;
    }
    //    if ( tab ) {
    //        this.$info.style.visibility = 'inherit';
    //    } else {
    //        this.$info.style.visibility = 'hidden';
    //    }
    if ( /*visible &&*/ tab ) { this.tabs[this.tab].$body.classList.remove('hidden'); }
};


// public
module.exports = Footer;
