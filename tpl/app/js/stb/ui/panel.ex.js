/**
 * @module stb/ui/panelEx
 * @author Aleynikov Boris <alynikov.boris@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');

/**
 * Extended panel implementation

 * @constructor
 * @extends Component
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {boolean} [config.main=false] set panel as main
 * @param {boolean} [config.size=1] size of panel width
 *
 * @example
 *
 * main = new Panel({
 *            size: 1,
 *             title:'Left Panel',
 *             main:true,
 *             children:[
 *                 new List({
 *                     data:['1 bla', '2 bro', '3 car', '4 hoho', 'Search'],
 *                     size:5
 *                 })
 *             ]
 *         });
 */
function PanelEx ( config ) {
    var $overlay;

    config = config || {};

    /**
     * Size of panel
     *
     * @type {number}
     */
    this.size = 1;

    /**
     * Set panel as main
     *
     * @type {boolean}
     */
    this.main = false;

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
    config.className = 'panelEx ' + (config.className || '');

    config.$body = document.createElement('div');
    config.$body.className = 'body';

    // parent constructor call
    Component.call(this, config);

    // add special class to set component size
    if ( config.size ) {
        this.size = config.size;
        this.$node.classList.add('size' + config.size);
    }

    // add special class to set main panel
    if ( config.main ) {
        this.main = true;
        this.$node.classList.add('main');
    }

    // create elements to set as component shadow
    this.$shadow = {
        left:document.createElement('div'),
        right:document.createElement('div')
    };

    this.$shadow.left.className = 'shadow left';
    this.$node.appendChild(this.$shadow.left);

    this.$shadow.right.className = 'shadow right';
    this.$node.appendChild(this.$shadow.right);

    // add title to panel
    if ( config.title ) {
        this.$title = document.createElement('div');
        this.$title.className = 'title';
        this.$title.innerText = config.title;
        this.$node.appendChild(this.$title);
    }

    this.$node.appendChild(this.$body);

    $overlay = document.createElement('div');
    $overlay.className = 'overlay';
    this.$node.appendChild($overlay);
}

// inheritance
PanelEx.prototype = Object.create(Component.prototype);
PanelEx.prototype.constructor = PanelEx;


/**
 * Default events
 *
 * @type {{focus: Function}} try to focus first child component if it present
 */
PanelEx.prototype.defaultEvents = {
    focus : function () {
        if ( this.children.length ) {
            this.children[0].focus();
        }
    }
};


/**
 * Redefine default component focus to set panel as active even when give focus to children components
 */
PanelEx.prototype.focus = function () {
    this.parent.panels[this.parent.focusIndex].$node.classList.remove('active');
    this.parent.panels[this.parent.focusIndex].$node.classList.remove('top');
    Component.prototype.focus.call(this);
    this.parent.focusIndex = this.index;
    this.$node.classList.add('active');
    this.$node.classList.add('top');
    if ( this.index === 0 && this.parent.panels[1].main ) {
        this.parent.panels[1].$node.classList.remove('position-left');
        this.parent.panels[1].$node.classList.add('position-right');
        this.parent.panels[2].$node.classList.remove('expand');
        this.$node.classList.add('expand');

    } else if ( this.index === 2 && this.parent.panels[1].main ) {
        this.parent.panels[1].$node.classList.remove('position-right');
        this.parent.panels[1].$node.classList.add('position-left');
        this.parent.panels[0].$node.classList.remove('expand');
        this.$node.classList.add('expand');
    }

};

/**
 * Blur panel
 */
PanelEx.prototype.blur = function () {
    this.parent.panels[this.parent.focusIndex].$node.classList.remove('active');
    Component.prototype.blur.call(this);
};

if ( DEBUG ) {
    // expose to the global scope
    window.ComponentPanelEx = PanelEx;
}


// public
module.exports = PanelEx;
