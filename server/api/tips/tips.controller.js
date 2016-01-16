'use strict';

var _ = require('lodash');
var Tips = require('./tips.model');
var Users = require('../user/user.model');

// Get list of tipss
exports.index = function(req, res) {
  Tips.find(function (err, tipss) {
    if(err) { return handleError(res, err); }
    return res.json(200, tipss);
  });
};

// Get a single tips
exports.show = function(req, res) {
  Tips.findById(req.params.id, function (err, tips) {
    if(err) { return handleError(res, err); }
    if(!tips) { return res.send(404); }
    return res.json(tips);
  });
};

// Creates a new tips in the DB.
exports.create = function(req, res) {
  Tips.create(req.body, function(err, tips) {
    if(err) { return handleError(res, err); }
    if(!tips) { return res.send(404); }
    else {
      var history = {
        cost: .10,
        category: 'tokens',
        item: 'Tipped Broadcaster',
        units: tips.amount,
        total: tips.amount *.10,
        to: tips.to,
        from: tips.from,
        rain: tips.rain || '',
        hideTip:  tips.hideTip || '',
        tipNote: tips.tipNote || ''
      };

      Users.findOne({slug: tips.from}, function (err, user){
        if(err) { return handleError(res, err); }
        if(!user) { return res.send(404); }
        user.credits.units -= tips.amount;
        user.credits.history.push(history)

        console.log(user);

        user.save(function (err, userFrom){
          if(err) { return handleError(res, err); }
          if(!userFrom) { return res.send(404); }

          Users.findOne({slug: tips.to}, function (err, user){
            if(err) { return handleError(res, err); }
            if(!user) { return res.send(404); }
            user.credits.units += tips.amount;
            user.credits.history.push(history)
            user.save(function (err, user){
              if(err) { return handleError(res, err); }
              if(!user) { return res.send(404); }
              return res.json(201, userFrom);

            });
          });

        });
      });

    }
  });
};

// Updates an existing tips in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Tips.findById(req.params.id, function (err, tips) {
    if (err) { return handleError(res, err); }
    if(!tips) { return res.send(404); }
    var updated = _.merge(tips, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, tips);
    });
  });
};

// Deletes a tips from the DB.
exports.destroy = function(req, res) {
  Tips.findById(req.params.id, function (err, tips) {
    if(err) { return handleError(res, err); }
    if(!tips) { return res.send(404); }
    tips.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
