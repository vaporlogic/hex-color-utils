'use strict';

/**
 * hex-color-utils — Convert between hex, RGB, and HSL color formats.
 */

/**
 * Parse a hex color string into { r, g, b }.
 * Accepts 3-digit (#abc) and 6-digit (#aabbcc) formats.
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number }}
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

/**
 * Convert { r, g, b } to a hex color string.
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {string} e.g. "#1a2b3c"
 */
function rgbToHex(rgb) {
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(function (n) { return n.toString(16).padStart(2, '0'); })
    .join('');
}

/**
 * Convert { r, g, b } to { h, s, l }.
 * h is in [0, 360], s and l in [0, 100].
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {{ h: number, s: number, l: number }}
 */
function rgbToHsl(rgb) {
  var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var l = (max + min) / 2;
  var h = 0, s = 0;

  if (max !== min) {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6;                break;
      case b: h = ((r - g) / d + 4) / 6;                break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert a hex color string directly to { h, s, l }.
 * @param {string} hex
 * @returns {{ h: number, s: number, l: number }}
 */
function hexToHsl(hex) {
  return rgbToHsl(hexToRgb(hex));
}

/**
 * Lighten a hex color by a given percentage.
 * @param {string} hex
 * @param {number} amount - 0 to 100
 * @returns {string}
 */
function lighten(hex, amount) {
  var hsl = hexToHsl(hex);
  hsl.l = Math.min(100, hsl.l + amount);
  return hslToHex(hsl);
}

/**
 * Darken a hex color by a given percentage.
 * @param {string} hex
 * @param {number} amount - 0 to 100
 * @returns {string}
 */
function darken(hex, amount) {
  return lighten(hex, -amount);
}

function _hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/**
 * Convert { h, s, l } to { r, g, b }.
 * @param {{ h: number, s: number, l: number }} hsl
 * @returns {{ r: number, g: number, b: number }}
 */
function hslToRgb(hsl) {
  var h = hsl.h / 360, s = hsl.s / 100, l = hsl.l / 100;
  if (s === 0) {
    var val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }
  var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  var p = 2 * l - q;
  return {
    r: Math.round(_hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(_hue2rgb(p, q, h)         * 255),
    b: Math.round(_hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Convert { h, s, l } to a hex color string.
 * @param {{ h: number, s: number, l: number }} hsl
 * @returns {string}
 */
function hslToHex(hsl) {
  return rgbToHex(hslToRgb(hsl));
}

module.exports = { hexToRgb, rgbToHex, hexToHsl, hslToHex, hslToRgb, rgbToHsl, lighten, darken };
