'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('LoginReset', {
        url: '/loginreset',
        templateUrl: 'app/Pages/LoginReset/loginreset.html',
        controller: 'LoginResetCtrl'
      });
  });
