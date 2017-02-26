'use strict';

angular.module('baseApp')
  .directive('chatRoomList', function () {
    return {
      controller: function ($scope){


        $scope.rooms = {
          'whiskey-private': {
            displayname: 'Private',
            isActive: true,
            numChildren: 1,
            children: {
              sharpe: {
                displayname: 'I Am Sharpe',
                type: 'user',
                icon: 'fa-user'
              }
            }
          },
          'whiskey-public': {
            displayname: 'Public',
            isActive: false,
            numChildren: 3,
            children: {
              favorites: {
                displayname: 'Faves',
                type: 'group',
                icon: 'fa-heart',
                isActive: false,
                numChildren: 1,
                children: {
                  'JohnDoe': {
                    displayname: 'John Doe',
                    type: 'user'
                  }
                }
              },
              users: {
                displayname: 'Users',
                type: 'group',
                icon: 'fa-users',
                isActive: false,
                numChildren: 1,
                children: {
                  'JaneDoe': {
                    displayname: 'Jane Doe',
                    type: 'group'
                  }
                }
              },
              guests: {
                displayname: 'Guests',
                type: 'group',
                isActive: false,
                numChildren: 1,
                children: {
                  'guest-123123': {
                    displayname: 'Guest 123123',
                    type: 'guest'
                  }
                }
              }
            }
          },
          'whiskey-direct': {
            displayname: 'DMs',
            isActive: false,
            numChildren: 3,
            children: {
              'DJ': {
                displayname: 'DJ',
                type: 'user',
                icon: 'fa-user'
              },
              'JS': {
                displayname: 'JS',
                type: 'user',
                icon: 'fa-user'
              },
              'VJ': {
                displayname: 'VJ',
                type: 'user',
                icon: 'fa-user'
              }
            }
          }
        };


        $scope.collapse = function (r){
          r.isActive = false;
        };
        $scope.expand = function (r){
          r.isActive = true;
        };
        $scope.selectRoom = function (room){

          if($scope.currentRoom) $scope.currentRoom.isActive = false;

          $scope.currentRoom = $scope.rooms[room];
          $scope.currentRoom.isActive = true;
          //$scope.newMsg.room = $scope.currentRoom;
        }
      },
      restrict: 'EA',
      replace: true,
      scope: {
        rooms: '='
      },
      templateUrl: 'components/chatRoomList/chatRoomList.html'
    };
  });
