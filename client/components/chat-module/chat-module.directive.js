'use strict';

angular.module('baseApp')
  .directive('chatModule', function () {
    return {
      templateUrl: 'components/chat-module/chat-module.html',
      restrict: 'EA',
      scope: {},
      link: function (scope, element, attrs) { },
      controller: function ($scope, socket){

        /* non $scope functions */
        var onMsg = function(msg){
          if (!$scope.rooms[msg.room.slug].messages) $scope.rooms[msg.room.slug].messages = [];
          $scope.rooms[msg.room.slug].messages.push(msg);
        };
        var resetMsg = function (){

          var thumbUrlBase = 'http://loremflickr.com/320/240/woman,sexy/all?radn='

          var obj = {
            username: 'User 1',
            slug: 'user-1',
            message: '',
            room: {
              displayname: $scope.currentRoom.displayname,
              slug: $scope.currentRoom.slug,
              type: $scope.currentRoom.type
            }
            //time: new Date(), <!-- set on server
            //thumb: ''  <-- set below
          }

          obj.thumb = thumbUrlBase + obj.slug;

          return obj;

        }

        /* $scope variables */
        $scope.roomsList = [
          'public','group','vip','groupone'
        ];
        $scope.rooms = {
          public: {
            slug: 'public',
            isActive: true,
            displayname: 'Public Room A',
            type: 'group',
            watchercount: 8,
            children: ['guest1'],
            messages: [
              {
                username: 'User 6',
                slug: 'user-6',
                message: 'Lorem ipsum dolor sit amet',
                time: '12:00am',
                thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-6'
              },
              {
                username: 'User 5',
                slug: 'user-5',
                message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec euismod dui, quis tristique urna. Suspendisse nunc augue, rhoncus placerat',
                time: '12:00am',
                thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-5'
              }
            ]
          },
          group: {
            slug: 'group',
            displayname: 'Group Room A',
            type: 'group',
            isActive: false,
            watchercount: 6,
            children: ['guest1'],
            messages: [
              {
                username: 'User 6',
                slug: 'user-6',
                message: 'Lorem ipsum dolor sit amet',
                time: '12:00am',
                thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-6'
              },
              {
                username: 'User 5',
                slug: 'user-5',
                message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec euismod dui, quis tristique urna. Suspendisse nunc augue, rhoncus placerat',
                time: '12:00am',
                thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-5'
              }
            ]
          },
          vip: {
            slug: 'vip',
            displayname: 'VIP Room',
            isActive: false,
            type: 'group',
            messages: [
              {
                username: 'User 7',
                slug: 'user-6',
                message: 'Lorem ipsum dolor sit amet',
                time: '12:00am',
                thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-6'
              },
              {
                username: 'User 8',
                slug: 'user-5',
                message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec euismod dui, quis tristique urna. Suspendisse nunc augue, rhoncus placerat',
                time: '12:00am',
                thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-5'
              }
            ]
          },
          groupone: {
            slug: 'groupone',
            displayname: 'Favorites',
            type: 'set',
            roomcount: 3,
            children: ['user-2']
          },
          user1: {
            slug: 'user1',
            displayname: 'User 1',
            type: 'user'
          },
          'user-2': {
            slug: 'user-2',
            displayname: 'User 2',
            type: 'user'
          },
          guest1: {
            slug: 'guest1',
            displayname: 'Guest 1',
            type: 'user',
            messages: [
              {
                username: 'User 6',
                slug: 'user-6',
                message: 'Lorem ipsum dolor sit amet',
                time: '12:00am',
                thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-6'
              },
              {
                username: 'User 5',
                slug: 'user-5',
                message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec euismod dui, quis tristique urna. Suspendisse nunc augue, rhoncus placerat',
                time: '12:00am',
                thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-5'
              }
            ]
          }
        };
        $scope.currentRoom = $scope.rooms.public;
        $scope.newMsg =resetMsg();

        /* $scope functions */
        $scope.closeRoomList = function (room){
          $scope.rooms[room].isOpen = false;
        };
        $scope.openRoomList = function (room){
          $scope.rooms[room].isOpen = true;
        };
        $scope.selectRoom = function (room){

          $scope.currentRoom.isActive = false;

          $scope.currentRoom = $scope.rooms[room];
          $scope.currentRoom.isActive = true;
          $scope.newMsg.room = $scope.currentRoom;
        }
        $scope.sendMsg = function(){
          if ($scope.newMsg.message) {
            console.log($scope.newMsg);

            onMsg($scope.newMsg);

            $scope.newMsg = resetMsg();
          }
        }

        var handleNewMesageRcvd = function (e, msg) {
          onMsg(msg);
        }

        $scope.$on('new chat msg', handleNewMesageRcvd);

      }

    };
  });
