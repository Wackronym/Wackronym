(function () {
  'use strict';

  angular
    .module('sentences')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sentences', {
        abstract: true,
        url: '/sentences',
        template: '<ui-view/>'
      })
      .state('sentences.list', {
        url: '',
        templateUrl: '/modules/sentences/client/views/list-sentences.client.view.html',
        controller: 'SentencesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sentences List'
        }
      })
      .state('sentences.create', {
        url: '/create',
        templateUrl: '/modules/sentences/client/views/form-sentence.client.view.html',
        controller: 'SentencesController',
        controllerAs: 'vm',
        resolve: {
          sentenceResolve: newSentence
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sentences Create'
        }
      })
      .state('sentences.edit', {
        url: '/:sentenceId/edit',
        templateUrl: '/modules/sentences/client/views/form-sentence.client.view.html',
        controller: 'SentencesController',
        controllerAs: 'vm',
        resolve: {
          sentenceResolve: getSentence
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sentence {{ sentenceResolve.name }}'
        }
      })
      .state('sentences.view', {
        url: '/:sentenceId',
        templateUrl: '/modules/sentences/client/views/view-sentence.client.view.html',
        controller: 'SentencesController',
        controllerAs: 'vm',
        resolve: {
          sentenceResolve: getSentence
        },
        data: {
          pageTitle: 'Sentence {{ sentenceResolve.name }}'
        }
      });
  }

  getSentence.$inject = ['$stateParams', 'SentencesService'];

  function getSentence($stateParams, SentencesService) {
    return SentencesService.get({
      sentenceId: $stateParams.sentenceId
    }).$promise;
  }

  newSentence.$inject = ['SentencesService'];

  function newSentence(SentencesService) {
    return new SentencesService();
  }
}());
