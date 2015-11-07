'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GuestSchema = new Schema({
  token: { type: String, required: true },
  guestNo: { type: Number, required: true },
  created: {type: Date, required: true, default: new Date()}
});

module.exports = mongoose.model('Guest', GuestSchema);
