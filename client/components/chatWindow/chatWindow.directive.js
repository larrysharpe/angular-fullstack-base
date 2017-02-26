'use strict';

angular.module('baseApp')
  .directive('chatWindow', function () {
    return {
      controller: function ($scope) {

        var onMsg = function(msg){
          if(!$scope.currentRoom.messages) $scope.currentRoom.messages = [];
          $scope.currentRoom.messages.push(msg);
        };
        var resetMsg = function (){

          var thumbUrlBase = 'http://loremflickr.com/320/240/woman,sexy/all?radn='

          var obj = {
            username: 'User 1',
            slug: 'user-1',
            message: ''
            //time: new Date(), <!-- set on server
            //thumb: ''  <-- set below
          }

          obj.thumb = thumbUrlBase + obj.slug;

          return obj;

        }

        $scope.sendMsg = function(){
          if ($scope.newMsg.message) {
            onMsg($scope.newMsg);
            $scope.newMsg = resetMsg();
          }
        }

        $scope.$watch('currentRoom', function(oldVar, newVar){
          if(oldVar != newVar) {
            $scope.newMsg = resetMsg();
          }
        });


      },
      restrict: 'EA',
      replace: true,
      scope: {
        currentRoom: '='
      },
      templateUrl: 'components/chatWindow/chatWindow.html'
    };
  });
