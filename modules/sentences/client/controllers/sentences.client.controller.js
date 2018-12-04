(function () {
  'use strict';

  // Sentences controller
  angular
    .module('sentences')
    .controller('SentencesController', SentencesController);

  SentencesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sentenceResolve'];

  function SentencesController ($scope, $state, $window, Authentication, sentence) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sentence = sentence;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sentence
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sentence.$remove($state.go('sentences.list'));
      }
    }

    // Save Sentence
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sentenceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sentence._id) {
        vm.sentence.$update(successCallback, errorCallback);
      } else {
        vm.sentence.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sentences.view', {
          sentenceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
