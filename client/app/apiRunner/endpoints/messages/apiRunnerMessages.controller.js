'use strict';

angular.module('baseApp')
  .controller('ApiRunnerMessagesCtrl', function ($scope, $state, $http) {
    var apiUrl = '/api/messages';

    var handleGetSuccess = function (messages) {
      $scope.messages = messages;
    }

    $scope.messages = [];
    $scope.params = $state.params;

    $http
      .get(apiUrl)
      .success(handleGetSuccess)
    ;
  });
