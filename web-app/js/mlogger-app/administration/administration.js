'use strict';

angular.module('administration', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/administration', {
                templateUrl: 'static/js/mlogger-app/administration/administration.tpl.html'
            })
    }]);