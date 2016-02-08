'use strict';

angular.module('baseApp')
  .controller('WatchPvtCtrl', function ($scope, $http, $stateParams, $location, Auth, socket, $rootScope) {
    $scope.slug = $stateParams.slug;
    $scope.user = Auth.getCurrentUser();


    console.log('watch pvt');

    if(Auth.hasRole('broadcaster') && $scope.slug === $scope.user.slug){
      $location.path('/broadcast');
    }

    var userObj = {
      slug: $scope.user.slug,
      username: $scope.user.username
    };

    socket.emit('init', {room: $stateParams.slug + '_public', user: userObj});

    var url = '/api/users/broadcasters/'+$stateParams.slug;
    if($scope.user._id) url += '?addRecent=1&user=' + $scope.user._id;

    $http.get(url)
      .success(function(data){
        console.log('new broadcaster data: ' , data);
        $scope.broadcaster = data;
      });

    $scope.$on('timer-tick', function (event, data){
      console.log('Timer tick - data = ', data);
      $scope.user.credits.units -= 1;
    });

    $scope.startTimer = function (){
      $scope.$broadcast('timer-start');
      $scope.timerRunning = true;
    }


    $scope.stopTimer = function (){
      console.log('--- stop timer ---');
      $scope.$broadcast('timer-stop');
      $scope.timerRunning = false;
    }




    $scope.isBroadcaster = function () {
      return false;
    };

    var screenStatuses = ['public', 'jukebox', 'group', 'private', 'meter', 'courtesy', 'password', 'vip'];

    $scope.showVid  = function () {

      if($scope.broadcaster  && $scope.broadcaster.status.online === true){
        if(screenStatuses.indexOf($scope.broadcaster.status.show) > -1){
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }

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


    socket.on('status:change', function (data) {
      console.log('rcvd cam status',data);
      if(data.status.show) $scope.broadcaster.status.show = data.status.show;
      if(data.status.online) $scope.broadcaster.status.online = data.status.online;
      $scope.camState = $scope.broadcaster.status.show;
    });


  });
