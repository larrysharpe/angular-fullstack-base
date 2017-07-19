'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, User, Auth, $http) {
    $scope.errors = {};
    $scope.vid = null;
    $scope.user = Auth.getCurrentUser();

    $scope.status = 'Offline';
    $scope.showGoPublic = true;
    $scope.showGoAway = false;
    $scope.showGoOffline = false;
    $scope.showGoPrivate = false;
    $scope.showGoVIP = false;
    $scope.showGoPassword = false;


    var showAll = function(list){
      for(var item in list){
        $scope[list[item]] = true;
      }
    }
    var hideAll = function(list){
      for(var item in list){
        $scope[list[item]] = false;
      }
    }

    $scope.setStatus = function (status){
      $scope.status = status;
      var hideEm;
      var showEm;

      if (status ===  'Public'){
        hideEm = ['showGoPublic'];
        showEm = ['showGoAway','showGoOffline','showGoPrivate','showGoVIP','showGoPassword'];
      } else if (status ===  'Away'){
        hideEm = ['showGoAway','showGoPrivate','showGoVIP','showGoPassword'];
        showEm = ['showGoPublic','showGoOffline'];
      } else if (status ===  'Offline'){
        hideEm = ['showGoAway','showGoOffline','showGoPrivate','showGoVIP','showGoPassword'];
        showEm = ['showGoPublic'];
      }

      hideAll(hideEm);
      showAll(showEm);

      if(!$scope.$$phase) $scope.$apply();
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
