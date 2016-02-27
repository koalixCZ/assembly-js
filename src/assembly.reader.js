"use strict";

var fs = require("fs");

/**
 * @param {string} filename
 * @param {number} index
 * @param {function(string, number)} callback
 */
function readFile(filename, index, callback) {
	fs.readFile(filename, {encoding: "UTF-8", flag: "r"}, function (err, data) {
		if (err) {
			throw err;
		}
		callback(data, index);
	});
}

/**
 * Transforms an array of source codes to a string.
 * @param {Array.<string>} sourceCode
 * @returns {string}
 */
function transformArrayToString(sourceCode) {
	return sourceCode.join("\n");
}


/**
 * @param {Array.<string>} sources
 * @param {function(string)} callback
 */
module.exports.readScripts = function (sources, callback) {
	var count = sources.length,
		sourceCodes = [],

		finish = function (code, index) {
			sourceCodes[index] = code;
			count = count - 1;

			if (count === 0) {
				callback(transformArrayToString(sourceCodes));
			}
		};

	sources.forEach(function (filename, index) {
		readFile(filename, index, finish);
	});
};
