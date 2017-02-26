'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Signup', {
        url: '/signup',
        templateUrl: 'app/Pages/Signup/signup.html',
        controller: 'SignupCtrl'
      });
  });
