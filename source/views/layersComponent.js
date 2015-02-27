enyo.kind({
    name: "cls.LAYERS",
    components: [{
        // content: Constants.layersComponent.heading,
        classes: "heading"
    }, {
        name: "hi"
    }],
    create: function() {
        var that = this;
        _.each(["Lights", "Notifications", "Retail", "Tourist"], function(servicesName) {
            that.$.hi.createComponent({
                kind: "cls.layersComponent",
                servicesName: servicesName
            }, {
                owner: this.$.hi
            });
            that.inherited(arguments);
            that.$.hi.render();
        });
    }
});
enyo.kind({
    name: "cls.layersComponent",
    classes: "layersComponent",
    // style: "margin:10px;",
    handlers: {
        hideLayerPopup: "hideLayerPopup"
    },
    published: {
        currentLayerSelected: null,
        notificationCache: null
    },
    components: [{
        kind: "Signals",
        activeService: "activeService"
    }, {
        content: Constants.layersComponent.heading,
        classes: "heading"
    }, {
        name: "lsLayers",
        classes: "addNewLayerContent",
        components: [{
            kind: "onyx.MenuDecorator",
            classes: "layersComponentMenu inline",
            components: [{
                name: "lightingServices",
                kind: "onyx.Button",
                ontap: "popupActivated",
                // servicesName:"",
                content: "Lighting Services",
                classes: "addNewLayerButtonInactive inline"
            }, {
                kind: "onyx.ContextualPopup",
                classes: "addLayersPopup",
                name: "addLayersPopup_ls",
                floating: true,
                components: [{
                    kind: "addLayersComponent",
                    name: "lsLayersContainer"
                        // name: "lightingServicesLayers"
                }]
            }]
        }, {
            // classes: "fa fa-pencil leftmargin inline",
            ontap: "AppConfig.log('clicked');"
        }]
    }, {
        name: "nsLayers",
        classes: "addNewLayerContent",
        components: [{
            kind: "onyx.MenuDecorator",
            classes: "layersComponentMenu inline",
            components: [{
                name: "notificationServices",
                kind: "onyx.Button",
                ontap: "popupActivated",
                content: "Notification Services",
                classes: "addNewLayerButtonInactive inline"
            }, {
                kind: "onyx.ContextualPopup",
                classes: "addLayersPopup",
                name: "addLayersPopup_ns",
                floating: true,
                components: [{
                    kind: "addLayersComponent",
                    name: "nsLayersContainer"
                        // name: "lightingServicesLayers"
                }]
            }]
        }, {
            // classes: "fa fa-pencil leftmargin inline",
            ontap: "AppConfig.log('clicked');"
        }]
    }, {
        name: "rsLayers",
        classes: "addNewLayerContent",
        components: [{
            kind: "onyx.MenuDecorator",
            classes: "layersComponentMenu inline",
            components: [{
                name: "retailServices",
                kind: "onyx.Button",
                ontap: "popupActivated",
                content: "Retail Services",
                classes: "addNewLayerButtonInactive inline"
            }, {
                kind: "onyx.ContextualPopup",
                classes: "addLayersPopup",
                name: "addLayersPopup_rs",
                floating: true,
                components: [{
                    kind: "addLayersComponent",
                    name: "rsLayersContainer"
                        // name: "lightingServicesLayers"
                }]
            }]
        }, {
            // classes: "fa fa-pencil leftmargin inline",
            ontap: "AppConfig.log('clicked');"
        }]
    }, {
        name: "tsLayers",
        classes: "addNewLayerContent",
        components: [{
            kind: "onyx.MenuDecorator",
            classes: "layersComponentMenu inline",
            components: [{
                name: "touristServices",
                kind: "onyx.Button",
                ontap: "popupActivated",
                content: "Tourist Services",
                classes: "addNewLayerButtonInactive inline"
            }, {
                kind: "onyx.ContextualPopup",
                classes: "addLayersPopup",
                name: "addLayersPopup_ts",
                floating: true,
                components: [{
                    kind: "addLayersComponent",
                    name: "tsLayersContainer"
                        // name: "lightingServicesLayers"
                }]
            }]
        }]
    }, {
        name: "divider",
        classes: "top-border"
    }, {
        name: "layersContainer",
        classes: "layersContainer"
    }, {
        name: "notificationBox",
        classes: "notificationBox",
        components: [{
            tag: "i",
            classes: "fa fa-exclamation-circle inline",
            // classes:"exclamation"
        }, {
            name: "notificationType",
            classes: "notificationType"
        }, {
            name: "notificationDescription",
            classes: "notificationDescription"
        }, {
            kind: "enyo.Button",
            content: "Finish Notification",
            classes: "addNewLayerButton",
            ontap: "hideNotificationBox"
        }]
    }, {
        kind: "Signals",
        createNotification: "createNotification"
    }],
    // create: function() {
    //     this.inherited(arguments);
    //     this.servicesNameChanged();
    // },
    // servicesNameChanged: function() {
    //     this.$.servicesName.setContent(this.servicesName);
    // },
    create: function() {
        this.inherited(arguments);
        this.$.notificationBox.hide();
        this.layerChanged();
    },
    layerChanged: function() {
        this.currentLayerSelected = this.$.lightingServices;
    },
    updateServicesAllowedBar: function(inSender, inEvent) {
        // AppConfig.log(inSender, inEvent);
    },
    hideLayerPopup: function(inSender, inResponse) {
        // AppConfig.log(inSender, inResponse);
        AppConfig.log(inSender.name);
        switch (inSender.name) {
            case 'lsLayers':
                this.$.addLayersPopup_ls.hide();
                break;
            case 'nsLayers':
                this.$.addLayersPopup_ns.hide();
                break;
            case 'rsLayers':
                this.$.addLayersPopup_rs.hide();
                break;
            case 'tsLayers':
                this.$.addLayersPopup_ts.hide();
                break;
            default:
                break;
        };
        var that = this;
        var count = 0;
        that.$.layersContainer.children = [];
        _.each(LayersModel.layersObj, function(layer) {
            if (layer.active) {
                count++;
                that.$.layersContainer.createComponent({
                    // kind: "cls.layerComponent",
                    layerName: layer.layerName
                }, {
                    owner: that
                });
                that.$.layersContainer.render();
            }
        });
        // that.$.layersCountValue.setContent("<span class='layersCountBrackets'>" + count + "</span>");
    },
    hideNotificationBox: function(inSender, inEvent) {
        var data = this.notificationCache;
        var postBody = {
            "query": {
                "documentation": "Cancel the notification for specified kiosk",
                "find": {
                    "kiosk": {
                        "id": data.kioskID
                    }
                },
                "process": {
                    "set": {
                        "currentAlert": null
                    }
                }
            }
        };
        var token = UserModel.responseHeader.token;
        var authToken = {
            "token": token,
            "app": 'portal'
        };
        AjaxAPI.makeAjaxRequest("/api/kiosk", null, this, "successCallback", "errorCallback", "POST", postBody, null, null, authToken);

    },
    // MQ team said they would be sending a json and not sure of http error codes,
    // so, For now, both response handlers do an adhoc display
    successCallback: function(inSender, inEvent) {
        var message = inEvent.status == 'Success' ? "You have successfully cleared the alerts on specified Kiosks" : "Clearing the alerts on specified Kiosks was unsuccessful";
        AppConfig.log(message);
        enyo.Signals.send("updateAjaxMessages", {
            "ajaxMessage": message
        });
        this.$.notificationBox.hide();
        enyo.Signals.send("clearSelection", {});
    },
    errorCallback: function(inSender, inEvent) {
        AppConfig.log(inEvent.response);
        var message = "Successfully Cleared the notification on the current Kiosks";
        enyo.Signals.send("updateAjaxMessages", {
            ajaxMessage: message
        });
        this.$.notificationBox.hide();

    },
    createNotification: function(inSender, inEvent) {
        // AppConfig.log(inEvent);
        this.notificationCache = inEvent.notificationCache;
        this.$.notificationType.setContent(this.notificationCache.notificationType);
        this.$.notificationDescription.setContent(this.notificationCache.description);
        this.$.notificationBox.show();
        this.bubbleUp("closeCreateNotifiactionPopUp");
    },
    popupActivated: function(inSender, inEvent) {
        // switch(this.currentLayerSelected){
        //     case 'Lighting Services':
        //         this.$.lightingServices.removeClass('addNewLayerButton');
        //         break;
        //     case 'Notification Services':
        //         this.$.notificationServices.removeClass('addNewLayerButtonInactive');
        //         break;
        //     case 'Retail Services':
        //         this.$.retailServices.removeClass('addNewLayerButtonInactive');
        //         break;
        //     case 'Tourist Services':
        //         this.$.touristServices.removeClass('addNewLayerButtonInactive');
        //         break;
        //     default:
        //         break;
        // };
        enyo.Signals.send("updateAvailableOperations", {
            selectedLayer: inSender.content
        });
        AppConfig.log("inside popupActivated");
        localStorage.setItem("serviceButtonActive", '');
        localStorage.setItem("serviceButtonActive", inSender.content);
        switch (inSender.content) {
            case 'Lighting Services':
                AppConfig.log(this.currentLayerSelected);
                this.$.lightingServices.removeClass("addNewLayerButtonInactive");
                this.currentLayerSelected = this.$.lightingServices;
                this.$.lightingServices.addClass("addNewLayerButton");
                this.$.lightingServices.addClass("lsButtonActive");
                this.$.notificationServices.removeClass("nsButtonActive");
                this.$.retailServices.removeClass("rsButtonActive");
                this.$.touristServices.removeClass("tsButtonActive");
                this.$.lsLayersContainer.createCheckBoxComponents(inSender, inEvent);
                AppConfig.log("lighting success");
                break;
            case 'Notification Services':
                AppConfig.log(this.currentLayerSelected);
                this.$.notificationServices.removeClass("addNewLayerButtonInactive");
                this.currentLayerSelected = this.$.notificationServices;
                this.$.notificationServices.addClass("addNewLayerButton");
                this.$.notificationServices.addClass("nsButtonActive");
                this.$.lightingServices.removeClass("lsButtonActive");
                this.$.retailServices.removeClass("rsButtonActive");
                this.$.touristServices.removeClass("tsButtonActive");
                this.$.nsLayersContainer.createCheckBoxComponents(inSender, inEvent);
                AppConfig.log("notification success");
                break;
            case 'Retail Services':
                AppConfig.log(this.currentLayerSelected);
                this.$.retailServices.removeClass("addNewLayerButtonInactive");
                this.currentLayerSelected = this.$.retailServices;
                this.$.retailServices.addClass("addNewLayerButton");
                this.$.retailServices.addClass("rsButtonActive");
                this.$.lightingServices.removeClass("lsButtonActive");
                this.$.touristServices.removeClass("tsButtonActive");
                this.$.notificationServices.removeClass("nsButtonActive");
                this.$.rsLayersContainer.createCheckBoxComponents(inSender, inEvent);
                AppConfig.log("retail success");
                break;
            case 'Tourist Services':
                AppConfig.log(this.currentLayerSelected);
                this.$.touristServices.removeClass("addNewLayerButtonInactive");
                this.currentLayerSelected = this.$.touristServices;
                this.$.touristServices.addClass("addNewLayerButton");
                this.$.touristServices.addClass("tsButtonActive");
                this.$.notificationServices.removeClass("nsButtonActive");
                this.$.lightingServices.removeClass("lsButtonActive");
                this.$.retailServices.removeClass("rsButtonActive");
                this.$.tsLayersContainer.createCheckBoxComponents(inSender, inEvent);
                AppConfig.log("Tourist success");
                break;
            default:
                break;
        };
        // enyo.Signals.send("updateAvailablOperations",{message:inSender.components[0].content});
        // Constants.layersComponent.currentOperation = inSender.components[0].content;
        // this.$.addLayersComponentContainer.createCheckBoxComponents();
    },
    serviceButtonActive: function(inSender) {
        switch (inSender) {
            case 'Lighting Services':
                AppConfig.log(this.currentLayerSelected);
                this.$.lightingServices.removeClass("addNewLayerButtonInactive");
                this.currentLayerSelected = this.$.lightingServices;
                this.$.lightingServices.addClass("addNewLayerButton");
                this.$.lightingServices.addClass("lsButtonActive");
                AppConfig.log("lighting success");
                break;
            case 'Notification Services':
                AppConfig.log(this.currentLayerSelected);
                this.$.notificationServices.removeClass("addNewLayerButtonInactive");
                this.currentLayerSelected = this.$.notificationServices;
                this.$.notificationServices.addClass("addNewLayerButton");
                this.$.notificationServices.addClass("nsButtonActive");
                AppConfig.log("notification success");
                break;
            case 'Retail Services':
                AppConfig.log(this.currentLayerSelected);
                this.$.retailServices.removeClass("addNewLayerButtonInactive");
                this.currentLayerSelected = this.$.retailServices;
                this.$.retailServices.addClass("addNewLayerButton");
                this.$.retailServices.addClass("rsButtonActive");
                AppConfig.log("retail success");
                break;
            case 'Tourist Services':
                AppConfig.log(this.currentLayerSelected);
                this.$.touristServices.removeClass("addNewLayerButtonInactive");
                this.currentLayerSelected = this.$.touristServices;
                this.$.touristServices.addClass("addNewLayerButton");
                this.$.touristServices.addClass("tsButtonActive");
                AppConfig.log("Tourist success");
                break;
            default:
                break;
        };
    },
    activeService: function() {
        this.serviceButtonActive(localStorage.serviceButtonActive);
    }
});
enyo.kind({
    name: "cls.layerComponent",
    kind: "FittableColumns",
    classes: "layerComponent",
    published: {
        layerName: ""
    },
    components: [{
        classes: "eyeOutline",
        content: '<i class="fa fa-eye fa-fw"></i>',
        allowHtml: true
    }, {
        name: "layerName",
        content: "Layer Name",
        classes: "layerName"
    }, {
        kind: "Image",
        src: "assets/layercomponent-close.png",
        classes: "layerComponentCloseImage",
        ontap: "removeLayer"
    }],
    create: function() {
        this.inherited(arguments);
        this.layerNameChanged();
    },
    layerNameChanged: function() {
        this.$.layerName.setContent(this.layerName);
    },
    removeLayer: function() {
        LayersModel.changeLayerStatus(this.layerName, false);
        enyo.Signals.send("applyLayers");
        this.destroy();
    }
});
/*Add Layer popup*/
enyo.kind({
    name: "addLayersComponent",
    kind: "FittableRows",
    published: {
        layers: ""
    },
    components: [{
        name: "row2",
        classes: "layerSelectionInfo",
        components: [{
            content: "Select layers you would like to show on the map",
            classes: "selectLayersTitle"
        }, {
            name: "layersTitleBorder",
            classes: "layersTitleBorder"
        }]
    }, {
        kind: "Scroller",
        classes: "checkBoxcontainer",
        horizontal: "hidden",
        /*Layers to be added dynamicaly*/
        components: [{
            name: "checkBoxContainer"
        }]
    }, {
        name: "row4",
        classes: "centerAlign popUpFooter",
        components: [{
            kind: "enyo.Button",
            content: "Cancel",
            classes: "cancelButton",
            ontap: "hidePopup"
        }, {
            kind: "enyo.Button",
            content: "Done",
            classes: "doneButton",
            ontap: "applyLayers",
            name: "done"
        }]
    }],
    create: function() {
        this.inherited(arguments);
    },
    createCheckBoxComponents: function(inSender, inEvent) {
        var that = this;
        this.layers = LayersModel.layersObj;
        var currentSubject = inSender.parent.children[1].controls[3];
        currentSubject.$.checkBoxContainer.children = [];
        // inSender.parent.components[2].children = [];
        // that.$.checkBoxContainer.children = [];
        _.each(LayersModel.layersObj, function(layer) {
            // AppConfig.log(list.length);
            currentSubject.$.checkBoxContainer.createComponent({
                kind: "layersSelectionComponent",
                checkedStatus: layer.active,
                layer: layer.layerName,
                // onchange: "checkboxSelected"
            }, {
                owner: currentSubject
            });
            currentSubject.$.checkBoxContainer.render();
        });
    },
    applyLayers: function() {
        this.hidePopup();
        localStorage.setItem("servicesInfo", '');
        localStorage.setItem("servicesStatus", '');
        var servicesArr = [];
        var servicesStatusArr = [];
        AppConfig.debug();
        _.each(this.$.checkBoxContainer.children, function(child) {
            // AppConfig.log(child.content, child.getValue());
            // var childService={"serviceName":child.content, "serviceStatus":child.getValue()};
            servicesArr.push(child.content);
            servicesStatusArr.push(child.getValue());
            LayersModel.changeLayerStatus(child.content, child.getValue());
        });
        // var servicesValues={"data":servicesArr};
        localStorage.setItem("servicesInfo", servicesArr);
        localStorage.setItem("servicesStatus", servicesStatusArr);
        enyo.Signals.send("applyLayers");
    },
    // checkboxSelected: function(inSender) {
    //     // LayersModel.changeLayerStatus(inSender.content, inSender.getValue());
    // },
    hidePopup: function(argument) {
        // this.hide();
        // body...
        this.bubbleUp("hideLayerPopup");
    }
});
/*Reusable component to be used for each layer*/
enyo.kind({
    name: "layersSelectionComponent",
    kind: "onyx.Checkbox",
    classes: "layersSelectionComponent layerSelectionCheckbox",
    // handlers: {
    //     onchange: "checkboxSelected"
    // },
    content: "",
    published: {
        layer: "",
        checkedStatus: false
    },
    // components: [{
    //     name: "parentCheckboxContainer",
    //     components: []
    // }, {
    //     name: "childCheckboxContainer",
    //     // kind: "FittableRows",
    //     classes: "childCheckboxContainer",
    //     components: []
    // }],
    create: function() {
        this.inherited(arguments);
        this.layerChanged();
        this.checkedStatusChanged();
    },
    checkedStatusChanged: function() {
        this.setValue(this.checkedStatus);
    },
    layerChanged: function() {
        this.setContent(this.layer);
        // this.$.parentCheckboxContainer.createComponent({
        //     kind: "enyo.Checkbox",
        //     onchange: "checkboxChanged",
        //     content: this.layer.name,
        //     checked: this.layer.checked
        // }, {
        //     owner: this
        // });
        // var that = this;
        // if (this.layer.childComponents) {
        //     _.each(this.layer.childComponents, function(value, key, list) {
        //         AppConfig.log(list.length);
        //         that.$.childCheckboxContainer.createComponent({
        //             kind: "enyo.Checkbox",
        //             style: "display:block;",
        //             onchange: "checkboxChanged",
        //             content: value.name,
        //             checked: value.checked
        //         }, {
        //             owner: that
        //         });
        //     });
        // }
    },
    checkboxSelected: function(inSender) {
        // LayersModel.changeLayerStatus(inSender.content, inSender.getValue());
    }
});
