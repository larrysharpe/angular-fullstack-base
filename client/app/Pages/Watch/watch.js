'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Watch', {
        url: '/watch',
        templateUrl: 'app/Pages/Watch/watch.html',
        controller: 'WatchCtrl',
        authenticate: true
      });
  });
