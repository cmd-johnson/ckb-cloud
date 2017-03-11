/* global describe, it */
'use strict'

const { colorToRGBA } = require('../lib/util/colors')

const { expect } = require('chai')

describe('utils', () => {
  describe('colorToRGBA', () => {
    it('should be able to parse named colors', () => {
      expect(colorToRGBA('red')).to.equal('#ff0000ff')
    })

    it('should be able to parse transparent named colors', () => {
      expect(colorToRGBA('50% green')).to.equal('#0080007f')
    })

    it('should be able to parse the color `transparent`', () => {
      expect(colorToRGBA('transparent')).to.equal('#00000000')
    })

    it('should be able to parse colors in the #rgb format', () => {
      expect(colorToRGBA('#f82')).to.equal('#ff8822ff')
    })

    it('should be able to parse colors in the #rgba format', () => {
      expect(colorToRGBA('#f827')).to.equal('#ff882277')
    })

    it('should be able to parse colors in the #rrggbb format', () => {
      expect(colorToRGBA('#beefed')).to.equal('#beefedff')
    })

    it('should be able to parse colors in the #rrggbbaa format', () => {
      expect(colorToRGBA('#deadbeef')).to.equal('#deadbeef')
    })

    it('should return `undefined` when the input isn\'t a string', () => {
      expect(colorToRGBA(123)).to.be.undefined
    })

    it('should return `undefined` when the named color is unknown', () => {
      expect(colorToRGBA('unknown')).to.be.undefined
    })

    it('should return `undefined` when the input is a hex string with an invalid number of digits', () => {
      expect(colorToRGBA('#1234567')).to.be.undefined
    })

    it('should return `undefined` when the input isn\'t a color string at all', () => {
      expect(colorToRGBA('this shouldn\'t work')).to.be.undefined
    })
  })
})
