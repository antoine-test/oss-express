'use strict'

var assert = require('node:assert')
var express = require('..')
var path = require('node:path')
var tmpl = require('./support/tmpl')

describe('app', function(){
  describe('.hasView(name)', function(){
    it('should be true for an existing view', function(){
      var app = express()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.engine('tmpl', tmpl)

      assert.strictEqual(app.hasView('name.tmpl'), true)
    })

    it('should be false for a missing view', function(){
      var app = express()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.engine('tmpl', tmpl)

      assert.strictEqual(app.hasView('missing.tmpl'), false)
    })

    it('should use the default engine extension', function(){
      var app = express()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.engine('tmpl', tmpl)
      app.set('view engine', 'tmpl')

      assert.strictEqual(app.hasView('name'), true)
    })

    it('should be false without extension or default engine', function(){
      var app = express()

      app.set('views', path.join(__dirname, 'fixtures'))

      assert.strictEqual(app.hasView('name'), false)
    })

    it('should not throw for an empty name', function(){
      var app = express()

      app.hasView('')
    })
  })
})
