'use strict';

angular.module('baseApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket, $state, $rootScope) {

    $scope.user = Auth.getCurrentUser();

    var initObj = {
      page: $state.current.name,
      user: {
        slug: $scope.user.slug,
        username: $scope.user.username
      }
    };


    if($rootScope.removeUser){
      initObj.remove = $rootScope.removeUser;
      delete $rootScope.removeUser;
    }

    var statsReceieved = function (results){
      console.log('Stats Received:', results);
      $scope.stats = results.data;
    }

    var checkStats = function (){
      socket.emit('stats:get',{}, statsReceieved);
    }

    //var checkStatsInterval = setInterval(checkStats, 1000);

    var initReturn = function (data){
      console.log('init return: ',data);
    };


    var getSocketStats = function (data){
      console.log('getSocketStats',data);
      for(var obj in data){
        $scope[obj] = data[obj];
      }
    }

    socket.emit('init', initObj, initReturn);
    socket.emit('getSocketStats', {}, getSocketStats);


    // Use the User $resource to fetch all users

    var handleLoadUsers = function (users) {
      $scope.users = users;
    };

    $scope.options = {
      online: [{label:'online', value: true}, {label: 'offline', value: false}],
      availability: ['offline', 'online',  'on call', 'away', 'busy'],
      show: ['offline','public', 'group', 'private', 'booked private', 'vip', 'jukebox','courtesy', 'meter', 'goal', 'password']
    };

    $scope.seedDB = function (){
      $http.post('/api/users/createBatch')
        .success(function(data){
          console.log(data);
        })
    }


    var handleStatusAvailability = function (d) {
      console.log(d)
    };

    var handleStatusOnline = function (d) {
      console.log(d)
    };

    var handleStatusShow = function (d) {
      console.log(d)
    };

    $scope.statusOnlineChange = function (user, index){
      var obj = {
        slug: user.slug,
        status: {
          online: user.status.online
        },
        index: index
      };
      socket.emit('status:change', obj, handleStatusOnline);
    };


    $scope.statusAvailabilityChange = function (user, index){
      var obj = {
        slug: user.slug,
        status: {
          availability: user.status.availability
        },
        index: index
      };
      socket.emit('status:change', obj, handleStatusAvailability);
    };

    $scope.statusShowChange = function (user, index){
      var obj = {
        slug: user.slug,
        status: {
          show: user.status.show
        },
        index: index
      };
      socket.emit('status:change', obj, handleStatusShow);
    };

    $scope.updateStatusOnline = function (status, slug, index){
      var obj = {
        slug: slug,
        status: {
          online: status
        },
        index: index
      };
      socket.emit('status:change', obj, handleStatusOnline);
    } ;

    $scope.isOnline = function (val) {
      if (val) return 'online';
      else return 'offline';
    }

    $http.get('/api/users/adminHome').success(handleLoadUsers);

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
          show: ''
        },
        index: index
      };

      if(status === 'camDenied')obj.status.show = 'offline';
      else obj.status.show = status;

      socket.emit('status:change', obj);
    }
    socket.on('status:change', function (data) {
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
