import {XhrLike} from './xhrlike.js';
// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Interface for a factory for creating XMLHttpRequest objects
 * and metadata about them.
 */

/**  Typedef. */

/**
 * Abstract base class for an XmlHttpRequest factory.
 * @abstract
 */
class net_XmlHttpFactory {

  /**
   * Abstract base class for an XmlHttpRequest factory.
   */
  constructor() {
    /**
     * Cache of options - we only actually call internalGetOptions once.
     * @type {?Object}
     * @private
     */
    this.cachedOptions_ = null;
  }

  /**
   * @return {!XhrLike.OrNative} A new XhrLike instance.
   * @abstract
   */
  createInstance() {}

  /**
   * @return {Object} Options describing how xhr objects obtained from this
   *     factory should be used.
   */
  getOptions() {
    return this.cachedOptions_ ||
        (this.cachedOptions_ = this.internalGetOptions());
  };

  /**
   * Override this method in subclasses to preserve the caching offered by
   * getOptions().
   * @return {Object} Options describing how xhr objects obtained from this
   *     factory should be used.
   * @protected
   * @abstract
   */
  internalGetOptions() {}
}

export {net_XmlHttpFactory as XmlHttpFactory};