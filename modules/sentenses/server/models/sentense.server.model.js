'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sentense Schema
 */
var SentenseSchema = new Schema({
  sentence: {
    type: String,
    default: '',
    required: 'Please fill Sentense sentence',
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

mongoose.model('Sentense', SentenseSchema);
