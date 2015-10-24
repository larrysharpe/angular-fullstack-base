angular.module('baseApp')
  .controller('FavesCtrl', function ($scope, User, Auth, $http) {

    $scope.user = Auth.getCurrentUser();
    $http.get('/api/users/'+$scope.user._id+'/faves')
      .success(function(data){
        $scope.faves = data;
      })

  });
