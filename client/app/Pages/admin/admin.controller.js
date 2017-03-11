'use strict';

angular.module('baseApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.userRoles = ['user','admin'];

    $scope.newUser = {
      validationNeeded: true
    };

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {

        var newUserObj = {
          username: $scope.newUser.username,
          email: $scope.newUser.email,
          password: $scope.newUser.password,
          roles: $scope.newUser.roles
        };

        $http.post('/api/users/admin', newUserObj)
          .then(function (res) {
            // Account created, redirect to home
            console.log('ACCOUNT CREATED: ', res);
            var addedUser = {
              _id: res.data.user._id,
              username: $scope.newUser.username,
              email: $scope.newUser.email,
              roles: $scope.newUser.roles,
              requireValidation: $scope.newUser.validationNeeded
            };
            $scope.users.push(addedUser);
            console.log(form);
            form.$setPristine();
            form.$setUntouched();
            $scope.submitted = false;
            $scope.newUser = '';

          })
          .catch(function (err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    }

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
