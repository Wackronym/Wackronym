(function () {
  'use strict';

  angular
    .module('configs')
    .controller('ConfigsListController', ConfigsListController);

  ConfigsListController.$inject = ['ConfigsService'];

  function ConfigsListController(ConfigsService) {
    var vm = this;

    vm.configs = ConfigsService.query();
  }
}());
