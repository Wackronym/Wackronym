(function () {
  'use strict';

  angular
    .module('friends')
    .controller('FriendsController', FriendsController);

  FriendsController.$inject = ['$scope', '$filter', 'AdminService'];

  function FriendsController($scope, $filter, AdminService) {
    var vm = this;

    AdminService.query(function (data) {
      vm.users = data;
    });


  }
}());
