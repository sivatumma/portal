enyo.kind({
    name: "cls.Toolbar",
    classes: "toolbarContainer",
    kind: "FittableColumns",
    activeButtonObject: null,
    events: {
        onSelectedViewChanged: "",
        onAssignUserRole: ""
    },
    components: [{
        kind: "Signals",
        changedToView: "selectTab"
    }, {
        name: "ciscoSmartCityLogo",
        classes: "ciscoSmartCityLogoToolbar centerAlign",
        components:[{        kind:"Image",
        src:"assets/cisco-logo.png",
        style:"width:70px !important; height:40px !important;"
}]
    }, {
        name: "rightToolbarContainer",
        classes: "rightToolbarContainer",
        kind: "FittableRows",
        fit: true,
        components: [{
            name: "toolbarNavigation",
            classes: "toolbarNavigation",
            // fit: true,
            style: "height:50px;",
            kind: "FittableColumns",
            components: [{
                kind: "toolbarNavButton",
                name: "manageButton",
                viewName: "MANAGE",
                classes: "toolbarNavButton",
                components: [{
                    kind: "FittableColumns",
                    components: [{
                        classes: "viewNavIcon"
                    }, {
                        fit: true,
                        classes: "toolbarNavText centerAlign",
                        content: "Home"
                    }]
                }]
                // }, {
                //     kind: "toolbarNavButton",
                //     name: "viewButton",
                //     viewName: "VIEW",
                //     classes: "toolbarNavButton activeToolbarNavButton",
                //     components: [{
                //         kind: "FittableColumns",
                //         components: [{
                //             classes: "viewNavIcon"
                //         }, {
                //             fit: true,
                //             classes: "toolbarNavText centerAlign",
                //             content: "View",
                //         }]
                //     }]
            }, {
                kind: "toolbarNavButton",
                name: "reportsButton",
                viewName: "REPORTS",
                classes: "toolbarNavButton",
                components: [{
                    kind: "FittableColumns",
                    components: [{
                        classes: "viewNavIcon"
                    }, {
                        fit: true,
                        classes: "toolbarNavText centerAlign",
                        content: "Reports",
                    }]
                }]
            }, {
                kind: "toolbarNavButton",
                name: "userBar",
                viewName: "USER",
                classes: "toolbarNavButton userbar",
                fit: true,
                components: [{
                    kind: "FittableColumns",
                    // fit: true,
                    classes: "rightAlign",
                    components: [{
                            classes: "viewNavIcon",
                            // fit: true
                        }, {
                                    kind: "onyx.ContextualPopup",
                                    classes: "createOfferPopup",
                                    name: "createNotificationPopup",
                                    floating: true,
                                    components: [{
                                        classes: "createNotificationPopup",
                                        kind: "cls.createNotification",
                                    }]
                                },{
                            // fit: true,
                            classes: "toolbarNavText userDetails",
                            components: [{kind:"onyx.MenuDecorator",components:[{
                                kind: "cls.User",
                                name: "userSettingsArea"
                            }, {kind:"onyx.ContextualPopup",components:[{
                                kind: "userSettingsDropdown"
                            }]}]}],
                        }
                    ]
                }]
            }]
        }]
    }],
    loginSuccess: function(inSender, inResponse) {
        var userObject = UserModel.userObject;
        var userModel = new enyo.Model({
            name: userObject.username,
            role: userObject.roles,
            // avatar: userObject.avatar,
        });
        this.$.userSettingsArea.set("userModel", userModel);
        this.$.userSettingsDropdown.set("userModel", userModel);
    },
    loginError: function(inSender, inResponse) {
        AppConfig.log("this is loginError");
        // AppConfig.log(inResponse);
    },
    showUserSettings: function(inSender, inEvent) {
        this.$.userSettingsDropdown.show();
        if (this.$.userSettingsDropdown.getShowStatus()) {
            this.$.userSettingsDropdown.hide();
            this.$.userSettingsDropdown.setShowStatus(0);
        } else {
            this.$.userSettingsDropdown.show();
            this.$.userSettingsDropdown.setShowStatus(1);
        }
    },
    create: function(inSender, inEvent) {
        this.inherited(arguments);
    },
    rendered: function() {
        this.inherited(arguments);
    },
    selectTab: function(inSender, inEvent) {
        var activeButton = inEvent.newView.toUpperCase();
        var allButtons = this.$.toolbarNavigation.children;
        _.each(allButtons, function(eachButton) {
            eachButton.removeClass("activeToolbarNavButton");
            if (eachButton.viewName == activeButton) {
                eachButton.addClass("activeToolbarNavButton");
            }
        }, this);
        if (activeButton == "MANAGE") {
            this.loginSuccess();
            // this.loginError();
        }
    }
});
enyo.kind({
    name: "toolbarNavButton",
    tap: function(inSender, inEvent) {
        var view = this.viewName;
        switch (view) {
            case "VIEW":
            case "REPORTS":
            case "MANAGE":
                enyo.Signals.send("changeToView", {
                    viewName: view
                });
                break;
            default:
                AppConfig.log("Unknown view change in toolbar:" + view);
                break;
        }
    }
});
enyo.kind({
    name: "cls.User",
    // classes: "userbar",
    // style: "float:right; max-width:150px;",
    fit: true,
    ontap: "showUserSettings",
    published: {
        userModel: null
    },
    create: function() {
        this.inherited(arguments);
    },
    components: [{
        name: "downArrow",
        tag: "i",
        classes: "fa fa-angle-down fa-fw",
        onmouseover: "stylechange"
    }, {
        name: "userData",
        classes: "userData",
        components: [{
            name: "userName",
            classes: "userNameText",
        }, {
            name: "userRole",
            // classes: "userNameText"
        }],
    }, {
        tag: "i",
        classes: "fa fa-user fa-fw",
    }],
    bindings: [{
        from: ".userModel.name",
        to: ".$.userName.content"
    }, {
        from: ".userModel.role",
        to: ".$.userRole.content"
    }],
});
enyo.kind({
    name: "userSettingsDropdown",
    kind: "enyo.Popup",
    classes: "userSettingsDropdown",
    floating: true,
    centered: false,
    published: {
        showStatus: 0,
        userModel: null,
        settings_icon_src:null,
        logout_icon_src:null
    },
    create:function(){
        this.inherited(arguments);
    },
    constructor: function() {
        this.inherited(arguments);
    },
    // constructor: function() {
    //     this.inherited(arguments);
    // },
    components: [{
        name: "userSettingsDropdownContent",
        content: "User Settings",
        components: [ {
            classes: "userSettingsButtonsArea",
            components: [
            // {kind:"Image", src:"assets/settings_icon_light_operator.png", classes:"inline"},{
            //     content: "Settings",
            //     classes:"inline button"
            // },
            {tag:"hr"},
            {kind:"Image", src:"assets/logout_icon_light_operator.png", classes:"inline"},{
                content: "Logout",
                ontap: "doLogout",
                classes:"inline button"
            },{tag:"hr"}],
        }],
    }],
    bindings: [{
        from: ".userModel.name",
        to: ".$.fullname.content"
    }, {
        from: ".userModel.email",
        to: ".$.email.content"
    }, ],
    onHide: function() {
        this.setShowStatus(0);
    },
    onShow: function() {
        this.setShowStatus(1);
    },
    doLogout: function(inSender, inResponse) {
        // AppConfig.log(inResponse);
        UserModel.userObject = inResponse;
        // AppConfig.log("Logging out...");
        this.hide();
        // AppConfig.log(inResponse);
        UserModel.logoutUser(UserModel.userObject.name, this.logoutSuccess, this.logoutError, this);
    },
    logoutSuccess: function(inSender, inResponse) {
        // AppConfig.log(inSender, inResponse);
        UserModel.userObject = inResponse;
        // AppConfig.log(AppConfig.debugURL);
        // window.location.href = "portal";
        //  When the system is not connected to VPN, use the below signal.
        //  Other wise, delete the following signal, uncomment the above window.location code
        //  that sends user to the home screen
        window.location.reload();
        enyo.Signals.send("changeToView", {
            viewName: "LOGIN"
        });
        this.bubble('onAssignUserRole');
    },
    logoutError: function(inSender, inResponse) {
        // AppConfig.log(inSender, inResponse);
        AppConfig.log("Error logging out");
        // window.location.href = AppConfig.debugURL + "portal";
    }
});
