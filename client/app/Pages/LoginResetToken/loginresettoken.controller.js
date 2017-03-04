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
        var flashObj = {text: 'Your token is invalid.', class: 'danger'};
        isTokenValid = false;
        $cookieStore.put('flash-msg', flashObj);
        $location.path('/loginhelp');
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
          var flashObj = {text: 'Your password has been updated. You can now login.', class: 'success'};

          $cookieStore.put('flash-msg', flashObj);
          $scope.user.newPassword = null;
          $location.path('/login');
        },function(data){
          console.log('save password failed', res);
        })
    }

  });
