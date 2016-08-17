'use strict';

angular.module('baseApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $http, $stateParams, Flash) {

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

            Auth.getCurrentUser().emailConfirmed = true;

            Flash.create('success', 'Your email has been confirmed');
            if(Auth.isLoggedIn()){
              redirectHome(Auth.getCurrentUser().roles);
            }
          } else {
            Flash.create('danger', 'Confirmation could not be saved. Please try again.');
            $scope.emailConfirmedFail = true;
          }
        })
        .error(function(data){
          Flash.create('danger', 'There was an error please try again');
          $scope.emailConfirmedFail = true;
        })
    }

    var redirectHome = function (roles){
      var home = '/';

      if(roles.indexOf('admin') > -1) home = '/admin';
      if(roles.indexOf('broadcaster') > -1) home = '/dashboard';
      if(roles.indexOf('broadcaster applicant') > -1) home = '/dashboard';
      $location.path(home);
    }

    $scope.changePasswordByReset = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.post('/api/users/passwordReset', {token: $scope.token, password: $scope.user.newPassword}  )
        .success(function(data){
          if(data === 'OK') {
            Flash.create('success', 'password changed');
            $location.path('/login');
          }
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
            $scope.user = data.user;
            redirectHome(data.user.roles)
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
