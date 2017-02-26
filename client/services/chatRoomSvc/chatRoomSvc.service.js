'use strict';

angular.module('baseApp')
  .service('chatRoomSvc', function (socket) {
    // AngularJS will instantiate a singleton by calling "new" on this function


    var chatRoomSvc = {
      roomsList: [],
      rooms: {},
      currentRoom: {}
    }

    socket.on('roomJoin', function (client) {
      console.log('Room Join in ChatRmSvc: ', client);
      if (chatRoomSvc.roomsList.indexOf(client.slug) === -1){
        chatRoomSvc.roomsList.push(client.slug);
      }
      chatRoomSvc.rooms[client.slug] = client;
      if (!chatRoomSvc.currentRoom) {
        chatRoomSvc.currentRoom = chatRoomSvc.rooms[client.slug];
      }
    });

    socket.on('roomLeave', function (slug) {
      if (chatRoomSvc.rooms[slug]) delete chatRoomSvc.rooms[slug];

      var roomListIndex = chatRoomSvc.roomsList.indexOf(slug);
      if (roomListIndex !== -1) chatRoomSvc.roomsList.splice(roomListIndex, 1);

      console.log('Room Leave in ChatRmSvc: ', slug, chatRoomSvc);
    });

    var setInitialRoom = function (){
      chatRoomSvc.currentRoom = chatRoomSvc.rooms[chatRoomSvc.roomsList[0]];
      chatRoomSvc.currentRoom.isActive = true;
      chatRoomSvc.currentRoom.isOpen = true;
    }

var chatStart = function () {
    socket.emit('roomInit', {}, function (data){
      console.log('roomInit', data);
      chatRoomSvc.roomsList = data.roomsList;
      chatRoomSvc.rooms = data.rooms;
      setInitialRoom();
    });
}

    //setTimeout(chatStart,500);

    return chatRoomSvc;


  });
