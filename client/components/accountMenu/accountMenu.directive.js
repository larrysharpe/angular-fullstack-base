'use strict';

angular.module('baseApp')
  .directive('accountMenu', function () {
    return {
      templateUrl: 'components/accountMenu/accountMenu.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });