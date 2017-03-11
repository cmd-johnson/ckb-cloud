/* global describe, before, after, it */
'use strict'

describe('REST Server', () => {
  before(() => {})
  after(() => {})

  describe('/clients', () => {
    it('should list available clients')
  })

  describe('/clients/{client_id}', () => {
    it('should list details of the given client')
    it('should reject invalid clientIDs')
  })

  describe('/clients/{client_id}/keys', () => {
    it('should list all keys available for the given client')
  })

  describe('/clients/{client_id}/keys/{key_id}', () => {
    it('should list details of the given key')
    it('should reject invalid keyIDs')
  })

  describe('/clients/{client_id}/keys/{key_id}/effects', () => {
    it('should accept POSTing a valid color-effect')
    it('should accept POSTing a valid gradient-effect')
    it('should reject POSTing invalid new effects')
    it('should list all active effects for the given key')
    it('should clear all effects upon DELETE')
  })

  describe('/clients/{client_id}/keys/{key_id}/effects/{effect_id}', () => {
    it('should list details of the given effect')
    it('should reject invalid effectIDs')
    it('should remove the given effect upon DELETE')
  })
})
