'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();



var handleUserLogin = function (err,user){

}


router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
    var roleSign = user.roles.join('');
    var token = auth.signToken(user._id, roleSign);

    user.lastLogin = new Date();

    user.save(function (err, user){
              if(err)  {
                  res.send(500);
               } else {
                var resObj = {
                  token: token,
                  roles: user.roles
                }
               res.json(resObj);
              }
         });

  })(req, res, next)
});

module.exports = router;
