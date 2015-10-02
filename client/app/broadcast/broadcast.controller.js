'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, $http, $stateParams, Auth) {

    $scope.broadcaster = Auth.getCurrentUser();

    $scope.doConnect = function () {
      callToActionscript('doConnect');
    };
    $scope.undoConnect = function () {
      callToActionscript('unPublish');
    };

  });
