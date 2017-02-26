'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Settings', {
        url: '/settings',
        templateUrl: 'app/Pages/Settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });
