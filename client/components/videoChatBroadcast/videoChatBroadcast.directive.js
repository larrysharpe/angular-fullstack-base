'use strict';

angular.module('baseApp')
  .directive('videoChatBroadcast', function () {
    return {
      templateUrl: 'components/videoChatBroadcast/videoChatBroadcast.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });