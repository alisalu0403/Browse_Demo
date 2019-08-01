sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Master",
	"./pages/Detail"
], function (opaTest) {
	"use strict";

	QUnit.module("Detail");

	// 1. Navigate to the detail page and should see the Order title
	opaTest("Should see the post page when a user clicks on an entry of the list", function (Given, When, Then) {
		
		var options = {delay:0, hash:"/Orders/7991"};
		// Arrangements
		Given.iStartMyApp(options);
		//Given.iStartMyApp();

		//Actions
		//When.onTheMasterPage.iPressOnTheItemWithTheID("7991");

		//When.onTheDetailPage.iPressOnFullScreen();
		// Assertions
		Then.onTheDetailPage.theTitleShouldDisplayTheName("Order 7991");
		
	});

	// 2. Should see the title and total count of the line items
	opaTest("Should see the line items with all items", function (Given,When, Then) {

		// Assertions
		Then.onTheDetailPage.theListShouldHavePagination().
			and.theTitleShouldDisplayTheTotalAmountOfItems();
	});
	
	// 3. when click the tab, should see different infor   --  employee information
	opaTest("Should can click the tab to see processor information", function(Given, When, Then){
		
		//Actions
		When.onTheDetailPage.iPressOnProcessorButton();       
		
		// Assertions
		Then.onTheDetailPage.theProcessorInforDisplay();
		
		
	});
	
	// 4. when click the tab, should see different infor   --  shipping information
	opaTest("Should can click the tab to see shipping information", function(Given, When, Then){
		
		//Actions
		When.onTheDetailPage.iPressOnShippingButton();       
		
		// Assertions
		Then.onTheDetailPage.theShippingInforDisplay();
		
	});
	
	// 5. click the full screen button, the layout should be MidColumnFullScreen
	opaTest("Should change the layout to MidColumnFullScreen", function(Given, When, Then){
		//Actions
		When.onTheDetailPage.iPressOnScreenButton("enterFullScreen");
		
		//Assertions
		Then.onTheDetailPage.theLayoutShouldChange("MidColumnFullScreen").
						and.theExitFullScreenButtonShouldDisplay();
		
	});
	
	// 6. click the exit full screen button, the layout should be TwoColumnsMidExpanded
	opaTest("Should change the layout to TwoColumnsMidExpanded", function(Given, When, Then){
		//Actions
		When.onTheDetailPage.iPressOnScreenButton("exitFullScreen");
		
		//Assertions
		Then.onTheDetailPage.theLayoutShouldChange("TwoColumnsMidExpanded");
		
	});
	
	//7. click the close button, the layout should be OneColumn
	opaTest("Should change the layout to TwoColumnsMidExpanded", function(Given, When, Then){
		//Actions
		When.onTheDetailPage.iPressOnScreenButton("closeColumn");
		
		//Assertions
		Then.onTheDetailPage.theLayoutShouldChange("OneColumn");
		// Cleanup
		Then.iTeardownMyApp();
		
	});
	

});