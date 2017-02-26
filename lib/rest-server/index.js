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

  connect (port, commandHandler) {
    return osprey.loadFile(join(__dirname, 'spec', 'api.raml'))
    .then(middleware => {
      this.app.use(middleware)
      this.app.use((err, req, res, next) => {
        console.error(err)
      })
      return new Promise((resolve, reject) =>
        this.app.listen(port, err => err ? reject(err) : resolve(port))
      )
    })
  }
}

module.exports = {
  RESTServer
}
