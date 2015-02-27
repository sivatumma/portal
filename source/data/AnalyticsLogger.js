enyo.kind({
  name: "AnalyticsLogger",
  statics:{
    loggerKey: "692039f6-5516-49e0-816c-5a1b9df72ce9",
    loggerHost: "https://logs.loggly.com",
    loggerURL: "",
    apiURL: "http://mtuity.loggly.com/apiv2/events?rsid={query_id}",
    appName: "Cisco CIM Portal",
    platformInfo: {name:'unknown'},
    _analyticsLogger: null,
    initialize: function() {
      AnalyticsLogger.loggerURL = AnalyticsLogger.loggerHost+'/inputs/'+AnalyticsLogger.loggerKey;//+'?rt=1';    
      if (typeof(loggly) != 'undefined') {
        enyo.log('sending analytics to:'+AnalyticsLogger.loggerURL);
        AnalyticsLogger._analyticsLogger = new loggly.castor({ url: AnalyticsLogger.loggerURL, level: 'log'});
      } else {
        enyo.warn('analytics not available')
      }
    },
    _sendLogData: function(logData) {
        // enyo.log('logging analytics:', logData);
        AnalyticsLogger._analyticsLogger.log(logData);
    },
    logAnalyticsData: function(logObj) {
      if (AnalyticsLogger._analyticsLogger) {
        var postData = {date: Date(), location: window.location.href, app: AnalyticsLogger.appName};
        // enyo.log('logging analytics (platformInfo):', AnalyticsLogger.platformInfo);
        // add the platform data
        enyo.mixin(postData,AnalyticsLogger.platformInfo);

        // add data that was passed in to the logging function
        enyo.mixin(postData,logObj);

        // add location if present
        if (navigator && navigator.geolocation) {
          var that = this;
          navigator.geolocation.getCurrentPosition(function(position) {
            postData.location = position;
            that._sendLogData(postData);   
          });        
        } else {
          this._sendLogData(postData);
        }
      } else {
        enyo.warn('unable to log analytics:'+ postData);
      }
    },
    getAnalyticsData: function(resource, context, callback) {
      var reportURL = this.apiURL.replace("{query_id}", resource)
      var ajax = new enyo.Ajax({
        url: reportURL,
        cacheBust: false,
        headers: {
          "Authorization": this.authHeader()
        }
      });
      ajax.response(context, callback);
      ajax.cache
      ajax.error(this, "processError");
      ajax.go();
    },
    authHeader: function() {
      var tok = "devtuity" + ':' + "dev2MTUITY";
      var hash = window.btoa(tok);
      return "Basic " + hash;
    },
    processError: function(inSender, inResponse) {
      console.error("*** Loggly API ERROR ***");
      console.error(inResponse);
    },
  },
});
