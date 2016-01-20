'use strict';

angular.module('baseApp')
  .directive('roomChat', function () {
    return {
      templateUrl: 'components/roomChat/roomChat.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.$watchCollection('messages', function(newValues, oldValues) {
          if(newValues != oldValues) {
            var lst = element.find('.chat-box')[0];
            lst.scrollTop = lst.scrollHeight;
            if(scope[newValues[newValues.length-1].subType]) scope[newValues[newValues.length-1].subType].play();
            console.log(newValues);
          }
        });
      },
      controller: function ($scope, $http, socket, $stateParams, ngAudio) {

        $scope.singleRing = ngAudio.load('/assets/sounds/single-ring.wav');
        $scope.multiRing = ngAudio.load('/assets/sounds/multi-ring.wav');

        $scope.messages = [];

        var room = $stateParams.slug + '_public';
        $http.get('/api/messages/room/' + room)
          .error(function(err){})
          .success(function(data){
            $scope.messages = data;
          })

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


        var postMessage = function (msg){
          $scope.messages.push(msg);
        };

        socket.on('message:rcv', postMessage);

        $scope.sendMessage = function () {

          var msg = {
            from: $scope.user.username,
            to: $scope.broadcaster.slug + '_public',
            content: $scope.message
          };

          socket.emit('message:send', msg, postMessage );
          $scope.message = '';// clear message box
        };

      }
    };
  });
