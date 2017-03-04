'use strict';

angular.module('baseApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $cookieStore) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.hasRole = Auth.hasRole;
    $scope.getCurrentUser = Auth.getCurrentUser;

    var flash = $cookieStore.get('flash-msg');
    if (flash) {
      $cookieStore.remove('flash-msg');
    }

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
