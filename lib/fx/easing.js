// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Easing functions for animations.
 */

/**
 * Ease in - Start slow and speed up.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 */
function easeIn(t) {
  return easeInInternal_(t, 3);
};

/**
 * Ease in with specifiable exponent.
 * @param {number} t Input between 0 and 1.
 * @param {number} exp Ease exponent.
 * @return {number} Output between 0 and 1.
 * @private
 */
function easeInInternal_(t, exp) {
  return Math.pow(t, exp);
};

/**
 * Ease out - Start fastest and slows to a stop.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 */
function easeOut(t) {
  return easeOutInternal_(t, 3);
};

/**
 * Ease out with specifiable exponent.
 * @param {number} t Input between 0 and 1.
 * @param {number} exp Ease exponent.
 * @return {number} Output between 0 and 1.
 * @private
 */
function easeOutInternal_(t, exp) {
  return 1 - easeInInternal_(1 - t, exp);
};

/**
 * Ease out long - Start fastest and slows to a stop with a long ease.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 */
function easeOutLong(t) {
  return easeOutInternal_(t, 4);
};

/**
 * Ease in and out - Start slow, speed up, then slow down.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 */
function inAndOut(t) {
  return 3 * t * t - 2 * t * t * t;
};

export {easeIn, easeOut, easeOutLong, inAndOut};