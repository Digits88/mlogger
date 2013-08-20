'use strict';

angular.module('log-viewer', ['ui.highlight', 'ui.keypress', 'ui.bootstrap'])

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

    .controller('LogViewerCtrl', ['$scope', '$location', 'LogViewerFactory', 'Logger', '$timeout', function ($scope, $location, LogViewerFactory, Logger, $timeout) {
        var logger = Logger.getLogger('LogViewerCtrl');

        populateProjectsData();
        $scope.oneAtATime = false;
        $scope.filter = "";
        $scope.singleModel = 0;
        $scope.searchText = "";
        $scope.searchFlag = false;
        $scope.stackTraceShowed = false;

        $scope.viewSource = function (project, source) {
            $scope.searchTextCopy = "";
            $scope.searchText = "";
            //$location.path('/viewer/events').search({projectId: project._id.$oid, sourceId: source._id.$oid, max: 10, offset: 0});
            LogViewerFactory.queryEvent(project, source, 0, 10, $scope.searchText).then(function (data) {
                $scope.currentPage = 1;
                $scope.maxSize = 10;
                populateGridData(data, project, source);
            });
        };

        $scope.filters = [
            {id:'1', filterName:'Time'},
            {id:'2', filterName:'Time | Level'},
            {id:'3', filterName:'Time | User'}
        ];

        $scope.open = function() {
          $timeout(function() {
            $scope.opened = true;
          });
        };

        $scope.$watch('filter', function (newVal, oldVal) {
            if (newVal != oldVal) {
                if(angular.isDefined(newVal.id)) {
                    $scope.filterId = newVal.id;
                } else {
                    $scope.filterId = "";
                }
            }
        });

        $scope.filterEvent = function (project, source, filterQuery) {
            $scope.filterQuery.sourceId = $scope.gridData.project._id.$oid;
            $scope.filterQuery.projectId = $scope.gridData.project._id.$oid;
            $scope.filterQuery.maxPag = 0;
            $scope.filterQuery.offsetPag = 10;
//            LogViewerFactory.queryFilterEvent($scope.gridData.project, $scope.gridData.source, 0, 10, filterQuery).then(function (data) {
//                populateGridData(data, $scope.gridData.project, $scope.gridData.source);
//            });
            LogViewerFactory.queryFilterEvent($scope.filterQuery).then(function (data) {
                  populateGridData(data, $scope.gridData.project, $scope.gridData.source);
              });
        };

        $scope.searchEvent = function () {
            //$location.path('/viewer/events').search({projectId: project._id.$oid, sourceId: source._id.$oid, max: 10, offset: 0});
//            LogViewerFactory.querySearchEvent($scope.gridData.project, $scope.gridData.source, 0, 10, searchText).then(function (data) {
//                $scope.searchTextCopy = angular.copy(searchText);
//                populateGridData(data, $scope.gridData.project, $scope.gridData.source);
//            });
            LogViewerFactory.queryEvent($scope.gridData.project, $scope.gridData.source, 0, 10, $scope.searchText).then(function (data) {
                $scope.searchFlag = true;
                $scope.currentPage = 1;
                $scope.maxSize = 10;
                $scope.searchTextCopy = angular.copy(data.searchText);
                populateGridData(data, $scope.gridData.project, $scope.gridData.source);
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
                addRow(cells, index, rows);
//                if(!_.isUndefined(log.stackTrace)) {
//                    cells = [];
//                    addCell("stackTrace", log.stackTrace, cells);
//                    addRow(cells, index, rows)
//                }
            });

            addGridData(mask[0].head, rows, project, source, data.pagination, data.time);

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

        function addGridData(headers, rows, project, source, pagination, time) {
            $scope.gridData = {
                    project: project,
                    source: source,
                    pagination: pagination,
                    headers: headers,
                    rows: rows,
                    time: time
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

        $scope.$watch("currentPage", function(newValue, oldValue) {
            if( newValue != oldValue ) {
                if(!_.isUndefined($scope.gridData) && !$scope.searchFlag) {
                    //$location.path('/mlogger/events').search({projectId: $scope.gridData.project._id.$oid, sourceId: $scope.gridData.source._id.$oid, max: $scope.gridData.pagination.max, offset: newValue * $scope.gridData.pagination.max});
                    LogViewerFactory.queryEvent($scope.gridData.project, $scope.gridData.source, newValue * $scope.gridData.pagination.max, $scope.gridData.pagination.max, $scope.searchText).then(function (data) {
                        $scope.searchTextCopy = angular.copy(data.searchText);
                        populateGridData(data, $scope.gridData.project, $scope.gridData.source);
                    });
                }
                $scope.searchFlag = false;
            }
        });

        $scope.toggleStackTrace = function () {
            $scope.stackTraceShowed = !$scope.stackTraceShowed;
        };
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
            queryEvent:function (project, source, offset, max, searchText) {
                var deferred = $q.defer();
                $http.get('/mlogger/events/list?projectId=' + project._id.$oid + '&sourceId=' + source._id.$oid + '&maxPag=' + max + '&offsetPag=' + offset + '&searchText=' + searchText, {project: project._id.$oid, source: source._id.$oid, maxPag: max, offsetPag: offset})
                        .success(function (data) {
                                     deferred.resolve(data);
                                 })
                        .error(function (data, status) {
                                   deferred.reject(new Error('Error loading projects data: ' + status));
                               });
                return deferred.promise;
            },
            querySearchEvent:function (project, source, offset, max, searchText) {
                var deferred = $q.defer();
                $http.get('/mlogger/events/search?projectId=' + project._id.$oid + '&sourceId=' + source._id.$oid + '&maxPag=' + max + '&offsetPag=' + offset + '&searchText=' + searchText, {project: project._id.$oid, source: source._id.$oid, maxPag: max, offsetPag: offset})
                        .success(function (data) {
                                     deferred.resolve(data);
                                 })
                        .error(function (data, status) {
                                   deferred.reject(new Error('Error loading projects data: ' + status));
                               });
                return deferred.promise;
            },
            queryFilterEvent:function (filterQuery) {
                var deferred = $q.defer();
//                $http.post('/mlogger/events/filter?projectId=' + project._id.$oid + '&sourceId=' + source._id.$oid + '&maxPag=' + max + '&offsetPag=' + offset + '&filterQuery=' + filterQuery, {project: project._id.$oid, source: source._id.$oid, maxPag: max, offsetPag: offset})
//                        .success(function (data) {
//                                     deferred.resolve(data);
//                                 })
//                        .error(function (data, status) {
//                                   deferred.reject(new Error('Error loading projects data: ' + status));
//                               });
                $http.post("/mlogger/events/filter", filterQuery)
                    .success(function (data) {
                                 deferred.resolve(data);
                             })
                    .error(function (data, status) {
                               deferred.reject(new Error('Error saving event data: ' + status));
                           });
                return deferred.promise;
            }

        }
    })

    .directive('mloggerGridCellViewer', ['$compile', function ($compile) {
        return {
            restrict:'EA',
            replace:true,
            scope:{
                cell:'=mloggerGridCellViewer',
                searchTextCopy:'=',
                leng:'=',
                stackTraceShowed:'='
            },
            link:function (scope, element, attrs) {
                var cell = scope.cell;
                if (cell.id.type === 'MESSAGE') {
                    attrs.$set('colspan', '1');
                    element.html($compile('<span ng-bind-html-unsafe="cell.value | highlight:searchTextCopy:caseSensitive"></span>')(scope));
                }
//                else if (cell.id.type === 'stackTrace') {
//                    attrs.$set('colspan', scope.leng);
//                    attrs.$set('ng-show', scope.stackTraceShowed);
//                    element.addClass('stackTrace');
//                    element.html($compile('<span ng-bind-html-unsafe="cell.value | newline"></span>')(scope));
//                }
                else {
                    attrs.$set('colspan', '1');
                    element.html($compile('<span>{{ cell.value }}</span>')(scope));
                }
            }
        };
    }])

