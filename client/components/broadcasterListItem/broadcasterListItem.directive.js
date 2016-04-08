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
          $scope.faved = function () { return $scope.user.faves.indexOf($scope.broadcaster._id) > -1; }


          var handleSetFaves = function (res) {
            $scope.user.faves = res.data.faves;
          };


          $scope.faveUpdate = function (add, remove) {

            var favObj = {
              _id: userId
            };

            if(add) favObj.add = add;
            if(remove) favObj.remove = remove;

            socket.emit('faveUpdate', favObj, handleSetFaves );

          };
        }
      }
    };
  });
