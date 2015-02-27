enyo.kind({
    name: "cls.createPolicy",
    kind: "FittableRows",
    published: {
        currentLightState: '',
        selectedLightsCount: "",
        selectedPolicyRule: "",
        intensitySelected: false
    },
    components: [{
        kind: "Signals",
        onSubmitPolicy: "onSubmitPolicy",
        updateCurrentLightState: "updateCurrentLightState"
    }, {
        name: "createPolicyHeader",
        kind: "FittableColumns",
        classes: "createPolicyHeader",
        components: [{
            content: "Create a New Policy",
        }, {
            kind: "FittableColumns",
            classes: "alignRight",
            components: [{
                name: "selectedLightsCount",
                content: ""
            }, {
                content: " Lights Selected",
                classes: "leftDefaultPaddding lightsSelectlabel"
            }]
        }]
    }, {
        name: "policyRuleSelector",
        classes: "policyRuleSelector",
        components: [{
                content: "Policy Rule"
            },
            // {
            //     kind: "Select",
            //     name: "policyRuleSelection",
            //     classes: "policyRuleSelection",
            //     onchange: "selectChanged",
            //     components: [{
            //         content: "Switch On",
            //         value: "on"
            //     }, {
            //         content: "Switch Off",
            //         value: "off"
            //     }, {
            //         content: "Dim +10%",
            //         value: "Dim +10%"
            //     }, {
            //         content: "Dim +20%",
            //         value: "Dim +20%"
            //     }, {
            //         content: "Dim +30%",
            //         value: "Dim +30%"
            //     }, {
            //         content: "Dim +40%",
            //         value: "Dim +40%"
            //     }, {
            //         content: "Dim +50%",
            //         value: "Dim +50%"
            //     }, {
            //         content: "Dim +60%",
            //         value: "Dim +60%"
            //     }, {
            //         content: "Dim +70%",
            //         value: "Dim +70%"
            //     }, {
            //         content: "Dim +80%",
            //         value: "Dim +80%"
            //     }, {
            //         content: "Dim +90%",
            //         value: "Dim +90%"
            //     }, {
            //         content: "Dim +100%",
            //         value: "Dim +100%"
            //     }]
            // }
        ]
    }, {
        content: "Intensity",
        classes: "fontSize80"
    }, {
        kind: "FittableColumns",
        classes: "width100 sliderContainer",
        components: [{
            kind: "onyx.Slider",
            name: "intensitySlider",
            classes: "intensitySlider",
            style: "width:63%",
            value: 30,
            increment: 10,
            onChange: "retrieveIntensity"
        }, {
            name: "intensityLevel",
            content: "30%",
            classes: "intensitylevel"
        }, {
            name: "onoffstate",
            kind: "onyx.ToggleButton",
            onContent: "ON",
            offContent: "OFF",
            classes: "intensityToggle",
            onChange: "intensityToggleChanged",
            active: this.currentLightState
        }]
    }, {
        name: "dateTimeInfo",
        classes: "dateTimeInfo",
        components: [{
                kind: "FittableRows",
                components: [{
                    name: "dateInfo",
                    kind: "FittableRows",
                    classes: "dateInfo",
                    // components: [{
                    //     kind: "FittableRows",
                    //     // style:"margin-bottom: 10px;",
                    //     classes: "dateTimeSection",
                    components: [{
                        kind: "FittableColumns",
                        classes: "dateSection",
                        components: [{
                            content: "Effective from:",
                            classes: "fontSize100 verticalAlign width40"
                        }, {
                            name: "startDate",
                            kind: "dateComponent",
                            classes: "width50"
                        }]
                    }, {
                        components: [{
                            kind: "FittableColumns",
                            classes: "tillDateSection",
                            components: [{
                                content: "Till: ",
                                classes: "fontSize100 verticalAlign width40"
                            }, {
                                name: "endDate",
                                kind: "dateComponent",
                                classes: "width50"
                            }]
                        }]
                    }]
                }, {
                    // kind: "FittableColumns",
                    components: [{
                        kind: "FittableColumns",
                        components: [{
                            content: "Start Time: ",
                            classes: "fontSize100 verticalAlign marginTop10 width40"
                        }, {
                            classes: "marginTop5",
                            name: "startTime",
                            kind: "timeComponent",
                            classes: "startTimeInputBox width50"
                        }]
                    }, {
                        components: [{
                            kind: "FittableColumns",
                            classes: "startTimeInputBox",
                            components: [{
                                content: "End Time: ",
                                classes: "fontSize100 verticalAlign marginTop10 width40"
                            }, {
                                classes: "marginTop5",
                                name: "endTime",
                                kind: "timeComponent",
                                classes: "width50"
                            }]
                        }]
                    }]
                }]
            }]
            // }]
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
            ontap: "createPolicy",
            classes: "doneButton"
        }]
    }, {
        name: "alertMessage",
        classes: "createPolicy_alertMessage"
    }],
    create: function() {
        this.inherited(arguments);
        this.selectedLightsCountChanged();
        this.rendered();
        this.$.onoffstate.active = this.currentLightState == "ON";
    },
    constructor:function(){
        this.inherited(arguments);
        console.log(this.currentAssetClicked);
    },
    retrieveIntensity: function(inSender, inEvent) {
        this.$.intensityLevel.setContent(Math.floor(inEvent.value) + "%");
    },
    updateCurrentLightState: function(inSender, inEvent){
        //  Update this.$ onoffstate according to selected light's ON/OFF
        try{
            this.currentLightState = inEvent.lights[inEvent.lights.length-1].layer.options.markerData.powerstate == "ON";
            this.$.onoffstate.setActive(this.currentLightState);
        } catch (e) {
            AppConfig.log("Looks like a light is deselected, no current update on createPolicy toggle for now");
        }
    },
    intensityToggleChanged: function(inSender, inEvent) {
        AppConfig.log(inSender.active);
        this.setIntensitySelected(this.$.onoffstate.getValue());
        if (inSender.active) {
            AppConfig.alert_(this.$.onoffstate.getValue());
            this.$.policyRuleSelection.value = "on";
        }
        if (!inSender.active) {
            AppConfig.alert_(this.$.onoffstate.getValue());
            this.$.policyRuleSelection.value = "off";
        }
    },
    onSubmitPolicy: function(inSender, inEvent) {
        AppConfig.log("Please update the data here (Of the dates and times being policy made...");
    },
    createPolicy: function(inSender, inEvent) {
        var startDate = moment(jQuery('#' + this.$.startDate.$.dateInput.id).val()).format('D MMM, YYYY');
        var endDate = moment(jQuery('#' + this.$.endDate.$.dateInput.id).val()).format('D MMM, YYYY');
        var startTime = jQuery('#' + this.$.startTime.$.timeInput.id).val();
        var endTime = jQuery('#' + this.$.endTime.$.timeInput.id).val();
        var selectedPolicyRule = this.selectedPolicyRule;
        var postBody;
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var start_date_contents = startDate.split(' ');
        var end_date_contents = endDate.split(' ');
        var dt_st = new Date(20 + start_date_contents[2], months.indexOf(start_date_contents[1]), start_date_contents[0], 0, 0, 0, 0); //for convenience
        var dt_end = new Date(20 + end_date_contents[2], months.indexOf(end_date_contents[1]), end_date_contents[0], 0, 0, 0, 0);
        if (dt_st > dt_end) {
            this.$.alertMessage.setContent("Start and End Dates are ambiguous !");
            this.$.alertMessage.show();
            return false;
        }
        var start_time_contents = startTime.split(':');
        var end_time_contents = endTime.split(':');
        var policy1Name = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        var policy2Name = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        //  Or, as there wont be two policies at a specified date,time & place, we can as well use
        //  latlong with date & time clubbed, for policy name
        policy1Name = startDate + startTime;
        policy2Name = endDate + endTime;
        /*Added new logic*/
        var set;
        if (this.intensitySelected) {
            set = {
                "intensitylevel": this.$.intensitySlider.getValue()
            };
        } else {
            set = {
                "powerstate": this.$.onoffstate.getValue() ? "ON" : "OFF"
            };
        }
        if (startDate === '' && endDate === '' && startTime === '' && endTime === '') {
            // if (startDate === '' && startTime === '') {
            AppConfig.log("Nothing Entered, switch on/off selected lights now");
            postBody = {
                "query": {
                    "documentation": "Turn ON all specified lights. ids are comma separated and case insensitive",
                    "process": {
                        "set": set
                    },
                    "find": {
                        "light": {
                            "operatedBy": "iot-wf",
                            "id": []
                        }
                    }
                }
            };
        } else if (startDate != '' && endDate != '' && startTime != '' && endTime != '') {
            AppConfig.log("Entered all values");
            postBody = {
                "query": {
                    "documentation": "Turn the following policy on the following lights on these specified dates and times ",
                    "policy": [{
                            "name": policy1Name,
                            "trigger": {
                                "name": policy1Name + "Trigger1",
                                "year": {
                                    "eq": start_date_contents[2],
                                    "month": {
                                        "eq": start_date_contents[1],
                                        "day": {
                                            "eq": start_date_contents[0],
                                            "hour": {
                                                "eq": start_time_contents[0],
                                                "minute": {
                                                    "eq": start_time_contents[1]
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "action": {
                                "name": policy1Name + "Action1",
                                "set": set
                            }
                        },
                        // "policy":
                        {
                            "name": policy2Name,
                            "trigger": {
                                "name": policy2Name + "Trigger2",
                                "year": {
                                    "eq": end_date_contents[2],
                                    "month": {
                                        "eq": end_date_contents[1],
                                        "day": {
                                            "eq": end_date_contents[0],
                                            "hour": {
                                                "eq": end_time_contents[0],
                                                "minute": {
                                                    "eq": end_time_contents[1]
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "action": {
                                "name": policy2Name + "Action2",
                                "set": set
                            }
                        }
                    ],
                    "find": {
                        "light": {
                            "operatedBy": "iot-wf",
                            "id": []
                        }
                    }
                }
            };
            AppConfig.log(postBody);
        } else {
            this.$.alertMessage.setContent("Please select all values");
            this.$.alertMessage.show();
            return false;
        }
        enyo.Signals.send("updatePoliciesForCurrentLights", {
            "postBody": postBody
        })
        enyo.Signals.send("hideCreatePolicyPopup", {});
        /*Added new logic*/
    },
    hidePopup: function() {
        enyo.Signals.send("hideCreatePolicyPopup");
    },
    processMyData: function(inSender, inEvent) {
        // enyo.Signals.send("changeSelectedColor");
        enyo.Signals.send("updateAjaxMessages", {
            ajaxMessage: inEvent.response,
        });
        AppConfig.log(inEvent);
        AppConfig.alert("Successfully updated policies");
    },
    selectChanged: function(inSender, inEvent) {
        if ((inSender.getValue()) == "on") {
            AppConfig.log("on");
            this.$.onoffstate.setActive(true);
        }
        if ((inSender.getValue()) == "off") {
            AppConfig.log("off");
            this.$.onoffstate.setActive(false);
        }
        var changedLightDimValue = "";
        if (inSender.getValue() != "on" && inSender.getValue() != "off") {
            this.intensitySelected = true;
            changedLightDimValue = inSender.getValue().split(' ')[1].substring(1, 3);
            this.$.intensityLevel.setContent(changedLightDimValue + '%');
            this.$.intensitySlider.setValue(changedLightDimValue);
        }
        this.selectedPolicyRule = changedLightDimValue;
    },
    selectedLightsCountChanged: function() {
        this.$.selectedLightsCount.setContent(this.selectedLightsCount);
    }
});