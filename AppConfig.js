enyo.kind({
    name: "AppConfig",
    statics: {
        baseURL: "/", // should be used everywhere in the app
        prodURL: "/",
        // debugURL: "https://173.36.245.244/",
        // debugURL: "https://cim.cisco.com/",
        debugURL: "/",
        debugMode:                              true,   //  Set this to true if we wish to enable console logging and alert(). 
                                                        //  Set this to false, before deploying the app into production.
        alertsEnabled:                          true,  //  alert statements will only work if this is true & debugMode is true.
        consoleLoggingEnabled:                  true,   //  console.log statements will only work if this is true & debugMode is true.
        consoleLogTraceEnabled:                 false,  //  Enable this to see the stacktrace of every log() statement
        breakPointsEnabled:                     false,   //  In development/debug mode, this will show breakpoints in code if any.
        logglyLoggingEnabled:                   false,  //  AppConfig.log() Logs will go to loggly endpoints if this is set to true. 
        useOfflineDataForKeyCityAssets:         true,   //  While developing, We can use offline data

        defaultCredentials: "lightop/lightop",
        // defaultCredentials: null,

        //  For better control over map tiles providers, we can alter our AppConfig.tileProvider'
        availableTileProviders: {
            mapbox: {
                url: "http://{s}.tiles.mapbox.com/v3/timtuity.j62gk2ig/{z}/{x}/{y}.png",
                // url: "http://{s}.tiles.mapbox.com/v3/timtuity.90357cd0/{z}/{x}/{y}.png",
                settings: {
                    attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='http://mapbox.com'>Mapbox</a>"
                }
            },
            google: {
                url: "http: //{s}.googleapis.com/vt?lyrs=m@174225136&src=apiv3.8&hl=en-US&x={x}&y={y}&z={z}&s=Galile&style=api%7Csmartmaps",
                settings: {
                    subdomains: ['mt0', 'mt1', 'mt2'],
                    attribution: "Map data © 2012 Google"
                }
            },
            cloudmade: {
                url: "http://{s}.tile.cloudmade.com/" + this.cloudmateApiKey + "/997/256/{z}/{x}/{y}.png",
                settings: {
                    attribution: "Map data © 2011 OpenStreetMap contributors, Imagery © 2011 CloudMade"
                }
            },
            openstreet: {
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                settings: {
                    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            openstreet_blackandwhite: {
                url: 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png',
                settings: {
                    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            openstreet_DE: {
                url: 'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
                settings: {
                    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            openstreet_HOT: {
                url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                settings: {
                    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
                }
            },
            //  Thunder Forest. OpenCycleMap
            tf_openCycleMap: {
                url: 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
                settings: {
                    attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            //  Thunder Forest. Transport
            tf_transport: {
                url: 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
                settings: {
                    attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            //  Thunder Forest. Landscape
            tf_landscape: {
                url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
                settings: {
                    attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            //  Thunder Forest. Outdoors
            tf_outdoors: {
                url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
                settings: {
                    attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            //  OpenMapSurfer. Roads
            oms_roads: {
                url: 'http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}',
                settings: {
                    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            //  OpenMapSurfer. Grayscale
            oms_grayscale: {
                url: 'http://openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}',
                settings: {
                    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            //  Hydda. Base
            hydda_base: {
                url: 'http://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png',
                settings: {
                    attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            //  Hydda. Full Maps
            hydda_full: {
                url: 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
                settings: {
                    attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
            },
            //  MapQuestOpen. OSM 
            mqo_osm: {
                url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
                settings: {
                    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    subdomains: '1234'
                }
            },
            //  MapQuestOpen. Aerial
            mqo_aerial: {
                url: 'http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',
                settings: {
                    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
                    subdomains: '1234'
                }
            },
            //  Stamen. Toner
            stamen_toner: {
                url: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
                settings: {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    subdomains: 'abcd'
                }
            },
            //  Stamen. Toner Background
            stamen_tonerBG: {
                url: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
                settings: {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    subdomains: 'abcd'
                }
            },
            //  Stamen. Toner Light
            stamen_tonerLight: {
                url: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
                settings: {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    subdomains: 'abcd'
                }
            }
        },
        currentTileProvider: "mapbox",
        mapOpacity: 1,
        minZoom:2,
        maxZoom:20,

        //  Log Control Configuration
        //  alert only if debugMode and alertsMode are true
        alert: function(message) {
            if (AppConfig.debugMode && AppConfig.alertsEnabled) {
                alert(message);
            }
        },
        alert_:function(message){
            //  Nothing, use this method to disable any alert statment for the time being.
        },
        echo: function(){
            Function.prototype.apply.apply(console.log, [console, arguments]);
        },
        log:function(message, trace){
            if(AppConfig.logglyLoggingEnabled)
                AnalyticsLogger.logAnalyticsData(message);
            // Log only if debugMode and logsMode are true. In production, logs will only goto loggly.
            if (AppConfig.debugMode && AppConfig.consoleLoggingEnabled) {
                if (AppConfig.consoleLogTraceEnabled || trace){
                    console.log(new Error().stack);
                } else {
                    var lineNumberOfLog = new Error().stack.split('\n')[2].split('/');
                    lineNumberOfLog = lineNumberOfLog[lineNumberOfLog.length - 1];
                    // Function.prototype.call(console.log, [console, arguments]);
                    console.log(arguments + " : " + lineNumberOfLog);
                }
            }
        },
        log_:function(message){
            //  Nothing, use this method to disable a specific log statement for the time being.
        },
        debug: function(){
            if (AppConfig.debugMode && AppConfig.breakPointsEnabled){
                debugger;
            }
        },
        debug_: function(){
            //  Use to disable the above functionality for any debug() statements
        }
    },
    create: function() {
        this.inherited(arguments);
        if (!window.location.hostname || window.location.hostname.indexOf("localhost") >= 0) {
            AppConfig.baseURL = AppConfig.debugURL;
        }
    }
});
