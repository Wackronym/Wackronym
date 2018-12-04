'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sentence = mongoose.model('Sentence'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sentence
 */
exports.create = function(req, res) {
  var sentence = new Sentence(req.body);
  sentence.user = req.user;

  sentence.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sentence);
    }
  });
};

/**
 * Show the current Sentence
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sentence = req.sentence ? req.sentence.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sentence.isCurrentUserOwner = req.user && sentence.user && sentence.user._id.toString() === req.user._id.toString();

  res.jsonp(sentence);
};

/**
 * Update a Sentence
 */
exports.update = function(req, res) {
  var sentence = req.sentence;

  sentence = _.extend(sentence, req.body);

  sentence.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sentence);
    }
  });
};

/**
 * Delete an Sentence
 */
exports.delete = function(req, res) {
  var sentence = req.sentence;

  sentence.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sentence);
    }
  });
};

/**
 * List of Sentences
 */
exports.list = function(req, res) {
  Sentence.find().sort('-created').exec(function(err, sentences) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sentences);
    }
  });
};

/**
 * Sentence middleware
 */
exports.sentenceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sentence is invalid'
    });
  }

  Sentence.findById(id).populate('user', 'displayName').exec(function (err, sentence) {
    if (err) {
      return next(err);
    } else if (!sentence) {
      return res.status(404).send({
        message: 'No Sentence with that identifier has been found'
      });
    }
    req.sentence = sentence;
    next();
  });
};
