(function () {
  'use strict';

  angular
    .module('configs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    /*menuService.addMenuItem('topbar', {
      title: 'Configs',
      state: 'configs',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'configs', {
      title: 'List Configs',
      state: 'configs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'configs', {
      title: 'Create Config',
      state: 'configs.create'
    });*/
  }
}());
