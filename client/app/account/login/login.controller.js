'use strict';

angular.module('baseApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $http, $stateParams) {
    $scope.user = {};
    $scope.errors = {};

    if($stateParams.etoken){
      $scope.token = $stateParams.etoken;
    }

    if($stateParams.vtoken){
      $http.post('/api/users/verify/', {token: $stateParams.vtoken})
        .success(function(data){
          if (data === 'OK'){
            $scope.emailConfirmed = true;
            $scope.emailConfirmedSuccess = true;
            if(Auth.isLoggedIn()){
              redirectHome(Auth.getCurrentUser().roles);
            }
          } else {
            $scope.emailConfirmedFail = true;
          }
        })
        .error(function(data){
          $scope.emailConfirmedFail = true;
        })
    }

    var redirectHome = function (roles){
      var home = '/';

      if(roles.indexOf('admin') > -1) home = '/admin';
      $location.path(home);
    }

    $scope.changePasswordByReset = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.post('/api/users/passwordReset', {token: $scope.token, password: $scope.user.newPassword}  )
        .success(function(data){
          if(data === 'OK') $location.path('/login');
        });
      }
    };
    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function(data) {
            var home = '/';

            if(data.roles.indexOf('admin') > -1) home = '/admin';

          // Logged in, redirect to home
          $location.path(home);
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
    $scope.accountHelp = function (form){
      if(form.$valid){
        $http.post('/api/users/accountHelp', {email: $scope.user.email})
          .success(function (res) {
            $scope.resetError = res.resetError || '';
            $scope.resetToken = res.resetToken || '';
            $scope.resetUrl = res.full || '';
          });
      }
    };
  });
