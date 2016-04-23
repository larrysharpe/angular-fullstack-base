'use strict';

var _ = require('lodash');
var Gallery = require('./gallery.model');

// Get list of gallerys
exports.index = function(req, res) {
  Gallery.find(function (err, gallerys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(gallerys);
  });
};

// Get a single gallery
exports.show = function(req, res) {
  Gallery.findById(req.params.id, function (err, gallery) {
    if(err) { return handleError(res, err); }
    if(!gallery) { return res.status(404).send('Not Found'); }
    return res.json(gallery);
  });
};

// Creates a new gallery in the DB.
exports.create = function(req, res) {
  Gallery.create(req.body, function(err, gallery) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(gallery);
  });
};

// Updates an existing gallery in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Gallery.findById(req.params.id, function (err, gallery) {
    if (err) { return handleError(res, err); }
    if(!gallery) { return res.status(404).send('Not Found'); }
    var updated = _.merge(gallery, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(gallery);
    });
  });
};

// Deletes a gallery from the DB.
exports.destroy = function(req, res) {
  Gallery.findById(req.params.id, function (err, gallery) {
    if(err) { return handleError(res, err); }
    if(!gallery) { return res.status(404).send('Not Found'); }
    gallery.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}