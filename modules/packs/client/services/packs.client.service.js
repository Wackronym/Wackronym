// Packs service used to communicate Packs REST endpoints
(function () {
  'use strict';

  angular
    .module('packs')
    .factory('PacksService', PacksService);

  PacksService.$inject = ['$resource'];

  function PacksService($resource) {
    return $resource('/api/packs/:packId', {
      packId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
