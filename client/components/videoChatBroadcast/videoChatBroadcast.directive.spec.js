'use strict';

describe('Directive: videoChatBroadcast', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/videoChatBroadcast/videoChatBroadcast.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<video-chat-broadcast></video-chat-broadcast>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the videoChatBroadcast directive');
  }));
});