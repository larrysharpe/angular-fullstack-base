'use strict';

angular.module('baseApp')
  .controller('LoginHelpCtrl', function ($scope, $http, $location) {
    $scope.user = {
      email: null
    };

    $scope.accountHelp = function (form){
      if(form.$valid){
        $http.post('/api/users/accountHelp', {email: $scope.user.email})
          .success(function (res) {
            if (res.resetToken){
              $location.path('/loginreset').search({email: $scope.user.email});
            }
          });
      }
    };
  });
