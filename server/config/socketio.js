/**
 * Socket.io configuration
 */

'use strict';
var Tips = require('../api/tips/tips.model');
var Messages = require('../api/message/message.model');
var Users = require('../api/user/user.model');
var config = require('./environment');



var clients = {};
var rooms = {};
var sockets = {};


// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    var initClient = function (data, b){
      console.log('Init Client: ', socket.id, data);

      if(data.room) socket.join(data.room);
      socket.join(data.user + '_direct');

      console.log('Direct Join: ',data.user, data.user + '_direct');

      var sockObj = {user: data.user, room: data.room, socket: socket.id};
      sockets[socket.id] = sockObj;


      if(clients[data.user]) {
        if(data.room){
          var roomIndex = clients[data.user].rooms.indexOf(data.room)
          if(roomIndex === -1) clients[data.user].rooms.push(data.room);
        }
      } else {
        clients[data.user] = {
          socket: socket.id
        };
        if (data.room) clients[data.user].rooms = [data.room];
      }



      if (data.room && rooms[data.room]) {
        if(rooms[data.room].indexOf(data.user) === -1) rooms[data.room].push(data.user);
      } else if (data.room) rooms[data.room] = [data.user];

      console.log('Clients: ',clients);
      console.log('Rooms: ',rooms);
      console.log('Sockets: ',sockets);
    };

    socket.on('init', initClient);

    socket.on('tip:send', function(tip, cb){
      var _tmpTip = tip;
      var room = tip.to + '_public';
      Tips.create(tip, function(err, tips) {
        if(err) {  }
        if(!tips) {  }
        else {
          var room = tips.to + '_public';
          var history = {
            cost: .10,
            category: 'tokens',
            item: 'Tipped Broadcaster',
            units: tips.amount,
            total: tips.amount *.10,
            to: tips.to,
            from: tips.from,
            rain: tips.rain || '',
            hideTip:  tips.hideTip || '',
            tipNote: tips.tipNote || ''
          };
          Users.findOne({slug: tips.from}, function (err, user){
            if(err) { }
            if(!user) {  }
            if(tips.amount > user.credits.units) {
              cb({error: 'not enough tokens', errorCode: 101})
            }else {
              user.credits.units -= tips.amount;
              user.credits.history.push(history);
              user.save(function (err, userFrom) {
                if (err) {
                }
                if (!userFrom) {
                }
                Users.findOne({slug: tips.to}, function (err, user) {
                  if (err) {
                  }
                  if (!user) {
                  }
                  user.credits.units += tips.amount;
                  user.credits.history.push(history);
                  user.save(function (err, user) {
                    if (err) {
                    }
                    if (!user) {
                    }
                    if (!tips.hideTip) {
                      var content;
                      _tmpTip.type = 'tip';

                      if (_tmpTip.amount > 999) _tmpTip.subType = 'tipLevel4';
                      else if (_tmpTip.amount > 499) _tmpTip.subType = 'tipLevel3';
                      else if (_tmpTip.amount > 99) _tmpTip.subType = 'tipLevel2';
                      else _tmpTip.subType = 'tipLevel1';

                      if(_tmpTip.rain) {
                        var rainAmount = _tmpTip.amount / 10;
                        var rainMsg =   {
                          content: 'has made it rain!',
                          from: _tmpTip.from,
                          subType: _tmpTip.subType,
                          to: _tmpTip.to,
                          type: "tip"
                        }
                        var rainTips =   {
                          amount: rainAmount,
                          content: " tipped "+ rainAmount +" tokens.",
                          from: _tmpTip.from,
                          hideTip: _tmpTip.hideTip,
                          rain: _tmpTip.rain,
                          subType: _tmpTip.subType,
                          to: _tmpTip.to,
                          type: "tip"
                        }

                        var _tmpMsg = {rain: true, main: rainMsg, tips: rainTips}

                        socket.emit('message:rcv', _tmpMsg);
                        socket.in(room).emit('message:rcv', _tmpMsg);
                      } else {
                        content = ' tipped ' + tips.amount + ' tokens.';
                        _tmpTip.content = content;
                        socket.emit('message:rcv', _tmpTip);
                        socket.in(room).emit('message:rcv', _tmpTip);
                      }
                    }
                    cb(userFrom);
                  });
                });
              });
            }
          });
        }
      });
    });

    // broadcast a user's message to other users
    socket.on('message:send', function (data, cb) {
      var msg = {
        from: data.from,
        content: data.content,
        to: data.to,
        type: 'message'
      };

      Messages.create(msg, function(err, msg){
        if(err) cb({error: err});
        if(!msg) cb({error: 'Message not created'});
        socket.to(data.to).emit('message:rcv', msg);
        cb(msg);
      })

    });

    socket.on('privatemessage:send', function (data, cb) {
      Messages.create(data, function(err, msg){
        if(err) cb({error: err});
        if(!msg) cb({error: 'Message not created'});
        socket.to(data.to).emit('privatemessage:rcv', data);
        cb(data);
      });
    });

    socket.on('cam:status', function (data, cb) {
      Users.findOne({slug: data.slug}, function (err, user) {
        if(err) { cb({error: err}); }
        else if (!user){ cb({error: 'User Not Found'}); }
        else {
          if (data.status.show) user.status.show = data.status.show;
          if (data.status.online) user.status.online = data.status.online;
          user.save(function (err, user) {
            if (err) cb({error: err});
            else if (!user) cb({error: 'User Not Saved'});
            else {
              socket.broadcast.emit('cam:status', user);
              socket.broadcast.emit('broadcaster:status:' + user.status.show, user);
              cb({user: user, index: data.index} );
            }
          })
        }
      });
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};
