sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("app.curdoperations.controller.View1", {
            onInit: function () {     
                // this.onReadAll();
                // this.onReadFilters();        
                // this.onReadSorter();      
                // this.onReadParameter();
                // this.onReadKeyData();
                // this.onEdit();
            },
            onReadAll: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Products", {
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("idProducts").setModel(jModel);
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadFilters: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oFilter = new sap.ui.model.Filter('Rating', 'NE', '4');
                oModel.read("/Products", {
                    filters: [oFilter], success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("idProducts").setModel(jModel);
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadSorter: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oSorter = new sap.ui.model.Sorter('Price', true);
                oModel.read("/Products", {
                    sorters: [oSorter], success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("idProducts").setModel(jModel);
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadParameter: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oSorter = new sap.ui.model.Sorter('Price', true);
                oModel.read("/Products", {
                    urlParameters: { $top: 4, $skip: 2 },
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("idProducts").setModel(jModel);
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadKeyData: function() {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oSorter = new sap.ui.model.Sorter('Price', true); // Not used in this context, but kept if needed elsewhere
            
                // Read a specific product by its ID (e.g., 2)
                oModel.read("/Products(2)", {
                    success: function(oData) {
                        console.log("Read data:", oData);
            
                        // Create a JSON model with the fetched data
                        var jModel = new sap.ui.model.json.JSONModel({ results: [oData] });
            
                        // Set the JSON model to the view
                        that.getView().byId("idProducts").setModel(jModel);
                    },
                    error: function(oError) {
                        console.error("Read operation failed:", oError);
                    }
                });
            },            
            // onEdit:function(oEvent){
            //     var that = this;
            //     var oModel = this.getOwnerComponent().getModel();
            //     oModel.setUseBatch(false);
            //     if(oEvent.getSource().getText() === "Edit"){   
            //       oEvent.getSource().setText("Submit");
            //       oEvent.getSource().getParent().getParent().getCells()[3].setEditable(true);
            //     }else{    
            //         oEvent.getSource().setText("Edit");  
            //         oEvent.getSource().getParent().getParent().getCells()[3].setEditable(false);
            //         var oInput = oEvent.getSource().getParent().getParent().getCells()[3].getValue();
            //         var oId = oEvent.getSource().getBindingContext().getProperty("ID");
            //         oModel.update("/Products(" + oId + ")",{Rating:oInput},{success: function (odata) {
            //          // that.onReadAll();
            //          that.getView().byId("idProducts").getModel().refresh();
            //         },error: function (oError) {  
            //            console.log(oError); }  
            //     })     
            //     }
            // },
            onEdit: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);
                if (oEvent.getSource().getText() === "Edit") {
                    oEvent.getSource().setText("Submit");
                    oEvent.getSource().getParent().getParent().getCells()[3].setEditable(true);
                } else {
                    oEvent.getSource().setText("Edit");
                    oEvent.getSource().getParent().getParent().getCells()[3].setEditable(false);

                    // Retrieve input value and ID for update
                    var oInput = oEvent.getSource().getParent().getParent().getCells()[3].getValue();
                    var oId = oEvent.getSource().getBindingContext().getProperty("ID");

                    // Perform the update operation
                    oModel.update("/Products(" + oId + ")", { Rating: oInput }, {
                        success: function (odata) {
                            // that.onReadAll(); // Assuming onReadAll() fetches and updates the table data
                            that.getView().byId("idProducts").getModel().refresh();
                        }, error: function (oError) {
                            console.error("Update failed:", oError);
                        }
                    });
                }
            },
            onDuplicate: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

                // Retrieve the binding context of the item
                var oBindingContext = oEvent.getSource().getBindingContext();
                var oDuplicateData = oBindingContext.getObject(); // Get the data as a plain object

                // Ensure ID is not null or undefined
                if (oDuplicateData.ID >= 0) {
                    // Modify the ID for the duplicate entry
                    oDuplicateData.ID = 100 + oDuplicateData.ID;
                } else {
                    // Handle cases where ID might be undefined or null
                    console.error("ID is undefined or null. Cannot duplicate.");
                    return;
                }
                // Create a new entry with the modified data
                oModel.create("/Products", oDuplicateData, {
                    success: function (odata) {
                        // that.onReadAll(); // Refresh the list or table
                            that.getView().byId("idProducts").getModel().refresh();
                    },
                    error: function (oError) {
                        console.error("Duplicate creation failed:", oError);
                    }
                });
            },
            onDelete: function(oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);
            
                // Retrieve the ID of the item to delete
                var oId = oEvent.getSource().getBindingContext().getProperty("ID");
            
                if (!oId) {
                    console.error("Item ID is undefined or null. Cannot perform delete operation.");
                    return;
                }
                // Perform the delete operation
                oModel.remove("/Products(" + oId + ")", {
                    success: function(odata) {
                        // that.onReadAll(); // Refresh the list or table
                            that.getView().byId("idProducts").getModel().refresh();
                    },
                    error: function(oError) {
                        console.error("Delete operation failed:", oError);
                    }
                });
            }            
    });
});
