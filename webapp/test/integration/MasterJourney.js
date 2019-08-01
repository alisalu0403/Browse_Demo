/*global QUnit*/
sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Master"
],  function (opaTest) {
	"use strict";
	
	QUnit.module("Master");

  //1. total number of the list
	opaTest("Should see the table with all items", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Assertions
		Then.onTheMasterPage.theListShouldHavePagination().
			and.theTitleShouldDisplayTheTotalAmountOfItems();
	});

    //2. press the more button
	opaTest("Should be able to load more items", function(Given, When, Then){
		// Actions
		When.onTheMasterPage.iPressOnMoreData();
		
		// Assertions
		Then.onTheMasterPage.theListShouldHaveAllEntries();
	});
	
	//3. Search the order name
	opaTest("Should be able to search the list with order name", function(Given, When, Then){
		//Actions
		When.onTheMasterPage.iSearchFor("Horn");
		
		//Assertions
		Then.onTheMasterPage.theListShouldHaveTwoEntries();                         
	});
	
	//4. clear the search field
	opaTest("Should be able to see all items when reset the search field", function(Given, When, Then){
		//Actions
		When.onTheMasterPage.iResetTheSearchField();
		
		// Assertions
		Then.onTheMasterPage.theListShouldHavePagination();
	
	});
	
	//5. filter the list with shipped orders
	opaTest("Should be able to filter the list with ship orders", function(Given, When, Then){
		//Actions
		When.onTheMasterPage.iFilterShippedOrders("filterButton", "Orders", "Only Shipped Orders");
		
		// Assertions
		Then.onTheMasterPage.theListShouldBeFilteredOnShippedOrders();
		
	});
	
	//6. filter the list without shipped orders
	opaTest("Should be able to filter the list without ship orders", function(Given, When, Then){
		//Actions
		When.onTheMasterPage.iFilterShippedOrders("filterButton", "Orders", "Only Orders without Shipment");
		
		// Assertions
		Then.onTheMasterPage.theListShouldBeFilteredOnNoShippedOrders();
		
	});
	
	//7. clear the filter condition, and the list should display all entries.
	opaTest("Clear the filter condition and should see all items", function(Given, When, Then){
		
		// Actions
		When.onTheMasterPage.iResetTheFilterOrders();
		
		//Assertions
		Then.onTheMasterPage.theListShouldHavePagination();
	
	});
	
	//8. group the list
	opaTest("Clear the filter condition and should see all items", function(Given, When, Then){
		
		// Actions
		When.onTheMasterPage.iGroupList("Group by Customer");
		
		//Assertions
		Then.onTheMasterPage.theListGroupHeader();
	
	});
	
	// 9. remove the grop list
	opaTest("Clear the group condition and the list should not display group header", function(Given, When, Then){
		
		// Actions
		When.onTheMasterPage.iGroupList("None");
		
		//Assertions
		Then.onTheMasterPage.theListGroupHeaderIsHidden();
		
		// Cleanup
		Then.iTeardownMyApp();
	
	});
	
	
	
	
	

});