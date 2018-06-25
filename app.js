// Angular init
(function() {
    'use strict';

    angular.module('MyApp',['ngMaterial'])
        .controller('SignalRCtrl', SignalRCtrl);

    function SignalRCtrl($mdPanel, $scope) {
        this._mdPanel = $mdPanel;
        var self = this;
        $scope.maxValue = 5;
        // this array will hold the data
        this.plotData = [0];
        this.ThePlotChart = undefined;

         var chat = $.connection.chatHub; // Declare a proxy to reference the hub.

            // This function will be called each time a value is sent from server..
            chat.client.broadcastMessage = function (randomVal) {
                $('#theValue').text(randomVal);
                if (self.plotData.length > 100)
                    self.plotData = [0];
                // add the data point
                self.plotData.push(parseInt(randomVal));
                // plot it!
                self.ThePlotChart = self.renderChart(self.ThePlotChart, self.plotData);
            };

            // Start the connection.
            $.connection.hub.start().done(function () {
                // every 2 seconds, generate a new random value and send to server
                setInterval(function () {
                    var maxValue = $("#maxValue").val();
                    var randomVal = Math.floor(Math.random() * (maxValue - 1 + 1) + 1);
                    chat.server.send(randomVal);
                }, 2000);
            });


        // default plot
       this.ThePlotChart = this.renderChart(this.ThePlotChart, this.plotData);
    }


    SignalRCtrl.prototype.resetChart = function () {
        this.plotData = [0];
    }


    /* JQPlot */
    SignalRCtrl.prototype.renderChart = function (ThePlotChart, plotData) {

        if (ThePlotChart) {
            ThePlotChart.destroy();
        }

        $('#chartDiv').show();

        var plot = $.jqplot('chartDiv', [plotData], {
            title: {
                text: 'SingleR Data',
                show: false,
                fontSize: '100%',
                textColor: 'white'
            },
            axesDefaults: {
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    angle: -30,
                    fontSize: '10pt',
                    textColor: (function () {
                        return '#333';
                    })()
                }
            },
            seriesDefaults: {
                renderer: $.jqplot.MeterGaugeRenderer,
                rendererOptions: {
                    smooth: true
                },
                step: true,
                markerOptions: { show: false },
                trendline: {
                    show: true,
                    color: 'lightcoral'
                }
            },
            axes: {
                xaxis: {
                    label: "Index",
                    pad: 0
                },
                yaxis: {
                    label: "Value"
                }
            }
        });

        return plot;
    }
})();




