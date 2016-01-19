'use strict';

angular.module('baseApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function (user) {
      User.remove({id: user._id});
      angular.forEach($scope.users, function (u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.statuses = {
      online: [
        'online',
        'offline',
        'on call',
        'away',
        'busy'
      ],
      show: [
        'offline',
        'public',
        'group',
        'private',
        'booked private',
        'vip',
        'courtesy',
        'meter',
        'goal',
        'password'
      ]
  };

    var updateStatus = function (data){
    //  console.log('status updated',data);
    //  $scope.users[data.index] = data.user;
    };

    $scope.setStatus = function (status, index, slug){

      var obj = {
        slug: slug,
        status: {
          show: '',
          online: ''
        },
        index: index
      };

      if(status === 'camDenied')obj.status.show = 'offline';
      else obj.status.show = status;

      obj.status.online = 'online';

      socket.emit('cam:status', obj);
    }
    socket.on('cam:status', function (data) {
      console.log('cam:status', data);
      for(var i = 0; i < $scope.users.length; i++){
        if ($scope.users[i].slug === data.slug){
          $scope.users[i].status = data.status;
        }
      }
    });

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
