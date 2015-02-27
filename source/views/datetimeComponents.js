enyo.kind({
    name: "dateComponent",
    components: [{
        name: 'dateInput',
        kind: "onyx.Input",
        classes: "dateInput",
        attributes: [{
            readonly: true
        }]
    }],
    create: function() {
        this.inherited(arguments);
    },
    rendered: function() {
        this.inherited(arguments);
        var now = new Date();
        $('#' + this.$.dateInput.id).mobiscroll().date({
            theme: 'ios',
            display: 'bubble',
            mode: 'scroller',
            startYear: now.getFullYear(),
            endYear: now.getFullYear() + 10,
            dateFormat: 'dd M y'
        });
    }
});
enyo.kind({
    name: "timeComponent",
    components: [{
        name: 'timeInput',
        kind: "onyx.Input",
        classes: "timeInput",
        attributes: [{
            readonly: true
        }]
    }],
    create: function() {
        this.inherited(arguments);
    },
    rendered: function() {
        this.inherited(arguments);
        jQuery('#' + this.$.timeInput.id).mobiscroll().time({
            theme: 'ios',
            display: 'bubble',
            mode: 'mixed',
            headerText: false,
            timeFormat: 'HH:ii'
        });
    }
});
