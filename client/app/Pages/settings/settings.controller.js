'use strict';

angular.module('baseApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $http) {
    $scope.errors = {};

    $scope.user = Auth.getCurrentUser();


    $scope.changeUsername = function (form){
      $scope.submitted = true;
      if(form.$valid) {
        $http.put('/api/users/' + $scope.user._id + '/username', {username: $scope.user.username})
          .then(function(res){
            console.log('SUCCESS!!!!!');
          })
          .catch(function(err){
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });

            console.log('FAIL:: ', $scope.errors, form);
          })
      }
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });
