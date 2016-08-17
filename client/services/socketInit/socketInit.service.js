'use strict';

angular.module('baseApp')
  .service('socketInit', function (socket, $state, $cookieStore, Auth) {
    // AngularJS will instantiate a singleton by calling "new" on this function


    var initObj = {
      page: '',
      user: {
        slug: '',
        username: ''
      },
      loggedIn: false
    };


    this.exec = function (cb){

      var client = Auth.getCurrentUser();

      initObj.page = $state.current.page;
      if ($state.current.show) initObj.show = $state.current.show;
      if ($state.current.page === 'watch') initObj.broadcaster = $state.params.slug;
      else if ($state.current.page === 'broadcast') {
        initObj.isBroadcaster = true;
        initObj.broadcaster = client.slug;
      }

      if (client.slug) initObj.user.slug = client.slug;
      if (client.username) initObj.user.username = client.username;
      if (client.roles) {
        initObj.loggedIn = true;
        initObj.roles = client.roles
      }

      socket.emit('init', initObj, cb);

    }

  });
