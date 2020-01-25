import * as strings from './../string/string.js';
import * as userAgent from './../useragent/useragent.js';
// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Vendor prefix getters.
 */

/**
 * Returns the JS vendor prefix used in CSS properties. Different vendors
 * use different methods of changing the case of the property names.
 *
 * @return {?string} The JS vendor prefix or null if there is none.
 */
function getVendorJsPrefix() {
  if (userAgent.WEBKIT) {
    return 'Webkit';
  } else if (userAgent.GECKO) {
    return 'Moz';
  } else if (userAgent.IE) {
    return 'ms';
  } else if (userAgent.OPERA) {
    return 'O';
  }

  return null;
};

/**
 * Returns the vendor prefix used in CSS properties.
 *
 * @return {?string} The vendor prefix or null if there is none.
 */
function getVendorPrefix() {
  if (userAgent.WEBKIT) {
    return '-webkit';
  } else if (userAgent.GECKO) {
    return '-moz';
  } else if (userAgent.IE) {
    return '-ms';
  } else if (userAgent.OPERA) {
    return '-o';
  }

  return null;
};

/**
 * @param {string} propertyName A property name.
 * @param {!Object=} opt_object If provided, we verify if the property exists in
 *     the object.
 * @return {?string} A vendor prefixed property name, or null if it does not
 *     exist.
 */
function getPrefixedPropertyName(propertyName, opt_object) {
  // We first check for a non-prefixed property, if available.
  if (opt_object && propertyName in opt_object) {
    return propertyName;
  }
  var prefix = getVendorJsPrefix();
  if (prefix) {
    prefix = prefix.toLowerCase();
    var prefixedPropertyName = prefix + strings.toTitleCase(propertyName);
    return (opt_object === undefined || prefixedPropertyName in opt_object) ?
        prefixedPropertyName :
        null;
  }
  return null;
};

/**
 * @param {string} eventType An event type.
 * @return {string} A lower-cased vendor prefixed event type.
 */
function getPrefixedEventType(eventType) {
  var prefix = getVendorJsPrefix() || '';
  return (prefix + eventType).toLowerCase();
};

export {getPrefixedEventType, getPrefixedPropertyName, getVendorJsPrefix, getVendorPrefix};