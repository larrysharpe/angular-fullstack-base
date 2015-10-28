'use strict';

angular.module('baseApp')
  .controller('HistoryCtrl', function ($scope, Auth) {
    $scope.user = Auth.getCurrentUser();
  });
