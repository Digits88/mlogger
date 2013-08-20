'use strict';

angular.module('source.preview', ['sourceService', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/projects/:projectId/source/:sourceId/preview', {
                templateUrl:'static/js/mlogger-app/source/preview/source-preview.tpl.html',
                controller:'SourcePreviewCtrl'
            })
    }])

    .controller('SourcePreviewCtrl', ['$scope', '$location', 'SourceFactory', '$routeParams', 'EventFactory', function ($scope, $location, SourceFactory, $routeParams, EventFactory) {

        $scope.viewSourceConfiguration = function() {
            $location.path('/projects/'+ $routeParams.projectId + '/sources/' + $routeParams.sourceId + '/configuration');
        };

        $scope.source = SourceFactory.getSource();
        $scope.choice = 4;

        $scope.masks = [
            {
                id: 1,
                label: "(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) (\\[.*\\]) (.*) (\\S*) (\\(.*\\)) - (.*)",
                regex: "^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) (\\[.*\\]) (.*) (\\S*) (\\(.*\\)) - (.*)$",
                head: ["TIME", "THREAD", "LEVEL", "LOGGER", "CONTEXT", "MESSAGE"]
            },
            {
                id: 2,
                label: "(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) (.*)",
                regex: "^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) (.*)$",
                head: ["TIME", "MESSAGE"]
            },
            {
                id: 3,
                label: "(\\S*) - - \\[(.*)] \"....? (\\S*) .*\" (\\d*) ([-0-9]*) (\".*\")",
                regex: '^(\\S*) - - \\[(.*)] \\"....? (\\S*) .*\\" (\\d*) ([-0-9]*) (\\".*\\")?',
                head: ["HOST", "TIME", "HTTP", "STATUS", "SIZE", "MESSAGE"]
            },
            {
                id: 4,
                label: "Default",
                regex: "^(.*)$",
                head: ["EVENT"]
            }
        ];

        $scope.addEvent = function () {
            $scope.eventsDetail = {};
            $scope.eventsDetail.mask = $scope.maskSelected;
            $scope.eventsDetail.head = $scope.eventsDetail.mask.head;
            $scope.eventsDetail.sourceId = $routeParams.sourceId;
            EventFactory.save($scope.eventsDetail).then(function (data) {
                $location.path('/projects');
            });
        };

//        $scope.heads = ["EVENT"];
//        $scope.logs = ["2012-09-27 01:00:00,612 [quartzScheduler_Worker-3] TEST phase.PhaseInterceptorChain (DC Job KCI Status Update) - Chain org.apache.cxf.phase.PhaseInterceptorChain@307bcef0 was created. Current flow:","  receive [LoggingInInterceptor, AttachmentInInterceptor]","  post-stream [StaxInInterceptor]","2012-09-27 01:00:00,612 [quartzScheduler_Worker-3] DEBUG phase.PhaseInterceptorChain (DC Job KCI Status Update) - Chain test org.apache.cxf.phase.PhaseInterceptorChain@307bcef0 was created. Current flow:","2012-09-27 01:00:00,028 [quartzScheduler_Worker-4] INFO  rolo.BasketCleanUpJob (DC Job Basket Cleanup) - Running shopping basket clean up"];

        //addGridData($scope.heads, $scope.logs);

        $scope.watchRadioButtonChange = function(newValue) {
            var mask = _.filter($scope.masks, function(obj){ return obj.id == newValue; });
            var rows = [];
            $scope.maskSelected = mask[0];
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

        $scope.watchRadioButtonChange(4);

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
    }])

    .factory('EventFactory', function ($q, $http) {
        return {
            save:function (project) {
                var deferred = $q.defer();
                $http.post("/mlogger/events/save", project)
                    .success(function (data) {
                                 deferred.resolve(data);
                             })
                    .error(function (data, status) {
                               deferred.reject(new Error('Error saving event data: ' + status));
                           });
                return deferred.promise;
            }
        }
    });

