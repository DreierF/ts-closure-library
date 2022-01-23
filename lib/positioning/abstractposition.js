import {Box} from './../math/box.js';
import {Size} from './../math/size.js';
import {Corner} from './positioning.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Abstract base class for positioning implementations.
 */

/**
 * Abstract position object. Encapsulates position and overflow handling.
 *
 */
class AbstractPosition {

  /**
   * Abstract position object. Encapsulates position and overflow handling.
   *
   */
  constructor() {}

  /**
   * Repositions the element. Abstract method, should be overloaded.
   *
   * @param {Element} movableElement Element to position.
   * @param {Corner} corner Corner of the movable element that
   *     should be positioned adjacent to the anchored element.
   * @param {Box=} opt_margin A margin specified in pixels.
   * @param {Size=} opt_preferredSize PreferredSize of the
   *     movableElement.
   */
  reposition(
      movableElement, corner, opt_margin, opt_preferredSize) {};
}

export {AbstractPosition};