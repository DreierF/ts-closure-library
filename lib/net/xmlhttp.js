import * as asserts from './../asserts/asserts.js';
import * as google from './../google.js';
import {WrapperXmlHttpFactory} from './wrapperxmlhttpfactory.js';
import {XhrLike} from './xhrlike.js';
import {XmlHttpFactory as NetXmlHttpFactory} from './xmlhttpfactory.js';
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
 * @fileoverview Low level handling of XMLHttpRequest.
 */

/**
 * Static class for creating XMLHttpRequest objects.
 * @return {!XhrLike.OrNative} A new XMLHttpRequest object.
 * @suppress {checkTypes}
 */
function XmlHttp() {
  return XmlHttp.factory_.createInstance();
};

/**
 * @type {boolean} Whether to assume XMLHttpRequest exists. Setting this to
 *     true bypasses the ActiveX probing code.
 * NOTE(ruilopes): Due to the way JSCompiler works, this define *will not* strip
 * out the ActiveX probing code from binaries.  To achieve this, use
 * `ASSUME_NATIVE_XHR` instead.
 * TODO(ruilopes): Collapse both defines.
 */

/** @const */
let XmlHttpDefines = {};

/**
 * @type {boolean} Whether to assume XMLHttpRequest exists. Setting this to
 *     true eliminates the ActiveX probing code.
 */
const ASSUME_NATIVE_XHR = false;

/**
 * Gets the options to use with the XMLHttpRequest objects obtained using
 * the static methods.
 * @return {Object} The options.
 */
XmlHttp.getOptions = function() {
  return XmlHttp.factory_.getOptions();
};

/**
 * Type of options that an XmlHttp object can have.
 * @enum {number}
 */
let OptionType = {
  /**
   * Whether a google.nullFunction should be used to clear the onreadystatechange
   * handler instead of null.
   */
  USE_NULL_FUNCTION: 0,

  /**
   * NOTE(user): In IE if send() errors on a *local* request the readystate
   * is still changed to COMPLETE.  We need to ignore it and allow the
   * try/catch around send() to pick up the error.
   */
  LOCAL_REQUEST_ERROR: 1,
};

/**
 * Status constants for XMLHTTP, matches:
 * https://msdn.microsoft.com/en-us/library/ms534361(v=vs.85).aspx
 * @enum {number}
 */
let ReadyState = {
  /**
   * Constant for when xmlhttprequest.readyState is uninitialized
   */
  UNINITIALIZED: 0,

  /**
   * Constant for when xmlhttprequest.readyState is loading.
   */
  LOADING: 1,

  /**
   * Constant for when xmlhttprequest.readyState is loaded.
   */
  LOADED: 2,

  /**
   * Constant for when xmlhttprequest.readyState is in an interactive state.
   */
  INTERACTIVE: 3,

  /**
   * Constant for when xmlhttprequest.readyState is completed
   */
  COMPLETE: 4,
};

/**
 * The global factory instance for creating XMLHttpRequest objects.
 * @type {NetXmlHttpFactory}
 * @private
 */
XmlHttp.factory_;

/**
 * Sets the factories for creating XMLHttpRequest objects and their options.
 * @param {Function} factory The factory for XMLHttpRequest objects.
 * @param {Function} optionsFactory The factory for options.
 * @deprecated Use setGlobalFactory instead.
 */
XmlHttp.setFactory = function(factory, optionsFactory) {
  XmlHttp.setGlobalFactory(
      new WrapperXmlHttpFactory(
          asserts.assert(factory), asserts.assert(optionsFactory)));
};

/**
 * Sets the global factory object.
 * @param {!NetXmlHttpFactory} factory New global factory object.
 */
XmlHttp.setGlobalFactory = function(factory) {
  XmlHttp.factory_ = factory;
};

/**
 * Default factory to use when creating xhr objects.  You probably shouldn't be
 * instantiating this directly, but rather using it via XmlHttp.
 * @extends {NetXmlHttpFactory}
 */
class DefaultXmlHttpFactory extends NetXmlHttpFactory {

  /**
   * Default factory to use when creating xhr objects.  You probably shouldn't be
   * instantiating this directly, but rather using it via XmlHttp.
   */
  constructor() {
    super();
    /**
     * The ActiveX PROG ID string to use to create xhr's in IE. Lazily initialized.
     * @type {string|undefined}
     * @private
     */
    this.ieProgId_ = undefined;
  
  }

  /** @override */
  createInstance() {
    var progId = this.getProgId_();
    if (progId) {
      return new ActiveXObject(progId);
    } else {
      return new XMLHttpRequest();
    }
  };

  /** @override */
  internalGetOptions() {
    var progId = this.getProgId_();
    var options = {};
    if (progId) {
      options[OptionType.USE_NULL_FUNCTION] = true;
      options[OptionType.LOCAL_REQUEST_ERROR] = true;
    }
    return options;
  };

  /**
   * Initialize the private state used by other functions.
   * @return {string} The ActiveX PROG ID string to use to create xhr's in IE.
   * @private
   */
  getProgId_() {
    if (ASSUME_NATIVE_XHR ||
        ASSUME_NATIVE_XHR) {
      return '';
    }
  
    // The following blog post describes what PROG IDs to use to create the
    // XMLHTTP object in Internet Explorer:
    // http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
    // However we do not (yet) fully trust that this will be OK for old versions
    // of IE on Win9x so we therefore keep the last 2.
    if (!this.ieProgId_ && typeof XMLHttpRequest == 'undefined' &&
        typeof ActiveXObject != 'undefined') {
      // Candidate Active X types.
      var ACTIVE_X_IDENTS = [
        'MSXML2.XMLHTTP.6.0',
        'MSXML2.XMLHTTP.3.0',
        'MSXML2.XMLHTTP',
        'Microsoft.XMLHTTP',
      ];
      for (var i = 0; i < ACTIVE_X_IDENTS.length; i++) {
        var candidate = ACTIVE_X_IDENTS[i];
  
        try {
          new ActiveXObject(candidate);
          // NOTE(user): cannot assign progid and return candidate in one line
          // because JSCompiler complaings: BUG 658126
          this.ieProgId_ = candidate;
          return candidate;
        } catch (e) {
          // do nothing; try next choice
        }
      }
  
      // couldn't find any matches
      throw new Error(
          'Could not create ActiveXObject. ActiveX might be disabled,' +
          ' or MSXML might not be installed');
    }
  
    return /** @type {string} */ (this.ieProgId_);
  };
}

// Set the global factory to an instance of the default factory.
XmlHttp.setGlobalFactory(new DefaultXmlHttpFactory());

export {ASSUME_NATIVE_XHR, DefaultXmlHttpFactory, OptionType, ReadyState, XmlHttp, XmlHttpDefines};