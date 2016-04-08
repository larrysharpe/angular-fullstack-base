'use strict';

angular.module('baseApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $http) {
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.hasRole = Auth.hasRole;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
    };

    if($scope.isLoggedIn()){
      $http.get('/api/users/' + $scope.getCurrentUser()._id + '/faves')
        .success(function(data){

          var faves = {
            total: data.length
          };
          for (var i = 0; i<data.length; i ++){
            if (faves[data[i].status]) faves[data[i].status].push(data[i]);
            else faves[data[i].status] = [data[i]];
          }

          $scope.faves = faves;
        });
    }

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.isVerified =  function () {
      return $scope.getCurrentUser().emailConfirmed && $scope.isLoggedIn();
    };

    $scope.broadcasterSetup = function (){
      var usr = {
        _id: $scope.getCurrentUser()._id
      };
      $http.post('/api/users/applyBroadcaster',usr)
        .success(function(data){
          if (data === 'OK'){
            Auth.refreshUser();
            $location.path('/dashboard');
          }
        })
    }

    $scope.resendVerification = function (){
      $http.get('/api/users/resendVerification/'+$scope.getCurrentUser()._id)
        .success((function(data){
          if (data === 'OK') {
            $scope.verificationSent = true;
          }
        }))
    }
  });
