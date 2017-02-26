'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Home', {
        url: '/',
        templateUrl: 'app/Pages/home/home.html',
        controller: 'HomeCtrl'
      });
  });
