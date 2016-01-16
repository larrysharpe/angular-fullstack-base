'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var requiredString ={
  type: String,
  required: true
};

var booleanType = {
  type: Boolean,
  required: true,
  default: false
};

var TipsSchema = new Schema({
  from: requiredString,
  to: requiredString,
  amount: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: new Date(),
    required: true
  },
  rain: booleanType,
  hideTip: booleanType,
  tipNote:String
});

module.exports = mongoose.model('Tips', TipsSchema);
