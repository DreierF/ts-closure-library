import * as strings from './../string/string.js';
import * as userAgent from './../useragent/useragent.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

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