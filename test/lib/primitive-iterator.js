"use strict";

var Set            = require("../../primitive")
  , toArray        = require("es5-ext/array/to-array")
  , iteratorSymbol = require("es6-symbol").iterator
  , compare
  , map;

compare = function (value1, value2) {
	if (!value1.value) return -1;
	if (!value2.value) return 1;
	return value1.value.localeCompare(value2.value);
};

map = function (arr) {
	return arr.sort().map(function (value) { return { done: false, value: value }; });
};

module.exports = function (T) {
	return {
		"": function (a) {
			var arr = ["raz", "dwa", "trzy", "cztery", "pięć"]
			  , it
			  , value1
			  , value2
			  , set = new Set(arr)
			  , result = [];

			it = new T(set);
			a(it[iteratorSymbol](), it, "@@iterator");
			value1 = it.next();
			result.push(value1);
			value2 = it.next();
			a.not(value1, value2, "Recreate result");
			result.push(value2);
			result.push(it.next());
			result.push(it.next());
			result.push(it.next());
			a.deep(result.sort(compare), map(arr));
			a.deep((value1 = it.next()), { done: true, value: undefined }, "End");
			a.not(value1, it.next(), "Recreate result on dead");
		},
		"Emited": function (a) {
			var arr = ["raz", "dwa", "trzy", "cztery", "pięć"], it, set = new Set(arr), result = [];

			it = new T(set);
			result.push(it.next());
			result.push(it.next());
			set.add("sześć");
			arr.push("sześć");
			result.push(it.next());
			set.delete("pięć");
			arr.splice(4, 1);
			result.push(it.next());
			result.push(it.next());
			a.deep(result.sort(compare), map(arr));
			a.deep(it.next(), { done: true, value: undefined }, "End");
		},
		"Emited #2": function (a) {
			var arr = ["raz", "dwa", "trzy", "cztery", "pięć", "sześć"]
			  , it
			  , set = new Set(arr)
			  , result = [];

			it = new T(set);
			result.push(it.next());
			result.push(it.next());
			set.add("siedem");
			set.delete("siedem");
			result.push(it.next());
			result.push(it.next());
			set.delete("pięć");
			arr.splice(4, 1);
			result.push(it.next());
			a.deep(result.sort(compare), map(arr));
			a.deep(it.next(), { done: true, value: undefined }, "End");
		},
		"Emited: Clear #1": function (a) {
			var arr = ["raz", "dwa", "trzy", "cztery", "pięć", "sześć"]
			  , it
			  , set = new Set(arr)
			  , result = [];

			it = new T(set);
			result.push(it.next());
			result.push(it.next());
			arr = ["raz", "dwa"];
			set.clear();
			a.deep(result.sort(compare), map(arr));
			a.deep(it.next(), { done: true, value: undefined }, "End");
		},
		"Emited: Clear #2": function (a) {
			var arr = ["raz", "dwa", "trzy", "cztery", "pięć", "sześć"]
			  , it
			  , set = new Set(arr)
			  , result = [];

			it = new T(set);
			result.push(it.next());
			result.push(it.next());
			set.clear();
			set.add("foo");
			set.add("bar");
			arr = ["raz", "dwa", "foo", "bar"];
			result.push(it.next());
			result.push(it.next());
			a.deep(result.sort(compare), map(arr));
			a.deep(it.next(), { done: true, value: undefined }, "End");
		},
		"Kinds": function (a) {
			var set = new Set(["raz", "dwa"]);

			a.deep(toArray(new T(set)).sort(), ["raz", "dwa"].sort(), "Default");
			a.deep(
				toArray(new T(set, "key+value")).sort(),
				[
					["raz", "raz"], ["dwa", "dwa"]
				].sort(),
				"Key & Value"
			);
			a.deep(toArray(new T(set, "value")).sort(), ["raz", "dwa"].sort(), "Other");
		}
	};
};
