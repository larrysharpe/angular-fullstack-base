'use strict';

angular.module('baseApp')
  .directive('privateChat', function () {
    return {
      templateUrl: 'components/privateChat/privateChat.html',
      restrict: 'EA',
      scope: {
        user: '=',
        broadcaster: '=',
        selectedConvo: '=',
        convos: '=',
        pmopen: '='
      },
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, $http, socket, $stateParams){

        $scope.pmopen = false;
        $scope.togglePm = function (){
          console.log('toggle pm called');
          var to = $scope.broadcaster.slug + '_direct';

          if(!$scope.convos) {
            $scope.selectedConvo = to;
            $scope.convos = {};
          }

          $scope.convos[to] = {
            username: $scope.broadcaster.username,
            messages: [],
            active: true
          }

          $scope.pmopen = !$scope.pmopen;
        }

        $scope.$on('togglepm', $scope.togglePm)

        $scope.selectUser = function (input){
          $scope.selectedConvo = input;
          $scope.convos[input].unread = 0;
        }
        $scope.convos;

        var postMessage = function (msg){
          if(!$scope.convos) $scope.convos = {};
          if(!$scope.convos[msg.from]){
            $scope.convos[msg.from] = {
              username: msg.fromUsername,
              messages: [],
              active: true
            };
          }
          $scope.convos[msg.from].messages.push(msg);
          if (!$scope.selectedConvo) $scope.selectUser(msg.from);
          if ($scope.selectedConvo != msg.from) {
            if(!$scope.convos[msg.from].unread) $scope.convos[msg.from].unread = 1;
            else $scope.convos[msg.from].unread++;
          }
        };

        var postMessageSent = function (msg){
          $scope.convos[msg.to].messages.push(msg);
        };

        socket.on('privatemessage:rcv', postMessage);

        $scope.sendMessage = function () {

          var msg = {
            from: $scope.user.slug + '_direct',
            fromUsername: $scope.user.username,
            to: $scope.selectedConvo,
            toUsername: $scope.convos[$scope.selectedConvo].username,
            content: $scope.message,
            type: 'privateMessage'
          };

          socket.emit('privatemessage:send', msg, postMessageSent );
          $scope.message = '';// clear message box
        };
      }
    };
  });
