'use strict';

angular.module('baseApp')
  .controller('TransactionsCtrl', function ($scope, $http) {
    $scope.message = 'Hello';

    $http.get('/api/transactions')
      .success(function(data){
        $scope.transactions = data;
      })

  });
