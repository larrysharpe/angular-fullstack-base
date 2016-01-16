'use strict';

angular.module('baseApp')
  .directive('roomChat', function () {
    return {
      templateUrl: 'components/roomChat/roomChat.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, socket) {

        $scope.messages = [];

        // Socket listeners
        // ================

        socket.on('init', function (data) {
          $scope.name = data.name;
          $scope.users = data.users;
        });



        socket.on('user:join', function (data) {
          $scope.messages.push({
            to: 'chatroom',
            from: 'chatroom',
            content: data.name + ' has joined.'
          });
          $scope.users.push(data.name);
        });

        // add a message to the conversation when a user disconnects or leaves the room
        socket.on('user:left', function (data) {
          $scope.messages.push({
            to: 'chatroom',
            from: 'chatroom',
            content: data.name + ' has left.'
          });
          var i, user;
          for (i = 0; i < $scope.users.length; i++) {
            user = $scope.users[i];
            if (user === data.name) {
              $scope.users.splice(i, 1);
              break;
            }
          }
        });

        socket.on('send:message', function (message) {
          console.log('message rcvd');
          $scope.messages.push(message);
        });

        $scope.sendMessage = function () {
          socket.emit('send:message', {
            from: $scope.user.username,
            to: 'chatroom',
            content: $scope.message
          });

          // add the message to our model locally
          $scope.messages.push({
            from: $scope.user.username,
            to: 'chatroom',
            content: $scope.message
          });

          // clear message box
          $scope.message = '';
        };

      }
    };
  });
