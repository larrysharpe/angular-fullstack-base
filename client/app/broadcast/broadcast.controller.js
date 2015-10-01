'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, $http, $stateParams, Auth) {

    $scope.broadcaster = Auth.getCurrentUser();

  });
