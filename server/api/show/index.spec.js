'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var showCtrlStub = {
  index: 'showCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var showIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './show.controller': showCtrlStub
});

describe('Show API Router:', function() {

  it('should return an express router instance', function() {
    showIndex.should.equal(routerStub);
  });

  describe('GET /api/shows', function() {

    it('should route to show.controller.index', function() {
      routerStub.get
        .withArgs('/', 'showCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
