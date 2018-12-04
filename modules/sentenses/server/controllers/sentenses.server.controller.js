'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sentense = mongoose.model('Sentense'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sentense
 */
exports.create = function(req, res) {
  var sentense = new Sentense(req.body);
  sentense.user = req.user;

  sentense.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sentense);
    }
  });
};

/**
 * Show the current Sentense
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sentense = req.sentense ? req.sentense.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sentense.isCurrentUserOwner = req.user && sentense.user && sentense.user._id.toString() === req.user._id.toString();

  res.jsonp(sentense);
};

/**
 * Update a Sentense
 */
exports.update = function(req, res) {
  var sentense = req.sentense;

  sentense = _.extend(sentense, req.body);

  sentense.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sentense);
    }
  });
};

/**
 * Delete an Sentense
 */
exports.delete = function(req, res) {
  var sentense = req.sentense;

  sentense.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sentense);
    }
  });
};

/**
 * List of Sentenses
 */
exports.list = function(req, res) {
  Sentense.find().sort('-created').populate('user', 'displayName').exec(function(err, sentenses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sentenses);
    }
  });
};

/**
 * Sentense middleware
 */
exports.sentenseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sentense is invalid'
    });
  }

  Sentense.findById(id).populate('user', 'displayName').exec(function (err, sentense) {
    if (err) {
      return next(err);
    } else if (!sentense) {
      return res.status(404).send({
        message: 'No Sentense with that identifier has been found'
      });
    }
    req.sentense = sentense;
    next();
  });
};
