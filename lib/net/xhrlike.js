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
 * Interface for the common parts of XMLHttpRequest.
 *
 * Mostly copied from externs/w3c_xml.js.
 *
 * @interface
 * @see http://www.w3.org/TR/XMLHttpRequest/
 */
class XhrLike {

  /**
   * Interface for the common parts of XMLHttpRequest.
   *
   * Mostly copied from externs/w3c_xml.js.
   *
   * @see http://www.w3.org/TR/XMLHttpRequest/
   */
  constructor() {
    /**
     * @type {function()|null|undefined}
     * @see http://www.w3.org/TR/XMLHttpRequest/#handler-xhr-onreadystatechange
     */
    this.onreadystatechange = undefined;
  
    /**
     * @type {?ArrayBuffer|?Blob|?Document|?Object|?string}
     * @see https://xhr.spec.whatwg.org/#response-object
     */
    this.response = null;
  
    /**
     * @type {string|null}
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-responsetext-attribute
     */
    this.responseText = null;
  
    /**
     * @type {string|null}
     * @see https://xhr.spec.whatwg.org/#the-responsetype-attribute
     */
    this.responseType = null;
  
    /**
     * @type {Document}
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-responsexml-attribute
     */
    this.responseXML = null;
  
    /**
     * @type {number|null}
     * @see http://www.w3.org/TR/XMLHttpRequest/#readystate
     */
    this.readyState = null;
  
    /**
     * @type {number|null}
     * @see http://www.w3.org/TR/XMLHttpRequest/#status
     */
    this.status = null;
  
    /**
     * @type {string|null}
     * @see http://www.w3.org/TR/XMLHttpRequest/#statustext
     */
    this.statusText = null;
  }

  /**
   * @param {string} method
   * @param {string} url
   * @param {?boolean=} opt_async
   * @param {?string=} opt_user
   * @param {?string=} opt_password
   * @see http://www.w3.org/TR/XMLHttpRequest/#the-open()-method
   */
  open(
      method, url, opt_async, opt_user, opt_password) {};

  /**
   * @param {ArrayBuffer|ArrayBufferView|Blob|Document|FormData|string=} opt_data
   * @see http://www.w3.org/TR/XMLHttpRequest/#the-send()-method
   */
  send(opt_data) {};

  /**
   * @see http://www.w3.org/TR/XMLHttpRequest/#the-abort()-method
   */
  abort() {};

  /**
   * @param {string} header
   * @param {string} value
   * @see http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader()-method
   */
  setRequestHeader(header, value) {};

  /**
   * @param {string} header
   * @return {string}
   * @see http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader()-method
   */
  getResponseHeader(header) {};

  /**
   * @return {string}
   * @see http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders()-method
   */
  getAllResponseHeaders() {};
}

/**
 * Typedef that refers to either native or custom-implemented XHR objects.
 * @typedef {!XhrLike|!XMLHttpRequest}
 */
XhrLike.OrNative;

export {XhrLike};