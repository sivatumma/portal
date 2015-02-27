enyo.kind({
    name: "LeafletMap",
    classes: "leaflet-map",
    published: {
        currentAssetClicked: null,
        myMarkers: [],
        selectedMarkers: {
            lights: [],
            kiosks: [],
            events: [],
            parking: [],
            crowd: [],
            "Key City Assets": []
        },
        mapLayers: [],
        center: {
            lat: 41.878114,
            lng: -87.629798
        },
        // showMarker: true,
        zoom: 3,
        maxZoom: 2,
        maxZoom: 20,
        // point imagePath to your leaflet images folder
        imagePath: "assets",
        tileProvider: "mapbox"
    },
    events: {
        onMarkerSelectionUpdated: '',
        onRouteSelection: ''
    },
    components: [{
        kind: "Signals",
        sendNotificationToKiosks: "sendNotificationToKiosks",
        updatePoliciesForCurrentLights: "updatePoliciesForCurrentLights",
        // changeSelectedColor: "changeSelectedColor",
        layersUpdated: "layersUpdated",
        applyLayers: "layersUpdated",
        clearSelection: "clearSelection" //Not in Use
    }],
    clearSelection: function(inSender, inEvent) {
        var that = this;
        _.each(this.selectedMarkers, function(markers, key) {
            var temp = markers;
            that.selectedMarkers[key] = [];
            _.each(temp, function(marker) {
                marker.layer.setIcon(that.generateMarkerIcon(false, marker.layer.options.layerInfo, marker.layer.options.markerData));
            });
        });
        that.doMarkerSelectionUpdated({
            selectedMarkers: that.selectedMarkers
        });
    },
    rendered: function() {
        this.inherited(arguments);
        this.renderMap();
    },
    renderMap: function() {
        this.destroyMap();
        this.imagePathChanged();
        this.createMap();
        this.createLayer();
        this.zoomChanged();
        // this.showMarkerChanged();
        // this.addMarkerClusterLayer();
    },
    createMap: function() {
        this.map = L.map(this.hasNode()).setView([51.505, -0.09], 13);
        this.map.setView(this.getLatLng(), this.zoom);
    },
    createLayer: function() {
        var tile = this.getTile();
        if (tile) {
            tile.settings.minZoom = AppConfig.minZoom || this.minZoom;
            tile.settings.maxZoom = AppConfig.maxZoom || this.maxZoom;
            tile.settings.opacity = AppConfig.mapOpacity || 1;
            L.tileLayer(tile.url, tile.settings).addTo(this.map);
        }
    },
    // getRandomLatLng: function(map) {
    //     var bounds = map.getBounds(),
    //         southWest = bounds.getSouthWest(),
    //         northEast = bounds.getNorthEast(),
    //         lngSpan = northEast.lng - southWest.lng,
    //         latSpan = northEast.lat - southWest.lat;
    //     return new L.LatLng(
    //         southWest.lat + latSpan * Math.random(),
    //         southWest.lng + lngSpan * Math.random());
    // },
    sendNotificationToKiosks: function(inSender, inEvent) {
        var selectedKiosk = this.selectedMarkers["kiosks"];
        var currentKioskID = selectedKiosk[0].layer.options.markerData.id;
        this.notificationCache = {
            notificationType: inEvent.messageBody.notificationType,
            description: inEvent.messageBody.description,
            kioskID: currentKioskID
        };
        var postBody = {
            "query": {
                "documentation": "Set notification for specified kiosk",
                "find": {
                    "kiosk": {
                        "id": currentKioskID
                    }
                },
                "process": {
                    "set": {
                        // "currentAlert": inEvent.messageBody.notificationType + " : " + inEvent.messageBody.description
                        "currentAlert": inEvent.messageBody.description
                    }
                }
            }
        };
        var token = UserModel.responseHeader.token;
        var authToken = {
            "token": token,
            "app": 'portal'
        };
        AjaxAPI.makeAjaxRequest("/api/kiosk", null, this, "successCallback", "errorCallback", "POST", postBody, null, null, authToken);
    },
    updatePoliciesForCurrentLights: function(inSender, inEvent) {
        var selectedIDs = [];
        _.each(this.selectedMarkers["lights"], function(x, index) {
            selectedIDs.push(x.layer.options.id);
        });
        inEvent.postBody.query.find.light.id = selectedIDs;
        var token = UserModel.responseHeader.token;
        var authToken = {
            "token": token,
            "app": 'portal'
        };
        AjaxAPI.makeAjaxRequest("api/lights", null, this, "policyCreatedSuccessfully", null, "POST", inEvent.postBody, null, null, authToken);
    },
    policyCreatedSuccessfully: function(inSender, inEvent) {
        var message = inEvent.Include == 'OK' ? 'Successfully updated your policy on the lights selected.' : 'The policy has not been updated successfully. Kindly retry.'; //inEvent.status;
        enyo.Signals.send("updateAjaxMessages", {
            "ajaxMessage": message,
        });
    },
    successCallback: function(inSender, inEvent) {
        var message = inEvent.status == 'Success' ? 'You have successfully updated the alerts on selected Kiosks.' : 'There was an error while to tried to set an alert on the selected kiosks.'; //inEvent.status;
        this.notificationCache.status = inSender.xhrResponse.body.substring(24, inSender.xhrResponse.body.length - 7);
        enyo.Signals.send("updateAjaxMessages", {
            "ajaxMessage": message,
            notificationCache: this.notificationCache,
        });
        //  This notification will go to layersComponent.js
        //  As this will be notified over the dashboard's layersView
        this.bubble('closeCreateNotificationPopUp');
    },
    errorCallback: function(inSender, inEvent) {
        enyo.Signals.send("updateAjaxMessages", {
            "ajaxMessage": "There was an error while setting alert on Kiosk.",
            notificationCache: this.notificationCache,
        });
        this.bubble('closeCreateNotificationPopUp');
    },
    generateMarkerIcon: function(selectionStatus, layer, marker, returnStatus) {
        var html = "";
        var selection = _.find(this.selectedMarkers[layer.layerName], function(item) {
            return item.layer == marker.layer;
        });
        var className = selection ? ' selectedMarker' : ' defaultMarker';
        if (layer) {
            switch (layer.layerName) {
                case 'lights':
                    if ((marker.schedule && marker.schedule.id) || (marker.layer && marker.layer.options.markerData.schedule && marker.layer.options.markerData.schedule.id)) {
                        className = " policyExistingOnThisLight" + className;
                    }
                    var powerstate = marker.layer ? marker.layer.options.markerData.powerstate : marker.powerstate;
                    if (powerstate == "ON") {
                        html = svgImages.map_icon_lighting_green;
                        // html = "<img src='assets/mapicons/map_icon_lighting_green.svg'/>";
                    } else {
                        html = svgImages.map_icon_lighting;
                        // html = "<img src='assets/mapicons/map_icon_lighting.svg'/>";
                    }
                    break;
                case 'kiosks':
                    html = svgImages.map_icon_kiosk_v2;
                    break;
                case 'parking':
                    var markerState = marker.layer ? marker.layer.options.markerData.state : marker.state;
                    if (markerState && markerState.occupied == false) {
                        html = "<img src='assets/map_icon_parking-taxi.svg' width='32' height='32'>";
                    } else {
                        html = svgImages.map_icon_parking_taxi_red;
                    }
                    break;
                case 'Key City Assets':
                    var markerType = marker.layer ? marker.layer.options.markerData.type : marker.type;
                    switch (markerType) {
                        case 'Museum':
                            html = svgImages.map_icon_museum;
                            break;
                        case 'BusStop':
                            html = svgImages.map_icon_bus;
                            break;
                        default:
                            html = svgImages.map_icon_bus;
                            break;
                    };
                    break;
                case 'events':
                    html = svgImages.map_icon_events;
                    break;
                case 'crowd':
                    html = "<img src='assets/mapicons/map_icon_crowd.svg'/>";
                    break;
            }
            var icon = L.divIcon({
                html: html,
                className: className
            });
            AppConfig.log(icon);
            return icon;
        }
    },
    imagePathChanged: function() {
        L.Icon.Default.imagePath = this.imagePath;
    },
    zoomChanged: function() {
        this.map.setZoom(this.zoom);
    },
    setCenter: function(inLat, inLng) {
        this.center.lat = inLat;
        this.center.lng = inLng;
        this.marker.update();
        // this.showMarkerChanged();
        this.updateCenter();
    },
    updateCenter: function() {
        this.map.panTo(this.getLatLng());
    },
    destroyMap: function() {
        this.map = null;
    },
    locate: function() {
        this.map.locate({
            setView: true,
            maxZoom: this.maxZoom
        });
    },
    getZoom: function() {
        return this.map.getZoom();
    },
    getMarker: function() {
        return this.marker;
    },
    getLatLng: function(inLat, inLng) {
        return new L.LatLng(inLat || this.center.lat, inLng || this.center.lng);
    },
    gotoNeighborhood: function(neighborHood) {
        var boundingbox = neighborHood.Bound.split(",");
        var southWest = L.latLng(boundingbox[1], boundingbox[0]);
        var northEast = L.latLng(boundingbox[3], boundingbox[2]);
        var bounds = [southWest, northEast];
        if (this.map) {
            this.map.fitBounds(bounds);
        }
    },
    getTile: function() {
        return AppConfig.availableTileProviders[AppConfig.currentTileProvider];
    },
    layersUpdated: function(inSender, inEvent) {
        var that = this;
        _.each(LayersModel.layersObj, function(layer) {
            var layerRendered = _.find(that.mapLayers, function(mapLayer) {
                return mapLayer.options.layerName == layer.layerName;
            });
            if (!layer.active || layerRendered) {
                that.mapLayers = _.reject(that.mapLayers, function(mapLayer) {
                    if (mapLayer.options.layerName == layer.layerName) {
                        layerRendered = false;
                        that.map.removeLayer(mapLayer);
                    }
                    return mapLayer.options.layerName == layer.layerName;
                });
            }
            AppConfig.debug_();
            if (layer.dataObject == "" || layer.dataObject == 'undefined' || !layer.dataObject){
                layer.dataObject = LayersModel.getFromCache(layer.layerName);
            }
            if (layer.active && layer.dataObject && !layerRendered) {
                var markerCluster = new L.MarkerClusterGroup({
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    layerName: layer.layerName
                });
                var newMarker = "";
                switch (layer.layerName) {
                    case "Key City Assets":
                        var uniqueAssetTypes = [];
                        _.each(layer.dataObject, function(marker) {
                            var markerIcon = that.generateMarkerIcon(false, layer, marker);
                            if (markerIcon) {
                                newMarker = new L.Marker(new L.LatLng(marker.coordinates.Pos.Y, marker.coordinates.Pos.X), {
                                    id: marker.id,
                                    icon: markerIcon,
                                    layerInfo: layer,
                                    assetType: layer.layerName,
                                    title: layer.layerName,
                                    selected: false,
                                    clickable: true,
                                    markerData: marker
                                });
                                uniqueAssetTypes.push(newMarker.options.markerData.type);
                                that.myMarkers.push(newMarker);
                                markerCluster.addLayer(newMarker);
                            }
                        });
                        AppConfig.log("These are the unique asset types available...");
                        AppConfig.log(_.uniq(uniqueAssetTypes));
                        break;
                    case "traffic":
                        // TO DO: need to add resonable data and code optimization
                        var mediumLatLngSet = [];
                        _.each(layer.dataObject.density.medium, function(item, index) {
                            mediumLatLngSet.push(new L.LatLng(item[0], item[2]));
                            mediumLatLngSet.push(new L.LatLng(item[1], item[3]));
                        });
                        newMarker = new L.polygon(mediumLatLngSet, true, true);
                        markerCluster.addLayer(newMarker);
                        that.myMarkers.push(newMarker);
                        var highLatLngSet = [];
                        _.each(layer.dataObject.density.high, function(item, index) {
                            highLatLngSet.push(new L.LatLng(item[0], item[2]));
                            highLatLngSet.push(new L.LatLng(item[1], item[3]));
                        });
                        newMarker = new L.polygon(highLatLngSet, true, true);
                        markerCluster.addLayer(newMarker);
                        that.myMarkers.push(newMarker);
                        var lowLatLngSet = [];
                        _.each(layer.dataObject.density.low, function(item, index) {
                            lowLatLngSet.push(new L.LatLng(item[0], item[2]));
                            lowLatLngSet.push(new L.LatLng(item[1], item[3]));
                        });
                        newMarker = new L.polygon(lowLatLngSet, true, true);
                        markerCluster.addLayer(newMarker);
                        that.myMarkers.push(newMarker);
                        break;
                    case "crowd":
                        var heatMapLatLng = [];
                        _.each(layer.dataObject, function(marker) {
                            if (marker.GeoCoordinate) {
                                heatMapLatLng.push([parseFloat(marker.GeoCoordinate[0].$.lattitude), parseFloat(marker.GeoCoordinate[0].$.longitude)]);
                            }
                        });
                        var heatLayer = new L.heatLayer(heatMapLatLng);
                        markerCluster.addLayer(heatLayer);
                        break;
                    case "events":
                        _.each(layer.dataObject, function(marker) {
                            marker.geocoordinates = marker.address[0].geocoordinates;
                            newMarker = new L.Marker(new L.LatLng(marker.geocoordinates.latitude, marker.geocoordinates.longitude), {
                                id: marker.id,
                                icon: that.generateMarkerIcon(false, layer, marker),
                                layerInfo: layer,
                                assetType: layer.layerName,
                                title: layer.layerName,
                                selected: false,
                                clickable: true,
                                markerData: marker
                            });
                            that.myMarkers.push(newMarker);
                            markerCluster.addLayer(newMarker);
                        });
                        break;
                    default:
                        if (typeof layer.dataObject == "string")
                            layer.dataObject = JSON.parse(layer.dataObject).dataObject;
                        AppConfig.log(layer.dataObject);
                        _.each(layer.dataObject, function(marker) {
                            try{
                                // console.log(marker);
                                // console.log(marker.geocoordinates);
                                newMarker = new L.Marker(new L.LatLng(marker.geocoordinates.latitude, marker.geocoordinates.longitude), {
                                    id: marker.id,
                                    icon: that.generateMarkerIcon(false, layer, marker),
                                    layerInfo: layer,
                                    assetType: layer.layerName,
                                    title: layer.layerName,
                                    selected: false,
                                    clickable: true,
                                    markerData: marker
                                });
                                that.myMarkers.push(newMarker);
                                markerCluster.addLayer(newMarker);
                            } catch (e){
                                AppConfig.log("Exception while laying markers in LeafletMap.js : " + e);
                            }
                        });
                        break;
                }
                markerCluster.on('click', function(markerEvent) {
                    var layerName = markerEvent.layer.options.layerInfo.layerName;
                    if (markerEvent.layer.options.selected) {
                        markerEvent.layer.options.selected = false;
                        that.selectedMarkers[layerName] = _.reject(that.selectedMarkers[layerName], function(item) {
                            return item.layer == markerEvent.layer;
                        });
                        markerEvent.layer.setIcon(that.generateMarkerIcon(false, markerEvent.layer.options.layerInfo, markerEvent, true));
                    } else {
                        markerEvent.layer.options.selected = true;
                        that.selectedMarkers[layerName].push(markerEvent);
                        markerEvent.layer.setIcon(that.generateMarkerIcon(true, markerEvent.layer.options.layerInfo, markerEvent, true));
                    }
                    AppConfig.log(that.selectedMarkers);
                    that.doMarkerSelectionUpdated({
                        selectedMarkers: that.selectedMarkers
                    });
                    enyo.Signals.send("updateCurrentLightState",{lights:that.selectedMarkers.lights});
                });
                that.map.addLayer(markerCluster);
                that.mapLayers.push(markerCluster);
                // } 
                // else if (!layer.active) {
                //     that.mapLayers = _.reject(that.mapLayers, function(mapLayer) {
                //         if (mapLayer.options.layerName == layer.layerName) {
                //             that.map.removeLayer(mapLayer);
                //         }
                //         return mapLayer.options.layerName == layer.layerName;
                //     });
            }
        });
    },
    addPolyLine: function(stops, extremePoints, allPoints, tourLayerId) {
        var that = this;
        if (this.map && stops) {
            var directionArray = _.map(stops, function(stop) {
                return L.latLng(parseFloat(stop.Latitude), parseFloat(stop.Longitude));
            });
            AppConfig.log(directionArray);
            var tourMarkerIcon = L.divIcon({
                html: '<i class="fa fa-circle"></i>',
                className: "tourendpoints"
            })
            var polyline = L.polyline(directionArray, {
                color: "#FFBE00",
                weight: 8,
                tourLayerId: tourLayerId
            });
            var layerGroup = "";
            if (allPoints) {
                var markers = _.map(directionArray, function(item) {
                    return L.marker(item, {
                        tourLayerId: tourLayerId
                    });
                });
                var x = [];
                _.each(RoutesDirectionModel.routesDirectionObject.RouteDirections, function(dir) {
                    _.each(dir.SegmentGeometry.Pos, function(item) {
                        x.push(L.latLng(parseFloat(item.Y), parseFloat(item.X)));
                    });
                });
                if (x) {
                    polyline = L.polyline(x, {
                        color: "#FFBE00",
                        weight: 8,
                        tourLayerId: tourLayerId
                    });
                }
                layerGroup = L.featureGroup(_.union(markers, polyline));
            } else if (extremePoints) {
                var marker1 = L.marker(directionArray[0], {
                    icon: tourMarkerIcon,
                    tourLayerId: tourLayerId
                });
                var marker2 = L.marker(directionArray[directionArray.length - 1], {
                    icon: tourMarkerIcon,
                    tourLayerId: tourLayerId
                });
                layerGroup = L.featureGroup([marker1, marker2, polyline]);
            } else {
                layerGroup = L.featureGroup([polyline]);
            }
            layerGroup.on('click', function(e) {
                that.doRouteSelection({
                    tourLayerId: e.layer.options.tourLayerId
                });
            })
            this.map.addLayer(layerGroup);
            if (layerGroup.getBounds().isValid()) {
                this.map.fitBounds(layerGroup.getBounds());
            }
        }
    }
});