'use strict';

describe('Directive: scrollToBottom', function () {

  // load the directive's module
  beforeEach(module('baseApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<scroll-to-bottom></scroll-to-bottom>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the scrollToBottom directive');
  }));
});