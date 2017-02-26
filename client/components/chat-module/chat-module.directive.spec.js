'use strict';

describe('Directive: chatModule', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/chat-module/chat-module.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chat-module></chat-module>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chatModule directive');
  }));
});