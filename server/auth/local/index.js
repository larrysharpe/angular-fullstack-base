'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var History = require('../../api/history/history.model');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
    user.lastLogin = new Date();
    user.save(function (err, user){

      if (err) return res.json(401, err);
      if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

      console.log(user)

      var roleSign = user.roles.join('');

      if(err)  {
        res.send(500);
      } else {
        var resObj = user;
        var token = auth.signToken(user._id, roleSign);
        var query = {'user': user._id};
        var update = {$push: {"logins": new Date()}};
        History.findOneAndUpdate(query, update, {upsert:true}, function(err, doc){
          if (err) return res.send(500, { error: err });
          res.json({user: resObj, token: token});
        });
      }
    });
  })(req, res, next)
});

module.exports = router;
