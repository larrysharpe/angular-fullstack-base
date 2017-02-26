'use strict';

angular.module('baseApp')
  .directive('chatRoomData', function () {
    return {
      controller: function ($scope, Auth){
        console.log($scope.user.slug)
        var roomSlug = $scope.user.slug + '-public';
        $scope.roomsList = [roomSlug];
        $scope.rooms = {
          public: {
            slug: roomSlug,
            isActive: false,
            displayname: 'Public Chat',
            type: 'group',
            watchercount: 0,
            children: [],
            messages: []
          }
        };
        $scope.currentRoom = roomSlug;
      },
      restrict: 'A'
    };
  });
