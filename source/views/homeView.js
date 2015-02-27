enyo.kind({
    name: "cls.homeView",
    viewName: "VIEW",
    // kind: "FittableRows",
    components: [{
        kind: "Signals",
        changedToView: "viewChanged"
    }, {
        kind: "FittableColumns",
        style: "height:100%",
        // fit: true,
        components: [{
            name: "layersPanel",
            classes: "layersPanel",
            components: [{
                kind: "cls.layersComponent"
            }]
        }, {
            name: "mapPanel",
            classes: "mapPanel",
            fit: true,
            components: [{
                kind: "FittableRows",
                classes: "width100 height100",
                components: [{
                    //     name: "dataTimeRangeContainer",
                    //     classes: "dataTimeRangeContainer",
                    //     kind: "cls.mapFilterComponent",
                    //     // content: "DateTimeRangeRegion"
                    // }
                    // , {
                    fit: true,
                    name: "mapContainer",
                    classes: "mapContainer",
                    // kind: "cls.mapComponent"
                }]
            }]
        }]
    }],
    create: function() {
        this.inherited(arguments);
        // this.$.mapContainer.$.map.invalidateSize(false);
    },
    viewChanged: function(inSender, inEvent) {
        if (inEvent.newView == this.viewName) {
            if (!this.map) {
                this.map = this.$.mapContainer.createComponent({
                    name: "homeViewMap",
                    kind: "LeafletMap",
                    classes: "map height100"
                });
                this.$.mapContainer.render();
                this.$.mapContainer.$.homeViewMap.addMarkerClusterLayer();

            }

        }
        // AppConfig.log(this.$.mapContainer);
    }
});
