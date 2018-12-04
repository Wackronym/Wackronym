'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Config Schema
 */
var ConfigSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Config name',
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

mongoose.model('Config', ConfigSchema);
