'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, $http, $state, $stateParams, Auth, socket, $rootScope, socketInit) {


    $scope.user = Auth.getCurrentUser();
    $scope.broadcaster = $scope.user;
    $scope.statusReadable = '';
    $scope.room = $scope.user.slug + '-public';
    var url = '/api/users/broadcasters/' + $scope.user.slug;

    $scope.todaysIncome = 0;
    $scope.userCount  = 0;
    $scope.guestCount = 0;

    var readableStatuses = {
      away: 'You Are Away',
      offline: 'Chat Is On Cam Is Off',
      password: 'In A Password Show',
      public: 'In Public',
      private: 'In A Private Show'
    };



    $scope.getReadableStatus = function (){
      if ($scope.user){
        if($scope.broadcaster.status.online === false || $scope.broadcaster.status.availability == 'offline'){
          return 'You are offline.';
        } else if ($scope.broadcaster.status.show && readableStatuses[$scope.broadcaster.status.show]) {
          return readableStatuses[$scope.broadcaster.status.show];
        } else {
          return $scope.broadcaster.status.show;
        }
      }
    }

    socket.on('status:change', function (data) {
      console.log('rcvd cam status',data);
      if(data.status.show) $scope.user.status.show = data.status.show;
      if(data.status.online) $scope.user.status.online = data.status.online;
      $scope.camState = $scope.user.status.show;
    });

    socketInit.run(function(data){console.log(data)}, $scope.user);

    $scope.camState = 'offline';

    $scope.doConnect = function (instanceType) {
      $scope.camState = 'going-online';
      var obj = {method: 'connect',
        instanceType: instanceType
      };
      callToActionscript(obj);
    };

    $scope.checkScope = function (){
      console.log($scope);
    }

    $scope.undoConnect = function () {
      $scope.camState = 'going-offline';
      var obj = {method: 'disconnect'};
      callToActionscript(obj);
    };

    $scope.changePublish = function (user){
      var obj = {broadcaster: user.slug,
        instanceType: user.status.show,
        method: 'changePublish'
      }
      callToActionscript(obj);
    }

    $scope.isBroadcaster = function () {
      return true;
    };

    $scope.isCamConnecting = function () {
      return $scope.camState === 'going-online';
    };

    $scope.isCamDenied = function () {
      return $scope.camState === 'camDenied';
    }

    $scope.isStatus = function (status) {
      if($scope.broadcaster) {
        if (typeof status === 'string')  return $scope.broadcaster.status.show === status;
        else if (status.indexOf($scope.broadcaster.status.show) > -1) return true;
        else return false;
      } else return false;
    }

    $scope.isPassword = function (){
      return $scope.broadcaster.status.show === 'password';
    }

    $scope.isCamOffline = function () {
      console.log($scope.broadcaster);
      return ($scope.camState === 'offline' || $scope.camState === 'camDenied');
    }

    $scope.isCamOnline = function () {
      return $scope.camState === 'online';
    }

    $scope.camStatus = function (status){

      var statusObj = $scope.user.status;
      if(status.show) statusObj.show = status.show;
      if(status.availability) statusObj.availability = status.availability;
      if(status.online) statusObj.online = status.online;

      socket.emit('status:change', {
        slug: $scope.user.slug,
        status: statusObj
      }, function(data){
        $scope.camState = data.user.status.show;
        $scope.user.status = data.user.status;
      });
    }
  });
