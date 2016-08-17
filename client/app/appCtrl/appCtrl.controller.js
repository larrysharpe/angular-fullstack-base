'use strict';

angular.module('baseApp')
  .controller('AppCtrl', function ($scope, ngToast, Auth, socketInit, socket) {

    var initialLoad = true;

    $scope.hasRole = Auth.hasRole;
    $scope.logout = Auth.logout;
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.hasNavBarAlt = function (){
      if (!$scope.user || !$scope.user.roles || $scope.user.emailConfirmed) return false;
      if (!$scope.user.emailConfirmed) return true;
    }
    $scope.showEmailNotConfirmed = function () {
      if ($scope.user && !$scope.user.emailConfirmed ) return true;
    };

    $scope.$on('$viewContentLoaded', function(event) {
      if (initialLoad)  initialLoad = false;
      else {
        //console.log('$viewContentLoaded', event, $scope.user);
        socketInit.exec($scope.user);
      }
    });

  });
