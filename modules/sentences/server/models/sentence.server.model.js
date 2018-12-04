'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sentence Schema
 */
var SentenceSchema = new Schema({
  puzzle: {
    type: String,
    default: '',
    required: 'Please fill Sentence name',
    trim: true
  }
});

mongoose.model('Sentence', SentenceSchema);
