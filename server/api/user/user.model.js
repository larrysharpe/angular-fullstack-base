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

var CreditHistorySchema = new Schema({
  date: {type: Date, required: true},
  desc: {type: String, enum: ['tip', 'pvt', 'vip' ], required: true},
  to: { type: String, required: true },
  amount: { type: Number, required: true }
});

var AddressSchema = new Schema({
  line1: String,
  country: {type: String, required: true},
  zip: String
});

var NameSchema = new Schema({
  first: {type: String, required: true},
  last: {type: String, required: true}
});


var UserSchema = new Schema({
  name: [NameSchema],
  username: {type: String, required: true},

  birthdate: Date,

  limits: {
    daily: {type: Number, default: 5000}
  },

  credits: {
    type: Number,
    required: true,
    default: 0
  },
  creditHistory: [CreditHistorySchema],

  xp:  {
    type: Number,
    required: true,
    default: 100
  },

  level:  {
    type: Number,
    required: true,
    default: 1
  },

  achievements: [String],

  email: { type: String, lowercase: true },
  emailConfirmed: {type: Boolean, required: true, default: false},
  emailConfirmationToken: String,

  address: [AddressSchema],


  faves: [],

  roles: {
    type: [String],
    default: 'user',
    enum: ['admin', 'user', 'broadcaster applicant', 'broadcaster']
  },

  created: {type: Date, required: true, default: new Date()},
  lastLogin: Date,

  hashedPassword: String,
  resetToken: {
    token: {type: String},
    date: {type: Date}
  },

  broadcasterDenialReason: String,

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
      'name': this.name,
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

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    this.emailConfirmationToken = makeRandomString(16);

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
