'use strict';

describe('Configs E2E Tests:', function () {
  describe('Test Configs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/configs');
      expect(element.all(by.repeater('config in configs')).count()).toEqual(0);
    });
  });
});
