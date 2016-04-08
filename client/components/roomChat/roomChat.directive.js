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
            //console.log(newValues);
          }
        });
      },
      controller: function ($scope, $http, socket, $stateParams, ngAudio) {

        $scope.tipLevel1 = ngAudio.load('/assets/sounds/tipLevel1.wav');
        $scope.tipLevel2 = ngAudio.load('/assets/sounds/tipLevel2.wav');
        $scope.tipLevel3 = ngAudio.load('/assets/sounds/tipLevel3.wav');
        $scope.tipLevel4 = ngAudio.load('/assets/sounds/tipLevel4.wav');

        $scope.messages = [];

        $http.get('/api/messages/room/' + $scope.room)
          .error(function(err){})
          .success(function(data){
            $scope.messages = data;
          })

        var postMessage = function (msg){
          if(msg.rain) {
            $scope.messages.push(msg.main);
            for(var i = 0; i < 10; i ++){
              $scope.messages.push(msg.tips);
            }
          } else {
            $scope.messages.push(msg);
          }
        };

        socket.on('message:rcv', postMessage);

        $scope.sendMessage = function () {

          var msg = {
            from: $scope.user.username,
            to: $scope.room,
            content: $scope.message
          };

          socket.emit('message:send', msg, postMessage );
          $scope.message = '';// clear message box
        };

      }
    };
  });
