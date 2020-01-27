import * as asserts from './../asserts/asserts.js';
import {Dir} from './../i18n/bidi.js';
import {Const} from './../string/const.js';
import * as internal from './../string/internal.js';
import {SafeHtml} from './safehtml.js';
import {SafeScript as Html_SafeScript} from './safescript.js';
import {SafeStyle as Html_SafeStyle} from './safestyle.js';
import {SafeStyleSheet as Html_SafeStyleSheet} from './safestylesheet.js';
import {SafeUrl as Html_SafeUrl} from './safeurl.js';
import {TrustedResourceUrl as Html_TrustedResourceUrl} from './trustedresourceurl.js';
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
 * @fileoverview Unchecked conversions to create values of google.html types from
 * plain strings.  Use of these functions could potentially result in instances
 * of google.html types that violate their type contracts, and hence result in
 * security vulnerabilties.
 *
 * Therefore, all uses of the methods herein must be carefully security
 * reviewed.  Avoid use of the methods in this file whenever possible; instead
 * prefer to create instances of google.html types using inherently safe builders
 * or template systems.
 *
 *
 */

/**
 * Performs an "unchecked conversion" to SafeHtml from a plain string that is
 * known to satisfy the SafeHtml type contract.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the value of `html` satisfies the SafeHtml type contract in all
 * possible program states.
 *
 *
 * @param {!Const} justification A constant string explaining why
 *     this use of this method is safe. May include a security review ticket
 *     number.
 * @param {string} html A string that is claimed to adhere to the SafeHtml
 *     contract.
 * @param {?Dir=} opt_dir The optional directionality of the
 *     SafeHtml to be constructed. A null or undefined value signifies an
 *     unknown directionality.
 * @return {!SafeHtml} The value of html, wrapped in a SafeHtml
 *     object.
 */
function safeHtmlFromStringKnownToSatisfyTypeContract(justification, html, opt_dir) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  asserts.assertString(
      Const.unwrap(justification), 'must provide justification');
  asserts.assert(
      !internal.isEmptyOrWhitespace(
          Const.unwrap(justification)),
      'must provide non-empty justification');
  return SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
      html, opt_dir || null);
};

/**
 * Performs an "unchecked conversion" to SafeScript from a plain string that is
 * known to satisfy the SafeScript type contract.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the value of `script` satisfies the SafeScript type contract in
 * all possible program states.
 *
 *
 * @param {!Const} justification A constant string explaining why
 *     this use of this method is safe. May include a security review ticket
 *     number.
 * @param {string} script The string to wrap as a SafeScript.
 * @return {!Html_SafeScript} The value of `script`, wrapped in a
 *     SafeScript object.
 */
function safeScriptFromStringKnownToSatisfyTypeContract(justification, script) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  asserts.assertString(
      Const.unwrap(justification), 'must provide justification');
  asserts.assert(
      !internal.isEmptyOrWhitespace(
          Const.unwrap(justification)),
      'must provide non-empty justification');
  return Html_SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(
      script);
};

/**
 * Performs an "unchecked conversion" to SafeStyle from a plain string that is
 * known to satisfy the SafeStyle type contract.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the value of `style` satisfies the SafeStyle type contract in all
 * possible program states.
 *
 *
 * @param {!Const} justification A constant string explaining why
 *     this use of this method is safe. May include a security review ticket
 *     number.
 * @param {string} style The string to wrap as a SafeStyle.
 * @return {!Html_SafeStyle} The value of `style`, wrapped in a
 *     SafeStyle object.
 */
function safeStyleFromStringKnownToSatisfyTypeContract(justification, style) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  asserts.assertString(
      Const.unwrap(justification), 'must provide justification');
  asserts.assert(
      !internal.isEmptyOrWhitespace(
          Const.unwrap(justification)),
      'must provide non-empty justification');
  return Html_SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(
      style);
};

/**
 * Performs an "unchecked conversion" to SafeStyleSheet from a plain string
 * that is known to satisfy the SafeStyleSheet type contract.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the value of `styleSheet` satisfies the SafeStyleSheet type
 * contract in all possible program states.
 *
 *
 * @param {!Const} justification A constant string explaining why
 *     this use of this method is safe. May include a security review ticket
 *     number.
 * @param {string} styleSheet The string to wrap as a SafeStyleSheet.
 * @return {!Html_SafeStyleSheet} The value of `styleSheet`, wrapped
 *     in a SafeStyleSheet object.
 */
function safeStyleSheetFromStringKnownToSatisfyTypeContract(
    justification, styleSheet) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  asserts.assertString(
      Const.unwrap(justification), 'must provide justification');
  asserts.assert(
      !internal.isEmptyOrWhitespace(
          Const.unwrap(justification)),
      'must provide non-empty justification');
  return Html_SafeStyleSheet
      .createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheet);
};

/**
 * Performs an "unchecked conversion" to SafeUrl from a plain string that is
 * known to satisfy the SafeUrl type contract.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the value of `url` satisfies the SafeUrl type contract in all
 * possible program states.
 *
 *
 * @param {!Const} justification A constant string explaining why
 *     this use of this method is safe. May include a security review ticket
 *     number.
 * @param {string} url The string to wrap as a SafeUrl.
 * @return {!Html_SafeUrl} The value of `url`, wrapped in a SafeUrl
 *     object.
 */
function safeUrlFromStringKnownToSatisfyTypeContract(justification, url) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  asserts.assertString(
      Const.unwrap(justification), 'must provide justification');
  asserts.assert(
      !internal.isEmptyOrWhitespace(
          Const.unwrap(justification)),
      'must provide non-empty justification');
  return Html_SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};

/**
 * Performs an "unchecked conversion" to TrustedResourceUrl from a plain string
 * that is known to satisfy the TrustedResourceUrl type contract.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the value of `url` satisfies the TrustedResourceUrl type contract
 * in all possible program states.
 *
 *
 * @param {!Const} justification A constant string explaining why
 *     this use of this method is safe. May include a security review ticket
 *     number.
 * @param {string} url The string to wrap as a TrustedResourceUrl.
 * @return {!Html_TrustedResourceUrl} The value of `url`, wrapped in
 *     a TrustedResourceUrl object.
 */
function trustedResourceUrlFromStringKnownToSatisfyTypeContract(
    justification, url) {
  // unwrap() called inside an assert so that justification can be optimized
  // away in production code.
  asserts.assertString(
      Const.unwrap(justification), 'must provide justification');
  asserts.assert(
      !internal.isEmptyOrWhitespace(
          Const.unwrap(justification)),
      'must provide non-empty justification');
  return Html_TrustedResourceUrl
      .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(url);
};

export {safeHtmlFromStringKnownToSatisfyTypeContract, safeScriptFromStringKnownToSatisfyTypeContract, safeStyleFromStringKnownToSatisfyTypeContract, safeStyleSheetFromStringKnownToSatisfyTypeContract, safeUrlFromStringKnownToSatisfyTypeContract, trustedResourceUrlFromStringKnownToSatisfyTypeContract};