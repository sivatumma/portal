/**
    For simple applications, you might define all of your views in this file.  
    For more complex applications, you might choose to separate these kind definitions 
    into multiple files under this folder.
*/
enyo.kind({
    name: "cls.MainView",
    kind: "FittableRows",
    fit: true,
    handlers: {
        onAssignUserRole: "assignUserRole"
    },
    components: [{
        kind: "Signals",
        changeToView: "changeToView"
    }, {
        kind: "cls.Toolbar",
        name: "appToolbar"
    }, {
        kind: "Panels",
        fit: true,
        name: "viewPanels",
        draggable: false,
        components: [{
            kind: "cls.loginView",
            viewName: "LOGIN"
        }, {
            kind: "cls.manageView",
            viewName: "MANAGE"
            // }, {
            //     kind: "cls.homeView",
            //     viewName: "VIEW"
        }, {
            kind: "cls.reportsView",
            viewName: "REPORTS"
        }]
    }],
    create: function() {
        this.inherited(arguments);
        enyo.Signals.send("changeToView", {
            viewName: "LOGIN"
        });
    },
    changeToView: function(inSender, inEvent) {
        var view = inEvent.viewName;
        if (view == "LOGIN") {
            this.$.appToolbar.applyStyle("visibility", "hidden");
        } else {
            this.$.appToolbar.applyStyle("visibility", "visible");
        }
        var that = this;
        _.find(that.$.viewPanels.children, function(panel, index) {
            if (panel.viewName == view) {
                that.$.viewPanels.setIndex(index);
                enyo.Signals.send("changedToView", {
                    newView: view
                });
                return;
            }
        });
    },
    assignUserRole: function() {
        this.removeClass('lightOpContainer');
        this.removeClass('businessOpContainer');
        this.removeClass('cityOpContainer');
        this.removeClass('lightOpContainer');
        this.removeClass('lightOpContainer');
        switch (UserModel.userObject.roles) {
            case 'lightoperator':
                this.addClass("lightOpContainer");
                break;
            case 'businessuser':
                this.addClass("businessOpContainer");
                break;
            case 'cityoperator':
                this.addClass("cityOpContainer");
                break;
            case 'touroperator':
                this.addClass("tourOpContainer");
                break;
            case 'cityofficial':
                this.addClass("cityoffContainer");
                break;
            default:
                break;
        };
    }
});