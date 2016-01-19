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
      controller: function ($scope, socket, broadcasterListSVC){

        if (!$scope.header) $scope.header = '';
        if(!$scope.type) $scope.type = '';

        $scope.getList = function () {
          broadcasterListSVC.get($scope.type).then(function(response){
            $scope.broadcasters = response.data;
          });
        }

        socket.on('cam:status', function (data) {
          console.log(data);
          $scope.getList();
        });

        $scope.getList();

      },
      link: function (scope, element, attrs) {}
    };
  });
