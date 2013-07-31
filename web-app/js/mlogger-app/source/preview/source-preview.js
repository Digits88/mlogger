'use strict';

angular.module('source.preview', ['sourceService', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/projects/:projectId/source/preview', {
                templateUrl:'static/js/mlogger-app/source/preview/source-preview.tpl.html',
                controller:'SourcePreviewCtrl'
            })
    }])

    .controller('SourcePreviewCtrl', ['$scope', '$location', 'SourceFactory', '$routeParams', function ($scope, $location, SourceFactory, $routeParams) {

        $scope.viewSourceConfiguration = function() {
            $location.path('/projects/'+ $routeParams.projectId +'/source/configuration');
        };

        $scope.source = SourceFactory.getSource();
        $scope.choice = 3;

        $scope.masks = [
            {
                id: 1,
                label: "(\\d{4}-\\d{2}-\\d{2}) (\\d{2}:\\d{2}:\\d{2},\\d{3}) (\\[.*\\]) (.*) (\\S*) (\\(.*\\)) - (.*)",
                regex: "^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2},\d{3}) (\[.*\]) (.*) (\S*) (\(.*\)) - (.*)$",
                head: ["DATE", "TIME", "THREAD", "LEVEL", "LOGGER", "Diagnostic Context", "MESSAGE"]
            },
            {
                id: 2,
                label: "(\\d{4}-\\d{2}-\\d{2}) (\\d{2}:\\d{2}:\\d{2},\\d{3}) (.*)",
                regex: /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2},\d{3}) (.*)$/,
                head: ["DATE", "TIME", "TEXT"]
            },
            {
                id: 3,
                label: "Default",
                regex: /^(.*)$/,
                head: ["EVENT"]
            }
        ];

        $scope.heads = ["EVENT"];
        $scope.logs = ["2012-09-27 01:00:00,612 [quartzScheduler_Worker-3] TEST phase.PhaseInterceptorChain (DC Job KCI Status Update) - Chain org.apache.cxf.phase.PhaseInterceptorChain@307bcef0 was created. Current flow:","  receive [LoggingInInterceptor, AttachmentInInterceptor]","  post-stream [StaxInInterceptor]","2012-09-27 01:00:00,612 [quartzScheduler_Worker-3] DEBUG phase.PhaseInterceptorChain (DC Job KCI Status Update) - Chain test org.apache.cxf.phase.PhaseInterceptorChain@307bcef0 was created. Current flow:","2012-09-27 01:00:00,028 [quartzScheduler_Worker-4] INFO  rolo.BasketCleanUpJob (DC Job Basket Cleanup) - Running shopping basket clean up"];

        addGridData($scope.heads, $scope.logs);

        $scope.watchRadioButtonChange = function(newValue) {
            var mask = _.filter($scope.masks, function(obj){ return obj.id == newValue; });
            var rows = [];

            _.each($scope.source.logs, function (log, index) {
                var regex = new RegExp(mask[0].regex);
                var matches = log.match(regex);
                if(!_.isUndefined(matches) && !_.isNull(matches)) {
                    var cells = [];
                    for (var i = 1; i < matches.length; i++) {
                        addCell(mask[0].head[i-1], matches[i], cells);
                    }
                    addRow(cells, index, rows)
                }
            });

            addGridData(mask[0].head, rows);
            $scope.source.mask = mask[0];
        };

        $scope.watchRadioButtonChange(3);

        function addCell(type, value, cells) {
            var cellValue = {
                id: {
                    type: type
                },
                value: value
            };

            cells.push(cellValue);
        }

        function addRow(cells, rowId, rows) {
            var rowValue = {
                id: rowId,
                cells: cells
            };

            rows.push(rowValue);
        }

        function addGridData(headers, rows) {
            $scope.gridData = {
                    headers: headers,
                    rows: rows
                };
        }
    }]);

