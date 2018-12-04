(function () {
  'use strict';

  angular
    .module('packs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('packs', {
        abstract: true,
        url: '/packs',
        template: '<ui-view/>'
      })
      .state('packs.list', {
        url: '',
        templateUrl: '/modules/packs/client/views/list-packs.client.view.html',
        controller: 'PacksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Packs List'
        }
      })
      .state('packs.create', {
        url: '/create',
        templateUrl: '/modules/packs/client/views/form-pack.client.view.html',
        controller: 'PacksController',
        controllerAs: 'vm',
        resolve: {
          packResolve: newPack
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Packs Create'
        }
      })
      .state('packs.edit', {
        url: '/:packId/edit',
        templateUrl: '/modules/packs/client/views/form-pack.client.view.html',
        controller: 'PacksController',
        controllerAs: 'vm',
        resolve: {
          packResolve: getPack
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Pack {{ packResolve.name }}'
        }
      })
      .state('packs.view', {
        url: '/:packId',
        templateUrl: '/modules/packs/client/views/view-pack.client.view.html',
        controller: 'PacksController',
        controllerAs: 'vm',
        resolve: {
          packResolve: getPack
        },
        data: {
          pageTitle: 'Pack {{ packResolve.name }}'
        }
      });
  }

  getPack.$inject = ['$stateParams', 'PacksService'];

  function getPack($stateParams, PacksService) {
    return PacksService.get({
      packId: $stateParams.packId
    }).$promise;
  }

  newPack.$inject = ['PacksService'];

  function newPack(PacksService) {
    return new PacksService();
  }
}());
