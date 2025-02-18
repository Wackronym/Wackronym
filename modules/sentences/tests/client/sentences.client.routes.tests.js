(function () {
  'use strict';

  describe('Sentences Route Tests', function () {
    // Initialize global variables
    var $scope,
      SentencesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SentencesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SentencesService = _SentencesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sentences');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sentences');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SentencesController,
          mockSentence;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sentences.view');
          $templateCache.put('modules/sentences/client/views/view-sentence.client.view.html', '');

          // create mock Sentence
          mockSentence = new SentencesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sentence Name'
          });

          // Initialize Controller
          SentencesController = $controller('SentencesController as vm', {
            $scope: $scope,
            sentenceResolve: mockSentence
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sentenceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sentenceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sentenceId: 1
          })).toEqual('/sentences/1');
        }));

        it('should attach an Sentence to the controller scope', function () {
          expect($scope.vm.sentence._id).toBe(mockSentence._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sentences/client/views/view-sentence.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SentencesController,
          mockSentence;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sentences.create');
          $templateCache.put('modules/sentences/client/views/form-sentence.client.view.html', '');

          // create mock Sentence
          mockSentence = new SentencesService();

          // Initialize Controller
          SentencesController = $controller('SentencesController as vm', {
            $scope: $scope,
            sentenceResolve: mockSentence
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sentenceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sentences/create');
        }));

        it('should attach an Sentence to the controller scope', function () {
          expect($scope.vm.sentence._id).toBe(mockSentence._id);
          expect($scope.vm.sentence._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sentences/client/views/form-sentence.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SentencesController,
          mockSentence;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sentences.edit');
          $templateCache.put('modules/sentences/client/views/form-sentence.client.view.html', '');

          // create mock Sentence
          mockSentence = new SentencesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sentence Name'
          });

          // Initialize Controller
          SentencesController = $controller('SentencesController as vm', {
            $scope: $scope,
            sentenceResolve: mockSentence
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sentenceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sentenceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sentenceId: 1
          })).toEqual('/sentences/1/edit');
        }));

        it('should attach an Sentence to the controller scope', function () {
          expect($scope.vm.sentence._id).toBe(mockSentence._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sentences/client/views/form-sentence.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
