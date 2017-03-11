'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const Promise = require('bluebird')
const osprey = require('osprey')
const { join } = require('path')

class RESTServer {
  constructor () {
    this.app = express()
    this.app.use(bodyParser.json({
      limit: '1kb'
    }))
  }

  init (commandHandler, errorHandler) {
    return osprey.loadFile(join(__dirname, 'spec', 'api.raml'))
    .then(middleware => {
      this.app.use(middleware)
      this.app.use(require('./routes')(commandHandler))
      this.app.use(errorHandler || osprey.errorHandler())
    })
  }

  listen (port) {
    return new Promise((resolve, reject) => {
      this.app.listen(port, (err) => {
        err ? reject(err) : resolve(port)
      })
    })
  }
}

module.exports = {
  RESTServer
}
