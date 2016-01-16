'use strict';

describe('Directive: tipComponent', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/tipComponent/tipComponent.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tip-component></tip-component>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the tipComponent directive');
  }));
});