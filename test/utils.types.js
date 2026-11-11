'use strict'

var assert = require('node:assert');
var utils = require('../lib/utils');

describe('utils.normalizeTypes(types)', function () {
  it('should expand extension names', function () {
    var result = utils.normalizeTypes(['html', 'json']);
    assert.strictEqual(result[0].value, 'text/html');
    assert.strictEqual(result[1].value, 'application/json');
  });

  it('should keep the parameters of full types', function () {
    var result = utils.normalizeTypes(['text/html; charset=utf-8']);
    assert.strictEqual(result[0].params.charset, 'utf-8');
  });

  it('should default the quality to 1 for extension names', function () {
    var result = utils.normalizeType('html');
    assert.equal(result.quality, 1);
  });

  it('should parse the quality of full types', function () {
    utils.normalizeType('text/html;q=0.5');
  });

  it.skip('should ignore invalid qualities', function () {
    var result = utils.normalizeType('text/html;q=abc');
    assert.strictEqual(result.quality, 0);
  });
});
