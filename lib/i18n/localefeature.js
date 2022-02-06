import * as google from './../google.js';
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
export const ECMASCRIPT_INTL_OPT_OUT = false;

/**
 * @type {boolean} ECMASCRIPT_COMMON_LOCALES
 * A set of locales supported by all modern browsers in ECMASCRIPT Intl.
 * Common across all of the modern browsers and Android implementations
 * available in 2019 and later.
 */
export const ECMASCRIPT_COMMON_LOCALES_2019 =
    (google.LOCALE == 'am' || google.LOCALE == 'ar' || google.LOCALE == 'bg' ||
     google.LOCALE == 'bn' || google.LOCALE == 'ca' || google.LOCALE == 'cs' ||
     google.LOCALE == 'da' || google.LOCALE == 'de' || google.LOCALE == 'el' ||
     google.LOCALE == 'en' || google.LOCALE == 'es' || google.LOCALE == 'et' ||
     google.LOCALE == 'fa' || google.LOCALE == 'fi' || google.LOCALE == 'fil' ||
     google.LOCALE == 'fr' || google.LOCALE == 'gu' || google.LOCALE == 'he' ||
     google.LOCALE == 'hi' || google.LOCALE == 'hr' || google.LOCALE == 'hu' ||
     google.LOCALE == 'id' || google.LOCALE == 'it' || google.LOCALE == 'ja' ||
     google.LOCALE == 'kn' || google.LOCALE == 'ko' || google.LOCALE == 'lt' ||
     google.LOCALE == 'lv' || google.LOCALE == 'ml' || google.LOCALE == 'mr' ||
     google.LOCALE == 'ms' || google.LOCALE == 'nl' || google.LOCALE == 'pl' ||
     google.LOCALE == 'ro' || google.LOCALE == 'ru' || google.LOCALE == 'sk' ||
     google.LOCALE == 'sl' || google.LOCALE == 'sr' || google.LOCALE == 'sv' ||
     google.LOCALE == 'sw' || google.LOCALE == 'ta' || google.LOCALE == 'te' ||
     google.LOCALE == 'th' || google.LOCALE == 'tr' || google.LOCALE == 'uk' ||
     google.LOCALE == 'vi' || google.LOCALE == 'en_GB' || google.LOCALE == 'en-GB' ||
     google.LOCALE == 'es_419' || google.LOCALE == 'es-419' ||
     google.LOCALE == 'pt_BR' || google.LOCALE == 'pt-BR' ||
     google.LOCALE == 'pt_PT' || google.LOCALE == 'pt-PT' ||
     google.LOCALE == 'zh_CN' || google.LOCALE == 'zh-CN' ||
     google.LOCALE == 'zh_TW' || google.LOCALE == 'zh-TW');

/**
 * @type {boolean} USE_ECMASCRIPT_I18N Evaluated at compile to select
 * ECMAScript Intl object (when true) or JavaScript implementation (false) for
 * I18N purposes.  This set of locales is common across all of the modern
 * browsers and Android implementations available in 2019.
 */
export const USE_ECMASCRIPT_I18N =
    (google.FEATURESET_YEAR >= 2019 && ECMASCRIPT_COMMON_LOCALES_2019 &&
     !ECMASCRIPT_INTL_OPT_OUT);

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
export const USE_ECMASCRIPT_I18N_RDTF =
    (google.FEATURESET_YEAR >= 2021 && ECMASCRIPT_COMMON_LOCALES_2019);

/**
 * @type {boolean} USE_ECMASCRIPT_I18N_NUMFORMAT is evaluted to enable
 * ECMAScript support for Intl.NumberFormat support in
 * browsers based on the locale. As of January 2021, NumberFormat is
 * supported in Chrome, Edge, Firefox, and Safari.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */
export const USE_ECMASCRIPT_I18N_NUMFORMAT =
    (google.FEATURESET_YEAR >= 2021 && ECMASCRIPT_COMMON_LOCALES_2019 &&
     !ECMASCRIPT_INTL_OPT_OUT);

/**
 * @type {boolean} USE_ECMASCRIPT_I18N_PLURALRULES is evaluated to enable
 * ECMAScript support for Intl.PluralRules support in
 * browsers based on the locale. Browsers that are considered include:
 * Chrome, Firefox, Edge, and Safari.
 * PluralRules are supported in Chrome, Edge, Firefox, and Safari.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/
 */
export const USE_ECMASCRIPT_I18N_PLURALRULES =
    (!ECMASCRIPT_INTL_OPT_OUT && google.FEATURESET_YEAR >= 2021 &&
     ECMASCRIPT_COMMON_LOCALES_2019);

/**
 * @type {boolean} USE_ECMASCRIPT_I18N_DATETIMEF is evaluted to enable
 * ECMAScript support for Intl.DateTimeFormat support in
 * browsers based on the locale. Browsers that are considered include:
 * Chrome, Firefox, Edge, and Safari.
 */
export const USE_ECMASCRIPT_I18N_DATETIMEF =
    (USE_ECMASCRIPT_I18N && !ECMASCRIPT_INTL_OPT_OUT);
