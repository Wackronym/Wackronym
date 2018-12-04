'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pack = mongoose.model('Pack'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Pack
 */
exports.create = function(req, res) {
  var pack = new Pack(req.body);
  pack.user = req.user;

  pack.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pack);
    }
  });
};

/**
 * Show the current Pack
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var pack = req.pack ? req.pack.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  pack.isCurrentUserOwner = req.user && pack.user && pack.user._id.toString() === req.user._id.toString();

  res.jsonp(pack);
};

/**
 * Update a Pack
 */
exports.update = function(req, res) {
  var pack = req.pack;

  pack = _.extend(pack, req.body);

  pack.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pack);
    }
  });
};

/**
 * Delete an Pack
 */
exports.delete = function(req, res) {
  var pack = req.pack;

  pack.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pack);
    }
  });
};

/**
 * List of Packs
 */
exports.list = function(req, res) {
  Pack.find().sort('-created').populate('user', 'displayName').exec(function(err, packs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(packs);
    }
  });
};

/**
 * Pack middleware
 */
exports.packByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pack is invalid'
    });
  }

  Pack.findById(id).populate('user', 'displayName').exec(function (err, pack) {
    if (err) {
      return next(err);
    } else if (!pack) {
      return res.status(404).send({
        message: 'No Pack with that identifier has been found'
      });
    }
    req.pack = pack;
    next();
  });
};
