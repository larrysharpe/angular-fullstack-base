'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('transactions', {
        url: '/admin/transactions',
        templateUrl: 'app/admin/transactions/transactions.html',
        controller: 'TransactionsCtrl'
      });
  });