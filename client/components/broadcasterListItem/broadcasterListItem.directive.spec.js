'use strict';

describe('Directive: broadcasterListItem', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/broadcasterListItem/broadcasterListItem.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<broadcaster-list-item></broadcaster-list-item>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the broadcasterListItem directive');
  }));
});