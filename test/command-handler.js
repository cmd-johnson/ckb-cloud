/* global describe, it */
'use strict'

const { CommandHandler } = require('../lib/command-handler')

const { expect } = require('chai')
const Promise = require('bluebird')

describe('CommandHandler base class', () => {
  const commandHandler = new CommandHandler()
  const shouldntBeCalled = () => Promise.reject('Shouldn\'t be called')
  const shouldBeNotOverriddenError = err => {
    expect(err.getPublicError()).to.contain({
      status: 500,
      message: 'Not overridden'
    })
  }

  it('should return a rejected promise when calling listClients', () => {
    return commandHandler.listClients().then(shouldntBeCalled, shouldBeNotOverriddenError)
  })

  it('should return a rejected promise when calling getClient', () => {
    return commandHandler.getClient().then(shouldntBeCalled, shouldBeNotOverriddenError)
  })

  it('should return a rejected promise when calling listKeys', () => {
    return commandHandler.listKeys().then(shouldntBeCalled, shouldBeNotOverriddenError)
  })

  it('should return a rejected promise when calling getKey', () => {
    return commandHandler.getKey().then(shouldntBeCalled, shouldBeNotOverriddenError)
  })

  it('should return a rejected promise when calling listKeyEffects', () => {
    return commandHandler.listKeyEffects().then(shouldntBeCalled, shouldBeNotOverriddenError)
  })

  it('should return a rejected promise when calling addKeyEffect', () => {
    return commandHandler.addKeyEffect().then(shouldntBeCalled, shouldBeNotOverriddenError)
  })

  it('should return a rejected promise when calling clearAllKeyEffects', () => {
    return commandHandler.clearAllKeyEffects().then(shouldntBeCalled, shouldBeNotOverriddenError)
  })

  it('should return a rejected promise when calling getKeyEffect', () => {
    return commandHandler.getKeyEffect().then(shouldntBeCalled, shouldBeNotOverriddenError)
  })

  it('should return a rejected promise when calling clearKeyEffect', () => {
    return commandHandler.clearKeyEffect().then(shouldntBeCalled, shouldBeNotOverriddenError)
  })
})
