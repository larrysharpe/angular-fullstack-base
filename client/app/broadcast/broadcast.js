'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('broadcast', {
        url: '/broadcast',
        templateUrl: 'app/broadcast/broadcast.html',
        controller: 'BroadcastCtrl',
        show: 'public',
        page: 'broadcast',
        authenticate: true
      });
  });
