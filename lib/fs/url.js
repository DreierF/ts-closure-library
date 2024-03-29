/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Wrapper for URL and its createObjectUrl and revokeObjectUrl
 * methods that are part of the HTML5 File API.
 */

/**
 * Creates a blob URL for a blob object.
 * Throws an error if the browser does not support Object Urls.
 *
 * @param {!File|!Blob|!MediaSource|!MediaStream} obj The object for which
 *   to create the URL.
 * @return {string} The URL for the object.
 */
function createObjectUrl(obj) {
  return getUrlObject_().createObjectURL(obj);
};

/**
 * Revokes a URL created by {@link createObjectUrl}.
 * Throws an error if the browser does not support Object Urls.
 *
 * @param {string} url The URL to revoke.
 * @return {void}
 */
function revokeObjectUrl(url) {
  getUrlObject_().revokeObjectURL(url);
};

/**
 * @record
 * @private
 */
function UrlObject_() {};

/**
 * @param {!File|!Blob|!MediaSource|!MediaStream} arg
 * @return {string}
 */
UrlObject_.prototype.createObjectURL = function(arg) {};

/**
 * @param {string} s
 * @return {void}
 */
UrlObject_.prototype.revokeObjectURL = function(s) {};

/**
 * Get the object that has the createObjectURL and revokeObjectURL functions for
 * this browser.
 *
 * @return {!UrlObject_} The object for this browser.
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
    return /** @type {!UrlObject_} */ (window.URL);
    // This is what the spec used to say to do
  } else if (window.createObjectURL !== undefined) {
    return /** @type {!UrlObject_} */ (window);
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