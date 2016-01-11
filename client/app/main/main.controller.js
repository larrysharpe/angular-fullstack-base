'use strict';

angular.module('baseApp')

  .controller('MainCtrl', function ($scope, Auth) {
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn= Auth.isLoggedIn();
  });
