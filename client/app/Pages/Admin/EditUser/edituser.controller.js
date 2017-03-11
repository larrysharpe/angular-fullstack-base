'use strict';

angular.module('baseApp')
  .controller('EditUserCtrl', function ($scope, Auth, $location, $window, $stateParams, $http, Alert) {

    $scope.userRoles = ['user','admin'];

    $http.get('/api/users/' + $stateParams.id)
    .then(function(res){
      $scope.newUser = res.data;
    })

    $scope.send = function() {
      $http.put('/api/users/' + $stateParams.id, $scope.newUser)
        .then(function(res){
          if(res.status === 200){
            Alert.open('EditUserSuccess');
          }
        })
    }



  });
