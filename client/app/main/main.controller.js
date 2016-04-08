'use strict';

angular.module('baseApp')

  .controller('MainCtrl', function ($scope, Auth, socketInit) {
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn();

    var initReturn = function (initObj){
      console.log('init return: ',initObj);
    };

    socketInit.run(initReturn, $scope.user);

  });
