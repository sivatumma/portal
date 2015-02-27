enyo.kind({
    name: "progressBar",
    kind: "onyx.Popup",
    floating: true,
    modal: true,
    scrim: true,
    centered: true,
    published: {
        color: "#FF0000" //Any HEX color works
    },
    components: [{
        kind: "jmtk.Spinner",
        name: "spinner",
        style: "position: absolute; top: 40%; left: 45%;z-index:1"
    }],
    create: function() {
        this.inherited(arguments);
    },
    rendered: function() {
        this.inherited(arguments);
        this.colorChanged();
    },
    colorChanged: function() {
        this.$.spinner.setColor(this.color);
    }
});