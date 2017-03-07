'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ResendEmailVerification', {
        url: '/resendemailverification',
        controller: 'ResendEmailVerificationCtrl'
      });
  });
