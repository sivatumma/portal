enyo.kind({
    name: "cls.createNotification",
    kind: "FittableRows",
    classes: "createNotificationView",
    uploadedFiles: {
        notification: "",
        coupon: ""
    },
    statics: {},
    components: [{
            name: "createOfficeHeader",
            kind: "FittableColumns",
            classes: "createOfficeHeader",
            components: [{
                content: "Send a Notification",
                classes: "notificationPopUpTitle"
            }, {
                kind: "FittableColumns",
                classes: "alignRight",
                components: [{
                    content: " Kiosks Selected",
                    classes: "leftDefaultPaddding storesSelectlabel"
                }]
            }]
        },
        //  {
        //     name: "alertMessage",
        //     content: "Please check your registration credentials",
        //     style: "display:none; font-size:80%;color: red; margin-top:10px;"
        // },
        {
            name: "messageType",
            kind: "Select",
            classes: "offerCategorySelect width100 topDefaultMargin bottomDefaultMargin",
            style: "font-size:100%;",
            placeholder: "Categories",
            onchange: "selectChanged",
            components: [{
                    content: "Alert",
                    value: "Alert !",
                    classes: "left"
                }, {
                    content: "Flood Alert",
                    value: "Flood Alert !"
                }, {
                    content: "Quake Alert",
                    value: "Quake Alert !!"
                }
                // {content: "Other", value: "O"},
            ]
        }, {
            kind: "onyx.TextArea",
            classes: "width100 topDefaultMargin bottomDefaultMargin labelBorder",
            style: "height:100px;",
            name: "messageDescription",
            placeholder: "Message",
            // onchange: "inputChanged"
        },
        // {
        //         kind: "onyx.InputDecorator",
        //         classes: "width100 topDefaultMargin bottomDefaultMargin",
        //         name: "categoryDec",
        //         components: [{
        //             kind: "onyx.Input",
        //             name: "category",
        //             placeholder: "Category",
        //             // onchange: "inputChanged"
        //         }]
        //     }, 
        {
            name: "actionsSection",
            classes: "actionsSection",
            components: [{
                kind: "enyo.Button",
                content: "Cancel",
                ontap: "hidePopup",
                classes: "cancelButton"
            }, {
                kind: "enyo.Button",
                content: "Done",
                ontap: "createNotification",
                classes: "doneButton"
            }]
        }
    ],
    create: function() {
        this.inherited(arguments);
        // this.selectedLightsCountChanged();
    },
    createNotification: function(inSender, inEvent) {
        var messageType = this.$.messageType.getValue();
        var messageDescription = this.$.messageDescription.getValue();
        if (messageType == '' || messageType == 'Message Type') {
            this.$.messageType.addStyles("border:1px solid red;");
            this.$.messageType.focus();
            // this.$.alertMessage.show();
            // this.$.alertMessage.setContent("Plase enter title");
            return false;
        } else if (messageDescription == '' || messageDescription == 'Message') {
            this.$.messageDescription.addStyles("border:1px solid red;");
            return false;
        } else {
            this.$.messageType.addStyles("border:1px solid silver;");
            this.$.messageDescription.addStyles("border:1px solid silver;");
            AppConfig.log("Going to notify");
            var messageBody = {
                "description": messageDescription,
                "notificationType": messageType
            };
            enyo.Signals.send("sendNotificationToKiosks", {
                "messageBody": messageBody
            });
            // AjaxAPI.makeAjaxRequest("/offers", null, this, "processMyData", null, "POST", postBody, null, null, this.authToken);
            // AjaxAPI.makeAjaxRequest("/createNotification", null, this, this.successCallback, this.errorCallback, "POST", null, authToken);
        }
    },
    hidePopup: function() {
        this.bubble("closeCreateNotificationPopUp");
    },
    successCallback: function(inSender, inEvent) {
        enyo.Signals.send("createNotification", {
            "messageType": messageType,
            "messageDescription": messageDescription
        });
        this.bubble('closeCreateNotificationPopUp');
    },
    errorCallback: function(inSender, inEvent) {
        var messageType = this.$.messageType.getValue();
        var messageDescription = this.$.messageDescription.getValue();
        enyo.Signals.send("createNotification", {
            "messageType": messageType,
            "messageDescription": messageDescription
        });
        this.bubble('closeCreateNotificationPopUp');
    }
});
