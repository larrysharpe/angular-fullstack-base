'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('watch', {
        url: '/watch/:slug',
        templateUrl: 'app/watch/watch.html',
        controller: 'WatchCtrl',
        room: 'public'
      })
      .state('watch.vip', {
        url: '/vip',
        templateUrl: 'app/watch/watchVip.html',
        controller: 'WatchCtrl',
        room: 'vip'
      })
      .state('watch.private', {
        url: '/private',
        templateUrl: 'app/watch/watchPrivate.html',
        controller: 'WatchPvtCtrl',
        room: 'private'
      })
      .state('watch.group', {
        url: '/group',
        templateUrl: 'app/watch/watchGroup.html',
        controller: 'WatchCtrl',
        room: 'group'
      })
    ;
  });
