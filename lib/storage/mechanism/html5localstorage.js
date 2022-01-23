import {HTML5WebStorage} from './html5webstorage.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Provides data persistence using HTML5 local storage
 * mechanism. Local storage must be available under window.localStorage,
 * see: http://www.w3.org/TR/webstorage/#the-localstorage-attribute.
 */

/**
 * Provides a storage mechanism that uses HTML5 local storage.
 *
 * @class
 * @extends {HTML5WebStorage}
 */
class HTML5LocalStorage extends HTML5WebStorage {

  /**
   * Provides a storage mechanism that uses HTML5 local storage.
   *
   */
  constructor() {
    var storage = null;
  
    try {
      // May throw an exception in cases where the local storage object
      // is visible but access to it is disabled.
      storage = window.localStorage || null;
    } catch (e) {
    }
    super(storage);
  }
}

export {HTML5LocalStorage};