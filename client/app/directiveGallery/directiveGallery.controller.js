'use strict';

angular.module('baseApp')
  .controller('DirectiveGalleryCtrl', function (Auth, $scope, socketInit, $rootScope) {

    var resetMsg = function (){

      var thumbUrlBase = 'http://loremflickr.com/320/240/woman,sexy/all?radn='

      var obj = {
        username: 'User 1',
        slug: 'user-1',
        message: '',
        room: {
          displayname: 'Public Room A',
          slug: 'public',
          type: 'group'
        }
        //time: new Date(), <!-- set on server
        //thumb: ''  <-- set below
      }

      obj.thumb = thumbUrlBase + obj.slug;

      return obj;

    }

    $scope.currentRoom;

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
      },
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
      },
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
    $scope.user = Auth.getCurrentUser();


    socketInit.exec(function(data){console.log(data)}, $scope.user);

    $scope.submitChat = function (form) {
      $rootScope.$broadcast('new chat msg', $scope[form]);
      $scope[form] = resetMsg();
    }

    var resetUser = function () {
      return {
        slug: '',
        username: ''
      }
    }

    $scope.directives = [
      {href:"roomUserList", name: "Room User List"},
      {href:"roomChatBox", name: "Room Chat Box"},
      {href:"broadcasterChat", name: "Broadcaster Chat"}
    ]

    $scope.addUser = function () {
      var newUser = {
        slug: $scope.newUsr.slug,
        displayname: $scope.newUsr.username,
        room: $scope.newUsr.room,
        type: 'user',
        messages: []
      };

      $scope.rooms[$scope.newUsr.room].children.push($scope.newUsr.slug);
      $scope.rooms[$scope.newUsr.slug] = newUser;
      $scope.newUsr = resetUser();

    }

  });
