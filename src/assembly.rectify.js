"use strict";

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
 * Checks options for UglifyJS.
 * @param {object} options
 * @return {object}
 */
module.exports.rectifyOptions = function (options) {
	rectifyIncompatibleOptions(options);

	//noinspection Eslint
	options.source_map = null;

	return options;
};
