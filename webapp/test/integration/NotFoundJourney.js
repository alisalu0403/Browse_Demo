sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/Opa5",
	"./pages/Common",
	"./pages/NotFound"
], function (opaTest, Opa5) {
	"use strict";

	QUnit.module("NotFound");

	opaTest("Should see the not found page when a user input an invalid url", function (Given, When, Then) {
		
		// Given = arrangements;
		// // Arrangements
		var options = {delay:0, hash:"ff"};

		Given.iStartMyApp(options);

		// Assertions
		Then.onTheNotFoundPage.theNotFoundPageShouldDisplay();
		
		// Cleanup
		Then.iTeardownMyApp();
	});
});