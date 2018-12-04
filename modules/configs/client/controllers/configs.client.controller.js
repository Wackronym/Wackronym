(function () {
  'use strict';

  // Configs controller
  angular
    .module('configs')
    .controller('ConfigsController', ConfigsController);

  ConfigsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'configResolve'];

  function ConfigsController ($scope, $state, $window, Authentication, config) {
    var vm = this;

    vm.authentication = Authentication;
    vm.config = config;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Config
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.config.$remove($state.go('configs.list'));
      }
    }

    // Save Config
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.configForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.config._id) {
        vm.config.$update(successCallback, errorCallback);
      } else {
        vm.config.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('configs.view', {
          configId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
