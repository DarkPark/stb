/**
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* jshint undef:false */

// dependencies
var dom = require('dom');


// declare named module
QUnit.module('dom');


test('tag', function testTag () {
    var a, t;

    a = dom.tag('');
    strictEqual(a, null, 'empty element');

    a = dom.tag('qwe');
    strictEqual(a.tagName, 'QWE', 'not existing element');

    a = dom.tag('a');
    strictEqual(a.tagName, 'A', 'link element');
    strictEqual(a instanceof HTMLAnchorElement, true, 'link element type');
    strictEqual(a instanceof Node, true, 'link element type');

    a = dom.tag('a', {className:'bold'});
    strictEqual(a.className, 'bold', 'link element class');

    a = dom.tag('a', {data:123});
    strictEqual(a.data, 123, 'link element custom attribute data');
    strictEqual(a.outerHTML, '<a></a>', 'link element custom attribute html');

    a = dom.tag('a', {className:'bold'}, 'some text');
    strictEqual(a.outerHTML, '<a class="bold">some text</a>', 'link element outer html');

    a = dom.tag('a', {}, '');
    strictEqual(a.innerHTML, '', 'link element empty html');

    a = dom.tag('a', {}, '', '', '', null, undefined, false);
    strictEqual(a.innerHTML, '', 'link element empty complex html');

    a = dom.tag('a', {}, 'qwe');
    strictEqual(a.innerHTML, 'qwe', 'link element html');

    a = dom.tag('a', {}, 'qwe', 'rty');
    strictEqual(a.children.length, 0, 'text sub-elements nodes');
    strictEqual(a.childNodes.length, 2, 'text sub-elements texts');
    strictEqual(a.innerHTML, 'qwerty', 'link element html');

    a = dom.tag('a', {}, dom.tag('div', {}, 'qwe'));
    strictEqual(a.innerHTML, '<div>qwe</div>', 'link nested element');
    strictEqual(a.children.length, 1, 'link nested element size');

    a = dom.tag('a', {}, dom.tag('div'), dom.tag('div'), dom.tag('div'));
    strictEqual(a.innerHTML, '<div></div><div></div><div></div>', 'nested element list');
    strictEqual(a.children.length, 3, 'nested element list size');

    a = dom.tag('a', {}, dom.tag('div', {}, dom.tag('div', {}, dom.tag('div'))));
    strictEqual(a.innerHTML, '<div><div><div></div></div></div>', 'nested elements');

    t = dom.tag('table', {},
        dom.tag('tr', {},
            dom.tag('td', {}, 1),
            dom.tag('td', {}, 2)
        ),
        dom.tag('tr', {},
            dom.tag('td', {colSpan:2}, 12)
        )
    );
    strictEqual(t.rows.length, 2, 'table element rows');
    strictEqual(t.rows[1].cells.length, 1, 'table element cells');
    strictEqual(t.rows[1].cells[0].colSpan, 2, 'table element colls');
});


test('fragment', function testFragment () {
    var f;

    f = dom.fragment();
    strictEqual(f instanceof DocumentFragment, true, 'empty fragment');
    strictEqual(f.hasChildNodes(), false, 'empty fragment');

    f = dom.fragment('', null, undefined, false);
    strictEqual(f.childNodes.length, 0, 'fragment with 4 items');

    f = dom.fragment('text');
    strictEqual(f.childNodes.length, 1, 'fragment with 1 text item');

    f = dom.fragment(dom.tag('div'));
    strictEqual(f.childNodes.length, 1, 'fragment with 1 node item');

    var el0 = '1',
        el1 = 'abc',
        el2 = dom.tag('div'),
        el3 = dom.tag('a', {className:'bold'}, 'some text');
    f = dom.fragment(el0, el1, el2, el3);
    strictEqual(f.childNodes.length, 4, 'fragment with 4 items');
    strictEqual(f.childNodes[0].nodeValue, el0, 'fragment with 4 items');
    strictEqual(f.childNodes[1].nodeValue, el1, 'fragment with 4 items');
    strictEqual(f.childNodes[2], el2, 'fragment with 4 items');
    strictEqual(f.childNodes[3], el3, 'fragment with 4 items');
});


test('add', function testAdd () {
    var a, d;

    strictEqual(dom.add(),        null, 'empty addition');
    strictEqual(dom.add(''),      null, 'empty addition');
    strictEqual(dom.add('123'),   null, 'empty addition');
    strictEqual(dom.add(null),    null, 'empty addition');
    strictEqual(dom.add(false),   null, 'empty addition');
    strictEqual(dom.add(true),    null, 'empty addition');
    strictEqual(dom.add(123),     null, 'empty addition');
    strictEqual(dom.add([1,2,3]), null, 'empty addition');

    a = dom.add(dom.tag('div'));
    strictEqual(a.nodeName, 'DIV', 'no addition but creation');
    strictEqual(a.childNodes.length, 0, 'no addition but creation');

    a = dom.add(dom.tag('div'), dom.tag('a'));
    strictEqual(a.childNodes.length, 1, 'addition and creation');
    strictEqual(a.firstChild.nodeName, 'A', 'addition and creation');

    var el0 = '1',
        el1 = 'abc',
        el2 = dom.tag('div'),
        el3 = dom.tag('a', {className:'bold'}, 'some text');
    d = dom.tag('div');
    a = dom.add(d, el0, el1, el2, el3);
    strictEqual(a.childNodes.length, 4, 'element list addition');
    strictEqual(a.innerHTML, '1abc<div></div><a class="bold">some text</a>', 'element list addition');
});


test('remove', function testRemove () {
    var d1, d2, d3;

    strictEqual(dom.remove(),     false, 'empty');
    strictEqual(dom.remove(null), false, 'null');
    strictEqual(dom.remove(true), false, 'boolean');
    strictEqual(dom.remove(''),   false, 'string');
    strictEqual(dom.remove({}),   false, 'object');
    strictEqual(dom.remove(34),   false, 'number');
    strictEqual(dom.remove([]),   false, 'array');

    d1 = dom.tag('div', {}, 'qwe1');
    d2 = dom.tag('div', {}, 'qwe2');
    d3 = dom.tag('div', {}, 'qwe3');
    dom.add(document.body, d1, d2, d3);
    strictEqual(dom.remove(d1), true, 'simple node');
    strictEqual(dom.remove(d2, d3), true, 'two nodes');
    strictEqual(dom.remove(d1), false, 'already removed node');

    d1 = dom.tag('div', {}, 'qwe1');
    strictEqual(dom.remove(d1), false, 'detached element');
});
