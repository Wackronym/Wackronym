'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Pack Schema
 */
var PackSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Pack name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Pack description',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Pack', PackSchema);
