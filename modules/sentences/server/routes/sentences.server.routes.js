'use strict';

/**
 * Module dependencies
 */
var sentencesPolicy = require('../policies/sentences.server.policy'),
  sentences = require('../controllers/sentences.server.controller');

module.exports = function(app) {
  // Sentences Routes
  app.route('/api/sentences').all(sentencesPolicy.isAllowed)
    .get(sentences.list)
    .post(sentences.create);

  app.route('/api/sentences/:sentenceId').all(sentencesPolicy.isAllowed)
    .get(sentences.read)
    .put(sentences.update)
    .delete(sentences.delete);

  // Finish by binding the Sentence middleware
  app.param('sentenceId', sentences.sentenceByID);
};
