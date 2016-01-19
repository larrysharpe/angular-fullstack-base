'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      })
      .state('adminuserprofile', {
        url: '/admin/user/:slug',
        templateUrl: 'app/admin/users/user.html',
        controller: 'AdminUserCtrl'
      })

      .state('adminBatchUsers', {
        url: '/admin/user/createBatch',
        templateUrl: 'app/admin/users/createBatch.html',
        controller: 'AdminUserCtrl'
      })
    ;
  });
