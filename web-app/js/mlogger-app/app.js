'use strict';

var LOG_LEVEL_ENUM = {
    OFF:{value:0, name:"All", code:"A"},
    INFO:{value:1, name:"Info", code:"I"},
    LOG:{value:2, name:"Log", code:"L"},
    WARN:{value:3, name:"Warn", code:"W"},
    ERROR:{value:4, name:"Error", code:"E"},
    ALL:{value:5, name:"Off", code:"O"}
};

angular.module('mloggerApp', ['log-viewer', 'projects', 'source.configuration', 'administration'])

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
//        $locationProvider.html5Mode(true);
        $routeProvider
//            .when('/', {
//                templateUrl:'',
//                controller:''
//            })
            .when('/', {
                templateUrl: 'static/js/mlogger-app/home/home.tpl.html'
            })
//            .otherwise({redirectTo: '/projects'});
    }])

//    .constant('APP_ROOT', 'static/js/mlogger-app/');
    .controller('NavCtrl', ['$scope','$route', '$routeParams', '$location', function MenuCntl($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
    }])

.constant('_START_REQUEST_', '_START_REQUEST_')
.constant('_END_REQUEST_', '_END_REQUEST_')

.config(['$httpProvider', '_START_REQUEST_', '_END_REQUEST_', function ($httpProvider, _START_REQUEST_, _END_REQUEST_) {
    var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {
            var rootScope;

            function success(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get $rootScope via $injector because of circular dependency problem
                    rootScope = rootScope || $injector.get('$rootScope');
                    // send a notification requests are complete
                    rootScope.$broadcast(_END_REQUEST_);
                }
                return response;
            }

            function error(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get $rootScope via $injector because of circular dependency problem
                    rootScope = rootScope || $injector.get('$rootScope');
                    // send a notification requests are complete
                    rootScope.$broadcast(_END_REQUEST_);
                }
                return $q.reject(response);
            }

            return function (promise) {
                // get $rootScope via $injector because of circular dependency problem
                rootScope = rootScope || $injector.get('$rootScope');
                // send notification a request has started
                rootScope.$broadcast(_START_REQUEST_);
                return promise.then(success, error);
            }
        }];

    $httpProvider.responseInterceptors.push(interceptor);
}])

.filter('newline', function(){
        return function(text) {
  return text.replace(/\n/g, '<br/>');
        }
})

.directive('loadingWidget', ['_START_REQUEST_', '_END_REQUEST_', function (_START_REQUEST_, _END_REQUEST_) {
    return {
        restrict: "A",
        link: function (scope, element) {
            // hide the element initially
            element.hide();

            scope.$on(_START_REQUEST_, function () {
                // got the request start notification, show the element
                element.show();
            });

            scope.$on(_END_REQUEST_, function () {
                // got the request end notification, hide the element
                element.hide();
            });
        }
    };
}])

.factory('Logger', ['$log', function ($log) {

    var timeStart = new Date().getTime();

    return {

        getLogger:function () {

            // Convert variable arguments to function into an array for processing

            var args = [].slice.apply(arguments);

            var getSource = function () {

                var getSourceElement = function (element, terminator) {

                    return _.isUndefined(element) ? "" : element.concat(terminator);

                };

                return _.reduce(_.first(args, args.length - 1), function (source, arg) { return source.concat(getSourceElement(arg, ", ")); }, "")

                        .concat(getSourceElement(_.last(args), ": "));

            };

            var leader = getSource();

            return {

                shouldLog:function (messageLevel) {

                    return (this.level["value"] >= messageLevel["value"]);

                },

                level:LOG_LEVEL_ENUM.ALL,

                withLevel:function (newLevel) {

                    this.level = newLevel;

                    return this;

                },

                error:function (msg) {

                    if (this.shouldLog(LOG_LEVEL_ENUM.ERROR)) {

                        $log.error(leader.concat(msg));

                    }

                },

                warn:function (msg) {

                    if (this.shouldLog(LOG_LEVEL_ENUM.WARN)) {

                        $log.warn(leader.concat(msg));

                    }

                },

                log:function (msg) {

                    if (this.shouldLog(LOG_LEVEL_ENUM.LOG)) {

                        $log.log(leader.concat(msg));

                    }

                },

                info:function (msg) {

                    if (this.shouldLog(LOG_LEVEL_ENUM.INFO)) {

                        $log.info(leader.concat(msg));

                    }

                },

                time:function (msg) {

                    if (this.shouldLog(LOG_LEVEL_ENUM.INFO)) {

                        var previousTime = timeStart;

                        timeStart = new Date().getTime();

                        msg = (timeStart - previousTime) + 'ms ' + msg;

                        $log.info(leader.concat(msg));

                    }

                }

            }

        }

    }

}]);
