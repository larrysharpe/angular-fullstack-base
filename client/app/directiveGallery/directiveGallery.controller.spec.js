'use strict';

describe('Controller: DirectiveGalleryCtrl', function () {

  // load the controller's module
  beforeEach(module('baseApp'));

  var DirectiveGalleryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DirectiveGalleryCtrl = $controller('DirectiveGalleryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
