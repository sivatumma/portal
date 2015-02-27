enyo.kind({
    name: "cls.loginView",
    classes: "loginView",
    events: {
        onAssignUserRole: ""
    },
    components: [{
        classes: "login",
        components: [{
            name: "logo",
            kind: "branding",
            classes: "logo",
        }, {
            //  This one is to show some message when credentials are not entered in a correct manner
            name: "alertMessage",
            content: "Please check your login credentials ",
            classes: "alertMessage"
        }, {
            name: "username",
            kind: "enyo.Input",
            classes: "loginview_input_text",
            placeholder: "Username",
            onkeydown: "doCleanup",
            onkeydown: "handleKeyStroke",
            value: ""
        }, {
            name: "password",
            kind: "enyo.Input",
            classes: "loginview_input_text",
            placeholder: "Password",
            onkeydown: "handleKeyStroke",
            attributes: {
                type: "password"
            },
            value: ""
        }, {
            name: "loginButton",
            kind: "enyo.Button",
            classes: "loginview_input_button",
            content: "Login",
            ontap: "submitLoginForm"
        }]
    }],
    create: function() {
        this.inherited(arguments);
        if (AppConfig.defaultCredentials) {
            this.$.username.setValue(AppConfig.defaultCredentials.split("/")[0]);
            this.$.password.setValue(AppConfig.defaultCredentials.split("/")[1]);
        }
    },
    showSignupForm: function(inSender, inEvent) {
        AppConfig.log("direct to Signup page <or a openid kind >");
    },
    showForgotPasswordForm: function(inSender, inEvent) {
        AppConfig.log("direct to forgotpassword");
    },
    doCleanup: function() {
        this.$.username.addClass("loginview_input_text");
    },
    handleKeyStroke: function(inSender, inEvent) {
        if (inEvent.keyCode === 13) {
            this.submitLoginForm();
            return true;
        }
    },
    submitLoginForm: function(sender, event) {
        var username = this.$.username.getValue().toLowerCase();
        var password = this.$.password.getValue();
        if (username == '' || username == 'Username') {
            this.$.username.addStyles("border:1px solid red;");
            this.$.username.focus();
            this.$.alertMessage.addStyles("visibility:visible;display:block;");
            this.addStyles("height:290px;");
            return false;
        } else if (password == '' || password == 'Username') {
            this.$.password.addStyles("border:1px solid red;");
            this.$.password.focus();
            this.$.alertMessage.addStyles("visibility:visible; display:block;");
            this.addStyles("height:290px;");
            return false;
        } else {
            this.$.username.addStyles("border:1px solid silver;");
            this.$.password.addStyles("border:1px solid silver;");
            this.$.alertMessage.addStyles("visibility:hidden; display:none;");
            this.addStyles("height:250px;");
            UserModel.loginUser(username, password, this.loginSuccess, this.loginError, this);
        }
    },
    loginSuccess: function(inSender, inResponse) {
        // AppConfig.log(inSender, inResponse);
        UserModel.userObject = inResponse;
        UserModel.responseHeader = inSender.xhrResponse.headers;
        AppConfig.log(UserModel.userObject);
        enyo.Signals.send("changeToView", {
            viewName: "MANAGE"
        });
        if (localStorage.clsUserName === UserModel.userObject.username) {
            AppConfig.log("Here u go");
            try {
                AppConfig.debug();
                var servicesArr = localStorage.servicesInfo.split(',');
                var servicesStatusArr = localStorage.servicesStatus.split(',');
                AppConfig.debug();
                for (var i = 0; i < servicesArr.length; i++) {
                    servicesStatusArr[i] = servicesStatusArr[i] === "true" ? true : false;
                    AppConfig.log_(servicesStatusArr[i]);
                    LayersModel.changeLayerStatus(servicesArr[i], servicesStatusArr[i]);
                    enyo.Signals.send("activeService");
                };
            } catch (e) {
                AppConfig.log("Some error was caught " + e, true);
            }
        } else {
            localStorage.setItem("clsUserName", UserModel.userObject.username);
        }
        this.bubble('onAssignUserRole');
        // IlluminationModel.findLights("+37.232976", "+37.442615", "-122.174149", "-121.771088", this.success, this.error, this);
        UserModel.userObject = UserModel.userObject || {};
        UserModel.userObject.loggedIn = localStorage.loggedIn = true;
        app.setCurrentUser(UserModel.userObject);
    },
    loginError: function(inSender, inResponse) {
        // AppConfig.log(inSender, inResponse);
        var that = this;
        var inputResp = inSender.xhrResponse.body.substring(16, inSender.xhrResponse.body.length - 4);
        AppConfig.log(inputResp);
        that.$.alertMessage.setContent(inputResp);
        that.$.alertMessage.show();
        this.$.alertMessage.addStyles("visibility:visible; display:block;");
        //  Just send "changeToView" signal with viewName as "VIEW" when not connected to VPN
    }
});
enyo.kind({
    name: "branding",
    classes: "branding",
    components: [{
        kind: "Image",
        src: "assets/smartcity-chicago-logo-blue-trans.png",
        classes: "logo"
    }, {
        content: strings_en_US.login.branding.heading,
        classes: "heading"
    }, {
        content: strings_en_US.login.branding.subHeading,
        classes: "subHeading"
    }]
});