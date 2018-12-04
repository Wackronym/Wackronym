'use strict';

describe('Packs E2E Tests:', function () {
  describe('Test Packs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/packs');
      expect(element.all(by.repeater('pack in packs')).count()).toEqual(0);
    });
  });
});
