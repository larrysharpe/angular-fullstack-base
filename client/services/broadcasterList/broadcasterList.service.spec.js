'use strict';

describe('Service: broadcasterList', function () {

  // load the service's module
  beforeEach(module('baseApp'));

  // instantiate service
  var broadcasterList;
  beforeEach(inject(function (_broadcasterList_) {
    broadcasterList = _broadcasterList_;
  }));

  it('should do something', function () {
    expect(!!broadcasterList).toBe(true);
  });

});
