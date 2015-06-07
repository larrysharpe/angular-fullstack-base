angular.module('baseApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $http) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser();
    $scope.message = {};

    $scope.changePassword = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
          .then(function () {
            $scope.message.password = 'Password successfully changed.';
            $scope.errors.password = '';
          })
          .catch(function () {
            form.password.$setValidity('mongoose', false);
            $scope.errors.password = 'Incorrect password';
            $scope.message.password = '';
          });
      }
    };

    $scope.changeProfile = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        $http.put('/api/users/changeProfile', { _id: $scope.user._id, username: $scope.user.username })
          .success(function (data) {
            $scope.message.profile = 'Profile successfully updated.';
            $scope.errors.profile = '';
            $scope.user = data.user;
            form.$setPristine();
          })
          .error(function (err) {
            form.profile.$setValidity('mongoose', false);
            $scope.message.profile = '';
            $scope.errors.profile = data;
          });
      }
    };

    $scope.changeEmail = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        $http.put('/api/users/changeEmail', { _id: $scope.user._id, email: $scope.user.email})
          .success(function (data) {
            $scope.message.email = 'Email successfully updated.';
            $scope.errors.email = '';
            $scope.user = data.user;
            form.$setPristine();

          })
          .error(function (data) {
            form.email.$setValidity('mongoose', false);
            $scope.message.email = '';
            $scope.errors.email = data;
          });
      }
    };
  });
