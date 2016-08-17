'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/'
        , templateUrl: 'app/main/main.html'
        , page: 'home'
      });
  });
