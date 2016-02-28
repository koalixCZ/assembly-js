"use strict";

var config = require("./config.json");

/**
 * Returns name of the sourcer map file.
 * @return {string}
 */
function getSourceMapName() {
	return config.assembledJS + ".map";
}


module.exports = {
	getSourceMapName: getSourceMapName
};
