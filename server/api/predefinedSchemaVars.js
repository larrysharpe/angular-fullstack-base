'use strict',

module.exports = {
  dateReqNow: {
    type: Date,
    required: true,
    default: new Date()
  },

  boolFalseReq: {
    default: false,
    required: true,
    type: Boolean
  },

  strLowerReqTrim: {
    lowercase: true,
    required: true,
    trim: true,
    type: String
  },

  strReq: {
    type: String,
    required: true
  },

  toTypeEnum: [
    'group',
    'room',
    'user'
  ]
};
