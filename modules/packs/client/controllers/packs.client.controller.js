(function () {
  'use strict';

  // Packs controller
  angular
    .module('packs')
    .controller('PacksController', PacksController);

  PacksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'packResolve'];

  function PacksController ($scope, $state, $window, Authentication, pack) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pack = pack;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Pack
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pack.$remove($state.go('packs.list'));
      }
    }

    // Save Pack
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.packForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pack._id) {
        vm.pack.$update(successCallback, errorCallback);
      } else {
        vm.pack.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('packs.view', {
          packId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
