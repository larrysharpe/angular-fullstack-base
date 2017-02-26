'use strict';

angular.module('baseApp')
  .directive('videoPlayer', function () {
    return {
      templateUrl: 'components/videoPlayer/videoPlayer.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });