sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/AggregationLengthEquals",
		"sap/ui/test/matchers/I18NText",
		"sap/ui/test/actions/Press",
		"sap/ui/test/matchers/BindingPath",
		"sap/ui/test/actions/EnterText",
		"sap/ui/test/matchers/PropertyStrictEquals"
	],
	function (Opa5,
			  AggregationLengthEquals,
			  I18NText,
			  Press,
			  BindingPath,
			  EnterText,
			  PropertyStrictEquals) {
		"use strict";

		var sViewName = "Master",
			sListId = "list";

		Opa5.createPageObjects({
			onTheMasterPage: {
				actions: {
					iPressOnMoreData: function () {
						// Press action hits the "more" trigger on a list
						return this.waitFor({
							id: sListId,
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "The list does not have a trigger."
						});
					} ,
					
					iSearchFor: function (sSearchString) {
						return this.waitFor({
							id: "searchDescription",
							viewName: sViewName,
							actions: new EnterText({
								text: sSearchString
							}),
							errorMessage: "SearchTitle was not found."
						});
					} ,
					
					iResetTheSearchField: function(){
						return this.waitFor({
							id : "searchDescription",
							viewName : sViewName,
							actions: function(oSearchField) {
								oSearchField.clear();
							},
							errorMessage : "Failed to find search field in Master view."
						});
						
					},
					
					iFilterShippedOrders : function (sSelect, sItem, sOption) {
						return this.waitFor({
							id : sSelect,
							viewName : sViewName,
							actions : new Press(),
							success : function () {
								this.waitFor({
									controlType: "sap.m.StandardListItem",
									matchers: new PropertyStrictEquals({name: "title", value: sItem}),
									actions: new Press(),
									success: function () {
										this.waitFor({
											controlType: "sap.m.StandardListItem",
											matchers : new PropertyStrictEquals({name: "title", value: sOption}),
											actions : new Press(),
											success: function () {
												this.waitFor({
													controlType: "sap.m.Button",
													matchers: new PropertyStrictEquals({name: "text", value: "OK"}),
													actions: new Press(),
													errorMessage: "The ok button in the dialog was not found and could not be pressed"
												});
											},
											errorMessage : "Did not find the" +  sOption + "in" + sItem
										});
									},
									errorMessage : "Did not find the " + sItem + " element in select"
								});
							},
							errorMessage : "Did not find the " + sSelect + " select"
						});
					},
					
					iResetTheFilterOrders: function(){
						return this.waitFor({
							id: "filterButton",
							viewName: sViewName,
							actions: new Press(),
							success: function(){
								this.waitFor({
									controlType: "sap.m.Button",
									matchers: new PropertyStrictEquals({name: "text", value: "Reset"}),
									actions: new Press(),
									success: function(){
										this.waitFor({
											controlType: "sap.m.Button",
											matchers: new PropertyStrictEquals({name: "text", value: "OK"}),
											actions: new Press(),
											errorMessage: "The ok button in the dialog was not found and could not be pressed"
											
										});
									},
									errorMessage: "Cannot find the Reset Button"
									
								});
							},
							errorMessage: "Cannot find the filter button"
						});
					
					},
					
					iGroupList  : function(sort){
						return this.waitFor({
							id: "groupButton",
							viewName: sViewName,
							actions: new Press(),
							success: function(){
								this.waitFor({
									controlType: "sap.m.StandardListItem",
									matchers: new PropertyStrictEquals({name: "title", value: sort}),
									actions: new Press(),
									success: function(){
										this.waitFor({
											controlType: "sap.m.Button",
											matchers: new PropertyStrictEquals({name: "text", value: "OK"}),
											actions: new Press(),
											errorMessage: "The ok button in the dialog was not found and could not be pressed"
											
										});
									},
									errorMessage: "Cannot find the " + sort
									
								});
							},
							errorMessage: "Cannot find the group button"
						});
					
					},
					
					// navigate to the detail page
					iPressOnTheItemWithTheID: function(sId){
						return this.waitFor({
							controlType: "sap.m.ObjectListItem",
							viewName: sViewName,
							matchers:  new BindingPath({
								path: "/Orders(" + sId + ")"
							}),
							actions: new Press(),
							errorMessage: "No list item with the id " + sId + " was found."
						});
					}
			
				
				},
				
				
				
				
				assertions: {
					theListShouldHavePagination: function () {
						return this.waitFor({
							id: sListId,
							viewName: sViewName,
							matchers: new AggregationLengthEquals({
								name: "items",
								length: 10
							}),
							success: function () {
								Opa5.assert.ok(true, "The list has 10 items on the first page");
							},
							errorMessage: "The list does not contain all items."
						});
					},
					
					theTitleShouldDisplayTheTotalAmountOfItems: function () {
						return this.waitFor({
							id: "listHeader",
							viewName: sViewName,
							matchers: new I18NText({
								key: "masterTableTitleCount",
								propertyName: "text",
								parameters: [11]
							}),
							success: function () {
								Opa5.assert.ok(true, "The list header has 11 items");
							},
							errorMessage: "The List's header does not container the number of items: 11"
						});
					},
				
					theListShouldHaveAllEntries: function () {
						return this.waitFor({
							id: sListId,
							viewName: sViewName,
							matchers: new AggregationLengthEquals({
								name: "items",
								length: 11
							}),
							success: function () {
								Opa5.assert.ok(true, "The list has 11 items");
							},
							errorMessage: "The list does not contain all items."
						});
					},
					
					theListShouldHaveTwoEntries: function() {
						return this.waitFor({
							id: sListId,
							viewName: sViewName,
							matchers: new AggregationLengthEquals({
								name: "items",
								length: 2
							}),
							success: function () {
								Opa5.assert.ok(true, "The list has been filtered with 2 items");
							},
							errorMessage: "The list cannot be filtered successfully."
						});
					},
					
					theListShouldBeFilteredOnShippedOrders : function () {
						function fnCheckFilter (oList){
							var fnIsFiltered = function (oElement) {
								if (!oElement.getBindingContext()) {
									return false;
								} else {
									var sDate = oElement.getBindingContext().getProperty("ShippedDate");
									if (!sDate) {
										return false;
									} else {
										return true;
									}
								}
							};
	
							return oList.getItems().every(fnIsFiltered);
						}
						return this.waitFor({
							viewName : sViewName,
							id : sListId,
							matchers : fnCheckFilter,
							success : function() {
								Opa5.assert.ok(true, "Master list has been filtered correctly");
							},
							errorMessage : "Master list has not been filtered correctly"
						});
					},
					
					theListShouldBeFilteredOnNoShippedOrders : function () {
						function fnCheckFilter (oList){
							var fnIsFiltered = function (oElement) {
								if (!oElement.getBindingContext()) {
									return false;
								} else {
									var sDate = oElement.getBindingContext().getProperty("ShippedDate");
									if (!sDate) {
										return true;
									} else {
										return false;
									}
								}
							};
	
							return oList.getItems().every(fnIsFiltered);
						}
						return this.waitFor({
							viewName : sViewName,
							id : sListId,
							matchers : fnCheckFilter,
							success : function() {
								Opa5.assert.ok(true, "Master list has been filtered correctly");
							},
							errorMessage : "Master list has not been filtered correctly"
						});

					
					},
					
					theListGroupHeader: function () {
						return this.waitFor({
							controlType: "sap.m.GroupHeaderListItem",
							viewName: sViewName,
							success: function () {
								Opa5.assert.ok(true, "The group header is visible");
							},
							errorMessage: "Was not able to see the group header."
						});
					},
					
					theListGroupHeaderIsHidden: function(){	
						return this.waitFor({
							id : sListId,
							viewName: sViewName,
					    	 matchers: [
					    	 	function(oList) {
		                           var groupHeaderHidden = function (oElement) {
		                           	if(oElement.getMetadata().getName() === "sap.m.GroupHeaderListItem"){
		                           		return false;
		                           	} else
		                           	{
		                           		return true;
		                           	}
							};
							return oList.getItems().every(groupHeaderHidden);
		                    
                    	 }],
							
							success: function () {
								Opa5.assert.ok(true, "The selected item has been deleted");
							},
							errorMessage: "There may be some problem with the delete function"
						});
						
						
					}

				}
			}
		});

	});