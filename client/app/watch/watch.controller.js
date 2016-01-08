'use strict';

angular.module('baseApp')
  .controller('WatchCtrl', function ($scope, $http, $stateParams, $location, Auth, socket) {
    $scope.slug = $stateParams.slug;
    $scope.user = Auth.getCurrentUser();

    if(Auth.hasRole('broadcaster') && $scope.slug === $scope.user.slug){
      $location.path('/broadcast');
    }


    var url = '/api/users/broadcasters/'+$stateParams.slug;
    if($scope.user._id) url += '?addRecent=1&user=' + $scope.user._id;

    $http.get(url)
      .success(function(data){
        $scope.broadcaster = data;
      });


    $scope.isBroadcaster = function () {
      return false;
    };

    $scope.isStatus = function (status) {
      return !$scope.broadcaster || $scope.broadcaster.status.online === status;
    }

    $scope.isShowStatus = function (status) {
      return !$scope.broadcaster || $scope.broadcaster.status.show === status;
    }

    $scope.isOffline = function (){
      return !$scope.broadcaster || $scope.broadcaster.status.show === 'offline';
    }

    $scope.isOnline = function (){
      return $scope.broadcaster && $scope.broadcaster.status.show === 'public';
    }

    socket.on('cam:status', function (data) {
      console.log('rcvd cam status',data);
      if(data.status.show) $scope.broadcaster.status.show = data.status.show;
      if(data.status.online) $scope.broadcaster.status.online = data.status.online;
      $scope.camState = $scope.broadcaster.status.show;
    });


  });
