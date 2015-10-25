'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HistorySchema = new Schema({
  user: String,
  logins: [Date],
  watches: [],
  shows: [
    {
      showType: {
        type: String,
        Enum: ['private', 'vip', 'meter', 'goal', 'password', 'booked private']
      },
      start: Date,
      end: Date
    }
  ],
  transactions: [
    {
      amount: Number,
      date: Date,
      desc: String
    }
  ]
});

module.exports = mongoose.model('History', HistorySchema);
