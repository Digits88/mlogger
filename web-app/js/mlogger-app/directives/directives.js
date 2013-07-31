var directives = angular.module('mlogger-directives', ['ui']);

directives.directive('mloggerProductList', ['$compile', function ($compile) {
    return {
        restrict:'EA',
        replace:true,
        terminal:true,
        controller:TreeNodeCtrl,
        scope:{
            node:'=',
            depth:'='
        },
        link:function (scope, element, attrs) {
            element.append(
                    '<span class="label" ng-class="node | selectedCssClasses:depth" ng-click="select(node)" rsqe-title="node.label">{{node.label}}</span>' +
                    '<ul ng-show="node.expanded">' +
                    '<li ng-class="child | validCssClasses:depth+1" ng-repeat="child in node.children" ng-init="child.expanded = true" rsqe-nav-id="child.id">' +
                    '<div ng-class="child | visibleCssClasses">' +
                    '<i ng-class="child | treeNodeValidClasses" rsqe-nav-id="child.id" rel="{{child.label}}"></i>' +
                    '<a ng-click="toggleExpanded(child)" ng-show="hasChildren(child)" class="expand-icon">' +
                    '<i ng-class="child | expandedCssClasses"></i>' +
                    '</a>' +
                    '<div ng-class="child | isExpandableCssClasses">' +
                    '<div rsqe-tree-list node="child" depth="depth + 1"></div>' +
                    '</div>' +
                    '</div>' +
                    '</li>' +
                    '</ul>');

            var childScope = scope.$new();

            element.bind('destroyed', function () {
                console.log('destroying node');
            });

            $compile(element.contents())(childScope);
        }
    };
}]);