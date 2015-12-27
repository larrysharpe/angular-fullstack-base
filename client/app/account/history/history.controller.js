'use strict';

angular.module('baseApp')
  .controller('HistoryCtrl', function ($scope, Auth) {
    Auth.refreshUser();
    $scope.user = Auth.getCurrentUser();

  });
