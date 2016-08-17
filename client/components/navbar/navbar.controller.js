'use strict';

angular.module('baseApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $http) {

    $scope.isCollapsed = true;

    //API URLs
    var api = {
      broadcasterSetup:  '/api/users/applyBroadcaster'
    };

    if ($scope.user._id){
      api.loadFaves = '/api/users/' + $scope.user._id + '/faves';
      api.verificationURL =  '/api/users/resendVerification/' + $scope.user._id
    }

    var verificationSent = false;

    /* Non Scope Functions */
    var isVerified =  function () {
      return $scope.user.emailConfirmed && $scope.isLoggedIn();
    };

    /* API Call Handlers */
    var handleBroadcastSetup = function(data){
      if (data === 'OK'){
        Auth.refreshUser();
        $location.path('/dashboard');
      }
    };
    var handleLoadFaves = function(data){
      var faves = {
        total: data.length
      };
      for (var i = 0; i<data.length; i ++){
        if (faves[data[i].status]) faves[data[i].status].push(data[i]);
        else faves[data[i].status] = [data[i]];
      }
      $scope.faves = faves;
    };
    var handleResendVerification = function(data){
          if (data === 'OK')  verificationSent = true;
        };

    /* Scope Functions */
    $scope.broadcasterSetup = function (){
      var usr = {
        _id: $scope.user._id
      };
      $http.post(api.broadcasterSetup,usr).success(handleBroadcastSetup);
    };
    $scope.isActive = function(route) {
      return route === $location.path();
    };
    $scope.resendVerification = function (){
      $http.get(api.verificationURL).success(handleResendVerification);
    };
    $scope.showConfirmationSent = function (){
      return (isVerified() && verificationSent);
    };

  });
