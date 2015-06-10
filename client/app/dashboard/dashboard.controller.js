'use strict';

angular.module('baseApp')
  .controller('DashboardCtrl', function ($scope, Auth) {
    $scope.user = Auth.getCurrentUser();
    $scope.hasRole = Auth.hasRole;
  });
