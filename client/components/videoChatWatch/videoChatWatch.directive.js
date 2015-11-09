'use strict';

angular.module('baseApp')
  .directive('videoChatWatch', function () {
    return {
      templateUrl: 'components/videoChatWatch/videoChatWatch.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });