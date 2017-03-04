'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('LoginHelp', {
        url: '/loginhelp',
        templateUrl: 'app/Pages/LoginHelp/loginhelp.html',
        controller: 'LoginHelpCtrl'
      });
  });
