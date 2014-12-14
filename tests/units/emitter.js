/**
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* jshint undef:false */

// dependencies
var Emitter = require('emitter');


// declare named module
QUnit.module('emitter');


test('constructor', function testConstructor () {
	var em;

	em = new Emitter();
	strictEqual(typeof em.events, 'object', 'type');
	strictEqual(em.events.constructor, Object, 'constructor type');
	strictEqual(Object.keys(em.events).length, 0, 'keys');
});


test('addListener', function testAddListener () {
	var f1 = function () {},
		f2 = function () {},
		em;

	em = new Emitter();
	em.addListener();
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');
	em.addListener('click');
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');
	em.addListener('click', 123);
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em = new Emitter();
	em.addListener('click', f1);
	strictEqual(Object.keys(em.events).length, 1, 'one event');
	strictEqual(Array.isArray(em.events.click), true, 'event list type');
	strictEqual(em.events.click.length, 1, 'callbacks amount');
	strictEqual(typeof em.events.click[0], 'function', 'new callback type');
	strictEqual(em.events.click[0], f1, 'new callback link');

	em.addListener('click', f2);
	strictEqual(em.events.click.length, 2, 'callbacks amount');
	strictEqual(typeof em.events.click[1], 'function', 'new callback type 2');
	strictEqual(em.events.click[1], f2, 'new callback link 2');

	em = new Emitter();
	em.addListener('click', f1);
	em.addListener('click', f1);
	em.addListener('click', f1);
	strictEqual(em.events.click.length, 3, 'callbacks duplicates');
});


test('addListeners', function testAddListeners () {
	var f1 = function () {},
		f2 = function () {},
		em;

	em = new Emitter();
	em.addListeners();
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners([]);
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners('');
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners(true);
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners(false);
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners(undefined);
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners({});
	strictEqual(Object.keys(em.events).length, 0, 'empty add');

	em.addListeners({click:123});
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners({click:[]});
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners({click:false});
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners({click:null});
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners({click:undefined});
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners({click:'123'});
	strictEqual(Object.keys(em.events).length, 0, 'wrong add');

	em.addListeners({click:f1});
	strictEqual(Object.keys(em.events).length, 1, 'normal add');
	strictEqual(em.events.click.length, 1, 'callbacks amount');

	em.addListeners({click:f1});
	strictEqual(Object.keys(em.events).length, 1, 'double add');
	strictEqual(em.events.click.length, 2, 'callbacks amount');

	em = new Emitter();
	em.addListeners({click:f1, close:f2, ok:f1});
	strictEqual(Object.keys(em.events).length, 3, 'double add');
	strictEqual(em.events.click.length, 1, 'callbacks amount');
	strictEqual(em.events.close.length, 1, 'callbacks amount');
	strictEqual(em.events.ok.length, 1, 'callbacks amount');
	strictEqual(em.events.click[0], f1, 'callback link');
	strictEqual(em.events.close[0], f2, 'callback link');
	strictEqual(em.events.ok[0], f1, 'callback link');
});


test('removeListener', function testRemoveListener () {
	var f1 = function () {},
		f2 = function () {},
		f3 = function () {},
		em;

	em = new Emitter();
	em.addListeners({click:f1, close:f2, ok:f1});
	strictEqual(Object.keys(em.events).length, 3, 'add 3 events');

	em.removeListener('click', f2);
	strictEqual(Object.keys(em.events).length, 3, 'wrong removal');
	strictEqual(em.events.click.length, 1, 'callbacks amount');

	em.removeListener('click', f3);
	strictEqual(Object.keys(em.events).length, 3, 'wrong removal');
	strictEqual(em.events.click.length, 1, 'callbacks amount');

	em.removeListener('click', f1);
	strictEqual(Object.keys(em.events).length, 2, 'normal removal');
	strictEqual(em.events.click, undefined, 'no event name');

	em = new Emitter();
	em.addListener('click', f1);
	em.addListener('click', f1);
	em.addListener('click', f1);
	strictEqual(em.events.click.length, 3, 'callbacks duplicates');
	em.removeListener('click', f1);
	strictEqual(em.events.click, undefined, 'callbacks duplicates');
	em.removeListener('click', f1);
	strictEqual(em.events.click, undefined, 'double removal');
});


test('removeAllListeners', function testRemoveAllListeners () {
	var f1 = function () {},
		f2 = function () {},
		em;

	em = new Emitter();
	em.addListener('click', f1);
	em.addListener('click', f2);
	strictEqual(em.events.click.length, 2, 'init');
	em.removeAllListeners('click');
	strictEqual(em.events.click, undefined, 'removal');

	em = new Emitter();
	em.addListener('click', f1);
	em.addListener('click', f2);
	em.addListener('close', f1);
	em.addListener('close', f2);
	strictEqual(em.events.click.length, 2, 'init');
	strictEqual(em.events.close.length, 2, 'init');
	em.removeAllListeners('click');
	em.removeAllListeners('close');
	strictEqual(em.events.click, undefined, 'removal');
	strictEqual(em.events.close, undefined, 'removal');
	em.removeAllListeners('click');
	em.removeAllListeners('close');
	strictEqual(em.events.click, undefined, 'double removal');
	strictEqual(em.events.close, undefined, 'double removal');

	em = new Emitter();
	em.addListener('click', f1);
	em.addListener('click', f2);
	em.addListener('close', f1);
	em.addListener('close', f2);
	strictEqual(Object.keys(em.events).length, 2, 'init');
	strictEqual(em.events.click.length, 2, 'init');
	strictEqual(em.events.close.length, 2, 'init');
	em.removeAllListeners();
	strictEqual(Object.keys(em.events).length, 0, 'removal');
	em.removeAllListeners();
	strictEqual(Object.keys(em.events).length, 0, 'double removal');
});


test('emit', function testEmit () {
	var em;

	expect(9);

	em = new Emitter();
	em.addListener('e1', function ( data ) {
		strictEqual(data, undefined, 'emit without data');
	});
	em.addListener('e2', function ( data ) {
		strictEqual(data, 123, 'emit with data');
	});
	em.addListener('e3', function ( data ) {
		propEqual(data, {a:1,b:2,c:3}, 'emit with complex data');
	});
	strictEqual(em.events.e1.length, 1, 'init');
	strictEqual(em.events.e2.length, 1, 'init');
	strictEqual(em.events.e3.length, 1, 'init');

	em.emit('e1');
	em.emit('e2', 123);
	em.emit('e3', {a:1,b:2,c:3});

	em.emit('e1');
	em.emit('e2', 123);
	em.emit('e3', {a:1,b:2,c:3});

	em.emit();
	em.emit(null);
	em.emit(false);
	em.emit(undefined);

	em.removeAllListeners();
	em.emit('e1');
	em.emit('e2', 123);
	em.emit('e3', {a:1,b:2,c:3});
});


test('once', function testOnce () {
	var em;

	expect(7);

	em = new Emitter();
	em.once('e1', function ( data ) {
		strictEqual(data, undefined, 'emit without data');
	});
	em.once('e2', function ( data ) {
		strictEqual(data, 123, 'emit with data');
	});
	em.once('e3', function ( data ) {
		propEqual(data, {a:1,b:2,c:3}, 'emit with complex data');
	});
	strictEqual(em.events.e1.length, 1, 'init');
	strictEqual(em.events.e2.length, 1, 'init');
	strictEqual(em.events.e3.length, 1, 'init');

	em.emit('e1');
	em.emit('e2', 123);
	em.emit('e3', {a:1,b:2,c:3});

	em.emit('e1');
	em.emit('e2', 123);
	em.emit('e3', {a:1,b:2,c:3});

	strictEqual(Object.keys(em.events).length, 0, 'no events');
});
