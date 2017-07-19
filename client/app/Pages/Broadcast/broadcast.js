'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Broadcast', {
        url: '/broadcast',
        templateUrl: 'app/Pages/Broadcast/broadcast.html',
        controller: 'BroadcastCtrl',
        authenticate: true
      });
  });
