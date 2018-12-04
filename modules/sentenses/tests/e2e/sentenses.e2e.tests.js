'use strict';

describe('Sentenses E2E Tests:', function () {
  describe('Test Sentenses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sentenses');
      expect(element.all(by.repeater('sentense in sentenses')).count()).toEqual(0);
    });
  });
});
