'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {


    var base = 'app/directiveGallery/';
    var directivesBase = base + 'directives/';
    var directivesList = [
      {slug: 'broadcasterChat', name: 'Broadcaster Chat'},
      {slug: 'roomChatBox', name: 'Room Chat Box'},
      {slug: 'roomUserList', name: 'Room User List'}
    ];

    $stateProvider
      .state('directiveGallery', {
        url: '/directiveGallery',
        templateUrl: base + 'directiveGallery.html',
        controller: 'DirectiveGalleryCtrl',
        resolve: {
        }
      });

    for (var i = 0; i < directivesList.length; i++){
      $stateProvider.state('directiveGallery.' + directivesList[i].slug, {
        url: '/' + directivesList[i].slug,
        templateUrl: directivesBase + directivesList[i].slug + '/' + directivesList[i].slug +'.html',
        params: {
          title: directivesList[i].name
        },
        page: 'directiveGallery'
      });
    }

  });
