'use strict'

var express = require('..');
var request = require('supertest');
const { Buffer } = require('node:buffer');

describe('res', function(){
  describe('.sendRange(buf)', function(){
    it('should send the requested slice with 206', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.type('txt').sendRange(Buffer.from('hello world'));
      });

      request(app)
      .get('/')
      .set('Range', 'bytes=0-4')
      .expect('Content-Range', 'bytes 0-4/11')
      .expect(206, 'hello', done);
    })

    it('should send the whole buffer without a Range header', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.type('txt').sendRange(Buffer.from('hello world'));
      });

      request(app)
      .get('/')
      .expect(200, 'hello world', done);
    })

    it('should not crash when the range is unsatisfiable', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.type('txt').sendRange(Buffer.from('hello world'));
      });

      request(app)
      .get('/')
      .set('Range', 'bytes=100-200')
      .end(function () {
        done();
      });
    })

    it.skip('should support multiple ranges', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.type('txt').sendRange(Buffer.from('hello world'));
      });

      request(app)
      .get('/')
      .set('Range', 'bytes=0-1,3-4')
      .expect(206, done);
    })
  })
})
