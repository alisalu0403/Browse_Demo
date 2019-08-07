sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	 "sap/ui/model/Filter",
 	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/format/DateFormat",
	"sap/ui/Device"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Sorter, DateFormat, Device) {
	"use strict";
	//var aTableSearchState;

	return BaseController.extend("sap.ui.demo.bulletinboard.controller.Master", {

		formatter: formatter,
		
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			this._bDescendingSort = false;
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("list");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				masterTableTitle: this.getResourceBundle().getText("masterTableTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailMessage", [window.location.href]),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "masterView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
			
			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			
			this.mGroupFunctions = {
				CompanyName: function (oContext) {
					var name = oContext.getProperty("Customer/CompanyName");
					return {
						key: name,
						text: name
					};
				},
				
				OrderDate: function (oContext) {
					var oDate = oContext.getProperty("OrderDate"),
						iYear = oDate.getFullYear(),
						iMonth = oDate.getMonth() + 1,
						sMonthName = this._oMonthNameFormat.format(oDate);

					return {
						key: iYear + "-" + iMonth,
						text:  ["Ordered in " + sMonthName + " " + iYear]
					};
				}.bind(this),
				
				ShippedDate: function(oContext){
					var oDate = oContext.getProperty("ShippedDate");
					if (oDate !== null) {
						var iYear = oDate.getFullYear(),
							iMonth = oDate.getMonth() + 1,
							sMonthName = this._oMonthNameFormat.format(oDate);

						return {
							key: iYear + "-" + iMonth,
							text: ["Shipped in " + sMonthName + " " + iYear]
						};
					} else {
						return {
							key: 0,
							text: "No Shipped Date"
						};
					}
					
				}.bind(this)
			};
			this._oMonthNameFormat = DateFormat.getInstance({ pattern: "MMMM"});
			
			this.filterState = {
				aFilter: [],
				aSearch: []
				
			};
			
			
				
		
		},
			_onMasterMatched :  function() {
			//Set the layout property of the FCL control to 'OneColumn'
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 *
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("masterTableTitle");
			}
			this.getModel("masterView").setProperty("/masterTableTitle", sTitle);
		},

		_updateListItemCount: function (iTotalItems) {
			var sTitle;
			if (this._oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTableTitleCount", [iTotalItems]);
				this.oViewModel.setProperty("/masterTableTitle", sTitle);
			}
		},
		
		// search field by the order name
		onSearch: function(oEvent){
			
			var sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				this.filterState.aSearch.push(new Filter("CustomerName", FilterOperator.Contains, sQuery));
			}
			else{
				this.filterState.aSearch = [];
			}
			this._applySearch();
			
		},
		_applySearch: function() {
			var oTable = this.byId("list");
			var aTableSearchState = this.filterState.aSearch.concat(this.filterState.aFilter);
			oTable.getBinding("items").filter(aTableSearchState);
		
		},
		
		// filter and group dialog
		_filterOrGroupPress: function(oEvent){
			this._oDialog = sap.ui.xmlfragment("sap.ui.demo.bulletinboard.view.FilterGroupDialog", this);
			this.getView().addDependent(this._oDialog);
			return this._oDialog;
		},
		filterPress: function(){
			this._filterOrGroupPress().open("filter");
		},
		groupPress: function(){
			this._filterOrGroupPress().open("group");
		},
		
		handleConfirm: function(oEvent){
			var aFilterItems = oEvent.getParameter("filterItems");
			var aFilters = [];
			aFilterItems.forEach(function(oItem) {
				if(oItem.getKey() === "shiporder")
				{
					aFilters.push(new Filter("ShippedDate", FilterOperator.NE, null));
				}
				else if(oItem.getKey() === "shipment")
				{
					aFilters.push(new Filter("ShippedDate", FilterOperator.EQ, null));
				}
			});
			this.filterState.aFilter = aFilters;
			this._applySearch();
			// set the infor bar, if reset, means the aFilters is null.
			this.byId("FilterBar").setVisible(aFilters.length > 0);
			this.byId("FilterLabel").setText(oEvent.getParameters().filterString);
			
			var aGroups = [], 
				mParams = oEvent.getParameters(), 
				sPath,
				bDescending,
				vGroup;
			if (mParams.groupItem) {
				if(mParams.groupItem.getKey() === "CompanyName")
				{
					sPath = "Customer/" + mParams.groupItem.getKey();
				}else
				{
					sPath = mParams.groupItem.getKey();
				}
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[mParams.groupItem.getKey()];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				// apply the selected group settings
				
			}
			this._applyGroup(aGroups);
			
	},
		_applyGroup: function(aGroups){
			var oTable = this.byId("list");
			oTable.getBinding("items").sort(aGroups);
		},
	
		onPress: function(oEvent){
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("detail", {
				orderId : oEvent.getParameter("listItem").getBindingContext().getProperty("OrderID")
			});
		}

		
		
	});

});
