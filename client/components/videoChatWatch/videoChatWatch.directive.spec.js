'use strict';

describe('Directive: videoChatWatch', function () {

  // load the directive's module and view
  beforeEach(module('baseApp'));
  beforeEach(module('components/videoChatWatch/videoChatWatch.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<video-chat-watch></video-chat-watch>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the videoChatWatch directive');
  }));
});