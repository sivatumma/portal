enyo.kind({
    name: "cls.reportsView",
    classes: "reportsView",
    published: {
        currentUser: null,
    },
    components: [{
        name: "chartContainers",
        kind: "FittableColumns",
        classes: "panel",
        style: "background-color: white;",
        components: [{
            name: "chartContainer1",
            style: "padding-right: 2px; height: 350px; width: 450px; background-color: white;"
        }, {
            name: "chartContainer2",
            fit: true,
            style: "padding-left: 2px; height: 350px; background-color: white;"
        }]
    }, ],
    bindings: [{
        from: ".app.currentUser",
        to: ".currentUser",
        transform: function(v) {
            if (v != this.currentUser) {
                this.updatMetrics();
            }
            return v;
        }
    }],
    updatMetrics: function() {
        if (!this.updated) {
            AnalyticsLogger.getAnalyticsData("316670706", this, enyo.bind(this, "loadPieChart"));
        }
    },
    loadPieChart: function(inSender, inResponse) {
        AnalyticsLogger.getAnalyticsData("316670706", this, enyo.bind(this, "loadPieChart2"));
        var resultData = inResponse.data;
        this.log(resultData);
        var chart;
        this.setTheme();
        // Radialize the colors
        // Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function(color) {
        //     return {
        //         radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
        //         stops: [
        //             [0, color],
        //             [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
        //         ]
        //     };
        // });
        var chartData = [];
        var eventCounts = {};
        _.each(inResponse.events, function(eventObj) {
            var event = eventObj.event;
            if (event && event.json && event.json.data) {
                var dateName = moment(event.json.date).format("Z");
                var eventCount = eventCounts[dateName] || 0;
                eventCounts[dateName] = ++eventCount;
            }
        });
        for (var key in eventCounts) {
            chartData.push([key, eventCounts[key]]);
        }
        //do stuff with o[key]
        // Build the chart
        var container = this.children[0];
        AppConfig.alert(container);
        // var cs = enyo.dom.getComputedStyle(container.hasNode());            
        // var cd = {width:parseInt(s.width),height:parseInt(s.height)}; 
        var chart1 = new Highcharts.Chart({
            chart: {
                renderTo: container.children[0].hasNode(), //'container',
                // animation: {
                //     duration: 1000
                // },
                plotBackgroundColor: null,
                borderWidth: 2,
                plotBorderWidth: null,
                plotShadow: false,
            },
            credits: {
                href: 'www.mtuity.com',
                enabled: false
            },
            title: {
                text: 'App Launches by Timezone'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    // cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            var percentage = this.percentage;
                            return '<b>' + this.point.name + '</b><br> ' + percentage.toFixed(2) + '%';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Percent of launches',
                data: chartData
            }]
        });
    },
    loadPieChart2: function(inSender, inResponse) {
        var resultData = inResponse.data;
        this.log(this);
        var chart;
        // Radialize the colors
        // Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function(color) {
        //     return {
        //         radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
        //         stops: [
        //             [0, color],
        //             [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
        //         ]
        //     };
        // });
        var container = this.children[0];
        var chartData = [];
        var categoryList = [];
        var eventCounts = {};
        _.each(inResponse.events, function(eventObj) {
            var event = eventObj.event;
            if (event && event.json && event.json.event) {
                var eventName = event.json.event;
                var eventCount = eventCounts[eventName] || 0;
                eventCounts[eventName] = ++eventCount;
            }
        });
        for (var key in eventCounts) {
            categoryList.push(key);
            chartData.push([key, eventCounts[key]]);
            AppConfig.log(key, eventCounts[key]);
        }
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: container.children[1].hasNode(),
                animation: {
                    duration: 1000
                },
                type: 'column',
                borderWidth: 2,
                plotBorderWidth: 1,
            },
            credits: {
                href: 'www.mtuity.com',
                enabled: false
            },
            title: {
                text: "Application Events By Type"
            },
            xAxis: {
                title: {
                    text: "Application Name"
                },
                categories: categoryList //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: "Number of Launches"
                },
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br/>' + this.x + ': ' + this.y;
                }
            },
            plotOptions: {
                series: {
                    // stacking: 'normal'
                }
            },
            series: [{
                name: "Application",
                data: chartData
            }]
        });
    },
    setTheme: function() {
        /**
         * Grid theme for Highcharts JS
         * @author Torstein Hønsi
         */
        Highcharts.theme = {
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            chart: {
                backgroundColor: 'whitesmoke',
                borderWidth: 0,
                plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                plotBorderWidth: 1
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                    dataLabels: {
                        distance: 5
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return this.point.name + " : " + this.y;
                }
            },
            title: {
                style: {
                    color: '#000',
                    font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                }
            },
            subtitle: {
                style: {
                    color: '#666666',
                    font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
                }
            },
            xAxis: {
                gridLineWidth: 1,
                lineColor: '#000',
                tickColor: '#000',
                labels: {
                    style: {
                        color: '#808080',
                        font: '11px Trebuchet MS, Verdana, sans-serif'
                    }
                },
                title: {
                    style: {
                        color: '#333',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                minorTickInterval: 'auto',
                lineColor: '#000',
                lineWidth: 1,
                tickWidth: 1,
                tickColor: '#000',
                labels: {
                    style: {
                        color: '#808080',
                        font: '11px Trebuchet MS, Verdana, sans-serif'
                    }
                },
                title: {
                    style: {
                        color: '#87CEFA',
                        fontWeight: 'bold',
                        fontSize: '10px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                    }
                }
            },
            labels: {
                style: {
                    color: 'darkgrey'
                }
            },
            navigation: {
                buttonOptions: {
                    theme: {
                        stroke: '#CCCCCC'
                    }
                }
            },
            credits: {
                enabled: false
            }
        };
        // Apply the theme
        var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
    }
});