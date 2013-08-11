'use strict';

angular.module('log-viewer', ['ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
//        .when('/mlogger/projects', {
//            templateUrl: 'static/js/mlogger-app/projects/projects.html',
//            controller: 'ProjectCtrl'
////            resolve: {
////                projects:['ProjectFactory', function (ProjectFactory) {
////                    return ProjectFactory.query();
////                }]
////            }
//        })
            .when('/viewer', {
                templateUrl: 'static/js/mlogger-app/log-viewer/log-viewer.html',
                controller:'LogViewerCtrl'
            })

//        .when('/configuration', {
//            templateUrl: 'projects/source/configuration/source-configuration.tpl.html',
//            controller: 'SourceConfigurationCtrl'
//        })
    }])

    .controller('LogViewerCtrl', ['$scope', '$location', 'LogViewerFactory', 'Logger', function ($scope, $location, LogViewerFactory, Logger) {
        var logger = Logger.getLogger('LogViewerCtrl');

        populateProjectsData();
        $scope.oneAtATime = true;

        $scope.viewSource = function (project, source) {
            //$location.path('/viewer/events').search({projectId: project._id.$oid, sourceId: source._id.$oid, max: 10, offset: 0});
            LogViewerFactory.queryEvent(project, source, 0, 10).then(function (data) {
                populateGridData(data, project, source);
            });
        };

        function populateGridData(data, project, source) {
            logger.time('start populate grid data');
//            var mask = [{head: ["lineNumber", "DATE", "TIME", "HOST", "LEVEL", "CLASS", "THREAD", "MESSAGE"]}];
            var mask = [{head: source.mask.head}];

            var rows = [];

            _.each(data.logs, function (log, index) {
                var cells = [];
                var head;
                for (var i = 0; i < mask[0].head.length; i++) {
                    head = mask[0].head[i];
                    addCell(head, log[head], cells);
                }
                addRow(cells, index, rows)
            });

            addGridData(mask[0].head, rows, project, source, data.pagination);

            logger.time('finish populate grid data');
        }

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

        function addGridData(headers, rows, project, source, pagination) {
            $scope.gridData = {
                    project: project,
                    source: source,
                    pagination: pagination,
                    headers: headers,
                    rows: rows
                };
        }


        // Helpers
        function populateProjectsData() {
            LogViewerFactory.query().then(function (projects) {
                $scope.projects = projects;
            });
        }

        $scope.currentPage = 1;
        $scope.maxSize = 10;

        $scope.prevPage = function() {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.prevPageDisabled = function() {
            return $scope.currentPage === 0 ? "disabled" : "";
        };

        $scope.nextPage = function() {
            if ($scope.currentPage < $scope.pageCount() - 1) {
                $scope.currentPage++;
            }
        };

        $scope.nextPageDisabled = function() {
            return $scope.currentPage === $scope.pageCount() - 1 ? "disabled" : "";
        };

        $scope.pageCount = function() {
            return Math.ceil($scope.gridData.pagination.total/$scope.gridData.pagination.noOfPages);
        };

        $scope.$watch("currentPage", function(newValue) {
            if(!_.isUndefined($scope.gridData)) {
                //$location.path('/mlogger/events').search({projectId: $scope.gridData.project._id.$oid, sourceId: $scope.gridData.source._id.$oid, max: $scope.gridData.pagination.max, offset: newValue * $scope.gridData.pagination.max});
                LogViewerFactory.queryEvent($scope.gridData.project, $scope.gridData.source, newValue * $scope.gridData.pagination.max, $scope.gridData.pagination.max).then(function (data) {
                    populateGridData(data, $scope.gridData.project, $scope.gridData.source);
                });
            }
        });
    }])
// restful r basically models in angular http://www.yearofmoo.com/2012/08/use-angularjs-to-power-your-web-application.html#web-applications-not-websites
//http://ngmodules.org/modules/restangular
//    .factory('todoFactory', function($resource) {
//        return $resource('/mLogger/project/:id', { id:'@_id.$oid' });
//    })

    .factory('LogViewerFactory', function ($q, $http) {
        return {
            save:function (project) {
                var deferred = $q.defer();
                $http.post("/mlogger/project", [project])
                    .success(function (data) {
                                 deferred.resolve(data);
                             })
                    .error(function (data, status) {
                               deferred.reject(new Error('Error saving project data: ' + status));
                           });
                return deferred.promise;
            },
            query:function () {
                var deferred = $q.defer();
                $http.get("/mlogger/projects")
                        .success(function (data) {
                                     deferred.resolve(data);
                                 })
                        .error(function (data, status) {
                                   deferred.reject(new Error('Error loading projects data: ' + status));
                               });
                return deferred.promise;
            },
            queryEvent:function (project, source, offset, max) {
                var deferred = $q.defer();
                $http.get('/mlogger/events?projectId=' + project._id.$oid + '&sourceId=' + source._id.$oid + '&maxPag=' + max + '&offsetPag=' + offset, {project: project._id.$oid, source: source._id.$oid, maxPag: max, offsetPag: offset})
                        .success(function (data) {
                                     deferred.resolve(data);
                                 })
                        .error(function (data, status) {
                                   deferred.reject(new Error('Error loading projects data: ' + status));
                               });
                return deferred.promise;
            }

        }
    })

