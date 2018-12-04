(function () {
  'use strict';

  angular
    .module('packs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Packs',
      state: 'packs',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'packs', {
      title: 'List Packs',
      state: 'packs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'packs', {
      title: 'Create Pack',
      state: 'packs.create'
    });
  }
}());
