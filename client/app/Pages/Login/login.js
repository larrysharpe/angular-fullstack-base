'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Login', {
        url: '/login',
        templateUrl: 'app/Pages/Login/login.html',
        controller: 'LoginCtrl'
      });
  });
