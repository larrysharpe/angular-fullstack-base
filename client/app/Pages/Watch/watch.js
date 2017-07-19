'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Watch', {
        url: '/watch/:username',
        templateUrl: 'app/Pages/Watch/watch.html',
        controller: 'WatchCtrl'
      });
  });
