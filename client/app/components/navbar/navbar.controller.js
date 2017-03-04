'use strict';

angular.module('baseApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $cookieStore, Flash) {
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
      var id = Flash.create(flash.class, flash.text, 0, {class: 'custom-class', id: 'custom-id'}, true);
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
