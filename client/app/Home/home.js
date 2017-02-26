'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        controller: 'HomeCtrl',
        url: '/'
        , templateUrl: 'app/Home/home.html'
        , page: 'home'
      });
  });
