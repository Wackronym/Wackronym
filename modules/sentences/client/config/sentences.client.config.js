(function () {
  'use strict';

  angular
    .module('sentences')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    /*menuService.addMenuItem('topbar', {
      title: 'Sentences',
      state: 'sentences',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sentences', {
      title: 'List Sentences',
      state: 'sentences.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sentences', {
      title: 'Create Sentence',
      state: 'sentences.create',
      roles: ['admin']
    });*/
  }
}());
