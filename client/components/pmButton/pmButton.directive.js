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
          var to = $scope.broadcaster.slug + '-direct';

          $rootScope.$broadcast('togglepm', to);
        }
      }
    };
  });
