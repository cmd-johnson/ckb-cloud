'use strict'

const errors = require('./errors.json')
const _ = require('lodash')

class CkbError extends Error {
  constructor (id, privateDetails, additionalDetails) {
    let error = errors[id] || errors.invalidErrorID

    super(error.message)

    error.privateDetails = privateDetails
    error.additionalDetails = additionalDetails

    this.error = _.assign(error, { privateDetails, additionalDetails })
    this.status = error.status
  }

  getError () {
    return _.assign(this.error, { stack: this.stack })
  }

  getPublicError () {
    return _.pick(this.error, 'status', 'message', 'additionalDetails')
  }
}

module.exports = {
  CkbError
}
