'use strict';

angular.module('baseApp')
  .controller('AppCtrl', function ($scope, socket, ngToast, Auth, $stateParams) {
    var broadcasterPublic = function (data){
      var onlineToast = '<a href="/watch/'+data.slug+'">'+data.username+'</a> is in Public.';

      ngToast.success({
        content: onlineToast
      });
    };

    var broadcasterOffline = function (data){
      var onlineToast = '<a href="/watch/'+data.slug+'">'+data.username+'</a> went offline.';

      ngToast.danger({
        content: onlineToast
      });
    };

    socket.on('broadcaster:status:public', broadcasterPublic );
    socket.on('broadcaster:status:offline', broadcasterOffline );
  });
