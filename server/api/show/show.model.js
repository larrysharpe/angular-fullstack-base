'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var userObj = {
  slug: {
    type: String,
    required: true
  },
  name:  {
    type: String,
    required: true
  }
};
var showArray = ['public','group','private','booked private','vip','courtesy','meter','goal','jukebox','password'];
var dateObj = {
  type: Date,
  required: true,
  default: new Date()
};
var statusObj = {
  type: String,
  required: true,
  default: 'requested',
  enum: ['requested','accepted','denied']
};

var ShowSchema = new Schema({
  requested: dateObj,
  requestor: userObj,
  show: {
    type: String,
    required: true,
    enum: showArray
  },
  status: statusObj,
  broadcaster: userObj,
  users: [userObj],
  denied: Date,
  denialReason: String,
  accepted: Date,
  started: Date,
  ended: Date
});

module.exports = mongoose.model('Show', ShowSchema);
