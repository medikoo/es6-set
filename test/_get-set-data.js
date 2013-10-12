'use strict';

module.exports = function (t) {
	return {
		"": function (a) {
			var data = t(), x = {};

			data.push(0);
			a(data.eIndexOf(0), 0, "0");
			a(data.eIndexOf(-0), 0, "-0");
			a(data.eIndexOf(x), -1, "Non existent");
			data.push(x);
			a(data.eIndexOf(x), 1, "Other");
			data.push(NaN);
			a(data.eIndexOf(NaN), 2, "NaN");
			a(data.length, 3, "Length");
			data.clear();
			a(data.length, 0, "Clear");
		},
		"is": function (a) {
			var data = t('is'), x = {};

			data.push(0);
			a(data.eIndexOf(0), 0, "0");
			a(data.eIndexOf(-0), -1, "-0");
			a(data.eIndexOf(x), -1, "Non existent");
			data.push(x);
			a(data.eIndexOf(x), 1, "Other");
			data.push(NaN);
			a(data.eIndexOf(NaN), 2, "NaN");
			data.push(-0);
			a(data.eIndexOf(0), 0, "0: When -0");
			a(data.eIndexOf(-0), 3, "-0: When -0");
			a(data.length, 4, "Length");
			data.clear();
			a(data.length, 0, "Clear");
		}
	};
};
