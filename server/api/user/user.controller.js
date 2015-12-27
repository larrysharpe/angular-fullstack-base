'use strict';

var User = require('./user.model');
var History = require('../history/history.model');
var Transaction = require('../transaction/transaction.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var slugify = function (text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

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
  newUser.provider = 'local';
  newUser.slug = slugify(newUser.username);
  newUser.save(function(err, user) {
    console.log(err);
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

var getCost = function (units) {
  if(units > 999) return .08;
  else return .10;
};

var getTotal = function (units) {
  return units * getCost(units);
};




exports.buyTokens = function (req, res, next) {
  var slug = req.body.slug;
  var units = Number(req.body.units);

  User.findOne({slug: slug}, function(err, user){

    var transaction = {
      user:{
        id: user._id,
        slug: user.slug
      },
      cost: getCost(units),
      category: 'tokens',
      item: 'Add Tokens',
      units: units,
      total: getTotal(units),
      date: new Date()
    };

    var t = new Transaction(transaction);
    t.save(function(err, trans){
      if (err) return next(err);
      if (!trans) return res.send(401);
    });

    user.credits.units = Number(user.credits.units) + units;
    user.credits.history.push(transaction);
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
    res.json(user);
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
exports.changePassword = function(req, res, next) {
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

exports.verifyEmail = function (req, res){
  User.findOne({emailConfirmationToken: req.body.token}, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    user.emailConfirmed = true;
    user.emailConfirmationToken = '';
    user.save(function (err, user) {
      res.send(200);
    });
  });
}


exports.applyBroadcaster = function (req, res) {
  if(!req.body._id) return res.json(422, 'No user provided');
  User.findById(req.body._id, function (err, user) {
    if (user) {
      if (user.roles.indexOf('broadcaster') > -1) res.json(422, 'Broadcaster Already Approved');
      else if (user.roles.indexOf('broadcaster applicant') > -1) res.json(422, 'Broadcaster Has Already Applied');
      else {
        user.roles.push('broadcaster applicant');
        user.save(function (err) {
          res.json(200, 'OK');
        });
      }
    }
  });
}

exports.approveBroadcaster = function (req, res) {
  if(!req.body._id) return res.json(422, 'No user provided');
  User.findById(req.body._id, function (err, user) {
    if(user && user.roles.indexOf('broadcaster') > -1) res.json(422, 'Broadcaster Already Approved');
    else if(user && user.roles.indexOf('broadcaster applicant') === -1) res.json(422, 'No Broadcaster Application');
    else if(user){
      var oldPermissionIndex = user.roles.indexOf('broadcaster applicant');
      user.roles.splice(oldPermissionIndex, 1);
      user.roles.push('broadcaster');
      user.save(function(err){
        res.json(200, user);
      });
    }
  });
}
exports.denyBroadcaster = function (req, res) {
  if(!req.body._id) return res.json(422, 'No user provided');
  User.findById(req.body._id, function (err, user) {
    if(user){
      var oldPermissionIndex = user.roles.indexOf('broadcaster applicant');
      user.roles.splice(oldPermissionIndex, 1);
      user.roles.push('broadcaster denied');
      user.broadcasterDenialReason = req.body.broadcasterDenialReason;
      user.save(function(err){
        res.json(200, user);
      });
    }
  });
}

exports.accountHelp = function (req, res) {
  if (!req.body.email) return res.json(422, 'no email address');
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

exports.changeEmail = function (req, res){
  if (!req.body._id) return res.json(422, 'no user');
  if (!req.body.email) return res.json(422, 'no email address');
  User.findById(req.body._id, function(err, user) {
    if (user) {
      if(user.email === req.body.email) {
        res.json(422,'Cannot use current email');
      } else {
        var token = makeRandomString(16);
        user.emailConfirmationToken = token;
        user.emailConfirmed = false;
        user.email = req.body.email;
        user.save(function (err, user) {
          res.json({user: user});
        });
      }
    } else {
      res.json(422, 'Could not find user.');
    }
  });
};


exports.changeProfile = function (req, res){
  if (!req.body._id) return res.json(422, 'no user');
  User.findById(req.body._id, function(err, user) {
    if (user) {
      user.username = req.body.username;
      user.save(function(err, user){
        res.json(200, {user: user});
      });
    } else {
      res.json(422, 'Could not find user.');
    }
  });
};

exports.passwordReset = function (req, res){
  User.findOne({"resetToken.token": req.body.token}, function (err, user) {
    if(err !== null) res.json({error:err});
    else if(!user) res.json({error:'User not found.'});
    else {
      user.password = req.body.password;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    }
  });
};

exports.resendVerification = function (req, res, next){
  User.findOne({_id: req.params.id}, 'emailConfirmationToken', function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.send(200);
  });
};

var returnBroadcasters = function (err, users, req, res, next) {
  if (err) return next(err);
  if (!users) return res.send(401);
  res.send(200, users);
};

exports.broadcastersFavorites = function (req,res, next) {
  User.findOne({ _id: req.query._id }, 'faves', function(err, user){
    User.find({_id: { $in: user.faves}}, '_id status username slug', function (err, broadcasters){
      return returnBroadcasters(err, broadcasters, req, res, next);
    });
  });
};

exports.broadcastersTrending = function (req,res, next) {
  User.find({roles: {$in: ['broadcaster']}, status: 'online', trending: true},
    'username slug status', function (err, users) { return returnBroadcasters(err, users, req, res, next);} );
};

exports.broadcastersPicks = function (req,res, next) {
  User.find({roles: {$in: ['broadcaster']}, status: 'online', picks: true},
    'username slug status', function (err, users) { return returnBroadcasters(err, users, req, res, next);} );
};

exports.broadcastersOnline = function (req,res, next) {
  User.find({roles: {$in: ['broadcaster']}, status: 'online'},
    'username slug status', function (err, users) { return returnBroadcasters(err, users, req, res, next);} );
};

exports.broadcastersOffline = function (req,res, next) {
  User.find({roles: {$in: ['broadcaster']}, status: 'offline'},
    'username slug status', function (err, users) { return returnBroadcasters(err, users, req, res, next);} );
};


exports.getBroadcaster = function (req, res, next) {
  User.findOne({roles: 'broadcaster', slug: req.params.slug}, function (err, broadcaster){
    if (err) return next(err);
    if (!broadcaster) return res.send(404);

    if(req.query.addRecent === '1' && req.query.user){
      var query = {'user': req.query.user};
      var update = {$push: {"watches": {broadcaster: req.params.slug, date: new Date()}}};
      History.findOneAndUpdate(query, update, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
      });
    }

    res.send(200, broadcaster);
  });
};

exports.listFaves = function (req, res, next){
  User.findOne({_id: req.params.id}, function (err, user){
    //console.log('ERROR:' + err);
    //console.log('Faves:' + faves);
    if (err) return next(err);
    if (!user) return res.send(404);
    User.find({_id: {$in: user.faves}}, 'username slug status', function (err, faves){
      if (err) return next(err);
      if (!faves) return res.send(404);
      res.send(200, faves);
    });
  })
};

exports.setFaves = function (req, res, next){
  User.findOne({_id: req.params.id},'faves', function (err, user){
    if (err) return next(err);
    if (!user) return res.send(404);
    var i;
    for(i = 0; i<req.body.ids.length; i++){
      var index = user.faves.indexOf(req.body.ids[i]);
      if (index === -1) user.faves.push(req.body.ids[i]);
    }

    user.save(function(err, user){
      if (err) return next(err);
      if (!user) return res.send(404);
      res.send(200, user.faves);
    });
  })
};

exports.unsetFaves = function (req, res, next){
  User.findOne({_id: req.params.id, faves: {$in: req.body.ids}}, 'faves', function (err, user){
    if (err) return next(err);
    if (!user) return res.send(404);

    var i;
    for(i = 0; i<req.body.ids.length; i++){
      var index = user.faves.indexOf(req.body.ids[i]);
      if (index > -1) user.faves.splice(index, 1);
    }
    user.save(function(err, user){
      if (err) return next(err);
      if (!user) return res.send(404);
      res.send(200, user.faves);
    });

  })
};

exports.justSend = function (req, res, next){
  res.send(200);
}

exports.guest = function (req, res, next){
  res.send(200);
}
