'use strict';

var toString = Object.prototype.toString

  , id = '[object Set]'
  , Global = (typeof Set === 'undefined') ? null : Set;

module.exports = function (x) {
	return (x && ((Global && (x instanceof Global)) ||
			(toString.call(x) === id) || (x['@@toStringTag'] === 'Set'))) || false;
};
