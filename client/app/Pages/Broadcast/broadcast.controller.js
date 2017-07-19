'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, User, Auth, $http) {
    $scope.errors = {};

    $scope.user = Auth.getCurrentUser();





  });
