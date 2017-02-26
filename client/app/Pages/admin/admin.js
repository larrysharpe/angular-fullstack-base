'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/Pages/Admin/admin.html',
        controller: 'AdminCtrl'
      });
  });
