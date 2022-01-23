/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Wrappers for the HTML5 File API. These wrappers closely mirror
 * the underlying APIs, but use Closure-style events and Deferred return values.
 * Their existence also makes it possible to mock the FileSystem API for testing
 * in browsers that don't support it natively.
 *
 * When adding public functions to anything under this namespace, be sure to add
 * its mock counterpart to goog.testing.fs.
 */
/**
 * Concatenates one or more values together and converts them to a Blob.
 *
 * @param {...(string|!Blob|!ArrayBuffer)} var_args The values that will make up
 *     the resulting blob.
 * @return {!Blob} The blob.
 */
export function getBlob(...args: (string | ArrayBuffer | Blob)[]): Blob;
/**
 * Creates a blob with the given properties.
 * See https://developer.mozilla.org/en-US/docs/Web/API/Blob for more details.
 *
 * @param {!Array<string|!Blob|!ArrayBuffer>} parts The values that will make up
 *     the resulting blob (subset supported by both BlobBuilder.append() and
 *     Blob constructor).
 * @param {string=} opt_type The MIME type of the Blob.
 * @param {string=} opt_endings Specifies how strings containing newlines are to
 *     be written out.
 * @return {!Blob} The blob.
 */
export function getBlobWithProperties(parts: Array<string | Blob | ArrayBuffer>, opt_type?: string | undefined, opt_endings?: string | undefined): Blob;
