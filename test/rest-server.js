/* global describe, before, beforeEach, it */
'use strict'

const { RESTServer } = require('../lib/rest-server')
const { MockCommandHandler } = require('./mocks/mock-command-handler')

const { expect } = require('chai')
const path = require('path')
const { readFileSync } = require('fs')
const supertest = require('supertest')

describe('REST Server', () => {
  let server
  let request
  let commandHandler

  before(done => {
    server = new RESTServer()
    commandHandler = new MockCommandHandler()
    server.init(commandHandler, (err, req, res, next) => {
      res.status(400).json(err)
    })
    .then(() => { request = supertest(server.app) })
    .then(done)
  })

  beforeEach(() => {
    const clients = JSON.parse(readFileSync(path.join(__dirname, 'fixtures', 'clients.json')))
    commandHandler.clients = clients
  })

  describe('/clients', () => {
    it('should list available clients', done => {
      request.get('/clients')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.be.an('array')
          done()
        })
    })
  })

  describe('/clients/{client_id}', () => {
    it('should list details of the given client', done => {
      request.get('/clients/client1')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.deep.equal({
            id: 'client1'
          })
          done()
        })
    })
    it('should reject invalid clientIDs', done => {
      request.get('/clients/invalidClient')
        .expect(400)
        .end(done)
    })
  })

  describe('/clients/{client_id}/keys', () => {
    it('should list all keys available for the given client', done => {
      request.get('/clients/client1/keys')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.deep.equal([
            { id: 'a', position: { x: 0, y: 2 } },
            { id: 'b', position: { x: 1, y: 1 } },
            { id: 'c', position: { x: 2, y: 0 } }
          ])
          done()
        })
    })
  })

  describe('/clients/{client_id}/keys/{key_id}', () => {
    it('should list details of the given key', done => {
      request.get('/clients/client1/keys/a')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.deep.equal({
            id: 'a',
            position: {
              x: 0,
              y: 2
            }
          })
          done()
        })
    })

    it('should reject invalid keyIDs', done => {
      request.get('/clients/client1/keys/xyz')
        .expect(400)
        .end(done)
    })
  })

  describe('/clients/{client_id}/keys/{key_id}/effects', () => {
    it('should list all active effects for the given key', done => {
      request.get('/clients/client1/keys/a/effects')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.deep.equal(commandHandler.clients[0].keys[0].effects)
          done()
        })
    })

    it('should reject POSTing invalid new effects', done => {
      request.post('/clients/client1/keys/a/effects')
        .send({ effect: 'invalid' })
        .expect(400)
        .end(done)
    })

    it('should clear all effects upon DELETE', done => {
      request.delete('/clients/client1/keys/a/effects')
        .expect(204)
        .end((err, res) => {
          if (err) return done(err)
          expect(commandHandler.clients[0].keys[0].effects).to.be.empty
          done()
        })
    })

    describe('color-effect', () => {
      it('should accept and process POSTing a valid color-effect', done => {
        commandHandler.clients[0].keys[0].effects = []
        request.post('/clients/client1/keys/a/effects')
          .send({ effect: 'color', color: 'red' })
          .expect(204)
          .end((err, res) => {
            if (err) return done(err)
            expect(commandHandler.clients[0].keys[0].effects).to.not.be.empty
            expect(commandHandler.clients[0].keys[0].effects[0]).to.contain({
              effect: 'color',
              color: '#ff0000ff'
            })
            done()
          })
      })
    })

    describe('gradient-effect', () => {
      it('should accept POSTing a valid gradient-effect', done => {
        commandHandler.clients[0].keys[0].effects = []
        request.post('/clients/client1/keys/a/effects')
          .send({
            effect: 'gradient',
            color_stops: [
              { position: 0, color: '50% red' },
              { position: 0.33, color: 'transparent' },
              { position: 0.67, color: '#fff' },
              { position: 1, color: '#fff8' }
            ]
          })
          .expect(204)
          .end((err, res) => {
            if (err) return done(err)
            expect(commandHandler.clients[0].keys[0].effects).to.not.be.empty
            expect(commandHandler.clients[0].keys[0].effects[0]).to.contain({
              effect: 'gradient',
              loop_count: 1,
              duration: 1
            })
            expect(commandHandler.clients[0].keys[0].effects[0].color_stops).to.deep.equal([
              { position: 0, color: '#ff00007f' },
              { position: 0.33, color: '#00000000' },
              { position: 0.67, color: '#ffffffff' },
              { position: 1, color: '#ffffff88' }
            ])
            done()
          })
      })
    })
  })

  describe('/clients/{client_id}/keys/{key_id}/effects/{effect_id}', () => {
    describe('color effect', () => {
      it('should list details of the given effect', done => {
        request.get('/clients/client1/keys/a/effects/colorEffect')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body).to.contain({
              effect: 'color',
              color: '#ff0000ff'
            })
            done()
          })
      })
    })

    describe('gradient effect', () => {
      it('should list details of the given effect', done => {
        request.get('/clients/client1/keys/a/effects/gradientEffect')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body).to.contain({
              effect: 'gradient',
              loop_count: 1,
              duration: 1
            })
            expect(res.body.color_stops).to.deep.equal([
              { position: 0, color: '#ff0000ff' },
              { position: 1, color: '#00000000' }
            ])
            done()
          })
      })
    })

    it('should reject invalid effectIDs', done => {
      request.get('/clients/client1/keys/a/effects/invalidEffect')
        .expect(400)
        .end(done)
    })

    it('should remove the given effect upon DELETE', done => {
      request.delete('/clients/client1/keys/a/effects/colorEffect')
        .expect(204)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.not.contain({
            effect: 'color',
            color: '#ff0000ff'
          })
          done()
        })
    })
  })
})
