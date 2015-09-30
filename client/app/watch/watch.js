'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('watch', {
        url: '/watch/:slug',
        templateUrl: 'app/watch/watch.html',
        controller: 'WatchCtrl'
      });
  });