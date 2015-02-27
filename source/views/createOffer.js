enyo.kind({
    name: "cls.createOffer",
    kind: "FittableRows",
    classes: "createOfferView",
    uploadedFiles: {
        offer: "",
        coupon: ""
    },
    components: [{
        name: "createOfficeHeader",
        kind: "FittableColumns",
        classes: "createOfficeHeader",
        components: [{
            content: "Create retail offer",
            classes: "offerPopUpTitle"
        }, {
            kind: "FittableColumns",
            classes: "alignRight",
            components: [{
                content: " Selected Store name",
                classes: "leftDefaultPaddding storesSelectlabel fontSize80"
            }]
        }]
    }, {
        kind: "onyx.InputDecorator",
        classes: "width100 createOfferTitle topDefaultMargin bottomDefaultMargin labelBorder",
        name: "titleDec",
        components: [{
            kind: "onyx.Input",
            name: "title",
            placeholder: "Title",
            // onchange: "inputChanged"
        }]
    }, {
        kind: "onyx.InputDecorator",
        classes: "width100 topDefaultMargin bottomDefaultMargin labelBorder",
        name: "locationDec",
        components: [{
            kind: "onyx.Input",
            name: "location",
            // placeholder: "Location",
            // onchange: "inputChanged"
            placeholder: "Description"
        }]
    }, {
        name: "categoryDec",
        kind: "Select",
        classes: "offerCategorySelect width100 topDefaultMargin bottomDefaultMargin",
        placeholder: "Categories",
        onchange: "selectChanged",
        components: [{
            content: "Categories",
            value: "0",
            classes: "left"
        }, {
            content: "Arts, Culture, Entertainment",
            value: "Arts, Culture, Entertainment"
        }, {
            content: "Hotels",
            value: "Hotels"
        }, {
            content: "Dining",
            value: "Dining"
        }, {
            content: "Shopping",
            value: "Shopping"
        }, {
            content: "Music & Nightlife",
            value: "Music & Nightlife"
        }, {
            content: "Sports & Recreation",
            value: "Sports & Recreation"
        }, {
            content: "Transportation",
            value: "Transportation"
        }]
    }, {
        classes: "width100 topDefaultMargin bottomDefaultMargin",
        name: "startDateDiv",
        components: [{
            kind: "dateComponent",
            name: "startDate"
        }]
    }, {
        classes: "width100 topDefaultMargin bottomDefaultMargin",
        name: "endDateDiv",
        components: [{
            kind: "dateComponent",
            name: "endDate"
        }]
    }, {
        kind: "Select",
        onchange: "selectChanged",
        classes: "frequencySelect width100",
        name: "frequency",
        components: [{
            content: "Frequency",
            value: "0",
        }, {
            content: "5",
            value: "5",
        }, {
            content: "10",
            value: "10",
        }]
    }, {
        kind: "onyx.InputDecorator",
        classes: "width100 topDefaultMargin bottomDefaultMargin labelBorder",
        name: "radiusDec",
        components: [{
            kind: "onyx.Input",
            name: "radius",
            placeholder: "Radius",
            // onchange: "inputChanged"
        }]
    }, {
        // kind: "onyx.InputDecorator",
        name: "fileInputDiv",
        classes: "width100 fileInputDiv topDefaultMargin bottomDefaultMargin",
        components: [{
            kind: "FittableColumns",
            components: [{
                kind: "enyo.FileInputDecorator",
                onSelect: "fileUploaded",
                imageType: "offer",
                style: "width:50%"
                    // onchange: "inputChanged"
            }, {
                kind: "enyo.FileInputDecorator",
                style: "width:50%",
                imageType: "coupon",
                onSelect: "fileUploaded",
                // onchange: "inputChanged"
            }]
        }]
    }, {
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
            ontap: "createOffer",
            classes: "doneButton"
        }]
    }],
    create: function() {
        this.inherited(arguments);
        // this.$.startDate.setValue(moment().format('D MMMM, YYYY'));
        // this.$.endDate.setValue(moment().format('D MMMM, YYYY'));
        // this.selectedLightsCountChanged();
    },
    createOffer: function(inSender, inEvent) {
        var title = this.$.title.getValue();
        var location = this.$.location.getValue();
        var category = this.$.categoryDec.getValue();
        var frequency = this.$.frequency.getValue();
        var radius = this.$.radius.getValue();
        var startDate = jQuery('#' + this.$.startDate.$.dateInput.id).val();
        var endDate = jQuery('#' + this.$.endDate.$.dateInput.id).val();
        var fileStatus = false;
        _.each(this.uploadedFiles, function(file) {
            if (file.length == 0) {
                fileStatus = false;
                return;
            } else {
                fileStatus = true;
            }
        });
        if (title == '' || title == 'Title') {
            this.$.titleDec.addStyles("border:1px solid red;");
            this.$.titleDec.focus();
            // this.$.alertMessage.show();
            // this.$.alertMessage.setContent("Plase enter title");
            return false;
        } else if (location == '' || location == 'Location') {
            this.$.locationDec.addStyles("border:1px solid red;");
            return false;
        } else if (category == '' || category == 0) {
            this.$.categoryDec.addStyles("border:1px solid red;");
            return false;
        } else if (startDate == '') {
            this.$.startDate.$.dateInput.addStyles("border:1px solid red;");
            return false;
        } else if (endDate == '') {
            this.$.endDate.$.dateInput.addStyles("border:1px solid red;");
            return false;
        } else if (frequency == '' || frequency == 0) {
            this.$.frequency.addStyles("border:1px solid red;");
            return false;
        } else if (radius == '' || radius == "radius" || isNaN(parseInt(radius))) {
            this.$.radiusDec.addStyles("border:1px solid red;");
            return false;
        } else if (!fileStatus) {
            this.$.fileInputDiv.addStyles("border:1px solid red;");
            return false;
        } else {
            this.OfferPopUpValuesValidations();
            var thumbImg = "";
            var couponImg = "";
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token,
                "app": 'portal'
            };
            if (this.uploadedFiles["offer"]["length"]) {
                var filebody = this.uploadedFiles["offer"][0];
                var formData = new FormData();
                formData.append("file", filebody);
                AjaxAPI.makeAjaxRequest("/upload", null, this, "processFilesData", null, "POST", formData, "multipart/form-data", null, authToken);
            }
        }
    },
    fileUploaded: function(inSender, inEvent) {
        this.uploadedFiles[inSender.imageType] = inEvent.files;
    },
    hidePopup: function() {
        this.emptyOfferPopUpValues();
        this.bubble("closeCreateOfferPopUp");
        this.OfferPopUpValuesValidations();
    },
    processFilesData: function(inSender, inEvent) {
        this.thumbImg = inEvent.image;
        if (this.uploadedFiles["coupon"]["length"]) {
            var filebody = this.uploadedFiles["coupon"][0];
            var formData = new FormData();
            formData.append("file", filebody);
            AjaxAPI.makeAjaxRequest("/upload", null, this, "processOfferData", null, "POST", formData, "multipart/form-data", null, this.authToken);
        }
    },
    processOfferData: function(inSender, inEvent) {
        this.couponImg = inEvent.image;
        var title = this.$.title.getValue();
        var location = this.$.location.getValue();
        var category = this.$.categoryDec.getValue();
        var frequency = this.$.frequency.getValue();
        var radius = this.$.radius.getValue();
        var startDate = jQuery('#' + this.$.startDate.$.dateInput.id).val();
        var endDate = jQuery('#' + this.$.endDate.$.dateInput.id).val();
        var postBody = {
            "title": title,
            "location": location,
            "category": category,
            "startDate": startDate,
            "endDate": endDate,
            "thumb": this.thumbImg,
            "coupon": this.couponImg,
            "frequency": frequency,
            "radius": radius
        };
        AppConfig.log(postBody);
        AjaxAPI.makeAjaxRequest("/offers", null, this, "processMyData", null, "POST", postBody, null, null, this.authToken);
    },
    processMyData: function(inResponse, inEvent) {
        this.bubble('closeCreateOfferPopUp');
        // for now till testing completed, need to optimize the code
        this.emptyOfferPopUpValues();
        this.OfferPopUpValuesValidations();
        var statusMessage = inResponse.xhrResponse.status == 200 ? 'Offer Created Successfully' : 'Offer was not Created';
        enyo.Signals.send("updateAjaxMessages", {
            ajaxMessage: statusMessage
        });
    },
    emptyOfferPopUpValues: function() {
        this.$.title.setValue("");
        this.$.location.setValue("");
        this.$.radius.setValue("");
    },
    OfferPopUpValuesValidations: function() {
        this.$.titleDec.addStyles("border:1px solid silver;");
        this.$.locationDec.addStyles("border:1px solid silver;");
        this.$.radiusDec.addStyles("border:1px solid silver;");
        this.$.categoryDec.addStyles("border:1px solid silver;");
        this.$.startDate.$.dateInput.addStyles("border:1px solid silver;");
        this.$.frequency.addStyles("border:1px solid silver;");
        this.$.endDate.$.dateInput.addStyles("border:1px solid silver;");
        this.$.fileInputDiv.addStyles("border:0px solid silver;");
    }
});