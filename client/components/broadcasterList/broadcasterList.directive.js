'use strict';

angular.module('baseApp')
  .directive('broadcasterList', function (broadcasterListSVC) {
    return {
      templateUrl: 'components/broadcasterList/broadcasterList.html',
      restrict: 'EA',
      scope: {
        type: '@'
      },
      link: function (scope, element, attrs) {
        broadcasterListSVC.get(scope.type).then(function(response){
          scope.broadcasters = response.data;
        });
      }
    };
  });
