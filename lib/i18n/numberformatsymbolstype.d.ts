/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Provide a type definition for the goog.i18n.NumberFormatSymbols
 * objects.
 */
/**
 * Number formatting symbols for locale.
 * @interface
 */
export class Type {
    /** @type {string} */ DECIMAL_SEP: string;
    /** @type {string} */ GROUP_SEP: string;
    /** @type {string} */ PERCENT: string;
    /** @type {string} */ ZERO_DIGIT: string;
    /** @type {string} */ PLUS_SIGN: string;
    /** @type {string} */ MINUS_SIGN: string;
    /** @type {string} */ EXP_SYMBOL: string;
    /** @type {string} */ PERMILL: string;
    /** @type {string} */ INFINITY: string;
    /** @type {string} */ NAN: string;
    /** @type {string} */ DECIMAL_PATTERN: string;
    /** @type {string} */ SCIENTIFIC_PATTERN: string;
    /** @type {string} */ PERCENT_PATTERN: string;
    /** @type {string} */ CURRENCY_PATTERN: string;
    /** @type {string} */ DEF_CURRENCY_CODE: string;
}
