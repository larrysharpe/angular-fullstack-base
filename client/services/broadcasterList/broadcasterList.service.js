'use strict';

angular.module('baseApp')
  .service('broadcasterListSVC', function ($http, $q, Auth) {
    // AngularJS will instantiate a singleton by calling "new" on this function

      var deferred = $q.defer();

      return {
        get: function (type) {

          var url = '/api/users/broadcasters/',
              usr = Auth.getCurrentUser()._id;

          if (type) url += type;

          if (type === 'favorites' && usr) {
            url += '?_id=' + usr;
          }

          return $http.get( url )
          .success(function(data){
            return data;
          });

        }
      }

  });
