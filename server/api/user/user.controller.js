'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

var makeRandomString = function (length){
  if(!length) length = 5;
  var text = "",
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);

  if(req.body.joinAs === 'broadcaster') {
    newUser.roles.push('broadcaster');
    newUser.accounts.push({});
  }

  newUser.provider = 'local';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};
exports.createByAdmin = function (req, res, next) {

  var newUser = new User(req.body);
  newUser.provider = 'local';

  if(!req.body.requireValidation){
    newUser.emailVerified = true;
    newUser.emailVerificationToken = undefined;
  }

  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    res.json({ user: user.adminProfile });
  });
};

exports.editByAdmin = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);


    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.roles) user.roles = req.body.roles;

    if(!req.body.requireValidation){
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
    }

    user.save(function(err, user){
      if (err) return next(err);
      if (!user) return res.send(401);
      res.json(user);
    });
  });
}

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    if (req.params.admin){
      res.json(user);
    } else {
      res.json(user.profile);
    }
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changepassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.changeusername = function(req, res, next) {
  var userId = req.user._id;
  var username = String(req.body.username);

  User.findById(userId, function (err, user) {
    if(user) {
      user.username = username;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.changeemail = function(req, res, next) {
  var userId = req.user._id;
  var email = String(req.body.email);

  User.findById(userId, function (err, user) {
    if(user) {
      //set new email
      user.email = email;
      //set email verified to false
      user.emailVerified = false;
      //create new verification token
      user.emailVerificationToken = makeRandomString(16);
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};


/**
 * Reset password
 * @param req
 * @param res
 * @returns {*}
 */
exports.accountHelp = function (req, res) {
  if  (!req.body.email) return res.json(422, 'no email address');
  User.findOne({email: req.body.email}, function(err, user) {
    if (user) {
      var resetToken = makeRandomString(16);
      user.resetToken = {token: resetToken, date: Date.now()};
      user.save();
      res.json({resetToken: resetToken, url: '/api/users/reset', full: '/api/users/reset/' + resetToken});
    } else {
      res.json({resetError: 'Could not find user.'})
    }
  });
}

exports.resetToken = function (req, res, next){
  if  (!req.params.token) return res.json(422, 'no token');
  User.findOne({'resetToken.token': req.params.token}, function (err, user){
    if(user){
      var hrsSinceToken = ( Date.now() - user.resetToken.date)/(100*60*60);
      var isExpired = hrsSinceToken > 24;
      if (isExpired) return res.json(422, 'token is expired');
      else return res.json(200, {token: user.resetToken.token, id: user._id});
    } else {
      return res.json(422, 'token not valid');
    }
  });
}

exports.emailVerificationToken = function (req, res, next){
  if (!req.params.token) return res.json(422, 'no token provided');
  var qry = {emailVerificationToken: req.params.token};
  User.findOne(qry, function (err, user){
    if (user){
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.save(function(err){
        res.send(200, {message: 'Email Verified'});
      });
    } else {
      return res.json(422, 'token not valid');
    }
  });
}

exports.resendEmailVerification = function (req, res, next) {
  var qry = {email: req.params.email};
  User.findOne(qry, function (err, user){
    if (user){
      user.emailVerified = false;
      user.emailVerificationToken = makeRandomString(16);
      user.save(function(err){
        res.send(200, {message: 'Verification Sent'});
      });
    } else {
      return res.json(422, 'email not valid');
    }
  });
}

exports.changePasswordReset = function (req, res, next){
  if (!req.body.password) return res.json(422, 'no password provided');
  User.findOne({'resetToken.token': req.params.token}, function (err, user){
    if(user){
      var hrsSinceToken = (Date.now() - user.resetToken.date)/(100*60*60);
      var isExpired = hrsSinceToken > 24;
      if (isExpired) return res.json(422, 'token is expired');
      else {
        user.password = String(req.body.password);
        user.resetToken = undefined;
        user.save(function(err) {
          if (err) return validationError(res, err);
          res.send(200, {});
        });
      }
    } else {
      return res.json(422, 'token not valid');
    }
  });
}

exports.changeidentity = function (req, res, next) {
  User.update(
    {_id: req.user._id},
    req.body,
    function (err, data){
      if (err) {
        res.send(500, 'err: ' + err);
      } else if (!data){
        res.send(500, 'data empty');
      } else {
        res.send(200, 'data ok');
      }
    }
  )
}
