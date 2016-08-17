/**
 * Socket.io configuration
 */

'use strict';
var Tips = require('../api/tips/tips.model');
var Messages = require('../api/message/message.model');
var Users = require('../api/user/user.model');
var Show = require('../api/show/show.model');
var config = require('./environment');

var pages_sockets = {};
var sockets_slugs = {};
var sockets_shows = {};

var socketsToUsers = {};
var usersToSockets = {};
var usersToRooms = {};
var roomsToUsers = {};

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


  var report = function(input){
    for(var i = 0; i < input.length; i++){
      console.log(input[i]);
    }
  }

  var userStats = {
    dates: '',
    guests: '',
    users: '',
    broadcasters: ''
  };

  var sendUserStats = function () {
    var rand  = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    var rand2 = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    var rand3 = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

    Users.count({roles: 'broadcaster', 'status.online':true}, function(err, users){
      userStats.broadcasters = rand;
      Users.count({roles: 'user', 'status.online':true}, function(err, users) {
        userStats.users = rand2;
        userStats.guests = rand3;
        userStats.dates = new Date();
        console.log('sendUserStats', userStats);
        socketio.emit('admin:userstats', userStats);
      });
    })
  }

  //var intervalSendUserStats = setInterval(sendUserStats,5000);


  socketio.on('connection', function (socket) {

    socket.connectedAt = new Date();

    var addr = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.address = addr;

    var sortOrderList = ['public','on call','vip','group','meter','goal','password','courtesy','private','offline'];

    var cleanup = {
      pages_sockets: function (id){
        if (sockets_slugs[id] && sockets_slugs[id].page && pages_sockets) {
          var oldPage = sockets_slugs[id].page;
          if (pages_sockets[oldPage] && pages_sockets[oldPage][id]) {
            delete pages_sockets[oldPage][id];
          }

          if (!Object.keys(pages_sockets[oldPage]).length) delete pages_sockets[oldPage];
        }
      },
      sockets_slugs: function (id){
        if (sockets_slugs && sockets_slugs[id]) delete sockets_slugs[id];
      },
      socket_rooms: function () {
        if(socket.currentRooms){
          var directRoom = socket.user.slug + '-direct';
          var pageRoom = socket.user.page + '-page';

          var rooms = socket.currentRooms;
          if (rooms[socket.id]) delete rooms[socket.id];
          if (rooms[directRoom]) delete rooms[directRoom];
          if (rooms[pageRoom]) delete rooms[pageRoom];

          for (var room in rooms) {
            if (rooms[room].emit) socket.to(room).emit('roomLeave', socket.user.slug);
            delete rooms[room];
          }
        }
      }
    }

    /**
     * Socket Listener Functions
     */

    /**
     * Disconnect
     * @param reason
     */
    var disconnect = function (reason) {
      //console.log('disconnecting ' + socket.id);

      cleanup.pages_sockets(socket.id);
      cleanup.sockets_slugs(socket.id);

      //console.log(socket.currentRooms );
      var rooms = socket.currentRooms;
    };

    /**
     * Init
     *
     * Called by the client everytime a they load or change a page.
     * This function tells sockets where every client is on the site, and what socket rooms they are in
     * Each client gets a direct room and a room based on the page they are on
     *
     * @param client
     * @param cb
     */
    var init = function (client, cb){

      console.log(client);

      cleanup.pages_sockets(socket.id);
      cleanup.socket_rooms(client)

      var clientObj = {
        username: client.user.username,
        slug: client.user.slug,
        socket_id: socket.id,
        page: client.page,
        show: client.show || null,
        loggedIn: client.loggedIn,
        broadcaster: client.broadcaster,
        isBroadcaster: client.isBroadcaster,
        time: new Date(),
        roles: client.roles
      };

      // add to sockets_slugs
      sockets_slugs[socket.id] = clientObj;

      if(!pages_sockets[client.page]) pages_sockets[client.page] = {};
      pages_sockets[client.page][socket.id] = clientObj;

      client.addr = socket.handshake.address;

      if (!client)cb(handleError(1001));
      else if (!client.user) cb(handleError(1002));
      else {
        var leaveRooms = [];

        //console.log('CLIENT', client);

        socket.user = {};
        if(client.user.slug) socket.user.slug = client.user.slug;
        if(client.user.username) socket.user.username = client.user.username;
        if(client.page) socket.user.page = client.page;
        if(client.loggedIn) socket.user.roles = client.roles;
        else socket.user.roles = 'guest';
        if (client.page === 'watch' || client.page === 'broadcast' && client.show) {
          socket.user.broadcaster = client.broadcaster;
          socket.user.show = client.show;
        }

        var directRoom = client.user.slug + '-direct';
        var pageRoom = client.page + '-page';

        if (!socket.currentRooms) socket.currentRooms = {};
        if (!socket.currentRooms[socket.id]) socket.currentRooms[socket.id] = {emit: false}; //socket room
        if (!socket.currentRooms[directRoom]) socket.currentRooms[directRoom] = {emit: false}; //slug direct room
        if (!socket.currentRooms[pageRoom]) socket.currentRooms[pageRoom] = {emit: false}; // page room

        if (client.roles) {
          for (var i = 0; i < client.roles.length; i++) {
            socket.currentRooms['all-role-' + client.roles[i]] = {emit: false};  // role rooms
          }
        }

        if (client.page === 'watch' || client.page === 'broadcast' && client.show) {
          var show = client.broadcaster + '-' + client.show;
          if (!sockets_shows[show]) sockets_shows[show] = {

          };
          sockets_shows[show][client.user.slug] = clientObj;
          socket.currentRooms[show] = {emit: true}; //show rooms
        }

        joinRooms(socket.currentRooms, client.user);
      }

    //  console.log('SOCKETS_SLUGS:', sockets_slugs);
    //  console.log('PAGES_SOCKETS:', pages_sockets);

    };

    var roomInit = function (data, cb) {

      //console.log('rOOMINIT',socket.user);

      console.log(sockets_shows);

      var roomsList = [];
      var lists = {
        sets: [],
        rooms: [],
        users: []
      };
      var rooms = {};

      var showDefault = function () {
        this.isActive = false;
        this.type= null;
        this.username= null;
        this.children= [];
        this.isOpen= false
      };

      for (var show in sockets_shows) {

          var showObj = sockets_shows[show];

          roomsList.push(show);
          var showRoom = new showDefault;
          showRoom.username = show;
          showRoom.type = 'group';

          for (var child in showObj) {
            var childObj = new showDefault;
            roomsList.push(child);
            childObj.username = child;
            childObj.type = 'user';
            showRoom.children.push(child);
            rooms[child] = childObj;
          }


          rooms[show] = showRoom;



      }

      //console.log('ROOM INIT:', roomList, data, socket.adapter.rooms);

      //var watchers = Object.keys(room);
/*
      for(var i = 0; i < watchers.length; i ++){
        var watcher = socketio.sockets.connected[watchers[i]].user;

        console.log('watcher: ', watcher);

        roomList.push(watcher);
      }
*/
      cb({roomsList:roomsList, rooms: rooms});
    };

    /**
     *
     * Utility Functions
     *
     */
    var broadcasterShowSort = function (a,b) {
      var c = sortOrderList.indexOf(a.status.show);
      var d = sortOrderList.indexOf(b.status.show);

      if (c < d) return -1;
      else if (c === d) return 0;
      else return 1;
    };
    var checkObj = function (err, users, cb) {
      if(err) cb(handleError(2001, err))
      else if (!users) cb(handleError(3001))
      else {
        cb(users)
      }
    }
    var handleError = function (errorNum, msg) {
      var errors = {
        1001: 'No data was provided to this method',
        1002: 'Your data contains no ID parameter',
        1003: 'Updating favorites requies either the add or remove parameter',
        2001: 'Schema validation error',
        3001: 'No results returned',
        4001: 'No user was prodvided to save',
        4002: 'No broadcaster was found',
        4003: 'No show was provided'
      };

      return {
        status: 'error',
        err: errors[errorNum],
        errNum: errorNum,
        msg: msg
      }
    };
    var handleSuccess = function (data){
      return {
        status: 'success',
        data: data
      }
    };
    var joinRooms = function (rooms, user) {
      for(var room in rooms){
        var r = rooms[room];
        socket.join(room);

        if (r.emit) socket.to(room).emit('roomJoin', user);
      }

    };

    var leavePage = function (rooms, client){
      for(var i = 0; i < rooms.length; i ++) {
        //console.log('Leave page: ', rooms[i], client);
        socket.leave(rooms[i].name);
        socket.to(rooms[i].name).emit('roomLeave', client);
      }
    };
    var saveUser = function (user, cb){
      if(!user) cb(handleError(4001))
      user.save(function(err,user){
        checkObj(err,user, function (users){
          cb(handleSuccess(users))
        })
      })
    };
    var setUserStatus = function (users, value, cb){

      console.log('setUserStatus: ', value, users);
      var slugs = [];
      for (var i = 0; i < users.length; i++){
        slugs.push(users[i].slug);
      }


      Users.update({slug: { $in: slugs }}, function(err,users) {

      });
    };

    var  listeners = {
      'stats:get': function (data,cb){
        //Users.aggregate({$group: {_id:'$roles', count: { $sum: 1}}}, function (err, result){
        //Users.aggregate({$group:{"_id": "$status.online", count: {$sum: 1}}}, function (err, result){
        //  if(err){
        //    cb({status: 'error', err: err});
        //  } else if (!result){
        //    cb({status: 'error', err: 'No Results'});
        //  } else {
        //    var stats = {};
        //
        //    for(var i = 0; i < result.length; i++){
        //      var label = result[i]._id;
        //      var count = result[i].count;
        //      stats[label] = count;
        //    }
        //
        //    cb({status: 'success', data: stats});
        //  }
        //})

        Users.find()

      },
      showJoin: function (data, cb){
        console.log('showJoin', data);
        Show.update({_id: data.show}, {$push: { users: data.user}}, function (err, show){
          checkObj(err, show, cb)
        })
      },
      showStop: function (data, cb){
        console.log('showStop');
        if (!data)cb(handleError(1001));
        else if (!data.show) cb(handleError(4003))
        else {
          Show.update({_id: data._id}, { $set: { status: 'ended', ended: new Date()} }, function(err, show){
            checkObj(err, show, function (show){
              if(show.status === 'error') cb(show)
              else {

                var statusObj = { availability: 'away', show: 'offline', online: 'true' };

                setUserStatus(data.broadcaster.slug, statusObj, function (user) {
                  console.log('set user status',user);
                  cb({status: 'success', user: user.data});
                })

              }
            });
          })
        }
      },
      showStart: function (data, cb){
        if (!data)cb(handleError(1001));
        else if (!data.show) cb(handleError(4003))
        else if (!data.broadcaster) cb(handleError(4002))
        else {

         var showObj = data;
         var statusObj = {show: data.show, online: true, availability: 'busy'};

         if(['public', 'group', 'meter', 'password', 'courtesy', 'goal'].indexOf(data.show) > -1){
           statusObj.availability = 'online';
         }

          showObj.status = 'started';
          showObj.started = new Date();
          var newShow = new Show(data);
          newShow.save(function(err,show) {
            checkObj(err, show, function (show) {
              if (show.status === 'error') cb(show);
              else {
                setUserStatus(data.broadcaster.slug, statusObj, function (user) {
                  cb({status: 'success', show: show, user: user.data});
                });
              }
            });

          })


        }
      },
      getSocket: function (data,cb) {
        for(var prop in socket) {
          console.log(prop);
          for(var child in socket[prop]){
            console.log('--',child)
          }
        }
        cb(socket.id);
      },
      disconnect: disconnect,
      faveUpdate: function (data, cb) {
        var i, self;
        self = data;

        if(!data) cb(handleError(1001));
        else if(!data._id) cb(handleError(1002));
        else if (!data.add && !data.remove) cb(handleError(1003));
        else {

          /* Find user */
          Users.findOne({_id: data._id}, 'faves', function (err, users){

            /* validate user and perform necessary operations on it */
            checkObj(err, users, function(user){

              /* if error send to callback */
              if(user.status === 'error') cb(user);
              else {

                /* if faves are being removed */
                if (self.remove) {
                  /* splice any unneeded faves */
                  for (i = 0; i < self.remove.length; i++) {
                    index = user.faves.indexOf(self.remove[i]);
                    if (index > -1) user.faves.splice(index, 1);
                  }
                }

                /* If faves are being added */
                if(self.add){
                  for (i = 0; i < self.add.length; i++) {
                    var index = user.faves.indexOf(self.add[i]);
                    if (index === -1) user.faves.push(self.add[i]);
                  }
                }

                /* save and send results to call back */
                saveUser(users, cb);
              }

            });
          });

        }
      },
      init: init,
      roomInit: roomInit,
      'getSocketStats':    function (data, cb) {
        var obj = {
          socketsToUsers:socketsToUsers,
          usersToSockets:usersToSockets,
          usersToRooms:usersToRooms,
          roomsToUsers:roomsToUsers
        };

        cb(obj);
      },
      'broadcasters:get': function (data, cb) {

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

            /*
             console.log('online faves: ',onlineFaves.length);
             console.log('online: ',online.length);
             console.log('offline faves: ',offlineFaves.length);
             console.log('offline: ',offline.length);
             */


            onlineFaves.sort(broadcasterShowSort);
            online.sort(broadcasterShowSort);

            var broadcasterList = onlineFaves.concat(online).concat(offlineFaves).concat(offline);

            cb({status: 'success', broadcasters: broadcasterList});
          }
        });
      },
      'message:send': function (data, cb) {
        var msg = {
          from: data.from,
          content: data.content,
          to: data.to,
          type: 'message'
        };

        Messages.create(msg, function(err, msg){
          if(err) {
            cb({error: err});
          } else if(!msg) {
            cb({error: 'Message not created'});
          } else {
            socket.to(data.to).emit('message:rcv', msg);
            cb(msg);
          }

        });
      },
      'privatemessage:send': function (data, cb) {
        console.log('receiving private message', data);
        Messages.create(data, function(err, msg){
          if(err) cb({error: err});
          if(!msg) cb({error: 'Message not created'});
          socket.to(data.to).emit('privatemessage:rcv', data);
          cb(data);
        });
      },
      'show:request:send': function (data, cb) {
        data.broadcaster.room = data.broadcaster.slug + '-direct';
        console.log('handle show request', data);
        var newShow = new Show(data);
        newShow.save(function(err,show){
          if(err) { cb({error: err}); }
          else if (!show){ cb({error: 'Show Not Found'}); }
          else {
            console.log('handle show request returned', data);
            socket.to(data.broadcaster.room).emit('show:request:rcv', [show]);
            cb({status: 'success', show: show});
          }
        });
      },
      'show:requestAccepted:send': function (d, cb){
          console.log('handleAcceptShowRequest', d);

          d.requestor.room = d.requestor.slug + '-direct';

          Show.findById(d._id, function(err, show) {
            if (err) {
              cb({err: err, status: 'error'});
              console.log('handleAcceptShowRequest error', err);
            }
            else if (!show) {
              cb({err: 'show not found', status: 'error'});
              console.log('handleAcceptShowRequest error', 'show not created');
            }
            else {

              show.status = 'accepted';
              show.started = new Date();

              console.log('saving the show', show);
              show.save(function (err, show) {
                if (err) {
                  cb({err: err, status: 'error'});
                }
                else if (!show) {
                  cb({err: 'show not found', status: 'error'});
                }
                else {

                  var broadcasterStatusObj = {online: true, availability: 'busy', show: d.show};

                  console.log('show saved setting statuses', broadcasterStatusObj);
                  setUserStatus(d.broadcaster.slug, broadcasterStatusObj, cb);
                  setUserStatus(d.requestor.slug, broadcasterStatusObj);


                  socket.to(d.requestor.room).emit('show:requestAccepted:rcv', d);

                }
              });
            }
          });
        },
      'status:change': function (data, cb) {
        console.log('status changing', data);
        setUserStatus(data, data[0].status, cb);
      },
      'statusUpdate': function (data, cb){
        console.log('Status Update: ', data);
      },
      'tip:send':  function(tip, cb){

      console.log('HandleTipSend');

      var _tmpTip = tip;
      var room = tip.to + '_public';
      Tips.create(tip, function(err, tips) {
        if(err) {
          console.log('Tip Error', err);
        }
        if(!tips) {
          console.log('Tip Error', 'Tip Not Created');
        }
        else {
          var room = tips.to + '-public';
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

                        console.log('sending tip: ',room,_tmpMsg);
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
    };

    /* iterate through the listener object to create socket listeners */
    for (var key in listeners) socket.on(key, listeners[key]);


  });
};

