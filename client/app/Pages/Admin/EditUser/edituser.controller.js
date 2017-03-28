'use strict';

angular.module('baseApp')
  .controller('EditUserCtrl', function ($scope, Auth, $location, $window, $stateParams, $http) {

    $scope.userRoles = ['user','admin'];

    $scope.view = 'email';
    $scope.yesNo = [{text: 'Yes', value: 'y'}, {text: 'No', value: 'n'}];
    $scope.genders = [{text: 'Female', value: 'f'}, {text: 'Male', value: 'm'}, {text: 'Other', value: 'o'}];

    $scope.menu = [
      {text: 'Email', view: 'email'},
      {text: 'Username', view: 'username'},
      {text: 'Password', view: 'password'},
      {text: 'Identity', view: 'identity'},
      {text: 'Roles', view: 'roles'}
    ];

    $scope.changeView = function (view) {
      $scope.view = view;
    }

    $http.get('/api/users/' + $stateParams.id + '/all/admin')
      .then(function(res){
        res.data.birthdate = new Date(res.data.birthdate);
        $scope.user = res.data;
      })




  });
