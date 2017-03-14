'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];


var makeRandomString = function (length){
  if(!length) length = 5;
  var text = "",
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var AccountStatuses = [
  'action-user',    // account is awaiting an action
  'action-admin',   // account is awaiting an action
  'active',         // account is normal
  'stale',          // user has not used account for x amount of days
  'suspended',      // account is suspended by admin
  'closed'          // account is closed
];

var ChatStatuses = [
  'offline',
  'away',
  'busy',
  'invisible',
  'online'
];


var AccountsSchema = new Schema({
  type: {
    required: true,
    type: String,
    enum: ['broadcaster'],
    default: 'broadcaster'
  },
  statuses: {
    account: {
      type: String,
      enum: AccountStatuses,
      default: 'action-user'
    },
    chat: {
      type: String,
      enum: ChatStatuses,
      default: 'offline'
    }
  }
});

var UserSchema = new Schema({
  username: {type: String, required: true, unique: true, trim: true},
  username_lower: {type: String, unique: true, trim: true, lowercase: true},
  email: {type: String, required: true, unique: true, trim: true, lowercase: true},
  emailVerified: {type: Boolean, default: false},
  emailVerificationToken: {type: String, default: makeRandomString(16)},

  created: {type: Date, required: true, default: new Date()},
  lastLogin: Date,

  resetToken: {},

  roles: {
    type: [String],
    default: 'user',
    enum: ['admin', 'user', 'broadcaster']
  },

  accounts: [AccountsSchema],


  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'email': this.email,
      'emailVerified': this.emailVerified,
      'username': this.username,
      'roles': this.roles
    };
  });

UserSchema
  .virtual('adminProfile')
  .get(function() {
    return {
      'email': this.email,
      '_id': this._id,
      'username': this.username,
      'roles': this.roles
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'roles': this.roles
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');
// Validate email is not taken
UserSchema
  .path('username')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne(
      { $or:[{username: value}, {username_lower: value.toLowerCase()}] }, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified username is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    this.username_lower = this.username.toLowerCase();

    if (!this.isNew) return next();
    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
