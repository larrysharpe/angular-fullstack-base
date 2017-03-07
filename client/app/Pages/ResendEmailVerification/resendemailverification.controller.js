'use strict';

angular.module('baseApp')
  .controller('ResendEmailVerificationCtrl', function ($scope, Auth, $cookieStore, $http, $window) {
    var user = Auth.getCurrentUser();
    var url = '/api/users/resendEmailVerification/' + user.email;

    var handleSuccess = function (res){
      console.log('SUCCESS: ', res);
      if (res.status === 200) {
        $cookieStore.put('email-verification-resent', true);
        $window.history.back();
      }
    }

    var handleFail = function (res){
      console.log('FAIL: ', d);
    }

    $http.get(url).then(handleSuccess, handleFail);
  });
