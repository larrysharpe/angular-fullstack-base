'use strict';

describe('Service: chatRoomSvc', function () {

  // load the service's module
  beforeEach(module('baseApp'));

  // instantiate service
  var chatRoomSvc;
  beforeEach(inject(function (_chatRoomSvc_) {
    chatRoomSvc = _chatRoomSvc_;
  }));

  it('should do something', function () {
    expect(!!chatRoomSvc).toBe(true);
  });

});
