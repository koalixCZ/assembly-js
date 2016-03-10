"use strict";

var UglifyJS = require("uglify-js"),
	config = require("./config.json");

/**
 * Returns name of the sourcer map file.
 * @return {string}
 */
function getSourceMapName() {
	return config.assembledJS + ".map";
}

/**
 * Rectifies incompatible options.
 * @param {object} options
 */
function rectifyIncompatibleOptions(options) {
	if (options.expression && (options.compress || options.mangle)) {
		console.warn("Option 'expression' is not compatible with compress and mangle");
		options.compress = false;
		options.mangle = false;
	}
}

/**
 * Setup the source map.
 * @param {object} options
 */
function setupSourceMap(options) {
	options.source_map = UglifyJS.SourceMap({
		file: getSourceMapName()
	});
}


module.exports = {
	getSourceMapName: getSourceMapName,
	rectifyIncompatibleOptions: rectifyIncompatibleOptions,
	setupSourceMap: setupSourceMap
};
