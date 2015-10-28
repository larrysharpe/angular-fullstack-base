'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('history', {
        url: '/account/history',
        templateUrl: 'app/account/history/history.html',
        controller: 'HistoryCtrl'
      });
  });
