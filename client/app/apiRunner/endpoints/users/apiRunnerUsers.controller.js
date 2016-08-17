'use strict';

angular.module('baseApp')
  .controller('ApiRunnerUsersCtrl', function ($scope, $http, $state) {
    var apiUrl = '/api/users';

    var handleGetSuccess = function (users) {
      $scope.users = users;
    }

    $scope.currentPage = 0;
    $scope.pageSize = 25;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.users.length/$scope.pageSize);
    };

    $scope.users = [];
    $scope.params = $state.params;

    $scope.getStatus = function (status){
      if (!status.online) return 'offline';
      else if (status.availability === 'offline' || status.show === 'offline') return 'logged In';
      else if (status.show !== 'public') return status.show;
      else return 'public';
    };

    $http
      .get(apiUrl)
      .success(handleGetSuccess)
    ;

  });
angular.module('baseApp')
.filter('startFrom', function() {
  return function(input, start) {
    start = +start; //parse to int
    return input.slice(start);
  }
});
