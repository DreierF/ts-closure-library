/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Options for rendering matches.
 */

/**
 * A simple class that contains options for rendering a set of autocomplete
 * matches.  Used as an optional argument in the callback from the matcher.
 */
class RenderOptions {

  /**
   * A simple class that contains options for rendering a set of autocomplete
   * matches.  Used as an optional argument in the callback from the matcher.
   */
  constructor() {
    /**
     * Whether the current highlighting is to be preserved when displaying the new
     * set of matches.
     * @type {boolean}
     * @private
     */
    this.preserveHilited_ = false;
  
    /**
     * Whether the first match is to be highlighted.  When undefined the autoHilite
     * flag of the autocomplete is used.
     * @type {boolean|undefined}
     * @private
     */
    this.autoHilite_ = undefined;
  }

  /**
   * @param {boolean} flag The new value for the preserveHilited_ flag.
   */
  setPreserveHilited(flag) {
    this.preserveHilited_ = flag;
  };

  /**
   * @return {boolean} The value of the preserveHilited_ flag.
   */
  getPreserveHilited() {
    return this.preserveHilited_;
  };

  /**
   * @param {boolean} flag The new value for the autoHilite_ flag.
   */
  setAutoHilite(flag) {
    this.autoHilite_ = flag;
  };

  /**
   * @return {boolean|undefined} The value of the autoHilite_ flag.
   */
  getAutoHilite() {
    return this.autoHilite_;
  };
}

export {RenderOptions};