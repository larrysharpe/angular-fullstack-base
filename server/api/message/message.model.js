'use strict';

var mongoose = require('mongoose'),
    presets = require('../predefinedSchemaVars'), // predefined schema settings
    Schema = mongoose.Schema;

var schemaObj = {
  from: presets.strLowerReqTrim,
  edits: [
    {
      content: presets.strReq,
      date: presets.dateReqNow,
      reversion: presets.boolFalseReq
    }
  ],
  to: {
    slug: presets.strLowerReqTrim,
    type: {
      type: String,
      enum: presets.toTypeEnum
    }
  },
  date: presets.dateReqNow,
  type: String
};

var MessageSchema = new Schema(schemaObj);

module.exports = mongoose.model('Message', MessageSchema);
