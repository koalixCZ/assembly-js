"use strict";

var widget = require("../src/assembly.widget");

describe("Widget", function () {

	it("returns right source map name", function () {
		expect(widget.getSourceMapName()).toBe("production.js.map");
	});
});