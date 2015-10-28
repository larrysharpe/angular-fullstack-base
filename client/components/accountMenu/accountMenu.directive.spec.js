'use strict';

describe('Directive: accountMenu', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/accountMenu/accountMenu.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<account-menu></account-menu>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the accountMenu directive');
  }));
});