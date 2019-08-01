sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Master",
	"./pages/Detail"
], function (opaTest) {
	"use strict";

	QUnit.module("Detail");

	opaTest("Should see the post page when a user clicks on an entry of the list", function (Given, When, Then) {
		
		var options = {delay:0, hash:"/Orders/7991"};
		// Arrangements
		Given.iStartMyApp(options);

		//Actions
	//	When.onTheMasterPage.iPressOnTheItemWithTheID("7991");

		// Assertions
		Then.onTheDetailPage.theTitleShouldDisplayTheName("Order 7991");
		
		// Cleanup
		Then.iTeardownMyApp();
	});


});