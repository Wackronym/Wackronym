(function () {
  'use strict';

  // Friends controller
  angular
    .module('friends')
    .controller('FriendsController', FriendsController);

  FriendsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'friendResolve'];

  function FriendsController ($scope, $state, $window, Authentication, friend) {
    var vm = this;

    vm.authentication = Authentication;
    vm.friend = friend;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Friend
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.friend.$remove($state.go('friends.list'));
      }
    }

    // Save Friend
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.friendForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.friend._id) {
        vm.friend.$update(successCallback, errorCallback);
      } else {
        vm.friend.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('friends.view', {
          friendId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
