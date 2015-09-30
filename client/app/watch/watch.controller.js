'use strict';

angular.module('baseApp')
  .controller('WatchCtrl', function ($scope, $http, $stateParams) {
    $scope.slug = $stateParams.slug;
    $http.get('/api/users/broadcasters/'+$stateParams.slug)
      .success(function(data){
        $scope.broadcaster = data;
      });
  });
