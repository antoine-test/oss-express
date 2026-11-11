'use strict'

var express = require('..');
var request = require('supertest');

describe('res', function(){
  describe('.csv(rows)', function(){
    it('should send a header and the rows', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.csv([{ a: 1, b: 'x' }, { a: 2, b: 'y' }]);
      });

      request(app)
      .get('/')
      .set('Accept', 'text/csv')
      .expect('Content-Type', /text\/csv/)
      .expect(200, 'a,b\n1,x\n2,y', done);
    })

    it('should quote cells containing the delimiter', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.csv([{ a: 'x,y' }]);
      });

      request(app)
      .get('/')
      .set('Accept', 'text/csv')
      .expect(200, 'a\n"x,y"', done);
    })

    it('should support a custom delimiter', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.csv([{ a: 1, b: 2 }], { delimiter: ';' });
      });

      request(app)
      .get('/')
      .set('Accept', 'text/csv')
      .expect(200, 'a;b\n1;2', done);
    })

    it('should send JSON when requested', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.csv([{ a: 1 }]);
      });

      request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200, [{ a: 1 }], done);
    })
  })
})
