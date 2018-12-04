'use strict';

/**
 * Module dependencies
 */
var configsPolicy = require('../policies/configs.server.policy'),
  configs = require('../controllers/configs.server.controller');

module.exports = function(app) {
  // Configs Routes
  app.route('/api/configs').all(configsPolicy.isAllowed)
    .get(configs.list)
    .post(configs.create);

  app.route('/api/configs/:configId').all(configsPolicy.isAllowed)
    .get(configs.read)
    .put(configs.update)
    .delete(configs.delete);

  // Finish by binding the Config middleware
  app.param('configId', configs.configByID);
};
