'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      })
      .state('admin.admins', {
        url: '/admins',
        templateUrl: 'app/admin/adminBroadcasters.html',
        controller: 'AdminAdminsCtrl',
        params: {
          title: 'Admins'
        }
      })
      .state('admin.broadcasters', {
        url: '/broadcasters',
        templateUrl: 'app/admin/adminBroadcasters.html',
        controller: 'AdminBroadcastersCtrl',
        params: {
          title: 'Broadcasters'
        }
      })
      .state('admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/admin/adminBroadcasters.html',
        controller: 'AdminDashboardCtrl',
        params: {
          title: 'Dashboard'
        }
      })
      .state('admin.users', {
        url: '/users',
        templateUrl: 'app/admin/adminBroadcasters.html',
        controller: 'AdminUsersCtrl',
        params: {
          title: 'Users'
        }
      })

      .state('adminuserprofile', {
        url: '/admin/user/:slug',
        templateUrl: 'app/admin/users/user.html',
        controller: 'AdminUserCtrl'
      })
      .state('adminstats', {
        url: '/admin/stats',
        templateUrl: 'app/admin/stats.html',
        controller: 'AdminStatsCtrl'
      })
      .state('adminBatchUsers', {
        url: '/admin/user/createBatch',
        templateUrl: 'app/admin/users/createBatch.html',
        controller: 'AdminUserCtrl'
      })
    ;
  });
