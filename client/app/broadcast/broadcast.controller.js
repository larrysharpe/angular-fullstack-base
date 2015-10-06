'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, $http, $stateParams, Auth, socket) {

    $scope.user = Auth.getCurrentUser();


    $scope.doConnect = function () {
      callToActionscript('doConnect');
    };
    $scope.undoConnect = function () {
      callToActionscript('unPublish');
    };

    $scope.camStatus = function (status){
      console.log('Cam StatusChange: ', status);
      socket.emit('cam:status', {
        slug: $scope.user.slug,
        status: status
      });
    }

  });
