'use strict';

var d = require('d')

  , create = Object.create, setPrototypeOf = Object.setPrototypeOf;

module.exports = function () {
	var set, iterator, result, SubSet;
	if (typeof Set !== 'function') return false;
	if (String(Set.prototype) !== '[object Set]') return false;
	set = new Set(['raz', 'dwa', 'trzy']);
	if (set.size !== 3) return false;
	if (typeof set.add !== 'function') return false;
	if (typeof set.clear !== 'function') return false;
	if (typeof set.delete !== 'function') return false;
	if (typeof set.entries !== 'function') return false;
	if (typeof set.forEach !== 'function') return false;
	if (typeof set.has !== 'function') return false;
	if (typeof set.keys !== 'function') return false;
	if (typeof set.values !== 'function') return false;

	iterator = set.values();
	result = iterator.next();
	if (result.done !== false) return false;
	if (result.value !== 'raz') return false;

	// Non new call
	try { set = Set([1, 2, 3]); } catch (e) { return false; } //jslint: ignore

	if (!set) return false;
	if (set.size !== 3) return false;

	// Extendable
	if (setPrototypeOf) {
		SubSet = function () { Set.apply(this, arguments); };
		setPrototypeOf(SubSet, Set);
		SubSet.prototype = create(Set.prototype, { constructor: d(SubSet) });
		try { set = new SubSet([1, 2, 3]); } catch (e) { return false; }
		try {
			if (set.size !== 3) return false;
		} catch (e) { return false; }
	}
	return true;
};
