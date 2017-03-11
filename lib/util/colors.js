'use strict'

const colorNames = require('color-name')

function toHex (value, digits) {
  return ('0'.repeat(digits) + value.toString(16)).substr(-digits)
}

function colorToRGBA (string) {
  if (typeof string !== 'string') { return undefined }

  // Match #RGB(A) and #RRGGBB(AA) strings
  let match = string.match(/^#([0-9a-f]{3,8})$/i)
  if (match) {
    const digits = match[1].length
    if (digits === 3 || digits === 4) { // #RGB(A)
      const [r, g, b, a] = match[1].split('')
      return `#${r + r}${g + g}${b + b}${a + a || 'ff'}`
    } else if (digits === 6 || digits === 8) { // #RRGGBB(AA)
      const [r, g, b, a] = match[1].match(/(..)/g)
      return `#${r}${g}${b}${a || 'ff'}`
    } else {
      return undefined
    }
  }

  // Match color names, followed by an optional alpha percentage
  match = string.match(/^(?:(\d{1,3}|\d{0,3}\.\d+)%\s+)?([a-z]+)$/i)
  if (match) {
    const color = match[2]
    const colorComponents = colorNames[color]
    if (!colorComponents) {
      return color === 'transparent' ? '#00000000' : undefined
    }
    const [r, g, b] = colorComponents.map(value => toHex(value, 2))
    const a = match[1] ? toHex((parseFloat(match[1]) * 2.55) | 0, 2) : 'ff'
    return `#${r}${g}${b}${a}`
  }

  return undefined
}

module.exports = {
  colorToRGBA
}
