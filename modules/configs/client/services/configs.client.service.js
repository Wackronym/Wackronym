// Configs service used to communicate Configs REST endpoints
(function () {
  'use strict';

  angular
    .module('configs')
    .factory('ConfigsService', ConfigsService);

  ConfigsService.$inject = ['$resource'];

  function ConfigsService($resource) {
    return $resource('/api/configs/:configId', {
      configId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
