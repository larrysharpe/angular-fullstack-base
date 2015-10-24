'use strict';

angular.module('baseApp')
  .directive('broadcasterListItem', function () {
    return {
      templateUrl: 'components/broadcasterListItem/broadcasterListItem.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, Auth, $http) {

        var userId = Auth.getCurrentUser()._id;

        if (userId) {
          $scope.faves = Auth.getCurrentUser().faves;

          $scope.faved = false;

          $scope.isFaved = function (id) {
            return $scope.faves.indexOf(id) > -1;
          }

          $scope.fave = function (id) {
            console.log($scope.faves);
            $http.post('/api/users/' + userId + '/faves/set', {ids: [id]})
              .success(function (faves) {
                $scope.faves = faves;
                Auth.setFaves(faves);
              });
          }

          $scope.unFave = function (id) {
            console.log($scope.faves);
            $http.post('/api/users/' + userId + '/faves/unset', {ids: [id]})
              .success(function (faves) {
                $scope.faves = faves;
                Auth.setFaves(faves);
              });
          }
        }
      }
    };
  });
