// Copyright 2017 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Provides methods dealing with context on error objects.
 */

/**
 * Adds key-value context to the error.
 * @param {!Error} err The error to add context to.
 * @param {string} contextKey Key for the context to be added.
 * @param {string} contextValue Value for the context to be added.
 */
function addErrorContext(
    err, contextKey, contextValue) {
  if (!err[CONTEXT_KEY_]) {
    err[CONTEXT_KEY_] = {};
  }
  err[CONTEXT_KEY_][contextKey] = contextValue;
};

/**
 * @param {!Error} err The error to get context from.
 * @return {!Object<string, string>} The context of the provided error.
 */
function getErrorContext(err) {
  return err[CONTEXT_KEY_] || {};
};

// TODO(user): convert this to a Symbol once goog.debug.ErrorReporter is
// able to use ES6.
/** @private @const {string} */
let CONTEXT_KEY_ = '__closure__error__context__984382';

export {addErrorContext, getErrorContext};