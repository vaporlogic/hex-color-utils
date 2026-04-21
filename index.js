'use strict';

/**
 * hex-color-utils v1.0.0
 * Hex ↔ RGB conversion only. HSL support added in v1.1.0.
 */

function hexToRgb(hex) {
  var clean = hex.replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  if (clean.length !== 6) throw new Error('Invalid hex color: ' + hex);
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex(rgb) {
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(function (n) { return n.toString(16).padStart(2, '0'); })
    .join('');
}

module.exports = { hexToRgb, rgbToHex };
