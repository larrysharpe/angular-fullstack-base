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

        $scope.returnStatusClass = function (status){
          if (!status.online || (status.availability === 'offline' && status.show === 'offline')) return 'offline';
          else if (status.show === 'offline') return status.availability.replace(' ','-');
          else return status.show.replace(' ','-');
        }

        $scope.returnStatusName = function (status){
          if (!status.online || (status.availability === 'offline' && status.show === 'offline')) return 'offline';
          else if (status.show === 'offline') return status.availability;
          else return status.show;
        }


        if (userId) {
          $scope.faves = Auth.getCurrentUser().faves;

          $scope.faved = $scope.faves.indexOf($scope.broadcaster._id) > -1

          $scope.isFaved = function (id) {
            return $scope.faves.indexOf(id) > -1;
          }

          var handleSetFaves = function (data) {
            $scope.faves = data.faves;
          };


          $scope.fave = function (id, index) {
            socket.emit('fave:set',{_id: userId, faves: [id]}, handleSetFaves);
          }

          $scope.unFave = function (id) {
            socket.emit('fave:unset',{_id: userId, faves: [id]}, handleSetFaves);
          }
        }
      }
    };
  });
