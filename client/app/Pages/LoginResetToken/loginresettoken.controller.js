'use strict';

angular.module('baseApp')
  .controller('LoginResetTokenCtrl', function ($scope, $stateParams, $http, $location,$cookieStore) {
    var isTokenValid = null;
    var resetToken = $stateParams.token;
    var userId = null;

    $scope.user = {
      newPassword: null
    };

    $http.get('/api/users/resetToken/' + resetToken)
      .then(function(res){
        if(res.data.token){
          isTokenValid = res.data.token === $stateParams.token;
          if (isTokenValid) {
            userId = res.data.id;
          }
        }
      },function(data){
        isTokenValid = false;
      }
    );

    $scope.showForm = function (){
      return isTokenValid;
    };

    $scope.changePassword = function (){
      var pwdObj = {
        password: $scope.user.newPassword
      };
      $http.put('/api/users/' + userId + '/passwordreset/' + $stateParams.token, pwdObj)
        .then(function(res){
          console.log('save password succeeded', res);
          $scope.user.newPassword = null;
          $cookieStore.put('flash-msg', 'Your password has been updated. You can now login.');
          $location.path('/login');

        },function(data){
          console.log('save password failed', res);
        })
    }

  });
