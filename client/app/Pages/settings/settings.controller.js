'use strict';

angular.module('baseApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $http) {
    $scope.errors = {};

    $scope.user = Auth.getCurrentUser();

    $scope.user.birthdate = new Date($scope.user.birthdate);

    $scope.yesNo = [{text: 'Yes', value: 'y'}, {text: 'No', value: 'n'}];
    $scope.genders = [{text: 'Female', value: 'f'}, {text: 'Male', value: 'm'}, {text: 'Other', value: 'o'}];

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

            //TODO: Create a mongoose error service
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });

            console.log('FAIL:: ', $scope.errors, form);
          })
      }
    };

    $scope.changeEmail = function (form){
      $scope.submitted = true;
      if(form.$valid) {
        $http.put('/api/users/' + $scope.user._id + '/email', {email: $scope.user.email})
          .then(function(res){
            console.log('SUCCESS!!!!!');
          })
          .catch(function(err){
            err = err.data;
            $scope.errors = {};

            //TODO: Create a mongoose error service
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });

            console.log('FAIL:: ', $scope.errors, form);
          })
      }
    };

    $scope.view = 'email';

    $scope.menu = [
      {text: 'Email', view: 'email'},
      {text: 'Username', view: 'username'},
      {text: 'Password', view: 'password'},
      {text: 'Identity', view: 'identity'}
    ];

    $scope.changeView = function (view) {
      $scope.view = view;
    }

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

    $scope.changeIdentity = function (form) {
      if(form.$valid) {

        var userUpdate = {
          name: {
            prefix: $scope.user.name.prefix,
            first:  $scope.user.name.first,
            middle:  $scope.user.name.middle,
            last:  $scope.user.name.last,
            suffix:  $scope.user.name.suffix
          },

          birthdate: $scope.user.birthdate,
          gender: $scope.user.gender,
          isUSCitizen:  $scope.user.isUSCitizen
        };


        $http.put('/api/users/' + $scope.user._id + '/identity', userUpdate)
          .then(function(res){
            console.log('SUCCESS!!!!!');
          })
          .catch(function(err){
            err = err.data;
            $scope.errors = {};

            //TODO: Create a mongoose error service
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });

            console.log('FAIL:: ', $scope.errors, form);
          })
      }
    };

  });
