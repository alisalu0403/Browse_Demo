sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	'../model/formatter',
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/m/Button",
	"sap/m/MessageToast",
	"sap/m/Label",
	"sap/base/Log",
	"sap/m/library"
], function (BaseController, JSONModel, formatter,Dialog, Text, TextArea, Button, MessageToast, Label, Log, mobileLibrary) {
	"use strict";
	return BaseController.extend("sap.ui.demo.bulletinboard.controller.Detail", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
					lineItemTitle: this.getResourceBundle().getText("lineItemTitle"),
					busy: false,
					delay : 0,
					sTotalPrice: 0,
					shareSendEmailSubject: "Subject",
					shareSendEmailMessage: "Message"
				});
			this.getRouter().getRoute("detail").attachPatternMatched(this._onPostMatched, this);
			this.setModel(oViewModel, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			//this.showDetail();
		},

	
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */
		/**
		 * Binds the view to the post path.
		 *
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onPostMatched: function (oEvent) {
		var sObjectId =  oEvent.getParameter("arguments").orderId;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("Orders", {
					OrderID :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},
		_onMetadataLoaded : function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
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

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path : sObjectPath,
				parameters: {
					expand: "Customer,Order_Details/Product,Employee"
				},
				events: {
					dataRequested : function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
	
		
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
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
			for(var i=0; i<iTotalContexts.length; i++)
			{
				iTotalPrice = iTotalPrice + iTotalContexts[i].getProperty("UnitPrice")*iTotalContexts[i].getProperty("Quantity");
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
			var telNum =oEvent.getSource().getBindingContext().getProperty("Employee/HomePhone"); 
			mobileLibrary.URLHelper.triggerTel(telNum);
		}
			
		
		
		
		
		
		
		
	});
});