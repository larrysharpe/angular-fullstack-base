'use strict';

angular.module('baseApp')
  .controller('BroadcastCtrl', function ($scope, $http, $state, $stateParams, Auth, socket, $rootScope) {


    socket.on('status:change', function (data) {
      console.log('rcvd cam status',data);
      if(data.status.show) $scope.user.status.show = data.status.show;
      if(data.status.online) $scope.user.status.online = data.status.online;
      $scope.camState = $scope.user.status.show;
    });

    $scope.user = Auth.getCurrentUser();
    $scope.room = $scope.user.slug + '-public';


    var url = '/api/users/broadcasters/' + $scope.user.slug;

    $http.get(url)
      .success(function(data){
        $scope.broadcaster = data;
      });

    $scope.camState = 'offline';

    console.log('my user: ', $scope.user);


    var initObj = {
      page: $state.current.name,
      room: $scope.user.slug + '-public',
      user: {
        slug: $scope.user.slug,
        username: $scope.user.username
      }
    };

    if($rootScope.removeUser){
      initObj.remove = $rootScope.removeUser;
      delete $rootScope.removeUser;
    }

    var initReturn = function (data){
      console.log('init return:',data);
      if(data.user) {
        $scope.broadcaster = data.user;
        $scope.user = data.user;
      } else {
        $scope.broadcaster = data.data;
      }
    };

    socket.emit('init', initObj, initReturn);

    $scope.roomsList = [
      'public','group','vip','groupone'
    ];
    $scope.rooms = {
      public: {
        slug: 'public',
        isActive: false,
        displayname: 'Public Room A',
        type: 'group',
        watchercount: 8,
        children: ['guest1'],
        messages: [
          {
            username: 'User 6',
            slug: 'user-6',
            message: 'Lorem ipsum dolor sit amet',
            time: '12:00am',
            thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-6'
          },
          {
            username: 'User 5',
            slug: 'user-5',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec euismod dui, quis tristique urna. Suspendisse nunc augue, rhoncus placerat',
            time: '12:00am',
            thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-5'
          }
        ]
      }
      /*,
      group: {
        slug: 'group',
        displayname: 'Group Room A',
        type: 'group',
        isActive: false,
        watchercount: 6,
        children: ['guest1'],
        messages: [
          {
            username: 'User 6',
            slug: 'user-6',
            message: 'Lorem ipsum dolor sit amet',
            time: '12:00am',
            thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-6'
          },
          {
            username: 'User 5',
            slug: 'user-5',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec euismod dui, quis tristique urna. Suspendisse nunc augue, rhoncus placerat',
            time: '12:00am',
            thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-5'
          }
        ]
      },
      vip: {
        slug: 'vip',
        displayname: 'VIP Room',
        isActive: false,
        type: 'group',
        messages: [
          {
            username: 'User 7',
            slug: 'user-6',
            message: 'Lorem ipsum dolor sit amet',
            time: '12:00am',
            thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-6'
          },
          {
            username: 'User 8',
            slug: 'user-5',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec euismod dui, quis tristique urna. Suspendisse nunc augue, rhoncus placerat',
            time: '12:00am',
            thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-5'
          }
        ]
      },
      groupone: {
        slug: 'groupone',
        displayname: 'Favorites',
        type: 'set',
        roomcount: 3,
        children: ['user-2']
      },
      user1: {
        slug: 'user1',
        displayname: 'User 1',
        type: 'user'
      },
      'user-2': {
        slug: 'user-2',
        displayname: 'User 2',
        type: 'user'
      }*/,
      guest1: {
        slug: 'guest1',
        displayname: 'Guest 1',
        type: 'user',
        messages: [
          {
            username: 'User 6',
            slug: 'user-6',
            message: 'Lorem ipsum dolor sit amet',
            time: '12:00am',
            thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-6'
          },
          {
            username: 'User 5',
            slug: 'user-5',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec euismod dui, quis tristique urna. Suspendisse nunc augue, rhoncus placerat',
            time: '12:00am',
            thumb: 'http://loremflickr.com/320/240/woman,sexy/all?radn=user-5'
          }
        ]
      }
    };
    $scope.currentRoom = $scope.rooms[$scope.roomsList[0]];

    $scope.doConnect = function (instanceType) {
      $scope.camState = 'going-online';
      var obj = {method: 'connect',
        instanceType: instanceType
      };
      callToActionscript(obj);
    };

    $scope.checkScope = function (){
      console.log($scope);
    }


    $scope.undoConnect = function () {
      $scope.camState = 'going-offline';
      var obj = {method: 'disconnect'};
      callToActionscript(obj);
    };

    $scope.changePublish = function (user){
      var obj = {broadcaster: user.slug,
        instanceType: user.status.show,
        method: 'changePublish'
      }
      callToActionscript(obj);
    }

    $scope.isBroadcaster = function () {
      return true;
    };

    $scope.isCamConnecting = function () {
      return $scope.camState === 'going-online';
    };

    $scope.isCamDenied = function () {
      return $scope.camState === 'camDenied';
    }

    $scope.isStatus = function (status) {
      if($scope.broadcaster) {
        if (typeof status === 'string')  return $scope.broadcaster.status.show === status;
        else if (status.indexOf($scope.broadcaster.status.show) > -1) return true;
        else return false;
      } else return false;
    }

    $scope.isPassword = function (){
      return $scope.broadcaster.status.show === 'password';
    }

    $scope.isCamOffline = function () {
      console.log($scope.broadcaster);
      return ($scope.camState === 'offline' || $scope.camState === 'camDenied');
    }

    $scope.isCamOnline = function () {
      return $scope.camState === 'online';
    }

    $scope.camStatus = function (status){

      var statusObj = $scope.user.status;
      if(status.show) statusObj.show = status.show;
      if(status.availability) statusObj.availability = status.availability;
      if(status.online) statusObj.online = status.online;

      socket.emit('status:change', {
        slug: $scope.user.slug,
        status: statusObj
      }, function(data){
        $scope.camState = data.user.status.show;
        $scope.user.status = data.user.status;
      });
    }
  });
