'use strict';

var app = require('../..');
import request from 'supertest';

describe('Show API:', function() {

  describe('GET /api/shows', function() {
    var shows;

    beforeEach(function(done) {
      request(app)
        .get('/api/shows')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          shows = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      shows.should.be.instanceOf(Array);
    });

  });

});
