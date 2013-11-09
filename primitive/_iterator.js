'use strict';

var clear          = require('es5-ext/array/#/clear')
  , assign         = require('es5-ext/object/assign')
  , setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , contains       = require('es5-ext/string/#/contains')
  , d              = require('d/d')
  , autoBind       = require('d/auto-bind')
  , Iterator       = require('es6-iterator')

  , defineProperties = Object.defineProperties, keys = Object.keys
  , PrimitiveSetIterator;

PrimitiveSetIterator = module.exports = function (set, kind) {
	if (!(this instanceof PrimitiveSetIterator)) {
		return new PrimitiveSetIterator(set, kind);
	}
	Iterator.call(this, keys(set.__setData__), set);
	if (!kind) kind = 'value';
	else if (contains.call(kind, 'key+value')) kind = 'key+value';
	else kind = 'value';
	defineProperties(this, {
		__kind__: d('', kind),
		__data__: d('', set.__setData__)
	});
};
if (setPrototypeOf) setPrototypeOf(PrimitiveSetIterator, Iterator);

PrimitiveSetIterator.prototype = Object.create(Iterator.prototype, assign({
	constructor: d(PrimitiveSetIterator),
	_resolve: d(function (i) {
		var value = this.__data__[this.__list__[i]];
		return (this.__kind__ === 'value') ? value : [value, value];
	}),
	toString: d(function () { return '[object Set Iterator]'; })
}, autoBind({
	_onAdd: d(function (key) { this.__list__.push(key); }),
	_onDelete: d(function (key) {
		var index = this.__list__.lastIndexOf(key);
		if (index < this.__nextIndex__) return;
		this.__list__.splice(index, 1);
	}),
	_onClear: d(function () {
		clear.call(this.__list__);
		this.__nextIndex__ = 0;
	})
})));
