/**
 * @module stb/ui/layout.list
 * @author Aleynikov Boris <alynikov.boris@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var List = require('./list'),
    Layout = require('./layout');

/**
 *  Layout list contains array of layout components
 *
 * @constructor
 * @extends List
 *
 * @param {object} config object
 * @param {Element} [config.noData=''] element or string to display if set empty data
 *
 * @example
 * var CheckList = require('../stb/ui/layout.list'),
 *     list = new LayoutList({
 *         propagate: true,
 *         size: 7,
 *         focusIndex: 0,
 *         noData: 'No channels'
 *         data: [
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
 *                 },
 *                 {
 *                     items: [
 *                         {
 *                             className: 'big',
 *                             value: ' Some'
 *                         },
 *                         {
 *                             value: new Input()
 *                         }
 *                     ]
 *                 },
 *                 {
 *                     items: [
 *                         new Button({value: 'Ok'}),
 *                         new Button({value: 'Cancel'}),
 *                         new Button({value: 'Exit'})
 *                     ]
 *                 }
 *             ]
 * });
 */
function LayoutList ( config ) {
    var self = this,
        $wrap;

    config = config || {};

    /**
     * Elements handlers
     */
    this.handlers = {};

    /**
     * No data placeholder
     *
     * @type {Element}
     */
    this.$noData = null;

    config.className = 'layoutList ' + (config.className || '');

    config.propagate = config.propagate || true;

    /**
     * Set data layout to be fixed to cache HTML elements
     *
     * @type {boolean|*}
     */
    this.fixedData = config.fixedData || false;

    //config.$body = document.createElement('div');

    config.$body = document.createElement('div');
    config.$body.className = 'body';

    this.$noData = document.createElement('div');
    this.$noData.className = 'noData hidden';

    List.call(this, config);

    this.$node.appendChild(this.$body);
    this.$node.appendChild(this.$noData);

    // add handler to focus inner layout
    this.addListener('click:item', function ( event ) {
        // focus inner layout of item
        if ( event.$item.layout.children.length && !event.inner ) {
            event.$item.layout.children[event.$item.layout.focusIndex].focus();
        }

        // only focus item if we click mouse
        if ( event.inner ) {
            self.focus();
            self.focusItem(event.$item);
        }
        // do click callback if it present
        if ( self.handlers[event.$item.index] ) {
            self.handlers[event.$item.index](event.$item);
        }
    });
}


LayoutList.prototype = Object.create(List.prototype);
LayoutList.prototype.constructor = LayoutList;

/*eslint id-length:0*/
/**
 * Default render function
 *
 * @param {Element} $item in list
 * @param {object} config to render layout element
 */
LayoutList.prototype.renderItemDefault = function ( $item, config ) {
    var layout, i;

    if ( $item.ready && this.fixedData && !$item.innerHTML.length ) {
        for ( i = 0; i < config.items.length; i++ ) {
            if ( typeof config.items[i].value === 'string' ) {
                $item.layout.$node.childNodes[i].innerText = config.items[i].value;
                $item.layout.$node.childNodes[i].className = config.items[i].className;
            }
        }
    } else {
        // clear inner content
        while ( $item.firstChild ) {
            $item.removeChild($item.firstChild);
        }

        layout = new Layout({
            focusable:false,
            data:config.items
        });

        $item.appendChild(layout.$node);
        $item.layout = layout;
        layout.parent = this;
        layout.$parentItem = $item;

        // focus layoutList if click on layout
        layout.addListener('click', function () {
            // add inner property to set that event comes from inner component
            this.parent.emit('click:item', {$item:$item, inner:true});
        });

        if ( config.click ) {
            this.handlers[$item.index] = config.click;
        }
        // item is rendered
        $item.ready = true;
    }
    $item.value = config.value || {};

};


LayoutList.prototype.setData = function ( config ) {
    List.prototype.setData.call(this, config);

    if ( config.data && config.data.length ) {
        this.$noData.classList.add('hidden');
    } else {
        this.$noData.classList.remove('hidden');
    }
};


LayoutList.prototype.init = function ( config ) {
    var $wrap;

    List.prototype.init.call(this, config);
    if ( config.noData ) {
        if ( DEBUG ) {
            if ( typeof config.noData !== 'string' && !(config.noData instanceof Element) ) { throw new Error(__filename + ': wrong config.$noData type'); }
        }
        this.$noData.innerHTML = '';
        if ( config.noData instanceof Element ) {
            this.$noData.appendChild(config.noData);
        } else if ( typeof config.noData === 'string' ) {
            $wrap = document.createElement('div');
            $wrap.innerText = config.noData;
            this.$noData.appendChild($wrap);
        }
    }
    if ( config.data && config.data.length ) {
        this.$noData.classList.add('hidden');
    } else {
        this.$noData.classList.remove('hidden');
    }


};

LayoutList.prototype.renderItem = LayoutList.prototype.renderItemDefault;


module.exports = LayoutList;
