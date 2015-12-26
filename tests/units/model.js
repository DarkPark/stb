/**
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* jshint undef:false */

// dependencies
var Model = require('model');


// declare named module
QUnit.module('model');


test('constructor', function testConstructor () {
    var m;

    m = new Model();
    strictEqual(typeof m.data, 'object', 'type');
    strictEqual(typeof m.events, 'object', 'type');
    strictEqual(m.data.constructor, Object, 'constructor type');
    strictEqual(Object.keys(m.data).length, 0, 'keys');

    m = new Model(null);
    strictEqual(m.data.constructor, Object, 'constructor type');
    strictEqual(Object.keys(m.data).length, 0, 'keys');

    m = new Model(undefined);
    strictEqual(m.data.constructor, Object, 'constructor type');
    strictEqual(Object.keys(m.data).length, 0, 'keys');

    m = new Model(123);
    strictEqual(m.data.constructor, Object, 'constructor type');
    strictEqual(Object.keys(m.data).length, 0, 'keys');

    m = new Model('qwe');
    strictEqual(m.data.constructor, Object, 'constructor type');
    strictEqual(Object.keys(m.data).length, 0, 'keys');

    m = new Model(true);
    strictEqual(m.data.constructor, Object, 'constructor type');
    strictEqual(Object.keys(m.data).length, 0, 'keys');

    m = new Model([]);
    strictEqual(m.data.constructor, Array, 'constructor type');
    strictEqual(Object.keys(m.data).length, 0, 'keys');

    m = new Model({a:1});
    strictEqual(m.data.constructor, Object, 'constructor type');
    strictEqual(Object.keys(m.data).length, 1, 'keys');
});


test('data', function testData () {
    var m;

    expect(16);

    m = new Model();
    strictEqual(m.init(), false, 'wrong param');
    strictEqual(m.init(''), false, 'wrong param');
    strictEqual(m.init('qwe'), false, 'wrong param');
    strictEqual(m.init(null), false, 'wrong param');
    strictEqual(m.init(undefined), false, 'wrong param');
    strictEqual(m.init(123), false, 'wrong param');
    strictEqual(m.init(12.3), false, 'wrong param');
    strictEqual(m.init(true), false, 'wrong param');
    strictEqual(m.init(false), false, 'wrong param');
    strictEqual(m.init(1,1,1,1), false, 'wrong param');
    strictEqual(m.init([]), true, 'wrong array param');

    strictEqual(m.init({}), true, 'normal param');

    m.init({a:1,b:2});
    propEqual(m.data, {a:1,b:2}, 'normal param');

    m.addListener('init', function ( event ) {
        propEqual(event.data, {a:123}, 'init event');
    });
    m.addListener('clear', function ( event ) {
        propEqual(event.data, {a:1,b:2}, 'clear event');
        propEqual(m.data, {}, 'clear event check');
    });
    m.init();
    m.init({a:123});
});


test('clear', function testClear () {
    var m;

    expect(5);

    m = new Model({a:1,b:2});
    propEqual(m.data, {a:1,b:2}, 'normal init');

    m.addListener('clear', function ( event ) {
        propEqual(event.data, {a:1,b:2}, 'clear event');
        propEqual(m.data, {}, 'clear event check');
    });
    ok(m.clear(), 'do clear');
    ok(!m.clear(), 'do clear again');
});


test('has', function testHas () {
    var m;

    m = new Model({a:1,b:2});
    propEqual(m.data, {a:1,b:2}, 'normal init');

    ok(m.has('a'), 'present');
    ok(m.has('b'), 'present');
    ok(!m.has('c'), 'not present');
    ok(!m.has(''), 'not present');
    ok(!m.has(null), 'not present');
    ok(!m.has(), 'not present');
    ok(!m.has(123), 'not present');
    ok(!m.has(undefined), 'not present');
    ok(!m.has(false), 'not present');
    ok(!m.has(true), 'not present');
    ok(!m.has([]), 'not present');
    ok(!m.has({}), 'not present');

    m.clear();
    ok(!m.has('a'), 'not present');
});


test('get', function testGet () {
    var m;

    m = new Model({a:1,b:2});
    propEqual(m.data, {a:1,b:2}, 'normal init');

    strictEqual(m.get('a'), 1, 'one attr');
    strictEqual(m.get('c'), undefined, 'missing attr');
    strictEqual(m.get(123), undefined, 'missing attr');
    strictEqual(m.get(null), undefined, 'missing attr');
    strictEqual(m.get(true), undefined, 'missing attr');
    strictEqual(m.get(false), undefined, 'missing attr');
    strictEqual(m.get(undefined), undefined, 'missing attr');
    strictEqual(m.get({}), undefined, 'missing attr');
    strictEqual(m.get([]), undefined, 'missing attr');
});


test('set', function testSet () {
    var m;

    expect(14);

    m = new Model();
    m.addListener('change', function ( event ) {
        strictEqual(event.name, 'a', 'create: name');
        strictEqual('prev' in event, false, 'create: prev');
        strictEqual('curr' in event, true, 'create: curr');
        strictEqual(event.curr, 123, 'create: curr data');
    });
    ok(m.set('a', 123), 'set operation');
    propEqual(m.data, {a:123}, 'check');

    m = new Model({a:0});
    m.addListener('change', function ( event ) {
        strictEqual(event.name, 'a', 'update: name');
        strictEqual('prev' in event, true, 'update: prev');
        strictEqual('curr' in event, true, 'update: curr');
        strictEqual(event.curr, 222, 'update: curr data');
    });
    ok(m.set('a', 222), 'set operation');
    propEqual(m.data, {a:222}, 'check');

    m = new Model({a:0});
    m.addListener('change', function () {
        ok(false, 'should not be called');
    });
    ok(!m.set('a', 0), 'set operation');
    propEqual(m.data, {a:0}, 'check');
});


test('unset', function testUnset () {
    var m;

    expect(11);

    m = new Model();
    propEqual(m.data, {}, 'normal init');
    m.addListener('change', function () {
        ok(false, 'should not be called');
    });
    ok(!m.unset('qwe'), 'nothing to remove');

    m = new Model({a:1,b:2});
    propEqual(m.data, {a:1,b:2}, 'normal init');

    m.addListener('change', function ( event ) {
        strictEqual(event.name, 'a', 'removal: name');
        strictEqual('prev' in event, true, 'removal: prev');
        strictEqual('curr' in event, false, 'removal: curr');
        strictEqual(event.prev, 1, 'removal: prev data');
        propEqual(m.data, {b:2}, 'result');
    });
    ok(m.unset('a'), 'do removal');
    ok(!m.unset('a'), 'do removal again');
    ok(!m.unset('qwe'), 'nothing to remove');
});
