/**
    Define and instantiate your enyo.Application kind in this file.  Note,
    application rendering should be deferred until DOM is ready by wrapping
    it in a call to enyo.ready().
*/

enyo.kind({
    name: "cls.Application",
    kind: "enyo.Application",
    view: "cls.MainView",
    published: {
        currentUser: null
    },
    currentUserChanged: function(oldVal) {
    }
});

enyo.ready(function() {
    var appConfig = new AppConfig();

    new cls.Application({
        name: "app"
    });

    window.onerror = null;

    //  Show logs on error, no need of console.log()s all the places.
    var gOldOnError = window.onerror;
    // Override previous handler.
    window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
        if (gOldOnError)
        // Call previous handler.
            return gOldOnError(errorMsg, url, lineNumber);

        // Just let default handler run.
        return false;
    };

    var cache = {
        lights:'',
        kiosks:'',
        parking:'',
        crowd:'',
        traffic:'',
        events:'',
        keyCityAssets:'',
        tours:''
    };
    AppConfig.alert_(localStorage.loggedIn);
    if (!localStorage.loggedIn)
        localStorage.cache = JSON.stringify(cache);

});
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

window.onload = function(){
    //  AppConfig.log("window.load() complete with all static images now. Do whatever care required");
}