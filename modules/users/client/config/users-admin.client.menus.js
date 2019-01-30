(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    // Set top bar menu items
    /*menuService.addMenuItem('topbar', {
      title: 'Users',
      state: 'user',
      type: 'dropdown',
      roles: ['admin']
    });

    menuService.addSubMenuItem('topbar', 'user', {
      title: 'Manage Users',
      state: 'admin.users'
    });*/
  }
}());
