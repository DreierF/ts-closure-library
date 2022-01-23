/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A record declaration to allow ClientRect and other rectangle
 * like objects to be used with goog.math.Rect.
 */

/**
 * Record for representing rectangular regions, allows compatibility between
 * things like ClientRect and goog.math.Rect.
 *
 * @record
 */
function IRect() {};

/** @type {number} */
IRect.prototype.left;

/** @type {number} */
IRect.prototype.top;

/** @type {number} */
IRect.prototype.width;

/** @type {number} */
IRect.prototype.height;

export {IRect};