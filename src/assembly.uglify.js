"use strict";

var UglifyJS = require("uglify-js"),
	rectify = require("./assembly.rectify"),
	widget = require("./assembly.widget"),
	config = require("./config.json");

/**
 * @typedef {object} Compressed
 * @property {string} code
 * @property {string} sourceMap
 */

/**
 * Adds the source map.
 * @param {string} code
 * @return {string}
 */
function addSourceMap(code) {
	return code + "\n//# sourceMappingURL=" + widget.getSourceMapName();
}

/**
 * Compress the source code.
 * @param {string} code
 * @return {Compressed}
 */
function uglify(code) {
	var options = rectify.rectifyOptions(config.options),
		output = UglifyJS.OutputStream(null),
		topLevel = UglifyJS.parse(code),
		min;

	// TODO Wrap
	// TODO: Compress
	// TODO: Mangle

	// Print the ast to OutputStream
	topLevel.print(output);
	min = output.get();

	if (options.sourceMap) {
		min = addSourceMap(min);
	}

	return {code: min, sourceMap: options.source_map};
}

/**
 * Compress the source code.
 * @param {string} sourceCode
 * @return {Compressed}
 */
module.exports.uglify = function (sourceCode) {
	var compressed = uglify(sourceCode);

	return compressed;
};