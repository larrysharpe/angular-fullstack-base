'use strict';

angular.module('baseApp')
  .directive('videoChatWatch', function () {
    return {
      templateUrl: 'components/videoChatWatch/videoChatWatch.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  })
  .directive('videoChatPvt', function () {
    return {
      templateUrl: 'components/videoChatWatch/videoChatPvt.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  })
  .directive('videoChatGroup', function () {
    return {
      templateUrl: 'components/videoChatWatch/videoChatGroup.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  })
;
