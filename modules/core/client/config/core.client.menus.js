(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('account', {
      roles: ['user']
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile Picture',
      state: 'settings.picture'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Manage Social Accounts',
      state: 'settings.accounts'
    });

    // ///////////////////////////////////////////// //
    //
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'List Configs',
      state: 'configs.list'
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'List Packs',
      state: 'packs.list'
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'List Sentences',
      state: 'sentences.list'
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });


  }
}());
