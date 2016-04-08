'use strict';

angular.module('baseApp')
  .directive('adminNav', function () {
    return {
      templateUrl: 'components/adminNav/adminNav.html',
      restrict: 'EA',
      controller: function ($scope, Auth, $location){

        $scope.logout = function() {
          Auth.logout();
          $location.path('/login');
        };
      }
    };
  });
