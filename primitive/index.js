'use strict';

var clear       = require('es5-ext/object/clear')
  , d           = require('d/d')
  , getIterator = require('es6-iterator/get')
  , forOf       = require('es6-iterator/for-of')
  , Set         = require('../polyfill')
  , Iterator    = require('./_iterator')

  , isArray = Array.isArray, create = Object.create
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , PrimitiveSet;

module.exports = PrimitiveSet = function (/*iterable*/) {
	var iterable = arguments[0];
	if (!(this instanceof PrimitiveSet)) return new PrimitiveSet(iterable);
	if (this.__setData__ !== undefined) {
		throw new TypeError(this + " cannot be reinitialized");
	}
	if (iterable != null) {
		if (!isArray(iterable)) iterable = getIterator(iterable);
	}
	defineProperties(this, {
		__setData__: d('', create(null)),
		__size__: d('w', 0)
	});
	if (!iterable) return;
	forOf(iterable, function (value) { this.add(value); }, this);
};

PrimitiveSet.prototype = Object.create(Set.prototype, {
	constructor: d(PrimitiveSet),
	_serialize: d(String),
	add: d(function (value) {
		var key = this._serialize(value);
		if (hasOwnProperty.call(this.__setData__, key)) return this;
		this.__setData__[key] = value;
		++this.__size__;
		this.emit('_add', key);
		return this;
	}),
	clear: d(function () {
		clear(this.__setData__);
		this.__size__ = 0;
		this.emit('_clear');
	}),
	delete: d(function (value) {
		var key = this._serialize(value);
		if (!hasOwnProperty.call(this.__setData__, key)) return false;
		delete this.__setData__[key];
		--this.__size__;
		this.emit('_delete', key);
		return true;
	}),
	entries: d(function () { return new Iterator(this, 'key+value'); }),
	has: d(function (value) {
		var key = this._serialize(value);
		return hasOwnProperty.call(this.__setData__, key);
	}),
	size: d.gs(function () { return this.__size__; }),
	get: d(function (key) { return this.__setData__[key]; }),
	values: d(function () { return new Iterator(this); })
});
