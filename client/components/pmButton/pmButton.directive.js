'use strict';

angular.module('baseApp')
  .directive('pmButton', function () {
    return {
      templateUrl: 'components/pmButton/pmButton.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, $rootScope){
        $scope.togglePm = function (){
          $rootScope.$broadcast('togglepm');
        }
      }
    };
  });
