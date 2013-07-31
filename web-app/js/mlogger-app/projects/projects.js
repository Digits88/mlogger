'use strict';

angular.module('projects', ['ui.bootstrap', 'ngResource', 'source.configuration', 'source.preview'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/new', {controller: 'ProjectCtrl', template:'<p>martin</p>'})
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

    .controller('ProjectCtrl', ['$scope', '$location', 'ProjectFactory', function ($scope, $location, ProjectFactory) {
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
        }

        $scope.viewSources = function (project) {
//            $location.path('/mlogger/projects/'+project._id.$oid+'/sources');
            ProjectFactory.querySources(project).then(function (projects) {
//                $location.path('/mlogger/projects').search({projectId: project._id.$oid});
                $scope.projectSources = projects
            });
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

        $scope.viewSourceConfiguration = function(project) {
            $location.path('/projects/'+project._id.$oid+'/source/configuration');

        };

        // Helpers
        function populateProjectsData() {
            ProjectFactory.query().then(function (projects) {
                $scope.projects = projects;
                $scope.projectAction = "cancel";
            });
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
            },
            querySources:function (project) {
                var deferred = $q.defer();
                $http.get("/mlogger/sources?id=" + project._id.$oid)
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

    .directive('mloggerProjectSources', ['$compile', function ($compile) {
        return {
            templateUrl:"static/js/mlogger-app/projects/source-list.tpl.html",
            replace:true,
            transclude:false,
            restrict:'EA',
            scope:{
                projects:'=',
                cancelProject:'=',
                createProject:'=',
                deleteProject:"=",
                project:'=',
                projectAction:'=',
                updateProject:'='
            }
        };
    }]);