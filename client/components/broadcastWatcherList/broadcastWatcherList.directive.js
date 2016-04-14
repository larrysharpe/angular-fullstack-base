'use strict';

angular.module('baseApp')
  .directive('broadcastWatcherList', function () {
    return {
      templateUrl: 'components/broadcastWatcherList/broadcastWatcherList.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, socket) {
        var guestMap = {};
        guestMap[$scope.user.slug] = 1;   //add user to the guest map
        $scope.chatGroups = {};
        $scope.groupCounts = {};

        var handleGetBroadcastChatGroups = function (data) {
          $scope.chatGroups = data;

          updateGroupCounts();
        }

        var updateGroupCounts = function (){
          for(var obj in $scope.chatGroups){
            $scope.groupCounts[obj] = Object.keys($scope.chatGroups[obj]).length;
          }

          console.log($scope.groupCounts);

        }


        var roomJoin = function (user) {
          if (typeof guestMap[user.slug] === 'undefined'){
            guestMap[user.slug] = 1;

            if(!user.loggedIn){
              if(!$scope.chatGroups.guests) $scope.chatGroups.guests = {};
              $scope.chatGroups.guests[user.slug] = user;
            } else {
              if(user.room) {
                if (!$scope.chatGroups[user.room]) $scope.chatGroups[user.room] = {};
                $scope.chatGroups[user.room][user.slug] = user;
              }
            }

            updateGroupCounts();
          }
        };

        var roomLeave = function (user){
          if(typeof guestMap[user.slug] !== 'undefined'){

            if(user.loggedIn) {
              delete $scope.chatGroups[$scope.room][user.slug];
            }
            else delete $scope.chatGroups.guests[user.slug];

            delete guestMap[user.slug];

            updateGroupCounts();
          }
        }

        socket.emit('getBroadcastChatGroups', {slug: $scope.user.slug, room: $scope.room}, handleGetBroadcastChatGroups)
        socket.emit('joinRoom', $scope.user.slug + '-public');
        socket.on('roomJoin', roomJoin);
        socket.on('roomLeave', roomLeave);
      }
    };
  });
