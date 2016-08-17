'use strict';

angular.module('baseApp')
  .controller('ApiRunnerShowsCtrl', function ($scope, $state, $http) {
    var apiUrl = '/api/shows';

    var handleGetSuccess = function (shows) {
      $scope.shows = shows;
    }

    $scope.shows = [];
    $scope.title = $state.params.title;

    $http
      .get(apiUrl)
      .success(handleGetSuccess)
    ;
  });
