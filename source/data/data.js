/**
    For simple applications, you might define all of your models, collections,
    and sources in this file.  For more complex applications, you might choose to separate
    these kind definitions into multiple files under this folder.
*/
enyo.kind({
    name: "AjaxAPI",
    statics: {
        defaultErrorHandler: function(inSender, inResponse) {
            var responseHandled = false;
            AppConfig.alert(inResponse);
            switch (inResponse) {
                case 0:
                    enyo.Signals.send("onAjaxError", {
                        errorMessage: "Unable to connect to the server. You will be logged out automatically.",
                        forceLogout: true,
                        errorReason: "unreachable"
                    });
                    break;
                case 'timeout':
                    enyo.Signals.send("onAjaxError", {
                        errorMessage: "Request Timed Out"
                    });
                    break;
                default:
                    if (inSender.xhrResponse.body) {
                        enyo.Signals.send("onAjaxError", {
                            errorMessage: "Error: " + inSender.xhrResponse.body
                        });
                    } else {
                        enyo.Signals.send("onAjaxError", {
                            errorMessage: "Error: Unknown"
                        });
                    }
                    // log the user out
                    break;
            }
            return responseHandled;
        },
        unifiedSuccessHandler: function(inSender, inResponse) {
            var responseHandled = true;
            if (inResponse !== null && (inResponse === "" || typeof inResponse === 'object') || inSender.contentType === "application/octet-stream") {
                // return false so that the local success handler can process the response
                responseHandled = false;
            } else {
                // log the user out
                enyo.Signals.send("onAjaxError", {
                    errorMessage: "Session Expired.\n You will be logged out automatically.",
                    errorReason: "session_expired",
                    forceLogout: true
                });
            }
            return responseHandled;
        },
        // request URL - url to call (baseURL + requestURL)
        // ipArray - array of IPs to add to the request or null for none
        // context - context for successCallback or errorCallback
        // successCallback - success handler (parser for the json)
        // errorCallback - optional error handler
        makeAjaxRequest: function(requestURL, ipArray, context, successCallback, errorCallback, method, postBody, contentType, timeoutValue, token) {
            AppConfig.log(requestURL);
            // set url (stripping leadding '/' from requestURL)
            if (requestURL.charAt(0) == "/") {
                requestURL = requestURL.replace("/", "");
            }
            var urlText = requestURL;
            if (urlText.indexOf(AppConfig.baseURL) != 0) {
                if (AppConfig.baseURL.charAt(AppConfig.baseURL.length - 1) == "/") {
                    urlText = AppConfig.baseURL + requestURL;
                } else {
                    urlText = AppConfig.baseURL + "/" + requestURL;
                }
            }
            if (ipArray) {
                urlText = this.generateParamsText(urlText, ipArray);
            }
            // log.debug("*** makeAjaxRequest: " + urlText);
            var methodType = (method && method !== "") ? method.toUpperCase() : "GET";
            var ajax = new enyo.Ajax({
                url: urlText,
                cacheBust: false,
                method: methodType,
                timeout: timeoutValue || AppConfig.defaultTimeoutInterval,
                headers: token,
                contentType: contentType || "application/json", // not setting this treats the data a form
                postBody: postBody
            });
            if (postBody) {
                switch (methodType) {
                    case "POST":
                    case "PUT":
                        ajax.postBody = postBody || {};
                        ajax.handleAs = "json";
                        break;
                    default:
                        log.error("Post Body passed to request, but method type is " + methodType, urlText);
                        break;
                }
            }
            AppConfig.log(ajax);
            // send parameters the remote service using the 'go()' method
            ajax.go();
            // attach responders to the transaction object
            var successHandler = (context && successCallback) ? enyo.bind(context, successCallback) : null;
            ajax.response(function(inSender, inResponse) {
                // unifiedSuccessHandler returns true if it handled the response, so
                //  don't call the handler if it returns true
                if (!AjaxAPI.unifiedSuccessHandler(inSender, inResponse)) {
                    if (successHandler) {
                        successHandler(inSender, inResponse);
                    }
                }
            });
            var errorHandler = (context && errorCallback) ? enyo.bind(context, errorCallback) : null;
            // user error handler that was passed in or the default handler
            ajax.error(errorHandler || AjaxAPI.defaultErrorHandler);
        },
        generateParamsText: function(urlText, ipArray) {
            urlText = urlText.replace("deviceId=?", "");
            urlText = urlText.replace("?", "");
            _.each(ipArray, function(ip) {
                if (ip == ipArray[0]) {
                    urlText = urlText + "?deviceId=" + ip.toString();
                } else {
                    urlText = urlText + "&deviceId=" + ip.toString();
                }
            }, this);
            return (urlText);
        }
    }
});
enyo.kind({
    name: "UserModel",
    statics: {
        MAC_ADDRESS: null,
        userObject: '',
        responseHeader: '',
        loginUser: function(username, password, successCallback, errorCallback, ctx) {
            AppConfig.log("In UserModel");
            var postBody = {
                "username": username,
                "password": password
            };
            AjaxAPI.makeAjaxRequest("login", null, ctx, successCallback, errorCallback, "POST", postBody);
        },
        logoutUser: function(username, successCallback, errorCallback, ctx) {
            AppConfig.log("Finally in UserModel, loggingout");
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token,
                "app": 'portal'
            };
            AjaxAPI.makeAjaxRequest("logout", null, ctx, successCallback, errorCallback, "GET", null, null, null, authToken);
        }
    }
});
enyo.kind({
    name: "IlluminationModel",
    statics: {
        illuminationObject: '',
        responseHeader: '',
        findLights: function(findObject, processObject) {
            AppConfig.log("In IlluminationModel");
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token,
                "app": 'portal'
            };
            var postBody = {
                "query": {
                    "find": findObject,
                    "process": processObject
                }
            };
            AjaxAPI.makeAjaxRequest("api/lights", null, this, "processData", "errorHandler", "POST", postBody, null, null, authToken);
            // requestURL, ipArray, context, successCallback, errorCallback, method, postBody, contentType, timeoutValue, token
        },
        findKiosks: function() {
            AppConfig.log("In IlluminationModel's findKiosks function");
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token,
            };
            var postBody = {
                "query": {
                    "find": findObject,
                    "process": processObject
                }
            };
            AppConfig.log(postBody);
            AjaxAPI.makeAjaxRequest("api/kiosks", null, this, "processData", "errorHandler", "POST", postBody, null, null, authToken);
        },
        findParkingLot: function(findObject) {},
        processData: function(inSender, inResponse) {
            IlluminationModel.illuminationObject = inResponse.lights;
            enyo.Signals.send("illuminationModelUpdated");
        },
        errorHandler: function(inSender, inResponse) {
            AppConfig.log(inSender, inResponse);
            AppConfig.log("Error");
        }
    }
});
enyo.kind({
    name: "PBModel",
    statics: {
        PBObject: '',
        responseHeader: '',
        getData: function() {
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token,
                "app": 'portal'
            };
            AjaxAPI.makeAjaxRequest("/api/neighborhood?Data.q=all", null, this, "processData", "errorHandler", "GET", null, null, null, authToken);
            // requestURL, ipArray, context, successCallback, errorCallback, method, postBody, contentType, timeoutValue, token
        },
        processData: function(inSender, inResponse) {
            PBModel.PBObject = inResponse.Output;
            enyo.Signals.send("PBDataUpdated");
        },
        errorHandler: function(inSender, inResponse) {
            AppConfig.log(inSender, inResponse);
            AppConfig.log("Error");
        }
    },
});
enyo.kind({
    name: "LayersModel",
    statics: {
        lastRequestedLayer: '',
        layersObj: [{
            layerName: "lights",
            requestURL: "api/lights",
            // requestURL: "http://mqciscocls.mqidentity.net:8080/fid-SmartLightGateway",
            // iconType: "lightbulb-o",
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "kiosks",
            requestURL: "api/kiosk",
            reqStatus: false,
            iconType: "bookmark-o",
            dataObject: '',
            active: false
        }, {
            layerName: "parking",
            iconType: "car",
            requestURL: "api/parking",
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "crowd",
            iconType: 'crowd',
            requestURL: 'api/mse/location/clients/', //  cim.cisco.com
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "traffic",
            iconType: "traffic",
            requestURL: "api/smart-traffic",
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "events",
            requestURL: "api/city-info",
            reqStatus: false,
            iconType: "bookmark-o", //  Please note this should be modified and is put just not to break the whole code
            dataObject: '',
            active: false
        }, {
            layerName: "Key City Assets",
            iconType: "building-o",
            // Lists all city assets
            requestURL: "/api/city-asset?Data.q=all",
            // Lists all city assets which are lying in current map view
            // requestURL: "/api/city-asset?Data.q=bound&Data.BBoxLonMin=-87.71484375&Data.BBoxLatMin=41.83682786072714&Data.BBoxLonMax=-87.626953&Data.BBoxLatMax=41.90227",
            reqStatus: false,
            dataObject: '',
            active: false
        }, {
            layerName: "tours",
            iconType: "tour",
            requestURL: "/api/routes?Data.q=all", //    prior to this, it was "/api/city-asset?Data.q=all"
            reqStatus: false,
            dataObject: '',
            active: false
        }],
        changeLayerStatus: function(layerName, status) {
            var layersObj = [];
            var newLayer = {};
            _.each(LayersModel.layersObj, function(layer) {
                newLayer = {};
                enyo.mixin(newLayer, layer);
                if (layer.layerName == layerName) {
                    newLayer.active = status;
                }
                if (newLayer.active && !newLayer.dataObject && newLayer.dataObject == "" && !newLayer.reqStatus) {
                    LayersModel.getData(newLayer);
                    newLayer.reqStatus = true;
                }
                layersObj.push(newLayer);
            });
            LayersModel.layersObj = layersObj;
            enyo.Signals.send("layersUpdated");
        },
        getData: function(layerObj) {
            var layer = layerObj.layerName;
            LayersModel.lastRequestedLayer = layer;
            var requestURL = "";
            var postBody = "";
            var method = "";
            AppConfig.debug_();

            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token,
                "app": 'portal'
            };

            switch (layer) {
                case "lights":
                    if(LayersModel.getFromCache(layer)){
                        AppConfig.log("Not going to fetch this URL : " + layerObj.requestURL + " as this is already in localStorage");
                        var newLayer = {};
                        enyo.mixin(newLayer, layerObj);
                        newLayer.dataObject = LayersModel.getFromCache(layer);
                        AppConfig.log(newLayer.dataObject);
                        layerObj.reqStatus = true;
                        LayersModel.layersObj.push(newLayer);
                    } else {
                        method = "POST";
                        postBody = {
                            "query": {
                                "documentation": "Get all lights operated by specified organization (maps to logical scopes)",
                                "find": {
                                    "light": {
                                        "operatedBy": "iot-wf"
                                    }
                                }
                            }
                        };
                        AppConfig.log("Loaded this " + layerObj.requestURL);
                        AjaxAPI.makeAjaxRequest(layerObj.requestURL, null, this, "processData", "errorHandler", method, postBody, null, null, authToken);
                    }
                    break;
                case "Key City Assets":
                    if(LayersModel.getFromCache(layer)){
                        AppConfig.log("Not going to fetch this URL : " + layerObj.requestURL + " as this is already in localStorage");
                        var newLayer = {};
                        enyo.mixin(newLayer, layerObj);
                        newLayer.dataObject = LayersModel.getFromCache(layer);
                        layerObj.reqStatus = true;
                        LayersModel.layersObj.push(newLayer);
                    } else {
                        method = "GET";
                        AppConfig.log("Loaded this " + layerObj.requestURL);
                        AjaxAPI.makeAjaxRequest(layerObj.requestURL, null, this, "processData", "errorHandler", method, postBody, null, null, authToken);
                    }
                    break;
                case "kiosks":
                    if(LayersModel.getFromCache(layer)){
                        AppConfig.log("Not going to fetch this URL : " + layerObj.requestURL + " as this is already in localStorage");
                        var newLayer = {};
                        enyo.mixin(newLayer, layerObj);
                        newLayer.dataObject = LayersModel.getFromCache(layer);
                        layerObj.reqStatus = true;
                        LayersModel.layersObj.push(newLayer);
                    } else {
                        method = "POST";
                        postBody = {
                            "query": {
                                "documentation": "Get kiosks at specified location",
                                "find": {
                                    "kiosk": {
                                    }
                                }
                            }
                        };
                        AppConfig.log("Loaded this " + layerObj.requestURL);
                        AjaxAPI.makeAjaxRequest(layerObj.requestURL, null, this, "processData", "errorHandler", method, postBody, null, null, authToken);
                    }
                    break;
                case "parking":
                    if(LayersModel.getFromCache(layer)){
                        AppConfig.log("Not going to fetch this URL : " + layerObj.requestURL + " as this is already in localStorage");
                        var newLayer = {};
                        enyo.mixin(newLayer, layerObj);
                        newLayer.dataObject = LayersModel.getFromCache(layer);
                        layerObj.reqStatus = true;
                        LayersModel.layersObj.push(newLayer);
                    } else {
                        method = "POST";
                        postBody = {
                            "query": {
                                "documentation": "Get parking space operated by specified organization",
                                "find": {
                                    "parkingSpace": {
                                        "operatedBy": "iot-wf"
                                    }
                                }
                            }
                        };
                        AppConfig.log("Loaded this " + layerObj.requestURL);
                        AjaxAPI.makeAjaxRequest(layerObj.requestURL, null, this, "processData", "errorHandler", method, postBody, null, null, authToken);
                    }
                    break;
                case "events":
                    if(LayersModel.getFromCache(layer)){
                        AppConfig.log("Not going to fetch this URL : " + layerObj.requestURL + " as this is already in localStorage");
                        var newLayer = {};
                        enyo.mixin(newLayer, layerObj);
                        newLayer.dataObject = LayersModel.getFromCache(layer);
                        AppConfig.log(newLayer.dataObject);
                        layerObj.reqStatus = true;
                        LayersModel.layersObj.push(newLayer);
                    } else {
                        method = "POST";
                        postBody = {
                            "query": {
                                "documentation": "Get all city information for specified city",
                                "find": {
                                    "event": {
                                        "cityName": "Chicago"
                                    }
                                }
                            }
                        };
                        AppConfig.log("Loaded this " + layerObj.requestURL);
                        AjaxAPI.makeAjaxRequest(layerObj.requestURL, null, this, "processData", "errorHandler", method, postBody, null, null, authToken);
                    }
                    break;
                case "traffic":
                    if(LayersModel.getFromCache(layer)){
                        AppConfig.log("Not going to fetch this URL : " + layerObj.requestURL + " as this is already in localStorage");
                        var newLayer = {};
                        enyo.mixin(newLayer, layerObj);
                        newLayer.dataObject = LayersModel.getFromCache(layer);
                        AppConfig.log(newLayer.dataObject);
                        layerObj.reqStatus = true;
                        LayersModel.layersObj.push(newLayer);
                    } else {
                        method = "POST";
                        postBody = {
                            "query": {
                                "documentation": "Get viewports corresponding to medium density traffic operated by 'iot-wf'",
                                "find": {
                                    "traffic": {
                                        "operatedBy": "iot-wf"
                                    }
                                }
                            }
                        };
                        AppConfig.log("Loaded this " + layerObj.requestURL);
                        AjaxAPI.makeAjaxRequest(layerObj.requestURL, null, this, "processData", "errorHandler", method, postBody, null, null, authToken);
                    }
                    break;
                case "tours":
                    if(LayersModel.getFromCache(layer)){
                        AppConfig.log("Not going to fetch this URL : " + layerObj.requestURL + " as this is already in localStorage");
                        var newLayer = {};
                        enyo.mixin(newLayer, layerObj);
                        newLayer.dataObject = LayersModel.getFromCache(layer);
                        AppConfig.log(newLayer.dataObject);
                        layerObj.reqStatus = true;
                        LayersModel.layersObj.push(newLayer);
                    } else {
                        method = "GET";
                        postBody = {
                            "query": {
                                "documentation": "Get viewports corresponding to medium density traffic operated by 'iot-wf'",
                                "find": {
                                    "tours": {
                                        "operatedBy": "iot-wf"
                                    }
                                }
                            }
                        };
                        postBody = null;
                        AppConfig.log("Loaded this " + layerObj.requestURL);
                        AjaxAPI.makeAjaxRequest(layerObj.requestURL, null, this, "processData", "errorHandler", method, postBody, null, null, authToken);
                    }
                    break;
                default:
                    AppConfig.log("Selected Layer not yet implemented " + layer);
                    break;
            }
            // requestURL, ipArray, context, successCallback, errorCallback, method, postBody, contentType, timeoutValue, token
        },
        updateCache: function(layerName, data){
            // var updatedCache = JSON.parse(localStorage.cache);
            // AppConfig.log(data);
            // updatedCache[layerName] =  JSON.stringify(data);
            // localStorage.cache = "";
            // localStorage.cache = JSON.stringify(updatedCache);
        },
        getFromCache: function(layerName){
            // var layerCache = JSON.parse(localStorage.cache);
            // if (layerCache[layerName] !== ""){
            //     try{
            //         AppConfig.log_("getFromCache: " + layerCache[layerName]);
            //         return layerCache[layerName];
            //     } catch (exception){
            //         AppConfig.log(exception);
            //     }
            // }
            return false;
        },
        processData: function(inSender, inResponse) {
            var layersObj = [];
            var newLayer = {};
            _.each(LayersModel.layersObj, function(layer) {
                newLayer = {};
                enyo.mixin(newLayer, layer);
                if (inSender.url.indexOf(layer.requestURL) >= 0) {
                    switch (layer.layerName) {
                        case "lights":
                            newLayer.dataObject = inResponse.lights;
                            LayersModel.updateCache("lights",newLayer);
                            AppConfig.log(inResponse.lights);
                            break;
                        case "parking":
                            newLayer.dataObject = inResponse.parkingSpace[0].parkingSpots;
                            LayersModel.updateCache("parking",newLayer);
                            break;
                        case "Key City Assets":
                            if(AppConfig.useOfflineDataForKeyCityAssets && AppConfig.debugMode){
                                newLayer.dataObject = cls_offline_data.chicago.Output;
                                break;
                            }
                            newLayer.dataObject = inResponse.Output;
                            break;
                        case "kiosks":
                            newLayer.dataObject = inResponse.kiosk;
                            break;
                        case "events":
                            newLayer.dataObject = inResponse.event;
                            break;
                        case "traffic":
                            newLayer.dataObject = inResponse.traffic;
                            break;
                        case "tours":
                            RoutesModel.loadRoutes();
                            // newLayer.dataObject = inResponse.tours;
                            break;
                        case "crowd":
                            AppConfig.log(inResponse.Locations);
                            newLayer.dataObject = inResponse.Locations.WirelessClientLocation;
                            break;
                        default:
                            AppConfig.log("Selected Layer not yet implemented " + layer);
                            break;
                    }
                }
                layersObj.push(newLayer);
            });
            LayersModel.layersObj = layersObj;
            enyo.Signals.send("layersUpdated", {
                layerName: LayersModel.lastRequestedLayer
            });
        },
        errorHandler: function(inSender, inResponse) {
            AppConfig.log(inSender, inResponse);
        }
    }
});
// enyo.kind({
//     name: "NeighborhoodModel",
//     kind: "enyo.Model",
//     // parse: function(data) {
//     //     AppConfig.log("OverviewModel / parse");
//     //     AppConfig.log(data);
//     //     data.parsedPatientName = dataHelper.getShortenedName(data.patientName.firstName, data.patientName.lastName);
//     //     return(data);
//     // }
// });
// enyo.kind({
//     name: "NeighborhoodCollection",
//     kind: "enyo.Collection",
//     model: "NeighborhoodModel",
//     getUrl: function() {
//         return AppConfig.baseURL + "/api/neighborhood?Data.q=all";
//     },
//     parse: function(data) {
//         AppConfig.log("OverviewCollection / parse");
//         AppConfig.log(data.Output);
//         return data.Output;
//     }
// });
// 
enyo.kind({
    name: "RoutesModel",
    statics: {
        routesObject: '',
        routesLength: '',
        updateModel: function() {
            // restart a timeout at 60 seconds + some random amount of time
            setTimeout(enyo.bind(EventModel, "updateModel"), 60 * 1000 + enyo.irand(10));
            RoutesModel.loadRoutes();
        },
        loadRoutes: function() {
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token,
                "app": 'portal'
            };
            AjaxAPI.makeAjaxRequest("/api/routes?Data.q=all", null, this, "processStatus", null, "", "", null, null, authToken);
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                AppConfig.log(inEvent.Output);
                RoutesModel.routesObject = inEvent.Output;
                RoutesModel.routesLength = inEvent.Output.length;
                RoutesDirectionModel.loadRoutesDirection();
                enyo.Signals.send("updateRoutes");
            }
        }
    }
});
enyo.kind({
    name: "RoutesDirectionModel",
    statics: {
        routesDirectionObject: [],
        dataReceived: 0,
        updateModel: function() {
            // restart aloadRoutesDirection timeout at 60 seconds + some random amount of time
            setTimeout(enyo.bind(EventModel, "updateModel"), 60 * 1000 + enyo.irand(10));
            RoutesDirectionModel.loadRoutesDirection();
        },
        loadRoutesDirection: function() {
            var token = UserModel.responseHeader.token;
            var authToken = {
                "token": token,
                "app": 'portal'
            };
            for (var i = 0; i < RoutesModel.routesLength; i++) {
                var id = RoutesModel.routesObject[i].ROUTE_ID;
                AjaxAPI.makeAjaxRequest("/api/directions?Data.q=direction&Data.id=" + id, null, this, "processStatus", "processError", "", "", null, null, authToken);
            }
        },
        processStatus: function(inSender, inEvent) {
            if (inEvent) {
                if (inEvent.Output.length > 0) {
                    RoutesDirectionModel.routesDirectionObject.push({
                        data: inEvent.Output[0],
                        routeID: inSender.url.split("=")[2]
                    });
                }
                RoutesDirectionModel.dataReceived++;
                if (RoutesDirectionModel.dataReceived == RoutesModel.routesLength) {
                    enyo.Signals.send("updateRouteDirections", {});
                }
                AppConfig.log(inEvent.Output[0]);   
            }
        },
        processError: function(inSender, inEvent) {
            AppConfig.log(inSender, inEvent);
        }
    }
});