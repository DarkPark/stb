/**
 * HTML elements low-level handling.
 *
 * @module stb/dom
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint no-unused-vars: 0 */

/**
 * DOM manipulation module
 */
var dom = {};


/**
 * Create a new HTML element.
 *
 * @param {string} tagName mandatory tag name
 * @param {Object|null} [attrList] element attributes
 * @param {...*} [content] element content (primitive value/values or other nodes)
 * @return {Node|null} HTML element or null on failure
 *
 * @example
 * dom.tag('table');
 * dom.tag('div', {}, 'some text');
 * dom.tag('div', {className:'top'}, dom.tag('span'), dom.tag('br'));
 * dom.tag('link', {rel:'stylesheet', type:'text/css', href:'http://some.url/'});
 */
dom.tag = function ( tagName, attrList, content ) {
    var node = null,
        i, name;

    // minimal param is given
    if ( tagName ) {
        // empty element
        node = document.createElement(tagName);

        // optional attribute list is given
        if ( attrList && typeof attrList === 'object' ) {
            for ( name in attrList ) {
                // extend a new node with the given attributes
                node[name] = attrList[name];
            }
        }

        // content (arguments except the first two)
        for ( i = 2; i < arguments.length; i++ ) {
            // some data is given
            if ( arguments[i] ) {
                // regular HTML tag or plain data
                node.appendChild(
                    typeof arguments[i] === 'object' ?
                    arguments[i] :
                    document.createTextNode(arguments[i])
                );
            }
        }

    }

    return node;
};


/**
 * Create a new DocumentFragment filled with the given non-empty elements if any.
 *
 * @param {...*} [node] fragment content (primitive value/values or other nodes)
 * @return {DocumentFragment} new placeholder
 *
 * @example
 * // gives an empty fragment element
 * dom.fragment();
 * // gives a fragment element with 3 div element inside
 * dom.fragment(dom.tag('div'), div2, div3);
 * // mixed case
 * dom.fragment('some text', 123, div3);
 */
dom.fragment = function ( node ) {
    // prepare placeholder
    var i, fragment = document.createDocumentFragment();

    // walk through all the given elements
    for ( i = 0; i < arguments.length; i++ ) {
        node = arguments[i];
        // some data is given
        if ( node ) {
            // regular HTML tag or plain data
            fragment.appendChild(typeof node === 'object' ? node : document.createTextNode(node));
        }
    }

    return fragment;
};


/**
 * Add the given non-empty data (HTML element/text or list) to the destination element.
 *
 * @param {Node} tagDst element to receive children
 * @param {...*} [content] element content (primitive value/values or other nodes)
 * @return {Node|null} the destination element - owner of all added data
 *
 * @example
 * // simple text value
 * add(some_div, 'Hello world');
 * // single DOM Element
 * add(some_div, some_other_div);
 * // DOM Element list
 * add(some_div, div1, div2, div3);
 * // mixed case
 * add(some_div, div1, 'hello', 'world');
 */
dom.add = function ( tagDst, content ) {
    var i;

    // valid HTML tag as the destination
    if ( tagDst instanceof Node ) {
        // append all except the first one
        for ( i = 1; i < arguments.length; i++ ) {
            // some data is given
            if ( arguments[i] ) {
                // regular HTML tag or plain data
                tagDst.appendChild(
                    typeof arguments[i] === 'object' ?
                    arguments[i] :
                    document.createTextNode(arguments[i])
                );
            }
        }
        return tagDst;
    }

    return null;
};


/**
 * Remove the given elements from the DOM.
 *
 * @param {...Node} [nodes] element to be removed
 * @return {boolean} operation status (true - all given elements removed)
 *
 * @example
 * dom.remove(document.querySelector('div.test'));
 * dom.remove(div1, div2, div3);
 */
dom.remove = function ( nodes ) {
    var count = 0,  // amount of successfully removed nodes
        i;

    // walk through all the given elements
    for ( i = 0; i < arguments.length; i++ ) {
        // valid non-empty tag
        if ( arguments[i] && arguments[i].parentNode ) {
            if ( arguments[i].parentNode.removeChild(arguments[i]) === arguments[i] ) {
                count++;
            }
        }
    }

    return arguments.length > 0 && count === arguments.length;
};


if ( DEBUG ) {
    // expose to the global scope
    window.dom = dom;
}


// public
module.exports = dom;
