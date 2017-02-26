'use strict';

describe('Directive: chatRoomData', function () {

  // load the directive's module
  beforeEach(module('baseApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chat-room-data></chat-room-data>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the chatRoomData directive');
  }));
});