sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/library"
], function (BaseController, JSONModel, formatter, mobileLibrary) {
	"use strict";
	return BaseController.extend("sap.ui.demo.bulletinboard.controller.Detail", {
		formatter: formatter,
		
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
					lineItemTitle: this.getResourceBundle().getText("lineItemTitle"),
					busy: false,
					delay : 0,
					sTotalPrice: 0,
					shareSendEmailSubject: "",
					shareSendEmailMessage: ""
				});
			this.getRouter().getRoute("detail").attachPatternMatched(this._onPostMatched, this);
			this.setModel(oViewModel, "detailView");
		
		},
		
		
		// _onPostMatched: function (oEvent) {
		// 	this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
		
			
		// 	var oViewModel = this.getModel("detailView");
		// 	var sObjectId =  oEvent.getParameter("arguments").orderId;

		// 	this.getView().bindElement({
		// 		path: "/Orders(" + sObjectId + ")",
		// 		parameters: {
		// 			expand: "Customer,Order_Details/Product,Employee"
		// 		},
		// 		events: {
		// 			dataRequested: function () {
		// 				this.getModel().metadataLoaded().then(function () {
		// 					oViewModel.setProperty("/busy", true);
		// 				});
		// 			},
		// 			dataReceived: function () {
		// 				oViewModel.setProperty("/busy", false);
		// 			}
		// 		}
		// 	});
		// },

	_onPostMatched : function (oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			this._sObjectId = oArguments.orderId;
			// Don't show two columns when in full screen mode
			if (this.getModel("appView").getProperty("/layout") !== "MidColumnFullScreen") {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			}
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("Orders", {
					OrderID :  this._sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView : function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");
			var oDataModel = this.getModel();

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path : sObjectPath,
				parameters: {
					expand: "Customer,Order_Details/Product,Employee"
				},
				events: {
					change : this._onBindingChange.bind(this),
					dataRequested : function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailNotFound");
			//this.getRouter().navTo("detailNotFound");
				return;
			}

			this.getModel("detailView").setProperty("/busy", false);
		},

		

		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}

		},
		
		
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total"),
				iTotalContexts = oTable.getBinding("items").getContexts();
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("lineItemTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("lineItemTitle");
			}
			this.getModel("detailView").setProperty("/lineItemTitle", sTitle);
			var iTotalPrice = 0;
			for(var i = 0; i < iTotalContexts.length; i++)
			{
				iTotalPrice = iTotalPrice + iTotalContexts[i].getProperty("UnitPrice") * iTotalContexts[i].getProperty("Quantity");
			}
			this.getModel("detailView").setProperty("/sTotalPrice", iTotalPrice);
		},

	
		onShareEmailPress:function (oEvent) {
			var oViewModel = this.getModel("detailView"), oResourceBundle = this.getResourceBundle();
		 	var oItem = oEvent.getSource().getBindingContext(); 
		 	var iOrderId = oItem.getProperty("OrderID");
		 	var iName = oItem.getProperty("ShipName");
		 	var iCustomerId = oItem.getProperty("CustomerID");
		 	var iProcessorId = oItem.getProperty("EmployeeID");
			oViewModel.setProperty("/shareSendEmailSubject", oResourceBundle.getText("shareSendEmailObjectSubject", [iOrderId]));
			oViewModel.setProperty("/shareSendEmailMessage",
			oResourceBundle.getText("shareSendEmailObjectMessage", [iOrderId, iOrderId, location.href, iName, iCustomerId, iProcessorId]));
	 	
 			mobileLibrary.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage"));
			
		},
		
		onPhonePress: function(oEvent){
			var telNum = oEvent.getSource().getBindingContext().getProperty("Employee/HomePhone"); 
			mobileLibrary.URLHelper.triggerTel(telNum);
		}
			
		
	});
});