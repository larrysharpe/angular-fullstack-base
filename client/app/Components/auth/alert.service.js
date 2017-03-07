'use strict';

angular.module('baseApp')
  .factory('Alert', function Auth($location, $rootScope, $http, User, $cookieStore, $q, Flash) {

    var alert = {
      emailVerification: {
        type: 'warning',
        content: 'Your Email Is Not Verified! <a href="/resendemailverification">Resend Verification</a>',
        duration: 0,
        attributes: {class: 'custom-class', id: 'custom-id'},
        showClose: true
      },
      emailVerificationResent: {
        type: 'warning',
        content: 'Your Email Is Not Verified! <span class="text-success">We just sent another verification.</span> <a href="/resendemailverification">Resend Verification</a>',
        duration: 0,
        attributes: {class: 'custom-class', id: 'custom-id'},
        showClose: true
      }
    };

    var openAlerts = [];

    return {

      open: function (alertName) {
        var a = alert[alertName];
        return Flash.create(a.type, a.content, a.duration, a.attributes, a.showClose);
      },

      close: function (id){
        Flash.dismiss(id);
      },

      closeAll: function () {
        Flash.clear();
      }


    }

  });
