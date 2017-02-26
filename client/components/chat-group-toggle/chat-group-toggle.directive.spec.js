'use strict';

describe('Directive: chatGroupToggle', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/chat-group-toggle/chat-group-toggle.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chat-group-toggle></chat-group-toggle>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chatGroupToggle directive');
  }));
});