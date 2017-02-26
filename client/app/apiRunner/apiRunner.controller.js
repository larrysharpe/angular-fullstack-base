'use strict';

angular.module('baseApp')
  .controller('ApiRunnerCtrl', function ($scope) {
    $scope.nav = [
      'users', 'messages', 'shows'
    ];
  });
