'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('VerifyEmail', {
        url: '/verifyEmail/:token',
        templateUrl: 'app/Pages/VerifyEmail/verifyemail.html',
        controller: 'VerifyEmailCtrl'
      });
  });
