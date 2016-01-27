'use strict';

describe('Directive: privateChat', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/privateChat/privateChat.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<private-chat></private-chat>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the privateChat directive');
  }));
});
