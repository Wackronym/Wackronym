(function () {
  'use strict';

  angular
    .module('configs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('configs', {
        abstract: true,
        url: '/configs',
        template: '<ui-view/>'
      })
      .state('configs.list', {
        url: '',
        templateUrl: '/modules/configs/client/views/list-configs.client.view.html',
        controller: 'ConfigsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Configs List'
        }
      })
      .state('configs.create', {
        url: '/create',
        templateUrl: '/modules/configs/client/views/form-config.client.view.html',
        controller: 'ConfigsController',
        controllerAs: 'vm',
        resolve: {
          configResolve: newConfig
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Configs Create'
        }
      })
      .state('configs.edit', {
        url: '/:configId/edit',
        templateUrl: '/modules/configs/client/views/form-config.client.view.html',
        controller: 'ConfigsController',
        controllerAs: 'vm',
        resolve: {
          configResolve: getConfig
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Config {{ configResolve.name }}'
        }
      })
      .state('configs.view', {
        url: '/:configId',
        templateUrl: '/modules/configs/client/views/view-config.client.view.html',
        controller: 'ConfigsController',
        controllerAs: 'vm',
        resolve: {
          configResolve: getConfig
        },
        data: {
          pageTitle: 'Config {{ configResolve.name }}'
        }
      });
  }

  getConfig.$inject = ['$stateParams', 'ConfigsService'];

  function getConfig($stateParams, ConfigsService) {
    return ConfigsService.get({
      configId: $stateParams.configId
    }).$promise;
  }

  newConfig.$inject = ['ConfigsService'];

  function newConfig(ConfigsService) {
    return new ConfigsService();
  }
}());
