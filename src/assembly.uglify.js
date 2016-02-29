"use strict";

var UglifyJS = require("uglify-js"),
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
	if (config.sourceMap) {
		return code + "\n//# sourceMappingURL=" + widget.getSourceMapName();
	}
	return code;
}

/**
 * Compress the source code.
 * @param {string} code
 * @param {object} options
 * @return {Compressed}
 */
function uglify(code, options) {
	var compressor = UglifyJS.Compressor(options.compress),
		stream = UglifyJS.OutputStream(options),
		ast = UglifyJS.parse(code);

	ast.figure_out_scope();
	ast.compute_char_frequency();
	ast.mangle_names();
	ast = ast.transform(compressor);
	ast.print(stream);

	return {
		code: addSourceMap(stream.get()),
		sourceMap: options.source_map
	};
}

/**
 * Compress the source code.
 * @param {string} sourceCode
 * @return {Compressed}
 */
module.exports.uglify = function (sourceCode) {
	var options = config.options;

	widget.rectifyIncompatibleOptions(options);
	widget.setupSourceMap(options);

	return uglify(sourceCode, options);
};