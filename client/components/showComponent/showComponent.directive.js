'use strict';

angular.module('baseApp')
  .directive('showComponent', function () {
    return {
      templateUrl: 'components/showComponent/showComponent.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });