'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function (chatRoomSvc, $scope, $http, $state, $stateParams, Auth, socket, $rootScope, socketInit) {


    $scope.showNavBarMessage = function (){
      return (!$scope.user.emailConfirmed);
    };

    socket.on('status:change', function (data) {
      console.log('rcvd cam status',data);
      if(data.status.show) $scope.user.status.show = data.status.show;
      if(data.status.online) $scope.user.status.online = data.status.online;
      $scope.camState = $scope.user.status.show;
    });

    $scope.room = $scope.user.slug + '-public';


    var url = '/api/users/broadcasters/' + $scope.user.slug;

    $http.get(url)
      .success(function(data){
        $scope.broadcaster = data;
      });

    $scope.camState = 'offline';


    if($rootScope.removeUser){
      initObj.remove = $rootScope.removeUser;
      delete $rootScope.removeUser;
    }

    var initReturn = function (data){
      if(data.user) {
        $scope.broadcaster = data.user;
        $scope.user = data.user;
      } else {
        $scope.broadcaster = data.data;
      }
    };




    $scope.chatSvc =  chatRoomSvc;

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
