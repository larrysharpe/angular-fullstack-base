'use strict';

angular.module('baseApp')
  .controller('WatchCtrl', function ($scope, $http, $stateParams, $location, Auth, socket) {
    $scope.slug = $stateParams.slug;
    $scope.user = Auth.getCurrentUser();

    if(Auth.hasRole('broadcaster') && $scope.slug === $scope.user.slug){
      $location.path('/broadcast');
    }

    $http.get('/api/users/broadcasters/'+$stateParams.slug)
      .success(function(data){
        $scope.broadcaster = data;
      });


    $scope.isOffline = function (){
      return !$scope.broadcaster || $scope.broadcaster.status === 'offline';
    }

    $scope.isOnline = function (){
      return $scope.broadcaster && $scope.broadcaster.status === 'online';
    }

    socket.on('cam:status', function (data) {
      console.log('cam:status', data);
      if (data.slug === $scope.broadcaster.slug){
        $scope.broadcaster.status = data.status;
      }
    });


  });
