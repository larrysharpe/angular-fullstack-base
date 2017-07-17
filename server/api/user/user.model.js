'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var GenderList = require('../../data-lists/genders.json');
var StatesList = require('../../data-lists/states.us.json');
var CountryList = require('../../data-lists/countries.json');

var makeRandomString = function (length){
  if(!length) length = 5;
  var text = "",
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var getCurrentYear = function () {
  var today = new Date();
  return today.getFullYear();
}

var UserSchema = new Schema({
  username: {type: String, required: true, unique: true, trim: true},
  username_lower: {type: String, unique: true, trim: true, lowercase: true},

  email: {type: String, required: true, unique: true, trim: true, lowercase: true},
  emailVerified: {type: Boolean, default: false},
  emailVerificationToken: {type: String, default: makeRandomString(16)},

  birthDate: {
    month: {
      max: 12,
      min: 1,
      type: Number
    },
    day:  {
      max: 31,
      min: 1,
      type: Number
    },
    year: {
      max: getCurrentYear() - 18,
      min: 1917,
      type: Number
    }
  },

  gender: {
    type: String,
    enum: GenderList
  },

  address: String,
  city: String,
  state: {
    type: String,
    enum: StatesList.codes
  },
  country: {
    type: String,
    enum: CountryList.codes
  },
  zip: Number,

  created: {type: Date, required: true, default: new Date()},
  lastLogin: Date,

  resetToken: {},

  roles: {
    type: [String],
    default: 'user',
    enum: ['admin', 'user']
  },
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
