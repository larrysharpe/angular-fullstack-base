'use strict';

angular.module('baseApp')
  .directive('broadcasterListItem', function () {
    return {
      templateUrl: 'components/broadcasterListItem/broadcasterListItem.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, Auth, $http, socket) {

        var userId = Auth.getCurrentUser()._id;

        if (userId) {
          $scope.faves = Auth.getCurrentUser().faves;

          $scope.faved = false;

          $scope.isFaved = function (id) {
            return $scope.faves.indexOf(id) > -1;
          }

          var handleSetFaves = function (data) {
            console.log('handlesetfaves: ', data, $scope.broadcaster);
            Auth.setFaves(data.faves);
          };


          var handleUnsetFaves = function (data) {
            console.log('handleunsetfaves: ', data);
            Auth.setFaves(data.faves);
          };

          $scope.fave = function (id, index) {
            socket.emit('fave:set',{_id: userId, faves: [id]}, handleSetFaves);
          }

          $scope.unFave = function (id) {
            socket.emit('fave:unset',{_id: userId, faves: [id]}, handleUnsetFaves);
          }
        }
      }
    };
  });
