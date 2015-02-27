enyo.kind({
    name: "cls.manageView",
    viewName: "MANAGE",
    published: {
        markerSelected: false,
        tourLayerId: "",
        neighbourhoodArr: '',
        selectedNeighborhood: 0
    },
    handlers: {
        closeCreateOfferPopUp: "closeCreateOfferPopUp",
        closeCreateNotificationPopUp: "closeCreateNotificationPopUp"
    },
    components: [{
        name: "ajaxMessages",
        kind: "enyo.Popup",
        classes: "ajaxMessages",
        floating: true,
        centered: true,
        onHide: "popupHidden",
        content: ""
    }, {
        kind: "Signals",
        changedToView: "viewChanged",
        illuminationModelUpdated: "illuminationModelUpdated",
        PBDataUpdated: "PBDataUpdated",
        updateRoutes: "updateRoutes",
        updateRouteDirections: "updateRouteDirections",
        updateStatusBar: "updateStatusBar"
            // markerSelectionUpdated: "markerSelectionUpdated"
    }, {
        kind: "Signals",
        updateServicesAllowedBar: "updateServicesAllowedBar",
        updateAjaxMessages: "updateAjaxMessages"
    }, {
        kind: "FittableColumns",
        classes: "height100",
        components: [{
            name: "layersPanel",
            classes: "manageViewLayersPanel",
            components: [{
                kind: "cls.layersComponent",
                classes: "layersComponentContent",
            }, {
                name: "manageViewsidebarFooter",
                fit: true
            }]
        }, {
            name: "mapPanel",
            classes: "manageViewMapPanel",
            fit: true,
            components: [{
                kind: "Signals",
                updateAvailableOperations: "updateAvailableOperations"
            }, {
                name: "mapComponentsContainer",
                kind: "FittableRows",
                classes: "width100 height100",
                components: [{
                    kind: "FittableColumns",
                    name: "lightOperationMgmtSection",
                    classes: "lightOperationMgmtSection",
                    style: "height:7%",
                    components: [{
                        name: "allowedOperationRole",
                        content: "",
                        classes: "lightOperCol1",
                        allowHtml: true
                    }, {
                        kind: "onyx.MenuDecorator",
                        classes: "rightAlign lightOperCol2",
                        components: [{
                            content: "<i class='fa fa-map-marker fa-fw'></i>Neighbourhood",
                            classes: "regionBtn",
                            allowHtml: true
                        }, {
                            kind: "onyx.ContextualPopup",
                            classes: "regionPopupContainer",
                            name: "regionPopupContainer",
                            title: "Select the region you would like to see on the map",
                            floating: true,
                            components: [{
                                style: "height:40px",
                                components: [{
                                    kind: "onyx.Input",
                                    name: "inputSearchOnFocus",
                                    classes: "searchNeighbourCls",
                                    type: "search",
                                    placeholder: "Search",
                                    value: "",
                                    selectOnFocus: true,
                                    onkeyup: "handleKeyStroke"
                                }]
                            }, {
                                fit: true,
                                kind: "enyo.Scroller",
                                components: [{
                                    kind: "enyo.Repeater",
                                    name: "regionComponentContainer",
                                    onSetupItem: "setNeighborhoods",
                                    components: [{
                                        classes: "width100 neighborhoodList",
                                        ontap: "selectDeselect",
                                        components: [{
                                            name: "neighborhoodLabel",
                                            content: "",
                                            neighborHoodData: "",
                                            classes: "neighborhoodItem"
                                        }]
                                    }],
                                }]
                            }]
                        }]
                    }]
                }, {
                    name: "manageMapContainer",
                    classes: "manageMapContainer",
                    fit: true,
                    components: [{
                        kind: "FittableColumns",
                        classes: "statusBar",
                        name: "statusBar",
                        // fit: true,
                        components: [{
                                name: "selectedItemPreviewNote",
                                // classes: "selectedItemPreviewNote",
                            }, {
                                name: "selectedItemsDescription",
                                classes: "selectedItemsDescription",
                            }, {
                                name: "clearSelectionButton",
                                ontap: "clearSelection",
                                classes: "clearSelectionButton",
                                style: "display:none",
                                content: Constants.manageView.clearSelectionButtonContent,
                                kind: "onyx.Button",
                            }, {
                                name: "tourEnable",
                                classes: "tourEnable",
                                kind: "onyx.Button",
                                style: "display:none",
                                content: "Enable",
                                disabled: true
                            }, {
                                name: "tourClearSelection",
                                classes: "tourClearSelection",
                                kind: "onyx.Button",
                                content: "Clear Selection",
                                style: "display:none",
                                disabled: true
                            },
                            // {
                            //     kind: "onyx.Button",
                            //     content: "Generate Report"
                            // },
                            {
                                kind: "onyx.MenuDecorator",
                                style: "float:right;",
                                components: [{
                                    name: "selectAllButton",
                                    kind: "onyx.Button",
                                    ontap: "selectAllKiosks",
                                    classes: "createNotificationButton",
                                    style: "display:none",
                                    content: "Select All",
                                }, {
                                    name: "createNotificationButton",
                                    kind: "onyx.Button",
                                    ontap: "showCreateNotificationButton",
                                    classes: "createPolicyButton createNotificationButton",
                                    style: "display:none",
                                    content: "Create a Notification",
                                }, {
                                    kind: "onyx.ContextualPopup",
                                    classes: "createOfferPopup",
                                    name: "createNotificationPopup",
                                    floating: true,
                                    components: [{
                                        classes: "createNotificationPopup",
                                        kind: "cls.createNotification",
                                    }]
                                }]
                            }, {
                                kind: "onyx.MenuDecorator",
                                style: "float:right;",
                                components: [{
                                    name: "createPolicyButton",
                                    kind: "onyx.Button",
                                    ontap: "showCreatePolicyPopup",
                                    classes: "createPolicyButton",
                                    style: "display:none",
                                    components: [{
                                        content: "Create a Policy",
                                    }]
                                }, {
                                    kind: "Signals",
                                    hideCreatePolicyPopup: "hideCreatePolicyPopup"
                                }, {
                                    kind: "onyx.ContextualPopup",
                                    name: "createPolicyPopup",
                                    classes: "createOfferPopup select-date",
                                    floating: true,
                                    autoDismiss: false,
                                    components: [{
                                        kind: "cls.createPolicy"
                                    }]
                                }]
                            }, {
                                kind: "onyx.MenuDecorator",
                                classes: "width100;",
                                style: "float:right;",
                                components: [{
                                    name: "createOfferButton",
                                    kind: "onyx.Button",
                                    ontap: "showCreateOfferPopup",
                                    classes: "createOfferButton",
                                    style: "display:none",
                                    components: [{
                                        content: "Create an Offer",
                                        classes: "createOfferBtnStyle"
                                    }]
                                }, {
                                    kind: "onyx.ContextualPopup",
                                    classes: "createOfferPopup select-date",
                                    name: "createOfferPopup",
                                    floating: true,
                                    autoDismiss: false,
                                    components: [{
                                        kind: "cls.createOffer"
                                    }]
                                }]
                            }
                        ]
                    }]
                }]
            }]
        }]
    }],
    // bindings: [{
    //     from: ".collection",
    //     to: ".$.regionComponentContainer.collection"
    // }],
    clearSelection: function() {
        // AppConfig.log("Inside the clearSelection() function");
        // enyo.Signals.send("clearSelection",{});
        // enyo.Signals.send("changeSelectedColor", {});
        enyo.Signals.send("clearSelection");
        // AppConfig.log("Clearing the selection");
        // AppConfig.log(this.$.manageMap.mapLayers);
        // var that = this.$.manageMap;
        // var markerCluster = this.$.manageMap.mapLayers;
        // _.each(markerCluster, function(marker) {
        //     AppConfig.log(marker);
        //     marker.setIcon(that.generateMarkerIcon(false, marker.layerInfo));
        //     that.selectedMarkers = _.reject(that.selectedMarkers, function(item) {
        //         return item.layer.id == marker.id;
        //     });
        // });
    },
    updateAjaxMessages: function(inSender, inEvent) {
        if (inEvent.ajaxMessage) {
            this.$.ajaxMessages.setContent(inEvent.ajaxMessage);
            this.$.ajaxMessages.show();
        }
        this.$.ajaxMessages.show();
        var that = this;
        try {
            setTimeout(function() {
                that.$.ajaxMessages.hide();
                if (inEvent.notificationCache) {
                    // enyo.Signals.send("changeSelectedColor", {});
                    if (inEvent.notificationCache.status != "Error") {
                        enyo.Signals.send("createNotification", {
                            notificationCache: inEvent.notificationCache
                        });
                    }
                }
            }, 5000);
        } catch (e) {
            setTimeout(function() {
                that.$.ajaxMessages.hide();
            }, 5000);
        }
    },
    updateStatusBar: function(inSender, inEvent) {
        this.$.selectedItemsDescription.setContent(inEvent.message);
        this.$.createPolicyButton.hide();
        this.$.createNotificationButton.hide();
        this.$.clearSelectionButton.hide();
        this.$.createOfferButton.hide();
        this.$.statusBar.removeClass("showStatusBar");
    },
    updateAvailableOperations: function(inSender, inEvent) {
        this.$.allowedOperationRole.setContent("<div class='lightOperCol1Content'>Manage " + inEvent.selectedLayer + "</div>");
    },
    create: function(source, event) {
        this.inherited(arguments);
        // PBModel.getData();
    },
    rendered: function() {
        this.inherited(arguments);
    },
    viewChanged: function(inSender, inEvent) {
        if (inEvent.newView == this.viewName) {
            if (!this.map) {
                this.map = this.$.manageMapContainer.createComponent({
                    name: "manageMap",
                    kind: "LeafletMap",
                    classes: "map height100 mapBorders",
                    center: {
                        lat: 37.38381647175324,
                        lng: -121.98723024392321
                    },
                    onMarkerSelectionUpdated: "selectionUpdated",
                    onRouteSelection: "routeSelected"
                }, {
                    owner: this
                });
                this.$.manageMapContainer.render();
                this.$.manageMap.createComponent({
                    name: "aboutAssets",
                    classes: "aboutAssets"
                }, {
                    owner: this
                });
                this.$.aboutAssets.render();
                PBModel.getData();
                // this.loadLayers();
                // if (UserModel.userObject.roles == 'touroperator') {
                //     RoutesModel.loadRoutes();
                // }
            }
        }
    },
    showCreatePolicyPopup: function(inSender, inEvent) {
        this.$.createPolicyPopup.render();
        this.$.createPolicyPopup.setAutoDismiss(false);
    },
    showCreateOfferPopup: function(inSender, inEvent) {
        this.$.createOfferPopup.setAutoDismiss(false);
    },
    hideCreatePolicyPopup: function(inSender, inEvent) {
        this.$.createPolicyPopup.setAutoDismiss(true);
        this.$.createPolicyPopup.hide();
    },
    loadLayers: function() {
        var findObj = {
            "light": {
                "operatedBy": "iot-wf",
                "geocoordinates": {
                    "lat": "+37.232976" + "," + "+37.442615",
                    "lon": "-122.174149" + "," + "-121.771088"
                }
            }
        };
        // var parkingObj = {
        //     "query ": {
        //         "documentation ": "Get parking space operated by specified organization ",
        //         "find ": {
        //             "parkingSpace ": {
        //                 "operatedBy ": "iot-wf"
        //             }
        //         }
        //     }
        // };
        IlluminationModel.findLights(findObj);
        PBModel.getData("KIOSK");
    },
    illuminationModelUpdated: function() {
        if (this.map) {
            // AppConfig.log(this.$.manageMap);
            this.$.manageMap.addMarkerClusterLayer(IlluminationModel.illuminationObject, "light");
        }
    },
    // loadLayers: function() {
    //     var findObj = {
    //         "light": {
    //             "operatedBy": "iot-wf",
    //             "geocoordinates": {
    //                 "lat": "+37.232976" + "," + "+37.442615",
    //                 "lon": "-122.174149" + "," + "-121.771088"
    //             }
    //         }
    //     };
    //     // var parkingObj = {
    //     //     "query ": {
    //     //         "documentation ": "Get parking space operated by specified organization ",
    //     //         "find ": {
    //     //             "parkingSpace ": {
    //     //                 "operatedBy ": "iot-wf"
    //     //             }
    //     //         }
    //     //     }
    //     // };
    //     IlluminationModel.findLights(findObj);
    //     PBModel.getData("KIOSK");
    // },
    // illuminationModelUpdated: function() {
    //     if (this.map) {
    //         AppConfig.log(this.$.manageMap);
    //         this.$.manageMap.addMarkerClusterLayer(IlluminationModel.illuminationObject, "light");
    //     }
    // },
    PBDataUpdated: function() {
        this.$.regionComponentContainer.setCount(PBModel.PBObject.length);
        this.setNeighbourhoodArr(PBModel.PBObject);
        // if (this.map) {
        //     AppConfig.log(this.$.manageMap);
        //     this.$.manageMap.addMarkerClusterLayer(PBModel.PBObject);
        // }
    },
    selectionUpdated: function(inSender, inEvent) {
        var selectedMarkers = inEvent.selectedMarkers;
        var role = UserModel.userObject.roles;
        var message = "";
        var totalSelection = false;
        var totalLength = 0;
        var markerDet = "";
        _.each(selectedMarkers, function(markers, layer) {
            var layerDet = layer;
            var layerBoolean = layerDet.substring(layerDet.length - 1, layerDet.length) === "s" ? true : false;
            var selection = markers.length > 0 ? true : false;
            if (selection) {
                totalSelection = true;
                totalLength += markers.length;
                if (message === "") {
                    if (layerBoolean) message = markers.length > 1 ? (markers.length + " " + layer) : (markers.length + " " + layer.substring('s', layer.length - 1) + " is");
                    else message = markers.length > 1 ? (markers.length + " " + layer + "s") : (markers.length + " " + layer + " is");
                } else {
                    var maketSubData = "";
                    if (layerBoolean) maketSubData = markers.length > 1 ? (markers.length + " " + layer) : (markers.length + " " + layer.substring('s', layer.length - 1) + "");
                    else maketSubData = markers.length > 1 ? (markers.length + " " + layer + "s") : (markers.length + " " + layer + "");
                    var messageTemp = message;
                    if (messageTemp.substring(messageTemp.length - 3, messageTemp.length) === " is") {
                        message = message.substring(" is", message.length - 3) + " and " + maketSubData;
                    } else {
                        message = message + " and " + maketSubData;
                    }
                }
                AppConfig.log(message);
                // message += markers.length>1?(markers.length+ " " + layer):(markers.length+ " " + layer.substring('s', layer.length - 1));
                AppConfig.log(message);
            }
            switch (layer) {
                case "lights":
                    AppConfig.alert_(role, selection);
                    if (role == "lightoperator" && selection) {
                        this.$.createPolicyButton.show();
                    } else {
                        this.$.createPolicyButton.hide();
                    }
                    break;
                case "Key City Assets":
                    if (selection) {
                        message = markers[markers.length - 1].layer.options.markerData.Name + " " + markers[markers.length - 1].layer.options.markerData.type + " " + ((totalLength - 1) > 0 ? "+" + (totalLength - 1) : " is");
                    }
                    if (role == "businessuser" && markers.length == 1) {
                        this.$.createOfferButton.show();
                    } else {
                        this.$.createOfferButton.hide();
                    }
                    break;
                case "kiosks":
                    if (role == "cityoperator" && markers.length == 1) {
                        this.$.createNotificationButton.show();
                    } else {
                        this.$.createNotificationButton.hide();
                    }
                    break;
                case "offers":
                    if (role == "businessuser" && selection) {
                        this.$.createOfferButton.show();
                    } else {
                        this.$.createOfferButton.hide();
                    }
                    break;
                case "events":
                    if (selection) {
                        message = "";
                        var data = markers[markers.length - 1].layer.options.markerData;
                        message = data.title + " " + data.subtitle + " " + ((totalLength - 1) > 0 ? "+" + (totalLength - 1) : " is");
                    }
                    break;
            }
        }, this);
        if (totalSelection) {
            this.$.clearSelectionButton.show();
            this.$.statusBar.addClass("showStatusBar");
        } else {
            this.$.clearSelectionButton.hide();
            this.$.statusBar.removeClass("showStatusBar");
        }
        AppConfig.log(message);
        var messBoolean = message.substring(message.length - 3, message.length) === " is" ? true : false;
        message += messBoolean ? "" : " are";
        message += totalSelection ? " selected" : "Nothing Selected";
        this.$.selectedItemsDescription.setContent(message);
    },
    updateRouteDirections: function() {
        var that = this;
        if (this.map) {
            _.each(RoutesDirectionModel.routesDirectionObject, function(item) {
                that.map.addPolyLine(item.data.Stops, true, false, item.routeID);
            });
        }
        this.$.tourClearSelection.show();
        this.$.tourEnable.show();
        this.$.statusBar.addClass("showStatusBar");
    },
    routeSelected: function(inSender, inEvent) {
        var tourLayerId = inEvent.tourLayerId;
        this.$.selectedItemsDescription.setContent("Selected Tour:" + tourLayerId);
    },
    setNeighborhoods: function(inSender, inEvent) {
        if (PBModel.PBObject) {
            var index = inEvent.index;
            var item = inEvent.item;
            var neighborhood;
            if (this.neighbourhoodArr[index]) {
                neighborhood = this.neighbourhoodArr[index];
            } else if (PBModel.PBObject[index]) {
                neighborhood = PBModel.PBObject[index];
            }
            if (neighborhood) {
                item.$.neighborhoodLabel.setContent(neighborhood.Name);
                item.$.neighborhoodLabel.neighborHoodData = neighborhood.Bound;
            }
            return true;
        }
    },
    selectDeselect: function(inSender, inEvent) {
        var that = inSender;
        _.each(that.children, function(child) {
            if (inEvent.originator.content == child.$.neighborhoodLabel.content) {
                child.$.neighborhoodLabel.addClass("selectedNeighborhood");
            } else {
                child.$.neighborhoodLabel.removeClass("selectedNeighborhood");
            }
        });
        this.$.manageMap.gotoNeighborhood(PBModel.PBObject[inEvent.index]);
        this.$.regionPopupContainer.hide();
    },
    closeCreateNotificationPopUp: function() {
        this.$.createNotificationPopup.hide();
    },
    closeCreateOfferPopUp: function(inSender, inEvent) {
        this.$.createOfferPopup.setAutoDismiss(true);
        this.$.createOfferPopup.hide();
    },
    closeCreateNotificationPopUp: function(inSender, inEvent) {
        this.$.createNotificationPopup.hide();
    },
    handleKeyStroke: function(inSender, inEvent) {
        AppConfig.log(inSender.value);
        this.$.regionComponentContainer.setCount(0);
        var filterVal = inSender.value;
        var matches = _.filter(PBModel.PBObject, function(s) {
            return s.Name.indexOf(filterVal) !== -1;
        });
        this.setNeighbourhoodArr('');
        this.setNeighbourhoodArr(matches);
        AppConfig.log(PBModel.PBObject);
        // this.$.regionComponentContainer.reset();
        this.$.regionComponentContainer.setCount(this.neighbourhoodArr.length);
        this.$.regionComponentContainer.render();
    }
});