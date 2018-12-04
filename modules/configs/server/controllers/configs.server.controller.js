'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Config = mongoose.model('Config'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Config
 */
exports.create = function(req, res) {
  var config = new Config(req.body);
  config.user = req.user;

  config.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(config);
    }
  });
};

/**
 * Show the current Config
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var config = req.config ? req.config.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  config.isCurrentUserOwner = req.user && config.user && config.user._id.toString() === req.user._id.toString();

  res.jsonp(config);
};

/**
 * Update a Config
 */
exports.update = function(req, res) {
  var config = req.config;

  config = _.extend(config, req.body);

  config.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(config);
    }
  });
};

/**
 * Delete an Config
 */
exports.delete = function(req, res) {
  var config = req.config;

  config.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(config);
    }
  });
};

/**
 * List of Configs
 */
exports.list = function(req, res) {
  Config.find().sort('-created').exec(function(err, configs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(configs);
    }
  });
};

/**
 * Config middleware
 */
exports.configByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Config is invalid'
    });
  }

  Config.findById(id).populate('user', 'displayName').exec(function (err, config) {
    if (err) {
      return next(err);
    } else if (!config) {
      return res.status(404).send({
        message: 'No Config with that identifier has been found'
      });
    }
    req.config = config;
    next();
  });
};
