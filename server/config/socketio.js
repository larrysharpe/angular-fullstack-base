/**
 * Socket.io configuration
 */

'use strict';
var Tips = require('../api/tips/tips.model');
var Users = require('../api/user/user.model');

var config = require('./environment');

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

    socket.on('join:room', function(room, cb){
      socket.join(room);

      console.log('join room: ', room);

      cb('joined')
    });

    socket.on('send-tip', function(tip, cb){
      Tips.create(tip, function(err, tips) {
        if(err) {  }
        if(!tips) {  }
        else {
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
            user.credits.units -= tips.amount;
            user.credits.history.push(history)

            console.log(user);

            user.save(function (err, userFrom){
              if(err) {  }
              if(!userFrom) {  }

              Users.findOne({slug: tips.to}, function (err, user){
                if(err) {  }
                if(!user) {  }
                user.credits.units += tips.amount;
                user.credits.history.push(history)
                user.save(function (err, user){
                  if(err) {  }
                  if(!user) {  }

                    cb(userFrom);
                });
              });
            });
          });
        }
      });
    });

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
      console.log('data: ', data);

      console.log('send mesage to room:' + data.to);

      socket.to(data.to).emit('send:message', {
        from: data.from,
        content: data.content,
        to: data.to
      });
    });

    socket.on('cam:status', function (data, cb) {
      console.log('cam:status: ', data);
      Users.findOne({slug: data.slug}, 'status username slug', function (err, user) {

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
              user.index = data.index; //send an index back to the client for updating
              cb(user);
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
