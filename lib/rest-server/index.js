'use strict'

const { CkbError } = require('../util/error')

const bodyParser = require('body-parser')
const express = require('express')
const Promise = require('bluebird')
const osprey = require('osprey')
const { inspect } = require('util')
const { join } = require('path')

class RESTServer {
  constructor () {
    this.app = express()
    this.app.use(bodyParser.json({
      limit: '1kb'
    }))
  }

  init (commandHandler) {
    return osprey.loadFile(join(__dirname, 'spec', 'api.raml'))
    .then(middleware => {
      this.app.use(middleware)
      this.app.use(require('./routes')(commandHandler))
      this.app.use(errorHandler)
    })
  }

  listen (port) {
    return new Promise((resolve, reject) => {
      try {
        let server = this.app.listen(port, () => {
          resolve({ port, server })
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

function errorHandler (err, req, res, next) {
  if (err instanceof CkbError) {
    if (err.status >= 500) {
      console.error(`ERR: ${inspect(err.getError())}`)
    }
    res.status(err.status).json(err.getPublicError())
  } else {
    let error = new CkbError('invalidErrorType', err)
    errorHandler(error, req, res, next)
  }
}

module.exports = {
  RESTServer
}
