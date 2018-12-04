'use strict';

/**
 * Module dependencies
 */
var packsPolicy = require('../policies/packs.server.policy'),
  packs = require('../controllers/packs.server.controller');

module.exports = function(app) {
  // Packs Routes
  app.route('/api/packs').all(packsPolicy.isAllowed)
    .get(packs.list)
    .post(packs.create);

  app.route('/api/packs/:packId').all(packsPolicy.isAllowed)
    .get(packs.read)
    .put(packs.update)
    .delete(packs.delete);

  // Finish by binding the Pack middleware
  app.param('packId', packs.packByID);
};
