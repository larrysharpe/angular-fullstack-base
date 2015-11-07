'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, $http, $stateParams, Auth, socket) {

    $scope.user = Auth.getCurrentUser();
    $scope.broadcaster = Auth.getCurrentUser();
    $scope.camState = 'offline';

    $scope.doConnect = function () {
      $scope.camState = 'going-online';
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
      return ($scope.camState === 'offline' || $scope.camState === 'camDenied');
    }

    $scope.isCamOnline = function () {
      return $scope.camState === 'online';
    }

    $scope.camStatus = function (status){
      $scope.camState = status;
      socket.emit('cam:status', {
        slug: $scope.user.slug,
        status: status
      });
    }

  });
