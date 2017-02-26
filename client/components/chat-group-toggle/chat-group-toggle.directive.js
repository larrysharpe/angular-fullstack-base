'use strict';

angular.module('baseApp')
  .directive('chatGroupToggle', function () {
    return {
      templateUrl: 'components/chat-group-toggle/chat-group-toggle.html',
      restrict: 'EA',
      scope: {
        isEnabled: '='
      }
    }
  });
