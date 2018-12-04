'use strict';

/**
 * Module dependencies
 */
var sentensesPolicy = require('../policies/sentenses.server.policy'),
  sentenses = require('../controllers/sentenses.server.controller');

module.exports = function(app) {
  // Sentenses Routes
  app.route('/api/sentenses').all(sentensesPolicy.isAllowed)
    .get(sentenses.list)
    .post(sentenses.create);

  app.route('/api/sentenses/:sentenseId').all(sentensesPolicy.isAllowed)
    .get(sentenses.read)
    .put(sentenses.update)
    .delete(sentenses.delete);

  // Finish by binding the Sentense middleware
  app.param('sentenseId', sentenses.sentenseByID);
};
