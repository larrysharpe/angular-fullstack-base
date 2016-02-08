/**
 * Socket.io configuration
 */

'use strict';
var Tips = require('../api/tips/tips.model');
var Messages = require('../api/message/message.model');
var Users = require('../api/user/user.model');
var Show = require('../api/show/show.model');
var config = require('./environment');
var socketsToUsers = {};
var usersToSockets = {};

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


  var setUserStatus = function (user, type, value){
    Users.findOne({slug: user}, function(err,user){
      if(err) console.log('Errors: ', err);
      else if(!user) console.log('USer not Found: ', user);
      else {
        if(type === '*'){
          user.status = value;
        } else {
          user.status[type] = value;
        }
        user.save(function(err,user){
          if(err) console.log('Errors: ', err);
          else if(!user) console.log('USer not Found: ', user);
          else {
            //onsole.log('User Saved', user);
          }
        });
      };
    });
  }

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    var connectClient = function (data){
      var userSocketIndex;
      if (!data){
        console.log('Init Data Not Found');
      } else if (!data.user){
        console.log('Init User Data Not Found');
      } else {
        socket.user = data.user;
/*

        console.log('SOCKET CONNECT INFO:')
        console.log('socket user:', socket.user);
        console.log('data:', data);
        console.log('sockets to users:',socketsToUsers);
        console.log('---------------------');
        console.log('usersToSockets:',usersToSockets);
*/


        if(socketsToUsers[socket.id]){
          //console.log('Socket Found Already:', socketsToUsers[socket.id]);
          var userId = socketsToUsers[socket.id].slug;
          if(usersToSockets[userId]){
            //console.log('User to Socket Found Already:', usersToSockets[userId]);
            delete usersToSockets[userId];
          }
        }

        /* store socket to user */
        socketsToUsers[socket.id] = data.user;
        /* store user to socket */
        // check for user and create if missing
        if (!usersToSockets[data.user.slug]) usersToSockets[data.user.slug] = [];
        // check for the socket
        userSocketIndex = usersToSockets[data.user.slug].indexOf(socket.id);
        // push socket to user
        if(userSocketIndex === -1) usersToSockets[data.user.slug].push(socket.id);

        /*
        console.log('Connect Info:')
        console.log('socketsToUsers:',socketsToUsers);
        console.log('usersToSockets:',usersToSockets);
        */

        if(data.room) {
          socket.join(data.room);
          //console.log(data.user.slug, 'Joined Room:', data.room);
        }
        socket.join(data.user.slug + '_direct');
        //console.log(data.user.slug, 'Joined Room:', data.user.slug + '_direct');

        setUserStatus(data.user.slug, 'online', true);
      }
    };
    var disconnectClient = function () {
      var userSocketIndex;
/*
      console.log('Disconnect Client: ',socket.id);
      console.log('Disconnect Client User: ',socket.user);
      console.log('Socks: ',socketsToUsers);
      console.log('Users: ',usersToSockets);
*/


      if (socketsToUsers[socket.id]) delete socketsToUsers[socket.id];
      if (socket.user && usersToSockets[socket.user.slug]) {
        userSocketIndex = usersToSockets[socket.user.slug].indexOf(socket.id);
        if (userSocketIndex > -1) usersToSockets[socket.user.slug].splice(userSocketIndex, 1);
        if (!usersToSockets[socket.user.slug].length) {
          delete usersToSockets[socket.user.slug];
          setUserStatus(socket.user.slug, '*', {online: false, availability: 'offline', show: 'offline'});
        }
      };

      /*
      console.log('Disconnect Info:')
      console.log('socketsToUsers:',socketsToUsers);
      console.log('usersToSockets:',usersToSockets);
      */


    };
    var handleMessageSend = function (data, cb) {
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
      });
    }
    var handlePrivateMessageSend = function (data, cb) {
      console.log('receiving private message', data);
      Messages.create(data, function(err, msg){
        if(err) cb({error: err});
        if(!msg) cb({error: 'Message not created'});
        socket.to(data.to).emit('privatemessage:rcv', data);
        cb(data);
      });
    }
    var handleShowRequest = function (data, cb) {
      data.broadcaster.room = data.broadcaster.slug + '_direct';
      console.log('handle show request', data);
      var newShow = new Show(data);
      newShow.save(function(err,show){
        if(err) { cb({error: err}); }
        else if (!show){ cb({error: 'Show Not Found'}); }
        else {
          socket.to(data.broadcaster.room).emit('show:request:rcv', [show]);
          cb({status: 'success', show: show});
        }
      });
    };
    var handleShowRequestAccepted = function (d, cb){
      d.requestor.room = d.requestor.slug + '_direct';

      Show.findById(d._id, function(err, show){
        if(err) { cb({err: err, status: 'error'}); }
        else if (!show) { cb({ err: 'show not found', status: 'error' }); }
        else {

          show.status = 'accepted';
          show.started = new Date();

          show.save(function(err,show){
            if(err) { cb({err: err, status: 'error'}); }
            else if (!show) { cb({ err: 'show not found', status: 'error' }); }
            else {
              Users.findOne({slug: d.broadcaster.slug}, function(err, user){
                if(err) { cb({err: err, status: 'error'}); }
                else if (!user) { cb({ err: 'user not found', status: 'error' }); }
                else {
                  console.log('my user:', d)
                  user.status.show = d.show.toLowerCase();
                  user.save(function (err, user){
                    if(err) { cb({err: err, status: 'error'}); }
                    else if (!user) { cb({ err: 'user not saved', status: 'error' }); }
                    else {

                      console.log('######## user saved', user)

                      socket.to(d.requestor.room).emit('show:requestAccepted:rcv',d);
                      cb({status: 'success', show: show.show})
                    }
                  })
                }
              })
            }
          })
        }
      })
    };
    var handleStatusChange = function (data, cb) {
      Users.findOne({slug: data.slug}, function (err, user) {
        if(err) { cb({error: err}); }
        else if (!user){ cb({error: 'User Not Found'}); }
        else {
          if (data.status.show) user.status.show = data.status.show;
          if (data.status.availability) user.status.availability = data.status.availability;
          if (data.status.online) user.status.online = data.status.online;
          user.save(function (err, user) {
            if (err) cb({error: err});
            else if (!user) cb({error: 'User Not Saved'});
            else {
              console.log(user.slug + 'status changed to: ', user.status);
              socket.broadcast.emit('status:change', user);
              cb({user: user, index: data.index} );
            }
          })
        }
      });
    };
    var handleTipSend = function(tip, cb){
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
    }

    var sortOrderList = ['public','on call','vip','group','meter','goal','password','courtesy','private','offline'];
    var broadcasterShowSort = function (a,b) {
      var c = sortOrderList.indexOf(a.status.show);
      var d = sortOrderList.indexOf(b.status.show);

      if (c < d) return -1;
      else if (c === d) return 0;
      else return 1;
    };

    var broadcasterNameSort = function (a,b){
      var c = a.slug.toLowerCase();
      var d = b.slug.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    }

    var handleGetBroadcasters = function (data, cb) {

      var onlineFaves = [];
      var online = [];
      var offlineFaves = [];
      var offline = [];
      var faves = [];
      var i = 0;

      if (data.roles && data.faves.length){
        for(i; i < data.faves.length; i++){
          faves.push(data.faves[i]);
        }
      }

      Users.find({roles: 'broadcaster'}, 'slug username status', function(err, broadcasters){
        if (err) { cb({status: 'error', err: err}); }
        else if(!broadcasters) { cb({status: 'error', err: 'Broadcasters Not Foud'}); }
        else {

          for (i = 0; i < broadcasters.length; i++){
            var isFave = faves.indexOf(String(broadcasters[i]._id));
            if (faves.length && isFave > -1){
              if(broadcasters[i].status.online) onlineFaves.push(broadcasters[i]);
              else offlineFaves.push(broadcasters[i]);
              faves.splice(isFave,1);
            }
            else if(broadcasters[i].status.online) online.push(broadcasters[i]);
            else offline.push(broadcasters[i]);
          }


          console.log('online faves: ',onlineFaves.length);
          console.log('online: ',online.length);
          console.log('offline faves: ',offlineFaves.length);
          console.log('offline: ',offline.length);


          onlineFaves.sort(broadcasterShowSort);
          online.sort(broadcasterShowSort);

          var broadcasterList = onlineFaves.concat(online).concat(offlineFaves).concat(offline);

          cb({status: 'success', broadcasters: broadcasterList});
        }
      });
    }

    var setFave = function (data, cb) {

      Users.findOne({_id: data._id},'faves', function (err, user){
        if (err) { cb({status: 'error', err: err}); }
        else if(!user) { cb({status: 'error', err: 'User Not Found'}); }
        else {
          var i;
          for (i = 0; i < data.faves.length; i++) {
            var index = user.faves.indexOf(data.faves[i]);
            if (index === -1) user.faves.push(data.faves[i]);
          }

          user.save(function (err, user) {
            if (err) { cb({status: 'error', err: err}); }
            else if(!user) { cb({status: 'error', err: 'User Not Found'}); }
            else {
              cb({status: 'success', faves:user.faves});
            }
          });
        }
      })
    }

    var unsetFave = function (data, cb) {
      Users.findOne({_id: data._id, faves: {$in: data.faves}}, 'faves', function (err, user){
        if (err) { cb({status: 'error', err: err}); }
        else if(!user) { cb({status: 'error', err: 'User Not Found'}); }
        else {
          var i;
          for (i = 0; i < data.faves.length; i++) {
            var index = user.faves.indexOf(data.faves[i]);
            if (index > -1) user.faves.splice(index, 1);
          }
          user.save(function (err, user) {
            if (err) { cb({status: 'error', err: err}); }
            else if(!user) { cb({status: 'error', err: 'User Not Found'}); }
            else {
              cb({status: 'success', faves:user.faves});
            }
          });
        }
      })
    }

    socket.on('broadcasters:get', handleGetBroadcasters)
    socket.on('disconnect', disconnectClient);
    socket.on('init', connectClient);
    socket.on('message:send', handleMessageSend);
    socket.on('privatemessage:send', handlePrivateMessageSend);
    socket.on('show:request:send', handleShowRequest);
    socket.on('show:requestAccepted:send',handleShowRequestAccepted);
    socket.on('status:change', handleStatusChange);
    socket.on('tip:send', handleTipSend);
    socket.on('fave:set', setFave);
    socket.on('fave:unset', unsetFave);

  });
};
