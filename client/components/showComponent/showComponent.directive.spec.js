'use strict';

describe('Directive: showComponent', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/showComponent/showComponent.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<show-component></show-component>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the showComponent directive');
  }));
});