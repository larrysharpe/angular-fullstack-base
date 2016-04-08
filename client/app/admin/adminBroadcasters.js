'use strict';

angular.module('baseApp')
  .controller('AdminAdminsCtrl', function ($scope, $stateParams) {
    $scope.title = $stateParams.title;
  })
  .controller('AdminBroadcastersCtrl', function ($scope, $stateParams) {
    $scope.title = $stateParams.title;
  })
  .controller('AdminDashboardCtrl', function ($scope, $stateParams, socket) {
    $scope.title = $stateParams.title;
    //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    //$scope.series = ['Guests','Users', 'Performers'];
    //$scope.data = [
    //  [65, 59, 80, 81, 56, 55, 40],
    //  [28, 48, 40, 19, 86, 27, 90],
    //  [10, 75, 65, 28, 48, 55, 80]
    //];
    $scope.labels = [];
    $scope.series = ['Guests','Users', 'Performers'];
    $scope.data = [
      [],
      [],
      []
    ];

    socket.on('admin:userstats', function(data){
      $scope.labels.push(data.dates);
      $scope.data[0].push(data.guests);
      $scope.data[1].push(data.users);
      $scope.data[2].push(data.broadcasters);
    });

    $scope.addData = function (){
      $scope.labels.push('text');

      var rand  = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
      var rand2 = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
      var rand3 = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

      $scope.data[0].push(rand);
      $scope.data[1].push(rand2);
      $scope.data[2].push(rand3);
    }

  })


  .controller('AdminUsersCtrl', function ($scope, $stateParams) {
    $scope.title = $stateParams.title;

  })


;

