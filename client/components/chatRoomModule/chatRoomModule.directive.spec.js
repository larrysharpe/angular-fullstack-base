'use strict';

describe('Directive: chatRoomModule', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/chatRoomModule/chatRoomModule.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chat-room-module></chat-room-module>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chatRoomModule directive');
  }));
});