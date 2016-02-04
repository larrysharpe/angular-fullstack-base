'use strict';

angular.module('baseApp')
  .directive('showComponent', function () {
    return {
      templateUrl: 'components/showComponent/showComponent.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, socket, $location) {
        $scope.showsOpen = false;
        $scope.shows = ['Private','Vip','Group'];
        $scope.disabledShows = [];

        $scope.isDisabled = function (show) {
          return $scope.disabledShows.indexOf(show) > -1;
        };

        var enableShow = function (show){
          var showIndex = $scope.disabledShows.indexOf(show);
          if( showIndex > -1){
            $scope.disabledShows.splice(showIndex, 1);
          }
        }

        var handleShowReqReturn = function (data) {
          if(data.status == 'success'){
          } else {
            enableShow(data.show);
          }
        }

        var handleShowReqAccepted = function (data) {
          console.log('Show Accepted --- ', data);
          var showPath = '/' + data.show.toLowerCase() + '/' + data.broadcaster.slug
          $location.path(showPath);
        }

        socket.on('show:requestAccepted:rcv', handleShowReqAccepted);

        $scope.requestShow = function (show){
          var data = {
            broadcaster: {
              slug: $scope.broadcaster.slug,
              name: $scope.broadcaster.username
            },
            user: {
              slug: $scope.user.slug,
              name: $scope.user.username
            },
            show: show
          };

          if(!$scope.isDisabled(show)) $scope.disabledShows.push(show);
          socket.emit('show:request:send', data, handleShowReqReturn)
        }
      }
    };
  });
