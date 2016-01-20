'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  from: {type: String, required: true},
  content: {type: String, required: true},
  to: {type: String, required: true},
  date: {type: Date, required: true, default: new Date()},
  type: String
});

module.exports = mongoose.model('Message', MessageSchema);
