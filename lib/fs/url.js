// Copyright 2015 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Wrapper for URL and its createObjectUrl and revokeObjectUrl
 * methods that are part of the HTML5 File API.
 */

/**
 * Creates a blob URL for a blob object.
 * Throws an error if the browser does not support Object Urls.
 *
 * @param {!Blob} blob The object for which to create the URL.
 * @return {string} The URL for the object.
 */
function createObjectUrl(blob) {
  return getUrlObject_().createObjectURL(blob);
};

/**
 * Revokes a URL created by {@link createObjectUrl}.
 * Throws an error if the browser does not support Object Urls.
 *
 * @param {string} url The URL to revoke.
 */
function revokeObjectUrl(url) {
  getUrlObject_().revokeObjectURL(url);
};

/**
 * @typedef {{createObjectURL: (function(!Blob): string),
 *            revokeObjectURL: function(string): void}}
 */
let UrlObject_;

/**
 * Get the object that has the createObjectURL and revokeObjectURL functions for
 * this browser.
 *
 * @return {UrlObject_} The object for this browser.
 * @private
 */
function getUrlObject_() {
  const urlObject = findUrlObject_();
  if (urlObject != null) {
    return urlObject;
  } else {
    throw new Error('This browser doesn\'t seem to support blob URLs');
  }
};

/**
 * Finds the object that has the createObjectURL and revokeObjectURL functions
 * for this browser.
 *
 * @return {?UrlObject_} The object for this browser or null if the
 *     browser does not support Object Urls.
 * @private
 */
function findUrlObject_() {
  // This is what the spec says to do
  // http://dev.w3.org/2006/webapi/FileAPI/#dfn-createObjectURL
  if (window.URL !== undefined &&
      window.URL.createObjectURL !== undefined) {
    return /** @type {UrlObject_} */ (window.URL);
    // This is what Chrome does (as of 10.0.648.6 dev)
  } else if (
      window.webkitURL !== undefined &&
      window.webkitURL.createObjectURL !== undefined) {
    return /** @type {UrlObject_} */ (window.webkitURL);
    // This is what the spec used to say to do
  } else if (window.createObjectURL !== undefined) {
    return /** @type {UrlObject_} */ (window);
  } else {
    return null;
  }
};

/**
 * Checks whether this browser supports Object Urls. If not, calls to
 * createObjectUrl and revokeObjectUrl will result in an error.
 *
 * @return {boolean} True if this browser supports Object Urls.
 */
function browserSupportsObjectUrls() {
  return findUrlObject_() != null;
};

export {browserSupportsObjectUrls, createObjectUrl, revokeObjectUrl};