'use strict';

describe('Controller: ApiRunnerCtrl', function () {

  // load the controller's module
  beforeEach(module('baseApp'));

  var ApiRunnerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApiRunnerCtrl = $controller('ApiRunnerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
