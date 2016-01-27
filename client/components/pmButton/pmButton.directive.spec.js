'use strict';

describe('Directive: pmButton', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/pmButton/pmButton.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pm-button></pm-button>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the pmButton directive');
  }));
});