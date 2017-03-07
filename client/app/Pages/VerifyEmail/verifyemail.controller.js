'use strict';

angular.module('baseApp')
  .controller('VerifyEmailCtrl', function ($scope, User, Auth, $stateParams, $http) {

    $scope.verified = null;

    $http.get('/api/users/verifyEmail/' + $stateParams.token)
      .then( function (res) {
        $scope.verified = true;
      }, function(){
        $scope.verified = false;
      })
  });
