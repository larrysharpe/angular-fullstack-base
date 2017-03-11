'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('EditUser', {
        url: '/admin/edit/:id',
        templateUrl: 'app/Pages/Admin/EditUser/edituser.html',
        controller: 'EditUserCtrl'
      });
  });
