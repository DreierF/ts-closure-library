import * as asserts from './../asserts/asserts.js';
import {Error as DebugError} from './../debug/error.js';
import * as goog_object from './../object/object.js';
import * as strings from './../string/string.js';
// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview A wrapper for the HTML5 FileError object.
 */

// TODO(b/130421259): We're trying to migrate all ES5 subclasses of Closure
// Library to ES6. In ES6 this cannot be referenced before super is called. This
// file has at least one this before a super call (in ES5) and cannot be
// automatically upgraded to ES6 as a result. Please fix this if you have a
// chance. Note: This can sometimes be caused by not calling the super
// constructor at all. You can run the conversion tool yourself to see what it
// does on this file: blaze run //javascript/refactoring/es6_classes:convert.

/** @record */
function DOMErrorLike() {};

/** @type {string|undefined} */
DOMErrorLike.prototype.name;

/** @type {!ErrorCode|undefined} */
DOMErrorLike.prototype.code;

/**
 * A filesystem error. Since the filesystem API is asynchronous, stack traces
 * are less useful for identifying where errors come from, so this includes a
 * large amount of metadata in the message.
 *
 * @extends {DebugError}
 * @final
 */
class fs_Error extends DebugError {

  /**
   * A filesystem error. Since the filesystem API is asynchronous, stack traces
   * are less useful for identifying where errors come from, so this includes a
   * large amount of metadata in the message.
   *
   * @param {!DOMError|!DOMErrorLike} error
   * @param {string} action The action being undertaken when the error was raised.
   */
  constructor(error, action) {
    let tempName = null;
    let tempCode = null;
  
    if (error.name !== undefined) {
      tempName = error.name;
      // TODO(user): Remove warning suppression after JSCompiler stops
      // firing a spurious warning here.
      /** @suppress {deprecated} */
      tempCode = fs_Error.getCodeFromName_(error.name);
    } else {
      tempCode = /** @type {!ErrorCode} */ (
          asserts.assertNumber(error.code));
      tempName = fs_Error.getNameFromCode_(tempCode);
    }
  
    super(strings.subs('%s %s', this.name, action));
  
    /** @type {string} */
    this.name = tempName;
  
    /**
     * @type {!ErrorCode}
     * @deprecated Use the 'name' or 'message' field instead.
     */
    this.code = tempCode;
  }

  /**
   * @param {ErrorCode|undefined} code
   * @return {string} name
   * @private
   */
  static getNameFromCode_(code) {
    var name = goog_object.findKey(
        fs_Error.NameToCodeMap_, function(c) { return code == c; });
    if (name === undefined) {
      throw new Error('Invalid code: ' + code);
    }
    return name;
  };

  /**
   * Returns the code that corresponds to the given name.
   * @param {string} name
   * @return {ErrorCode} code
   * @private
   */
  static getCodeFromName_(name) {
    return fs_Error.NameToCodeMap_[name];
  };
}

/**
 * Names of errors that may be thrown by the File API, the File System API, or
 * the File Writer API.
 *
 * @see http://dev.w3.org/2006/webapi/FileAPI/#ErrorAndException
 * @see http://www.w3.org/TR/file-system-api/#definitions
 * @see http://dev.w3.org/2009/dap/file-system/file-writer.html#definitions
 * @enum {string}
 */
fs_Error.ErrorName = {
  ABORT: 'AbortError',
  ENCODING: 'EncodingError',
  INVALID_MODIFICATION: 'InvalidModificationError',
  INVALID_STATE: 'InvalidStateError',
  NOT_FOUND: 'NotFoundError',
  NOT_READABLE: 'NotReadableError',
  NO_MODIFICATION_ALLOWED: 'NoModificationAllowedError',
  PATH_EXISTS: 'PathExistsError',
  QUOTA_EXCEEDED: 'QuotaExceededError',
  SECURITY: 'SecurityError',
  SYNTAX: 'SyntaxError',
  TYPE_MISMATCH: 'TypeMismatchError'
};

/**
 * Error codes for file errors.
 * @see http://www.w3.org/TR/file-system-api/#idl-def-FileException
 *
 * @enum {number}
 * @deprecated Use the 'name' or 'message' attribute instead.
 */
let ErrorCode = {
  NOT_FOUND: 1,
  SECURITY: 2,
  ABORT: 3,
  NOT_READABLE: 4,
  ENCODING: 5,
  NO_MODIFICATION_ALLOWED: 6,
  INVALID_STATE: 7,
  SYNTAX: 8,
  INVALID_MODIFICATION: 9,
  QUOTA_EXCEEDED: 10,
  TYPE_MISMATCH: 11,
  PATH_EXISTS: 12
};

/**
 * Mapping from error names to values from the ErrorCode enum.
 * @see http://www.w3.org/TR/file-system-api/#definitions.
 * @private {!Object<string, ErrorCode>}
 */
fs_Error.NameToCodeMap_ = goog_object.create(
    fs_Error.ErrorName.ABORT, ErrorCode.ABORT,

    fs_Error.ErrorName.ENCODING, ErrorCode.ENCODING,

    fs_Error.ErrorName.INVALID_MODIFICATION,
    ErrorCode.INVALID_MODIFICATION,

    fs_Error.ErrorName.INVALID_STATE,
    ErrorCode.INVALID_STATE,

    fs_Error.ErrorName.NOT_FOUND, ErrorCode.NOT_FOUND,

    fs_Error.ErrorName.NOT_READABLE, ErrorCode.NOT_READABLE,

    fs_Error.ErrorName.NO_MODIFICATION_ALLOWED,
    ErrorCode.NO_MODIFICATION_ALLOWED,

    fs_Error.ErrorName.PATH_EXISTS, ErrorCode.PATH_EXISTS,

    fs_Error.ErrorName.QUOTA_EXCEEDED,
    ErrorCode.QUOTA_EXCEEDED,

    fs_Error.ErrorName.SECURITY, ErrorCode.SECURITY,

    fs_Error.ErrorName.SYNTAX, ErrorCode.SYNTAX,

    fs_Error.ErrorName.TYPE_MISMATCH,
    ErrorCode.TYPE_MISMATCH);

export {DOMErrorLike, ErrorCode, fs_Error as Error};