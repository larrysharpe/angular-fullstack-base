'use strict';

angular.module('baseApp')
  .directive('videoChat', function () {
    return {
      templateUrl: 'components/videoChat/videoChat.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });