'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, User, Auth, $http) {
    $scope.errors = {};
    $scope.vid = null;
    $scope.user = Auth.getCurrentUser();

    $scope.status = 'Offline';

    $scope.setStatus = function (status){
      console.log('setStatusCalled', status);
      $scope.status = status;
    }

    $scope.onLoadHandler = function (evt){
      $scope.vid = evt.ref;
    }

    $scope.goPublic = function () {$scope.vid.callGoPublic();}
    $scope.goAway = function () {$scope.vid.callGoAway();}
    $scope.goOffline = function () {$scope.vid.callGoOffline();}
    $scope.goPrivate = function () {$scope.vid.callGoPrivate();}
    $scope.goVIP = function () {$scope.vid.callGoVIP();}
    $scope.goPassword = function () {$scope.vid.callGoPassword();}

  });
