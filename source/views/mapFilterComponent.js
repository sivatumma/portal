enyo.kind({
    name: "cls.mapFilterComponent",
    kind: "FittableColumns",
    components: [{
        kind: "datePickerComponent",
        classes: "mapDatePickerComponent",
        // style: "width:45%;text-align:center"
    }, {
        kind: "timePickerComponent",
        classes: "mapTimePickerComponent"
    }, {
        kind: "onyx.MenuDecorator",
        classes: "mapFilterComponentMenu",
        components: [{
            content: "Region"
        }, {
            kind: "onyx.ContextualPopup",
            classes: "regionPopupContainer",
            floating: true,
            components: [{
                kind: "regionPopup"
            }]
        }]
    }]
});

enyo.kind({
    name: "datePickerComponent",
    kind: "FittableColumns",
    components: [{
        content: "Date Range",
        classes: "dateRangeLabel"
    }, {
        classes:"startLabel",
        content: "Start:"
    }, {
        name: "StartDate",
        kind: "onyx.Input",
        classes: "startDateInput"
    }, {
        classes: "endLabel",
        content: "End:"
    }, {
        name: "EndDate",
        kind: "onyx.Input",
        classes: "endDateInput",
    }],
    create: function() {
        this.inherited(arguments);
    },
    rendered: function() {
        this.inherited(arguments);
        jQuery('#' + this.$.StartDate.id).datetimepicker({
            format: 'Y/m/d',
            timepicker: false,
            mask: true // '9999/19/39 29:59' - digit is the maximum possible for a cell
        });
        jQuery('#' + this.$.EndDate.id).datetimepicker({
            format: 'Y/m/d',
            timepicker: false,
            mask: true // '9999/19/39 29:59' - digit is the maximum possible for a cell
        });
    }
});

enyo.kind({
    name: "timePickerComponent",
    kind: "FittableColumns",
    components: [{
        content: "Time Range",
        classes: "timeRangeLabel"

    }, {
        classes: "startLabel",
        content: "Start:"
    }, {
        name: "StartTime",
        kind: "onyx.Input",
        // disabled: true,
        // fit: true,
        classes: "startTimeInput",
    }, {
        classes: "endLabel",
        content: "End:"
    }, {
        name: "EndTime",
        kind: "onyx.Input",
        // disabled: true,
        // fit: true,
        classes: "endTimeInput",
    }],
    create: function() {
        this.inherited(arguments);
    },
    rendered: function() {
        this.inherited(arguments);
        jQuery('#' + this.$.StartTime.id).datetimepicker({
            format: 'H:i',
            datepicker: false,
            step: 30,
            mask: true // '9999/19/39 29:59' - digit is the maximum possible for a cell
        });
        jQuery('#' + this.$.EndTime.id).datetimepicker({
            format: 'H:i',
            datepicker: false,
            step: 30,
            mask: true // '9999/19/39 29:59' - digit is the maximum possible for a cell
        });
    }
});
