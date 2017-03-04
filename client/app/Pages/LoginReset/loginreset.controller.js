'use strict';

angular.module('baseApp')
  .controller('LoginResetCtrl', function ($scope, Auth, $location, $window) {
    var urlParams = $location.search();
    $scope.email = urlParams.email;
  });
