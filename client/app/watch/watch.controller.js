'use strict';

angular.module('baseApp')
  .controller('WatchCtrl', function ($scope, $http, $stateParams, $location, Auth) {
    $scope.slug = $stateParams.slug;
    var user = Auth.getCurrentUser();

    if(Auth.hasRole('broadcaster') && $scope.slug === user.slug){
      $location.path('/broadcast');
    }

    $http.get('/api/users/broadcasters/'+$stateParams.slug)
      .success(function(data){
        $scope.broadcaster = data;
      });
  });
