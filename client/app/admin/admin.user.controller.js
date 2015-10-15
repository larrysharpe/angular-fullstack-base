'use strict';

angular.module('baseApp')
  .controller('AdminUserCtrl', function ($scope, $http, Auth, User, $stateParams) {

    $scope.showSlug = function () {
      return $scope.profile.username !== $scope.profile.slug;
    }

    $http.get('/api/users/'+$stateParams.slug)
      .success(function(data){
        $scope.profile = data;
      })

  });
