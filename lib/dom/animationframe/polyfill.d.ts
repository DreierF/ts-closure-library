/**
 * @fileoverview A polyfill for window.requestAnimationFrame and
 * window.cancelAnimationFrame.
 * Code based on https://gist.github.com/paulirish/1579671
 */
/**
 * @type {boolean} If true, will install the requestAnimationFrame polyfill.
 */
export const ENABLED: boolean;
/**
 * Installs the requestAnimationFrame (and cancelAnimationFrame) polyfill.
 */
export function install(): void;
