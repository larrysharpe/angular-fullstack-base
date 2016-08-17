'use strict';

angular.module('baseApp')
  .directive('roomUserList', function () {
    return {
      templateUrl: 'components/roomUserList/roomUserList.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, socket, $rootScope, $stateParams){
        console.log('<>><><><>');
        socket.emit('roomInit', {}, function (data) {
          console.log('<><><><>',data);
        });

        /*
          var guestMap = {};
          $scope.guestList = [];

          guestMap[$stateParams.slug] = 1;  //add broadcaster to the guest map
          guestMap[$scope.user.slug] = 2;   //add user to the guest map

          var initRoom = function (room){
            for(var i = 0; i < room.length; i++) roomJoin(room[i]);
          };

          var roomJoin = function (user) {
            if (typeof guestMap[user.slug] === 'undefined'){
              guestMap[user.slug] = $scope.guestList.length; //used to help with easy deletion
              $scope.guestList.push(user);
            }
          };

          var roomLeave = function (user){
            if(typeof guestMap[user.slug] !== 'undefined'){
              $scope.guestList.splice(guestMap[user.slug], 1);
              delete guestMap[user.slug];
            }
          }

          $scope.openPm = function (to) {
            $rootScope.$broadcast('togglepm', to);
          }

          socket.emit('roomInit', {room: $scope.room}, initRoom);
          socket.on('roomJoin', roomJoin);
          socket.on('roomLeave', roomLeave);
          */
      }
    };
  });
