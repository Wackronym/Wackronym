(function () {
  'use strict';

  angular
    .module('packs')
    .controller('PacksListController', PacksListController);

  PacksListController.$inject = ['PacksService'];

  function PacksListController(PacksService) {
    var vm = this;

    vm.packs = PacksService.query();
  }
}());
