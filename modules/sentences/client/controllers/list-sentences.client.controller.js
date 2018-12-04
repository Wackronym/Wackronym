(function () {
  'use strict';

  angular
    .module('sentences')
    .controller('SentencesListController', SentencesListController);

  SentencesListController.$inject = ['SentencesService'];

  function SentencesListController(SentencesService) {
    var vm = this;

    vm.sentences = SentencesService.query();
  }
}());
