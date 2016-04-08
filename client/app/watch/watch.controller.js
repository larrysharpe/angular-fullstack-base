'use strict';

angular.module('baseApp')
  .controller('WatchCtrl', function ($scope, $http, $stateParams, $location, Auth, socket, socketInit) {
    $scope.slug = $stateParams.slug;
    $scope.user = Auth.getCurrentUser();
    $scope.room = $stateParams.slug + '-public';

    if(Auth.hasRole('broadcaster') && $scope.slug === $scope.user.slug){
      $location.path('/broadcast');
    }

    socketInit.run(function(data){console.log(data)}, $scope.user);


    var url = '/api/users/broadcasters/'+$stateParams.slug;
    if($scope.user._id) url += '?addRecent=1&user=' + $scope.user._id;

    $http.get(url)
      .success(function(data){
        $scope.broadcaster = data;
      });


    $scope.isBroadcaster = function () {
      return false;
    };

    var screenStatuses = ['public', 'jukebox', 'group', 'private', 'meter', 'courtesy', 'vip'];

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
      return !$scope.broadcaster || $scope.broadcaster.status.online === false || $scope.broadcaster.status.availability === 'offline';
    }

    $scope.isOnCall = function (){
      return $scope.broadcaster && $scope.broadcaster.status.show === 'offline' && $scope.broadcaster.status.availability === 'on call';
    }

    $scope.isAway = function (){
      return $scope.broadcaster && $scope.broadcaster.status.online === true && $scope.broadcaster.status.show === 'offline' && $scope.broadcaster.status.availability === 'away';
    }

    $scope.isBusy = function (){
      return $scope.broadcaster && $scope.broadcaster.status.show === 'offline' && $scope.broadcaster.status.availability === 'busy';
    }

    $scope.isOnline = function (){
      return $scope.broadcaster && $scope.broadcaster.status.online === true && $scope.broadcaster.status.availability === 'online' && $scope.broadcaster.status.show === 'offline';
    }

    var joinShow = function (){
      var joinObj = {
        show: $scope.show._id,
        user: {
          slug: $scope.user.slug,
          username: $scope.user.username
        }
      }
      socket.emit('showJoin', joinObj);
    }

    socket.on('showStart', function (show) {
      $scope.show = show;
    })


    socket.on('status:change', function (data) {
      if(data.slug === $scope.broadcaster.slug) {
        //console.log('rcvd cam status', data.status);
        if (data.status.show) $scope.broadcaster.status.show = data.status.show;
        if (data.status.online === true || data.status.online === false) $scope.broadcaster.status.online = data.status.online;
        if (data.status.availability) $scope.broadcaster.status.availability = data.status.availability;
        $scope.camState = $scope.broadcaster.status.show;

        if(data.status.show === 'public'){
           joinShow()
        }
      }
    });


  });
