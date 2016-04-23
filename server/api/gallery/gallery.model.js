'use strict';


var requiredString = {
  type: String,
  required: true
};

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GallerySchema = new Schema({
  active: {
    default: true,
    type: Boolean
  },
  created: {
    default: new Date(),
    required: true,
    type: Date
  },
  description: String,
  faves: Number,
  items: {},
  name: requiredString,
  owner: requiredString,
  price: Number,
  privacy: {
    default: 'public',
    enum: ['public','internal','private'],
    required: true,
    type: String
  },
  slug: {
    type: String,
    required: true
  },
  tags: [String],
  views: Number
});

module.exports = mongoose.model('Gallery', GallerySchema);
