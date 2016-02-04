'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, $http, $stateParams, Auth, socket) {

    socket.on('status:change', function (data) {
      console.log('rcvd cam status',data);
      if(data.status.show) $scope.user.status.show = data.status.show;
      if(data.status.online) $scope.user.status.online = data.status.online;
      $scope.camState = $scope.user.status.show;
    });

    $scope.user = Auth.getCurrentUser();
    $scope.broadcaster = Auth.getCurrentUser();
    $scope.camState = 'offline';
    socket.emit('init', {room: $scope.user.slug + '_public', user: $scope.user.slug});

    $scope.doConnect = function (show) {
      $scope.camState = 'going-online';


      var connector = {method: 'connect', connectUrl: cwlGlobal.streamServer};

      callToActionscript('connect');
    };

    $scope.undoConnect = function () {
      $scope.camState = 'going-offline';
      callToActionscript('disconnect');
    };

    $scope.isBroadcaster = function () {
      return true;
    };

    $scope.isCamConnecting = function () {
      return $scope.camState === 'going-online';
    };

    $scope.isCamDenied = function () {
      return $scope.camState === 'camDenied';
    }

    $scope.isStatus = function (status) {
      return $scope.camState === status;
    }

    $scope.isCamOffline = function () {
      console.log($scope.broadcaster);
      return ($scope.camState === 'offline' || $scope.camState === 'camDenied');
    }

    $scope.isCamOnline = function () {
      return $scope.camState === 'online';
    }

    $scope.camStatus = function (status){
      socket.emit('status:change', {
        slug: $scope.user.slug,
        status: status
      }, function(data){
        $scope.camState = data.user.status.show;
      });
    }

  });
