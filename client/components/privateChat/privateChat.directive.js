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

        var convoCount = function () {
          return Object.keys($scope.convos).length;
        };
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

          $scope.pmopen = true;
        };
        var postMessageSent = function (msg){
          $scope.convos[msg.to].messages.push(msg);
        };
        var selectFirstConvo = function () {
          for(var convo in $scope.convos){
            $scope.selectUser(convo);
            break;
          }
        };
        var singleConvoCheck = function () {
          if(!$scope.hasMultipleConvos()) selectFirstConvo();
        };

        $scope.convos;
        $scope.pmopen = false;
        $scope.closeConvo = function (input) {
          delete $scope.convos[input];
          singleConvoCheck()
        };
        $scope.hasMultipleConvos = function (){
          return convoCount() > 1;
        };
        $scope.selectUser = function (input){
          $scope.selectedConvo = input;
          if($scope.convos && $scope.convos[input].unread)$scope.convos[input].unread = 0;
        };
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
        $scope.togglePm = function (){
          console.log('toggle pm called');
          var to = $scope.broadcaster.slug + '_direct';

          if(!$scope.convos) {
            $scope.selectUser(to);
            $scope.convos = {};
          }

          if (!$scope.convos[to]) {
            $scope.convos[to] = {
              username: $scope.broadcaster.username,
              messages: [],
              active: true
            }
          }

          $scope.pmopen = !$scope.pmopen;
        };

        $scope.$on('togglepm', $scope.togglePm);
        socket.on('privatemessage:rcv', postMessage);
      }
    };
  });
