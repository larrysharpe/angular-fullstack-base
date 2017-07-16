'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('SignupBroadcaster', {
        url: '/signup-broadcaster',
        templateUrl: 'app/Pages/Signup-Broadcaster/signup-broadcaster.html',
        controller: 'SignupBroadcasterCtrl'
      });
  });
