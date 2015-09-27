'use strict';

angular.module('baseApp')
  .directive('broadcasterListItem', function () {
    return {
      templateUrl: 'components/broadcasterListItem/broadcasterListItem.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });