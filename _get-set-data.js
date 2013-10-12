'use strict';

var clear          = require('es5-ext/array/#/clear')
  , eIndexOf       = require('es5-ext/array/#/e-index-of')
  , findIndex      = require('es5-ext/array/#/find-index')
  , is             = require('es5-ext/object/is')
  , mixin          = require('es5-ext/object/mixin')
  , setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , d              = require('d/d')

  , defineProperty = Object.defineProperty
  , SetData, eIndexOfIs;

eIndexOfIs = function (value) {
	if (value !== 0) return eIndexOf.call(this, value);
	return findIndex.call(this, function (item) { return is(value, item); });
};

SetData = module.exports = function (comparator) {
	var data = [];
	if (setPrototypeOf) setPrototypeOf(data, SetData.prototype);
	else mixin(data, SetData.prototype);
	if (comparator === 'is') defineProperty(data, 'eIndexOf', d(eIndexOfIs));
	return data;
};

SetData.prototype = Object.create(Array.prototype, {
	constructor: d(SetData),
	clear: d(clear),
	eIndexOf: d(eIndexOf)
});
