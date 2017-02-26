'use strict';

angular.module('baseApp')
  .directive('chatRoomModule', function () {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        currentRoom: '=',
        rooms: '=',
        roomsList: '='
      },
      controller: function ($scope){
      },
      templateUrl: 'components/chatRoomModule/chatRoomModule.html'
    };
  });
