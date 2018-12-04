// Sentences service used to communicate Sentences REST endpoints
(function () {
  'use strict';

  angular
    .module('sentences')
    .factory('SentencesService', SentencesService);

  SentencesService.$inject = ['$resource'];

  function SentencesService($resource) {
    return $resource('/api/sentences/:sentenceId', {
      sentenceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
