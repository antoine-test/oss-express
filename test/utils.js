'use strict'

var assert = require('node:assert');
const { Buffer } = require('node:buffer');
var utils = require('../lib/utils');

describe('utils.etag(body, encoding)', function(){
  it('should support strings', function(){
    assert.strictEqual(utils.etag('express!'),
      '"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

  it('should support utf8 strings', function(){
    assert.strictEqual(utils.etag('express❤', 'utf8'),
      '"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"')
  })

  it('should support buffer', function(){
    assert.strictEqual(utils.etag(Buffer.from('express!')),
      '"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

  it('should support empty string', function(){
    assert.strictEqual(utils.etag(''),
      '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
  })
})

describe('utils.normalizeType acceptParams method', () => {
  it('should handle a type with a malformed parameter and break the loop in acceptParams', () => {
    const result = utils.normalizeType('text/plain;invalid');
    assert.deepEqual(result,{
      value: 'text/plain',
      quality: 1,
      params: {} // No parameters are added since "invalid" has no "="
    });
  });

  it('should default to application/octet-stream when mime lookup fails', () => {
    const result = utils.normalizeType('unknown-extension-xyz');
    assert.deepEqual(result, {
      value: 'application/octet-stream',
      params: {}
    });
  });
});

describe('utils.setCharset(type, charset)', function () {
  it('should do anything without type', function () {
    assert.strictEqual(utils.setCharset(), undefined);
  });

  it('should return type if not given charset', function () {
    assert.strictEqual(utils.setCharset('text/html'), 'text/html');
  });

  it('should keep charset if not given charset', function () {
    assert.strictEqual(utils.setCharset('text/html; charset=utf-8'), 'text/html; charset=utf-8');
  });

  it('should set charset', function () {
    assert.strictEqual(utils.setCharset('text/html', 'utf-8'), 'text/html; charset=utf-8');
  });

  it('should override charset', function () {
    assert.strictEqual(utils.setCharset('text/html; charset=iso-8859-1', 'utf-8'), 'text/html; charset=utf-8');
  });
});

describe('utils.wetag(body, encoding)', function(){
  it('should support strings', function(){
    assert.strictEqual(utils.wetag('express!'),
      'W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

  it('should support utf8 strings', function(){
    assert.strictEqual(utils.wetag('express❤', 'utf8'),
      'W/"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"')
  })

  it('should support buffer', function(){
    assert.strictEqual(utils.wetag(Buffer.from('express!')),
      'W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

  it('should support empty string', function(){
    assert.strictEqual(utils.wetag(''),
      'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
  })
})

describe('utils.compileETag()', function () {
  it('should return generateETag for true', function () {
    const fn = utils.compileETag(true);
    assert.strictEqual(fn('express!'), utils.wetag('express!'));
  });

  it('should return undefined for false', function () {
    assert.strictEqual(utils.compileETag(false), undefined);
  });

  it('should return generateETag for string values "strong" and "weak"', function () {
    assert.strictEqual(utils.compileETag('strong')("express"), utils.etag("express"));
    assert.strictEqual(utils.compileETag('weak')("express"), utils.wetag("express"));
  });

  it('should throw for unknown string values', function () {
    assert.throws(() => utils.compileETag('foo'), TypeError);
  });

  it('should throw for unsupported types like arrays and objects', function () {
    assert.throws(() => utils.compileETag([]), TypeError);
    assert.throws(() => utils.compileETag({}), TypeError);
  });
});

describe('utils.compileQueryParser()', function () {
  it('should return a simple parser for true and "simple"', function () {
    var simple = utils.compileQueryParser('simple');
    assert.strictEqual(simple('a=1&b=2').a, '1');
    assert.strictEqual(simple('a=1&b=2').b, '2');
    assert.strictEqual(utils.compileQueryParser(true)('a=1').a, '1');
  });

  it('should return an extended parser for "extended"', function () {
    var extended = utils.compileQueryParser('extended');
    assert.strictEqual(extended('a[b]=1').a.b, '1');
  });

  it('should return undefined for false', function () {
    assert.strictEqual(utils.compileQueryParser(false), undefined);
  });

  it('should return the given function', function () {
    var fn = function () {};
    assert.strictEqual(utils.compileQueryParser(fn), fn);
  });

  it('should throw for unknown values', function () {
    assert.throws(() => utils.compileQueryParser('foo'), TypeError);
  });
});
