/**
 * @module stb/ui/panelEx
 * @author Aleynikov Boris <alynikov.boris@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
    LayoutList = require('./layout.list');

/**
 * Extended panel implementation

 * @constructor
 * @extends Component
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 *
 * @example
 *
 * main = new Panel({
 *             title:'Some Panel',
 *             className:'aaa',
 *             size: 7,
 *             focusIndex: 0,
 *             data: [
 *                 {
 *                     items: [
 *                         {
 *                             className: 'star'
 *                         },
 *                         'Some text'
 *                     ],
 *                     click: function () {
 *                         // do something
 *                     }
 *                 },
 *                 {
 *                     items: [
 *                         'Hello world',
 *                         {
 *                             value: 'hi',
 *                             className: 'status'
 *                         }
 *                     ],
 *                     value:{
 *                         uri: 'http://55.55.55.55/some'
 *                     },
 *                     click: someHandler
 *                 }
 *             ]
 *         });
 */
function ModalList ( config ) {
    var self = this;

    config = config || {};
    config.visible = false;

    /**
     * Index in panel set
     *
     * @type {number}
     */
    this.index = 0;

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
        if ( config.title && typeof config.title !== 'string' ) { throw new Error(__filename + ': wrong  config.title'); }
    }

    // set default className if classList property empty or undefined
    config.className = 'ModalList panelEx ' + (config.className || '');

    config.$body = document.createElement('div');
    config.$body.className = 'body';

    // parent constructor call
    Component.call(this, config);

    // add title to panel
    if ( config.title ) {
        this.$title = document.createElement('div');
        this.$title.className = 'title';
        this.$title.innerText = config.title;
        this.$node.appendChild(this.$title);
    }

    this.$node.appendChild(this.$body);

    this.layoutList = new LayoutList({
        focusIndex: config.focusIndex || 0,
        data: config.data || [],
        size: config.size || null
    });

    this.add(this.layoutList);

    // add handler to focus inner layout
    this.addListener('show', function ( event ) {
        self.focus();
    });
}

// inheritance
ModalList.prototype = Object.create(Component.prototype);
ModalList.prototype.constructor = ModalList;


/**
 * Default events
 *
 * @type {{focus: Function}} try to focus first child component if it present
 */
ModalList.prototype.defaultEvents = {
    focus: function () {
        if ( this.children.length ) {
            this.children[0].focus();
        }
    }
};


/**
 * Redefine default component focus to set panel as active even when give focus to children components
 */
ModalList.prototype.focus = function () {
    Component.prototype.focus.call(this);
    this.$node.classList.add('active');
};


if ( DEBUG ) {
    // expose to the global scope
    window.ComponentModalList = ModalList;
}


// public
module.exports = ModalList;
