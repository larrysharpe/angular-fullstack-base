'use strict';

angular.module('baseApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.needsBroadcasterApproval = function (index) {
      return $scope.users[index].roles.indexOf('broadcaster applicant') > -1;
    }

    $scope.approveBroadcaster = function (user,index) {
      $http.post('/api/users/approveBroadcaster', {_id: user._id})
        .success(function(userData){
          console.log('Broadcaster Approved');
          $scope.users[index] = userData;
        })
        .error(function(data){
          console.log('Broadcaster Approval Failed.', data);
        })
    };

    $scope.denyBroadcaster = function (user,index) {
      $http.post('/api/users/denyBroadcaster', {_id: user._id})
        .success(function(userData){
          console.log('Broadcaster Denied');
          $scope.users[index] = userData;
        })
        .error(function(data){
          console.log('Broadcaster Denial Failed', data);

        })
    };
  });
