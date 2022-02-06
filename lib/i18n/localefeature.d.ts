/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Provides flag for using ECMAScript 402 features vs.
 * native JavaScript Closure implementations for I18N purposes.
 */
/**
 * @type {boolean} ECMASCRIPT_INTL_OPT_OUT
 * A global flag that an application can set to avoid using native
 * ECMAScript Intl implementation in any browser or Android implementations.
 * This may be necessary for applications that cannot use the regular
 * setting of google.LOCALE or that must provide the Javascript data and
 * to create formatted output exactly the same on both client and server.
 *
 * Default value is false. Applications can set this to true so
 * compilation will opt out of the native mode.
 */
export const ECMASCRIPT_INTL_OPT_OUT: boolean;
/**
 * @type {boolean} ECMASCRIPT_COMMON_LOCALES
 * A set of locales supported by all modern browsers in ECMASCRIPT Intl.
 * Common across all of the modern browsers and Android implementations
 * available in 2019 and later.
 */
export const ECMASCRIPT_COMMON_LOCALES_2019: boolean;
/**
 * @type {boolean} USE_ECMASCRIPT_I18N Evaluated at compile to select
 * ECMAScript Intl object (when true) or JavaScript implementation (false) for
 * I18N purposes.  This set of locales is common across all of the modern
 * browsers and Android implementations available in 2019.
 */
export const USE_ECMASCRIPT_I18N: boolean;
/**
 * @type {boolean} USE_ECMASCRIPT_I18N_RDTF is evaluated to enable
 * ECMAScript support for Intl.RelativeTimeFormat support in
 * browsers based on the locale. Browsers that are considered include:
 * Chrome, Firefox, Edge, and Safari.
 * As of January 2021, RelativeTimeFormat is supported in Chrome,
 * Edge, Firefox, and Safari.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
 */
export const USE_ECMASCRIPT_I18N_RDTF: boolean;
/**
 * @type {boolean} USE_ECMASCRIPT_I18N_NUMFORMAT is evaluted to enable
 * ECMAScript support for Intl.NumberFormat support in
 * browsers based on the locale. As of January 2021, NumberFormat is
 * supported in Chrome, Edge, Firefox, and Safari.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */
export const USE_ECMASCRIPT_I18N_NUMFORMAT: boolean;
/**
 * @type {boolean} USE_ECMASCRIPT_I18N_PLURALRULES is evaluated to enable
 * ECMAScript support for Intl.PluralRules support in
 * browsers based on the locale. Browsers that are considered include:
 * Chrome, Firefox, Edge, and Safari.
 * PluralRules are supported in Chrome, Edge, Firefox, and Safari.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/
 */
export const USE_ECMASCRIPT_I18N_PLURALRULES: boolean;
/**
 * @type {boolean} USE_ECMASCRIPT_I18N_DATETIMEF is evaluted to enable
 * ECMAScript support for Intl.DateTimeFormat support in
 * browsers based on the locale. Browsers that are considered include:
 * Chrome, Firefox, Edge, and Safari.
 */
export const USE_ECMASCRIPT_I18N_DATETIMEF: boolean;
