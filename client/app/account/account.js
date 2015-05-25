'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('broadcasterSignup', {
        url: '/broadcasterSignup',
        templateUrl: 'app/account/signup/broadcasters.html',
        controller: 'SignupCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('login-help', {
        url: '/loginhelp',
        templateUrl: 'app/account/login/loginhelp.html',
        controller: 'LoginCtrl'
      })
      .state('login-help-reset', {
        url: '/loginhelp/:etoken',
        templateUrl: 'app/account/login/loginhelptoken.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/users.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('verify', {
        url: '/verify/:vtoken',
        templateUrl: 'app/account/login/verify.html',
        controller: 'LoginCtrl'
      });
  });
