'use strict';

angular.module('baseApp')
  .controller('DashboardCtrl', function ($scope, Auth, socketInit ) {
    $scope.user = Auth.getCurrentUser();

    var initReturn = function (data){
      console.log('init return: ',data);
    };

    socketInit.run(initReturn, $scope.user);

  });
