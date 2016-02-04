'use strict';

angular.module('baseApp')
  .directive('videoChatBroadcast', function () {
    return {
      templateUrl: 'components/videoChatBroadcast/videoChatBroadcast.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, socket){

        var showRequestRcv = function (data) {

          console.log('showReqRcv:', data);

          for (var i = 0; i < data.length; i++){
            $scope.requests.push(data[i]);
          }
        };

        var clearRequests = function (){
          $scope.requests = [];
        }

        var acceptShowCB = function (data) {
          if (data.status == 'success'){
            clearRequests();
            $scope.undoConnect();
          }
        }

        $scope.acceptShow = function (index) {
          socket.emit('show:requestAccepted:send',$scope.requests[index], acceptShowCB);
        }

        $scope.denyShowStep1 = function (index) {

        }

        socket.on('show:request:rcv', showRequestRcv);
        $scope.requests = [];

      }
    };
  });
