'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const Promise = require('bluebird')

class RESTServer {
  constructor () {
    this.app = express()
    this.app.use(bodyParser.json({
      limit: '1kb'
    }))
  }

  connect (port, commandHandler) {
    return new Promise((resolve, reject) => {
      this.app.use(require('./routes')(commandHandler))
      this.app.use((err, req, res, next) => {
        console.error('Error', err)
        if (typeof err === 'object') {
          res.status(500).json(err)
        } else if (typeof err === 'string') {
          res.status(500).json({ message: err })
        } else {
          res.status(500).json({ message: 'invalid error' })
        }
      })

      this.app.listen(port, err => {
        err ? reject(err) : resolve(port)
      })
    })
  }
}

module.exports = {
  RESTServer
}
