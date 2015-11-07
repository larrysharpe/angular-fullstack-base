'use strict';

var _ = require('lodash');
var Guest = require('./guest.model');
var auth = require('../../auth/auth.service');
var guests =  {};
var guestIndex = 1;


// Get list of guests
exports.index = function(req, res) {
  Guest.find(function (err, guests) {
    if(err) { return handleError(res, err); }
    return res.json(200, guests);
  });
};

// Get a single guest
exports.show = function(req, res) {
  Guest.findOne({token: req.params.token}, function (err, guest) {
    if(err) { return handleError(res, err); }
    if(!guest) { return res.send(404); }
    return res.json(guest);
  });
};

// Creates a new guest in the DB.
exports.create = function(req, res) {

  var resObj = {
    token: auth.signToken(guestIndex, 'guest'),
    guestNo: guestIndex
  };
  guestIndex++;

  Guest.create(resObj, function(err, guest) {
    if(err) { return handleError(res, err); }
    return res.json(201, guest);
  });
};

// Updates an existing guest in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Guest.findById(req.params.id, function (err, guest) {
    if (err) { return handleError(res, err); }
    if(!guest) { return res.send(404); }
    var updated = _.merge(guest, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, guest);
    });
  });
};

// Deletes a guest from the DB.
exports.destroy = function(req, res) {
  Guest.findById(req.params.id, function (err, guest) {
    if(err) { return handleError(res, err); }
    if(!guest) { return res.send(404); }
    guest.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
