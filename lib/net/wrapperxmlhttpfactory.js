import {XhrLike} from './xhrlike.js';
import {XmlHttpFactory as NetXmlHttpFactory} from './xmlhttpfactory.js';
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
 * @fileoverview Implementation of XmlHttpFactory which allows construction from
 * simple factory methods.
 */

/**  Typedef. */

/**
 * An xhr factory subclass which can be constructed using two factory methods.
 * This exists partly to allow the preservation of goog.net.XmlHttp.setFactory()
 * with an unchanged signature.
 *     A function which returns a new XHR object.
 *     options associated with xhr objects from this factory.
 * @extends {NetXmlHttpFactory}
 * @final
 */
class WrapperXmlHttpFactory extends NetXmlHttpFactory {

  /**
   * An xhr factory subclass which can be constructed using two factory methods.
   * This exists partly to allow the preservation of goog.net.XmlHttp.setFactory()
   * with an unchanged signature.
   * @param {function():!XhrLike.OrNative} xhrFactory
   *     A function which returns a new XHR object.
   * @param {function():!Object} optionsFactory A function which returns the
   *     options associated with xhr objects from this factory.
   */
  constructor(xhrFactory, optionsFactory) {
    super();
  
    /**
     * XHR factory method.
     * @type {function() : !XhrLike.OrNative}
     * @private
     */
    this.xhrFactory_ = xhrFactory;
  
    /**
     * Options factory method.
     * @type {function() : !Object}
     * @private
     */
    this.optionsFactory_ = optionsFactory;
  }

  /** @override */
  createInstance() {
    return this.xhrFactory_();
  };

  /** @override */
  getOptions() {
    return this.optionsFactory_();
  };

  /**
   * Never called as the only callsite is overwritten. 
   * @override
   */
  internalGetOptions() {};
}

export {WrapperXmlHttpFactory};