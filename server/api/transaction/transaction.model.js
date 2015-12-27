'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  user:{
    id: {
      required: true,
      type: Schema.Types.ObjectId
    },
    slug: {
      type: String,
      required: true
    }
  },
  cost: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['tokens','subscription']
  },
  item: {
    type: String,
    required: true
  },
  units: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: new Date()
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
