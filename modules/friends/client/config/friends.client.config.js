(function () {
  'use strict';

  angular
    .module('friends')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    /*menuService.addMenuItem('topbar', {
      title: 'Friends',
      state: 'friends',
      type: 'dropdown',
      roles: ['*']
    });*/

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'List Friends',
      state: 'friends.list'
    });

    // Add the dropdown create item
    /*menuService.addSubMenuItem('topbar', 'friends', {
      title: 'Create Friend',
      state: 'friends.create',
      roles: ['user']
    });*/
  }
}());
