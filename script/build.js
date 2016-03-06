"use strict";

var fsx = require("fs-extra"),
	assembly = require("../src/assembly"),
	config = require("../src/config.json");

(function () {
	fsx.emptyDir(config.targetDirectory, function (err) {
		if (err) {
			throw err;
		}

		assembly.assembly(function () {
			console.log("Ready");
		});
	});
}());
