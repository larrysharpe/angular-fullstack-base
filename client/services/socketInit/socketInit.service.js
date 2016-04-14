'use strict';

angular.module('baseApp')
  .service('socketInit', function (socket, $state, $cookieStore) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var initObj = {
      page: '',
      room: '',
      remove: '',
      user: {
        slug: '',
        username: '',
        loggedIn: false
      }
    };

    this.run = function (cb, user){

      var slug = ($state.params.slug) ? $state.params.slug.toLowerCase() : '';

      initObj.page = $state.current.name;

      if (user.slug) initObj.user.slug = user.slug;
      if (user.username) initObj.user.username = user.username;
      if (user.roles) initObj.user.loggedIn =  true;
      if (slug && $state.current.room){
        initObj.room = slug + '-' + $state.current.room;
      } else {
        initObj.room = '';
      }

      /* Removes guest users from server after a user logs in */
      if ($cookieStore.get('removeUser')) {
        initObj.remove = $cookieStore.get('removeUser');
        $cookieStore.remove('removeUser');
      }

      socket.emit('init', initObj, cb);

    }

  });
