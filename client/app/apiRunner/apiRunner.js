'use strict';

angular.module('baseApp')
  .config(function ($stateProvider) {

    var base = 'app/apiRunner/';
    var baseState = 'apiRunner';
    var controllerBase = 'ApiRunner';
    var endPointsBase = base + 'endpoints/';
    var endPointsList = [
      {slug: 'messages', name: 'Messages'},
      {slug: 'users', name: 'Users'},
      {slug: 'shows', name: 'Shows'}
    ];

    $stateProvider
      .state(baseState, {
        url: '/apiRunner',
        templateUrl: base + baseState +'.html',
        controller: 'ApiRunnerCtrl',
        resolve: {
        }
      });

    for (var i = 0; i < endPointsList.length; i++){
      $stateProvider.state(baseState + '.' + endPointsList[i].slug, {
        url: '/' + endPointsList[i].slug,
        templateUrl: endPointsBase + endPointsList[i].slug + '/' + endPointsList[i].slug +'.html',
        params: {
          title: endPointsList[i].name
        },
        page: baseState,
        controller: controllerBase + endPointsList[i].name + 'Ctrl'
      });
    }

  });
