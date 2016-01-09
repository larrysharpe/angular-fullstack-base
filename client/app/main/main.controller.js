'use strict';

angular.module('baseApp')

  .controller('MainCtrl', function ($scope, Auth, ngToast) {
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn= Auth.isLoggedIn();


    var onlineToast = '<a href="/watch/beyonce">Beyonce</a> is in Public.';



    ngToast.success({
      content: onlineToast
    });

    ngToast.warning({
      content: 'Hello World'
    });

    ngToast.danger({
      content: 'Hello World'
    });


  });
