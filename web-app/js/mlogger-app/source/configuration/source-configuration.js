'use strict';

angular.module('source.configuration', ['sourceService', 'ui.bootstrap', 'ngUpload'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/projects/:projectId/source/configuration', {
                templateUrl:'static/js/mlogger-app/source/configuration/source-configuration.tpl.html',
                controller:'SourceConfigurationCtrl'
            })
    }])

    .controller('SourceConfigurationCtrl', ['$scope', '$location', '$routeParams', 'SourceFactory', function ($scope, $location, $routeParams, SourceFactory) {
        $scope.hosts = [
            {id:'1', host:'Local Drive'},
            {id:'2', host:'Over SSH'},
            {id:'3', host:'Over FTP'},
            {id:'4', host:'Merge Logs'}
        ];
//        $scope.host = $scope.hosts[0];

        $scope.types = [
            {id:'1', type:'Apache Logs'},
            {id:'2', type:'IIS'}
        ];
//        $scope.type = $scope.types[0];
        $scope.source = {
            name: '',
            host: '',
            type: '',
            file: '' ,
            fileSize: '',
            fileName: '',
            logs: ''
        };

        $scope.uploadComplete = function (content, completed) {
            if (completed && content)
            {
                $scope.source.fileSize = content.fileSize;
                $scope.source.fileName = content.fileName;
                $scope.source.logs = content.logs;
                $scope.source.projectId = $routeParams.projectId;
                SourceFactory.setSource($scope.source);
                $location.path('/projects/'+ $routeParams.projectId +'/source/preview');
            }
        };

        $scope.createSource = function(source) {
            var ms =             {
                            id: 1,
                            label: "(\\d{4}-\\d{2}-\\d{2}) (\\d{2}:\\d{2}:\\d{2},\\d{3}) (\\[.*\\]) (.*) (\\S*) (\\(.*\\)) - (.*)",
                            regex: "/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2},\d{3}) (\[.*\]) (.*) (\S*) (\(.*\)) - (.*)$/",
                            head: ["DATE", "TIME", "THREAD", "LEVEL", "LOGGER", "Diagnostic Context", "MESSAGE"]
                        }
            source.projectId = $routeParams.projectId;
            source.mask = ms;
            SourceFactory.save(source).then(function () {
            });
        };
    }]);

