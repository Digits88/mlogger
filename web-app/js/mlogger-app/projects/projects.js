'use strict';

angular.module('projects', ['ui.bootstrap', 'ngResource', 'source.configuration', 'source.preview'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/projects/:projectId/sources', {controller: 'ProjectCtrl'})
        .when('/projects', {
            templateUrl: 'static/js/mlogger-app/projects/projects.html',
            controller: 'ProjectCtrl'
//            resolve: {
//                projects:['ProjectFactory', function (ProjectFactory) {
//                    return ProjectFactory.query();
//                }]
//            }
        })
//            .when('/mlogger/projects/:projectId/source/configuration', {
//                templateUrl:'static/js/mlogger-app/projects/source/configuration/source-configuration.tpl.html',
//                controller:'SourceConfigurationCtrl'
//            })
//        .when('/configuration', {
//            templateUrl: 'projects/source/configuration/source-configuration.tpl.html',
//            controller: 'SourceConfigurationCtrl'
//        })
    }])

    .controller('ProjectCtrl', ['$scope', '$location', 'ProjectFactory', 'Logger', 'SourceFactory', function ($scope, $location, ProjectFactory, Logger, SourceFactory) {
        var logger = Logger.getLogger('LogViewerCtrl');
//    $scope.projects = projects;
//
//    $scope.viewProject = function (projectId) {
//    $location.path('/projects/'+projectId);
//    };
//
//    $scope.manageBacklog = function (projectId) {
//    $location.path('/projects/'+projectId+'/productbacklog');
//    };
//
//    $scope.manageSprints = function (projectId) {
//    $location.path('/projects/'+projectId+'/sprints');
//    };
        populateProjectsData();

        $scope.addProject = function () {
            $scope.projectAction = 'create';
            $scope.project = {};
        };

        $scope.cancelProject = function () {
            $scope.projectAction = 'cancel';
        };

        $scope.editProject = function (action, project) {
            $scope.project = project;
            if(action === 'edit') {
                $scope.projectAction = action;
            } else if(action === 'delete') {
                $scope.projectAction = action;
            }
        };

        $scope.deleteProject = function(project) {
            ProjectFactory.delete(project).then(function () {
                populateProjectsData();
            });
        };

        $scope.createProject = function(project) {
            ProjectFactory.save(project).then(function () {
                populateProjectsData();
            });
        };

        $scope.updateProject = function(project) {
            ProjectFactory.update(project).then(function () {
                populateProjectsData();
            });
        };

        $scope.viewSources = function (project) {
            SourceFactory.queryAll(project).then(function (sources) {
                $scope.projectNavClicked = true;
                populateGridData(sources, project);
//                $location.path('/projects/' + project._id.$oid + '/sources');
            });
        };

        $scope.deleteSource = function(project, source) {
            SourceFactory.delete(project, source).then(function () {
                SourceFactory.queryAll(project).then(function (sources) {
                    populateGridData(sources, project);
                });
            });
        };

        $scope.viewSourceConfiguration = function(project) {
            $location.path('/projects/'+project._id.$oid+'/source/configuration');
        };

        $scope.editSource = function(project, source) {
            $location.path('/projects/'+ project._id.$oid + '/sources/' + source._id.$oid + '/configuration');
        };

        // Helpers
        function populateProjectsData() {
            ProjectFactory.query().then(function (projects) {
                $scope.projects = projects;
                $scope.projectAction = "cancel";
            });
        }

        function populateGridData(sources, project) {
            logger.time('start populate grid data');
            var rows = [];
            var header = [
                {
                    id: "name",
                    type: "value",
                    label: "NAME"
                },
                {
                    id: "host",
                    type: "value",
                    label: "HOST"
                },
                {
                    id: "source",
                    type: "value",
                    label: "SOURCE"
                },
                {
                    id: "dataType",
                    type: "value",
                    label: "DATA TYPE"
                },
                {
                    id: "countEvent",
                    type: "value",
                    label: "COUNT EVENT"
                },
                {
                    id: "earliestEvent",
                    type: "value",
                    label: "EARLIEST EVENT"
                },
                {
                    id: "lastEvent",
                    type: "value",
                    label: "LAST EVENT"
                },
                {
                    id: "pattern",
                    type: "value",
                    label: "PATTERN"
                },
                {
                    id: "action",
                    type: "action",
                    label: "ACTION"
                }
            ];

            _.each(sources, function (source, index) {
                var cells = [];
                var head;
                for (var i = 0; i < header.length; i++) {
                    head = header[i];
                    addCell(head, source[head.id], cells);
                }
                addRow(cells, index, rows, source)
            });

            addGridData(header, rows, project);
            logger.time('finish populate grid data');
        }

        function addCell(head, value, cells) {
            var cellValue = {
                id: {
                    type: head.type,
                    header: head.value
                },
                value: value
            };

            cells.push(cellValue);
        }

        function addRow(cells, rowId, rows, source) {
            var rowValue = {
                id: rowId,
                cells: cells,
                source: source
            };

            rows.push(rowValue);
        }

        function addGridData(headers, rows, project) {
            $scope.gridData = {
                    project: project,
                    headers: headers,
                    rows: rows
                };
        }

            // Modal Form
//        $scope.open = function () {
//          $scope.shouldBeOpen = true;
//        };
//
//        $scope.close = function () {
//            $scope.closeMsg = 'I was closed at: ' + new Date();
//            $scope.shouldBeOpen = false;
//        };
    }])
// restful r basically models in angular http://www.yearofmoo.com/2012/08/use-angularjs-to-power-your-web-application.html#web-applications-not-websites
//http://ngmodules.org/modules/restangular
//    .factory('todoFactory', function($resource) {
//        return $resource('/mLogger/project/:id', { id:'@_id.$oid' });
//    })

    .factory('ProjectFactory', function ($q, $http) {
        return {
            delete:function (project) {
                var deferred = $q.defer();
                $http.delete("/mlogger/project/delete?id=" + project._id.$oid)
                    .success(function (data) {
                                 deferred.resolve(data);
                             })
                    .error(function (data, status) {
                               deferred.reject(new Error('Error deleting project data: ' + status));
                           });
                return deferred.promise;
            },
            update:function (project) {
                var deferred = $q.defer();
                $http.put("/mlogger/project/update", project)
                    .success(function (data) {
                                 deferred.resolve(data);
                             })
                    .error(function (data, status) {
                               deferred.reject(new Error('Error updating project data: ' + status));
                           });
                return deferred.promise;
            },
            save:function (project) {
                var deferred = $q.defer();
                $http.post("/mlogger/projects", project)
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
            }
        }
    })

    .directive('mloggerProjectList', ['$compile', function ($compile) {
        return {
            priority:0,
            templateUrl:"static/js/mlogger-app/projects/project-list.tpl.html",
            replace:false,
            transclude:false,
            restrict:'EA',
            scope:{
                projects:"=",
                viewSources:"=",
                editProject:'='
            }
        };
    }])

    .directive('mloggerProjectDetails', ['$compile', function ($compile) {
        return {
            templateUrl:"static/js/mlogger-app/projects/project-details.tpl.html",
            replace:false,
            transclude:false,
            restrict:'EA',
            scope:{
                cancelProject:'=',
                createProject:'=',
                deleteProject:"=",
                project:'=',
                projectAction:'=',
                updateProject:'='
            }
        };
    }])

    .directive('mloggerProjectSidebar', ['$compile', function ($compile) {
        return {
            restrict:'EA',
            replace:false,
            scope:{
                projects:'=',
                projectAction:'=',
                createProject:'=',
                editProject:'=',
                deleteProject:'=',
                updateProject:'=',
                cancelProject:'=',
                addProject:'=',
                viewSources:'=',
                project:'='
            },
            link:function (scope, element, attrs) {

                element.html($compile('<div mlogger-project-list projects="projects" view-sources="viewSources" edit-project="editProject"></div>')(scope));

                scope.$watch('projectAction', function (newVal, oldVal) {
                    if (newVal != oldVal) {
                        if (scope.projectAction === 'create' || scope.projectAction === 'delete' || scope.projectAction === 'edit') {
                            element.html($compile('<div mlogger-project-details add-project="addProject" cancel-project="cancelProject" create-project="createProject" delete-project="deleteProject" update-project="updateProject" project="project" project-action="projectAction"></div>')(scope));
                        }
                        else if (scope.projectAction === 'cancel') {
                            element.html($compile('<div mlogger-project-list projects="projects" view-sources="viewSources" edit-project="editProject"></div>')(scope));
                        }
                    }
                });
            }
        };
    }])

    .directive('mloggerGridCell', ['$compile', function ($compile) {
        return {
            restrict:'EA',
            replace:false,
            scope:{
                cell:'=mloggerGridCell',
                source:'=',
                project:'=',
                editSource:'=',
                deleteSource:'='
            },
            link:function (scope, element, attrs) {
                var row = scope.row;
                var cell = scope.cell;

                if (cell.id.type === 'action') {
                    element.html($compile('<span mlogger-action-cell source="source" project="project" delete-source="deleteSource" edit-source="editSource"></span>')(scope));
                }
                else {
                    element.html($compile('<span>{{ cell.value }}</span>')(scope));
                }

            }
        };
    }])

    .directive('mloggerActionCell', function () {
        return {
            restrict:'A',
            replace:true,
            scope:{
                source:'=',
                project:'=',
                editSource:'=',
                deleteSource:'='
            },
            template:'<div>' +
                     '  <img src="static/images/skin/pencil.png" alt="edit" ng-click="editSource(project, source)" style="cursor:pointer; "/>' +
                     '  <img src="static/images/skin/delete.png" alt="delete" ng-click="deleteSource(project, source)" style=" cursor:pointer;"/>' +
                     '</div>'
        };
    })

