'use strict';

angular.module('baseApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q, $window) {
    var currentUser = {};
    var reload = function(data) {
      $cookieStore.put('guest-token', data.token);
      $window.location.reload();
  };

    var createGuest = function () {
      console.log('User not logged in. Set guest cookie.');
      $http.post('/api/guests')
        .success(reload);
    };
    var loadGuest = function () {
      console.log('guest user found');
      $http.get('/api/guests/' + $cookieStore.get('guest-token'))
        .success(getGuest)
    };

    var getGuest = function(data){
      currentUser = {
        username: 'Guest ' + data.guestNo
      };
      deferred.resolve(data);
      console.log('user created');
    };
    var deferred = $q.defer();

    if($cookieStore.get('token'))  currentUser = User.get();
    else if ($cookieStore.get('guest-token')) loadGuest();
    else createGuest();


    return {
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.remove('guest-token');
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      refreshUser: function() {
        currentUser = User.get();
      },


      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
        if (!$cookieStore.get('guest-token')) {
          createGuest();
          $window.location.reload();
        }
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      setFaves: function (faves) {
        currentUser.faves = faves;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('roles');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('roles')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       * @param {String|[String]} roles - role to be looked up
       * @return {Boolean}
       */
      hasRole: function (roles) {
        if(!currentUser || !currentUser.roles) return false;
        if(!roles) return false;
        if(Array.isArray(roles)){
          for (var i = 0; i<roles.length;i++){
            if(currentUser.roles.indexOf(roles[i]) > -1){
              return true;
            }
          }
          return false;
        } else {
          return currentUser.roles.indexOf(roles) > -1;
        }
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
