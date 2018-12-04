(function () {
  'use strict';

  describe('Configs Route Tests', function () {
    // Initialize global variables
    var $scope,
      ConfigsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ConfigsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ConfigsService = _ConfigsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('configs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/configs');
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
          ConfigsController,
          mockConfig;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('configs.view');
          $templateCache.put('modules/configs/client/views/view-config.client.view.html', '');

          // create mock Config
          mockConfig = new ConfigsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Config Name'
          });

          // Initialize Controller
          ConfigsController = $controller('ConfigsController as vm', {
            $scope: $scope,
            configResolve: mockConfig
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:configId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.configResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            configId: 1
          })).toEqual('/configs/1');
        }));

        it('should attach an Config to the controller scope', function () {
          expect($scope.vm.config._id).toBe(mockConfig._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/configs/client/views/view-config.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ConfigsController,
          mockConfig;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('configs.create');
          $templateCache.put('modules/configs/client/views/form-config.client.view.html', '');

          // create mock Config
          mockConfig = new ConfigsService();

          // Initialize Controller
          ConfigsController = $controller('ConfigsController as vm', {
            $scope: $scope,
            configResolve: mockConfig
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.configResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/configs/create');
        }));

        it('should attach an Config to the controller scope', function () {
          expect($scope.vm.config._id).toBe(mockConfig._id);
          expect($scope.vm.config._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/configs/client/views/form-config.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ConfigsController,
          mockConfig;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('configs.edit');
          $templateCache.put('modules/configs/client/views/form-config.client.view.html', '');

          // create mock Config
          mockConfig = new ConfigsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Config Name'
          });

          // Initialize Controller
          ConfigsController = $controller('ConfigsController as vm', {
            $scope: $scope,
            configResolve: mockConfig
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:configId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.configResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            configId: 1
          })).toEqual('/configs/1/edit');
        }));

        it('should attach an Config to the controller scope', function () {
          expect($scope.vm.config._id).toBe(mockConfig._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/configs/client/views/form-config.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
