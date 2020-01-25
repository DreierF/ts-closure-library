import * as asserts from './../asserts/asserts.js';
import * as json from './json.js';
// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Utility to attempt native JSON processing, falling back to
 *     json if not available.
 *
 *     This is intended as a drop-in for current users of json who want
 *     to take advantage of native JSON if present.
 */

/**
 * Attempts to serialize the JSON string natively, falling back to
 * `json.serialize` if unsuccessful.
 * @param {!Object} obj JavaScript object to serialize to JSON.
 * @return {string} Resulting JSON string.
 */
let stringify =
    json.USE_NATIVE_JSON ? window['JSON']['stringify'] : function(
                                                                       obj) {
      if (window.JSON) {
        try {
          return window.JSON.stringify(obj);
        } catch (e) {
          // Native serialization failed.  Fall through to retry with
          // json.serialize.
        }
      }

      return json.serialize(obj);
    };

/**
 * Attempts to parse the JSON string natively, falling back to
 * the supplied `fallbackParser` if unsuccessful.
 * @param {string} jsonString JSON string to parse.
 * @param {function(string):Object} fallbackParser Fallback JSON parser used
 *     if native
 * @return {?Object} Resulting JSON object.
 * @private
 */
function parse_(jsonString, fallbackParser) {
  if (window.JSON) {
    try {
      var obj = window.JSON.parse(jsonString);
      asserts.assert(typeof obj == 'object');
      return /** @type {?Object} */ (obj);
    } catch (e) {
      // Native parse failed.  Fall through to retry with json.parse.
    }
  }

  return fallbackParser(jsonString);
};

/**
 * Attempts to parse the JSON string natively, falling back to
 * `json.parse` if unsuccessful.
 * @param {string} jsonString JSON string to parse.
 * @return {?Object} Resulting JSON object.
 */
let parse =
    json.USE_NATIVE_JSON ? window['JSON']['parse'] : function(
                                                                   jsonString) {
      return parse_(jsonString, json.parse);
    };

export {parse, stringify};