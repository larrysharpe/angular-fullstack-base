'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('watch', {
        url: '/watch/:slug',
        templateUrl: 'app/watch/watch.html',
        controller: 'WatchCtrl',
        page: 'watch',
        show: 'public'
      })
      .state('watch.vip', {
        url: '/vip',
        templateUrl: 'app/watch/watchVip.html',
        controller: 'WatchCtrl',
        page: 'watch',
        show: 'vip'
      })
      .state('watch.private', {
        url: '/private',
        templateUrl: 'app/watch/watchPrivate.html',
        controller: 'WatchPvtCtrl',
        page: 'watch',
        show: 'private'
      })
      .state('watch.group', {
        url: '/group',
        templateUrl: 'app/watch/watchGroup.html',
        controller: 'WatchCtrl',
        page: 'watch',
        show: 'group'
      })
    ;
  });
