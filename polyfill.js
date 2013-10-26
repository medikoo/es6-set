'use strict';

var setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , callable       = require('es5-ext/object/valid-callable')
  , d              = require('d/d')
  , ee             = require('event-emitter/lib/core')
  , getIterator    = require('es6-iterator/get')
  , forOf          = require('es6-iterator/for-of')
  , getSetData     = require('./_get-set-data')
  , Iterator       = require('./_iterator')
  , isNative       = require('./is-native-implemented')

  , isArray = Array.isArray
  , call = Function.prototype.call, defineProperty = Object.defineProperty
  , SetPoly, getValues;

module.exports = SetPoly = function (/*iterable, comparator*/) {
	var iterable = arguments[0], comparator = arguments[1];
	if (!(this instanceof SetPoly)) return new SetPoly(iterable, comparator);
	if (this.__setData__ !== undefined) {
		throw new TypeError(this + " cannot be reinitialized");
	}
	if (iterable != null) {
		if (!isArray(iterable)) iterable = getIterator(iterable);
	}
	if (comparator != null) {
		if (comparator !== 'is') throw new RangeError("Unknown comparator");
	}
	defineProperty(this, '__setData__', d('', getSetData(comparator)));
	if (!iterable) return;
	forOf(iterable, function (value) {
		if (this.eIndexOf(value) !== -1) return;
		this.push(value);
	}, this.__setData__);
};

if (isNative) {
	if (setPrototypeOf) setPrototypeOf(SetPoly, Set);
	SetPoly.prototype = Object.create(Set.prototype, {
		constructor: d(SetPoly)
	});
}

ee(Object.defineProperties(SetPoly.prototype, {
	add: d(function (value) {
		if (this.has(value)) return this;
		this.emit('_add', this.__setData__.push(value) - 1, value);
		return this;
	}),
	clear: d(function () {
		if (!this.__setData__.length) return;
		this.__setData__.clear();
		this.emit('_clear');
	}),
	delete: d(function (value) {
		var index = this.__setData__.eIndexOf(value);
		if (index === -1) return false;
		this.__setData__.splice(index, 1);
		this.emit('_delete', index, value);
		return true;
	}),
	entries: d(function () { return new Iterator(this, 'key+value'); }),
	forEach: d(function (cb/*, thisArg*/) {
		var thisArg = arguments[1], iterator, result;
		callable(cb);
		iterator = this.values();
		result = iterator.next();
		while (!result.done) {
			call.call(cb, thisArg, result.value, result.value, this);
			result = iterator.next();
		}
	}),
	has: d(function (value) {
		return (this.__setData__.eIndexOf(value) !== -1);
	}),
	keys: d(getValues = function () { return this.values(); }),
	size: d.gs(function () { return this.__setData__.length; }),
	values: d(function () { return new Iterator(this); }),
	'@@iterator': d(getValues),
	'@@toStringTag': d('c', 'Set'),
	toString: d(function () { return '[object Set]'; })
}));
