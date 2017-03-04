'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('LoginResetToken', {
        url: '/loginreset/:token',
        templateUrl: 'app/Pages/LoginResetToken/loginresettoken.html',
        controller: 'LoginResetTokenCtrl'
      });
  });
