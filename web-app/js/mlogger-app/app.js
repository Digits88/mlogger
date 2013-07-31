'use strict';

var LOG_LEVEL_ENUM = {
    OFF:{value:0, name:"All", code:"A"},
    INFO:{value:1, name:"Info", code:"I"},
    LOG:{value:2, name:"Log", code:"L"},
    WARN:{value:3, name:"Warn", code:"W"},
    ERROR:{value:4, name:"Error", code:"E"},
    ALL:{value:5, name:"Off", code:"O"}
};

angular.module('mloggerApp', ['log-viewer', 'projects', 'source.configuration'])

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
//        $locationProvider.html5Mode(true);
        $routeProvider
//            .when('/', {
//                templateUrl:'',
//                controller:''
//            })
            .when('/', {
                templateUrl: 'static/js/mlogger-app/projects/projects.html',
                controller:'ProjectCtrl'
            })
            .otherwise({redirectTo: '/projects'});
    }])

//    .constant('APP_ROOT', 'static/js/mlogger-app/');

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
