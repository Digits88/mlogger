'use strict';

angular.module('chitterApp', ['clientCore'])
    .config(function ($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'app/templates/login.tpl.html',
            controller: 'MainCtrl'
        })
        .when('/home', {
            templateUrl: 'app/templates/home.tpl.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    });