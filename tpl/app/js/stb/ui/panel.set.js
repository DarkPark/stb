/**
 * @module stb/ui/panel.set
 * @author Aleynikov Boris <alynikov.boris@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
    keys      = require('../keys');

/**
 * Magsdk panel set implementation
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {array} [config.panels] array of panels to use
 * @param {array} [config.focusIndex=0] focus panel index
 * @constructor
 * @extends Component
 */
function PanelSet ( config ) {
    var self = this,
        i;

    config = config || {};

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
        if ( config.panels && !Array.isArray(config.panels) || !config.panels.length       ) { throw new Error(__filename + ': wrong config.panels type'); }
    }


    // can't accept focus
    config.focusable = config.focusable || false;

    // set default className if classList property empty or undefined
    config.className = 'panelSet ' + (config.className || '');

    // parent constructor call
    Component.call(this, config);

    this.panels = config.panels;

    /**
     * Index of current active panel
     *
     * @type {number}
     */
    this.focusIndex = 0;

    // set special panels classes
    if ( config.panels && !config.panels[0].main ) {
        config.panels[0].$node.classList.add('left');
    }

    if ( config.panels && config.panels[2] && config.panels[1].main ) {
        config.panels[2].$node.classList.add('right');
    }

    // add panels
    if ( config.panels ) {
        this.add.apply(this, config.panels);
    }


    // add special listener
    for ( i = 0; i < this.panels.length; i++ ) {
        this.panels[i].addListeners({
            keydown: keydownHandler
        });
        // set panels indexes
        this.panels[i].index = i;
    }


    // panel keydown handler to set focus panel
    function keydownHandler ( e ) {
        switch ( e.code ) {
            case keys.left:
                if ( self.focusIndex > 0 ) {
                    self.panels[self.focusIndex - 1].focus();
                }
                break;
            case keys.right:
                if ( self.focusIndex < self.panels.length - 1 ) {
                    self.panels[self.focusIndex + 1].focus();
                }
                break;
        }
    }

    /*if ( config.focusIndex && config.focusIndex < this.panels.length ) {
     this.panels[config.focusIndex].focus();
     } else {
     if ( config.panels.length > 1 ) {
     this.panels[1].focus();
     } else {
     this.panels[0].focus();
     }
     }*/
}

PanelSet.prototype = Object.create(Component.prototype);
PanelSet.prototype.constructor = PanelSet;


/**
 * Draw panels shadow after adding to DOM
 */
PanelSet.prototype.drawShadow = function  () {
    var i, height, top;


    for ( i = 0; i < this.panels.length; i++ ) {
        if ( i > 0 ) {
            this.panels[i].$node.classList.add('leftShadow');
            height = this.panels[i - 1].$node.offsetHeight;
            top = this.panels[i - 1].$node.offsetTop - this.panels[i].$node.offsetTop;
            if ( this.panels[i].$node.offsetHeight > height ) {
                this.panels[i].$shadow.left.style.height = this.panels[i - 1].$node.offsetHeight + 'px';
                this.panels[i].$shadow.left.style.top = top + 'px';
            } else {
                this.panels[i].$shadow.left.style.height = this.panels[i].$node.offsetHeight + 'px';
            }

        }

        if ( i < this.panels.length - 1 ) {
            this.panels[i].$node.classList.add('rightShadow');

            height = this.panels[i + 1].$node.offsetHeight;
            top = this.panels[i + 1].$node.offsetTop - this.panels[i].$node.offsetTop;

            if ( this.panels[i].$node.offsetHeight > height ) {
                this.panels[i].$shadow.right.style.height = this.panels[i - 1].$node.offsetHeight + 'px';
                this.panels[i].$shadow.right.style.top = top + 'px';
            } else {
                this.panels[i].$shadow.right.style.height = this.panels[i].$node.offsetHeight + 'px';
            }
        }
    }
};

/**
 *
 */
PanelSet.prototype.focus = function () {
    Component.prototype.focus.call(this);
    this.panels[this.focusIndex].focus();
};

/**
 *
 */
PanelSet.prototype.blur = function () {
    this.panels[this.focusIndex].blur();
};

module.exports = PanelSet;
