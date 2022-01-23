/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A polyfill for window.requestAnimationFrame and
 * window.cancelAnimationFrame.
 * Code based on https://gist.github.com/paulirish/1579671
 */

/**
 * @type {boolean} If true, will install the requestAnimationFrame polyfill.
 */
const ENABLED = true;

/**
 * Installs the requestAnimationFrame (and cancelAnimationFrame) polyfill.
 */
function install() {
  if (ENABLED) {
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    let v;
    for (let i = 0; v = vendors[i] && !window.requestAnimationFrame; ++i) {
      window.requestAnimationFrame =
          window[v + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
          window[v + 'CancelAnimationFrame'] ||
          window[v + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      let lastTime = 0;
      window.requestAnimationFrame = function(callback) {
        const currTime = new Date().getTime();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime));
        lastTime = currTime + timeToCall;
        return window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
      };

      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) { clearTimeout(id); };
      }
    }
  }
};

export {ENABLED, install};