/**
 * @module stb/ui/scroll.area
 * @author Aleynikov Boris <alynikov.boris@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
    app       = require('../app'),
    keys      = require('../keys');

/**
 * Scroll area implementation
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} config object
 * @param {number} [config.step] step in % of screen height to scroll area
 *
 * @example
 * var ScrollArea = require('../stb/ui/scroll.area'),
 *     textArea = new ScrollArea({
 *         step: 5
 *         });
 *
 * textArea.$body.innerText = 'Some long long long text to scroll..........';
 * textArea.init();
 *
 */
function ScrollArea ( config ) {

    config = config || {};

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
    }

    config.className = ' scrollArea ' + (config.className || '');

    config.$body = document.createElement('div');
    config.$body.className = 'body';

    /**
     * Step to scroll area in % of screen height
     *
     * @type {number}
     */
    this.step = 5;

    /**
     * Real height of scroll area
     *
     * @type {number}
     */
    this.realHeight = 0;

    /**
     * Visible height of area
     *
     * @type {number}
     */
    this.viewHeight = 0;

    /**
     * Top position of scroll container
     *
     * @type {number}
     */
    this.topPosition = 0;

    /**
     * Associated ScrollBar component link.
     *
     * @type {ScrollBar}
     */
    this.scroll = null;

    Component.call(this, config);


    this.$node.appendChild(this.$body);

    // component setup
    this.init(config);
}


ScrollArea.prototype = Object.create(Component.prototype);
ScrollArea.prototype.constructor = ScrollArea;


/**
 * List of all default event callbacks.
 *
 * @type {Object.<string, function>}
 */
ScrollArea.prototype.defaultEvents = {
    /**
     * Default method to handle keyboard keydown events.
     *
     * @param {Event} event generated event
     */
    keydown: function ( event ) {
        switch ( event.code ) {
            case keys.up:
            case keys.down:
                this.move(event.code);
                break;
        }
    }
};


/**
 * Attempt to go beyond the edge of the list.
 *
 * @event
 *
 * @type {Object}
 * @property {number} direction key code initiator of movement
 */

/**
 * Move ScrollArea content
 *
 * @param {number} direction to move
 */
ScrollArea.prototype.move = function ( direction ) {
    switch ( direction ) {
        case keys.down:
            if ( this.topPosition - this.step * app.data.metrics.height / 100 < this.viewHeight - this.realHeight ) {
                this.topPosition = this.viewHeight - this.realHeight;
                this.$body.style.top =  this.topPosition + 'px';
                this.emit('overflow', {direction: direction});
                if ( this.scroll ) {
                    this.scroll.scrollTo(-this.topPosition);
                }
                return;
            }

            this.topPosition -= this.step * app.data.metrics.height / 100;

            if ( this.scroll ) {
                this.scroll.scrollTo(-this.topPosition);
            }
            this.$body.style.top =  this.topPosition + 'px';
            break;
        case keys.up:
            if ( this.topPosition + this.step * app.data.metrics.height / 100 > 0 ) {
                this.topPosition = 0;
                this.$body.style.top =  this.topPosition + 'px';
                this.emit('overflow', {direction: direction});
                if ( this.scroll ) {
                    this.scroll.scrollTo(-this.topPosition);
                }
                return;
            }
            this.topPosition += this.step * app.data.metrics.height / 100;

            if ( this.scroll ) {
                this.scroll.scrollTo(-this.topPosition);
            }
            this.$body.style.top =  this.topPosition + 'px';
            break;
    }
};

/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} config init parameters (subset of constructor config params)
 */
ScrollArea.prototype.init = function ( config ) {

    config = config || {};

    this.realHeight = this.$body.offsetHeight;
    this.viewHeight = this.$node.offsetHeight;
    this.topPosition = 0;

    if ( config.scroll ) {
        this.scroll = config.scroll;
    }

    if ( config.step ) {
        this.step = config.step;
    }

    if ( this.scroll ) {
        this.scroll.init({
            realSize: this.realHeight,
            viewSize: this.viewHeight
        });
    }
};

module.exports = ScrollArea;
