'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('watch', {
        url: '/watch/:slug',
        templateUrl: 'app/watch/watch.html',
        controller: 'WatchCtrl'
      })
      .state('vip', {
        url: '/vip/:slug',
        templateUrl: 'app/watch/watchVip.html',
        controller: 'WatchCtrl'
      })
      .state('private', {
        url: '/private/:slug',
        templateUrl: 'app/watch/watchPrivate.html',
        controller: 'WatchPvtCtrl'
      })
      .state('group', {
        url: '/group/:slug',
        templateUrl: 'app/watch/watchGroup.html',
        controller: 'WatchCtrl'
      })
    ;
  });
