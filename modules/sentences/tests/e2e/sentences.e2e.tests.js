'use strict';

describe('Sentences E2E Tests:', function () {
  describe('Test Sentences page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sentences');
      expect(element.all(by.repeater('sentence in sentences')).count()).toEqual(0);
    });
  });
});
