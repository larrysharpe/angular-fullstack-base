'use strict';

angular.module('baseApp')
  .directive('broadcasterList', function (broadcasterListSVC, socket) {
    return {
      templateUrl: 'components/broadcasterList/broadcasterList.html',
      restrict: 'EA',
      scope: {
        type: '@',
        header: '@'
      },
      controller: function ($scope, socket, broadcasterListSVC, Auth){

        if (!$scope.header) $scope.header = '';
        if(!$scope.type) $scope.type = '';

        var user = Auth.getCurrentUser();

        var handleGetBroadcasters = function (data){
          if(data.status === 'success'){
            $scope.broadcasters = data.broadcasters;
          }
        };

        $scope.getList = function () {
          socket.emit('broadcasters:get', user, handleGetBroadcasters);
        }

        socket.on('status:change', function (data) {
          $scope.getList();
        });

        $scope.getList();

      },
      link: function (scope, element, attrs) {}
    };
  });
