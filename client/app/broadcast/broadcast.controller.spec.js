'use strict';

describe('Controller: BroadcastCtrl', function () {

  // load the controller's module
  beforeEach(module('baseApp'));

  var BroadcastCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BroadcastCtrl = $controller('BroadcastCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
