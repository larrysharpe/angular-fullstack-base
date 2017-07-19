'use strict';

angular.module('baseApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ngFlash',
  'checklist-model',
  'swfobject'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, Alert, $cookieStore) {

    Auth.isLoggedInAsync(function(loggedIn) {
      if(loggedIn){
        var emailVerified = Auth.getCurrentUser().emailVerified;
        if (!emailVerified){
          Alert.open('emailVerification');
        }
      }
    });

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
        else if(loggedIn) {
            var emailVerificationResent = $cookieStore.get('email-verification-resent');
            if(emailVerificationResent) {
              $cookieStore.remove('email-verification-resent');
              Alert.closeAll();
              Alert.open('emailVerificationResent');
            }
        }
      });
    });
  });
