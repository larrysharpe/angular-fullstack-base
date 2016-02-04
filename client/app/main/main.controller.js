'use strict';

angular.module('baseApp')

  .controller('MainCtrl', function ($scope, $http, $state, $stateParams, Auth, socket) {
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn= Auth.isLoggedIn();

    var data = {
      page: $state.current.name,
      user: {
        slug: $scope.user.slug,
        username: $scope.user.username
      }
    };

    socket.emit('init', data);

  });
