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
 * @type {boolean} USE_ECMASCRIPT_I18N_2020 Evaluated to select
 * ECMAScript Intl object (when true) or JavaScript implementation (false) for
 * I18N purposes. It depends on browser implementation in January 2020.
 */
export const USE_ECMASCRIPT_I18N_2020 =
    (google.FEATURESET_YEAR >= 2020 && ECMASCRIPT_COMMON_LOCALES_2019 &&
     !ECMASCRIPT_INTL_OPT_OUT);

/**
 * @type {boolean} USE_ECMASCRIPT_I18N_2021 Evaluated to select
 * ECMAScript Intl object (when true) or JavaScript implementation (false) for
 * I18N purposes. It depends on browser implementation in January 2021.
 */
export const USE_ECMASCRIPT_I18N_2021 =
    (google.FEATURESET_YEAR >= 2021 && ECMASCRIPT_COMMON_LOCALES_2019 &&
     !ECMASCRIPT_INTL_OPT_OUT);

/**
 * @type {boolean} USE_ECMASCRIPT_I18N_2022 Evaluated to select
 * ECMAScript Intl object (when true) or JavaScript implementation (false) for
 * I18N purposes. It depends on browser implementation in January 2022.
 */
export const USE_ECMASCRIPT_I18N_2022 =
    (google.FEATURESET_YEAR >= 2022 && ECMASCRIPT_COMMON_LOCALES_2019 &&
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
export const USE_ECMASCRIPT_I18N_RDTF = USE_ECMASCRIPT_I18N_2021;

/**
 * @type {boolean} USE_ECMASCRIPT_I18N_NUMFORMAT is evaluted to enable
 * ECMAScript support for Intl.NumberFormat support in
 * browsers based on the locale. As of January 2021, NumberFormat is
 * supported in Chrome, Edge, Firefox, and Safari.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */
export const USE_ECMASCRIPT_I18N_NUMFORMAT = USE_ECMASCRIPT_I18N_2021;

/**
 * @type {boolean} USE_ECMASCRIPT_I18N_PLURALRULES is evaluated to enable
 * ECMAScript support for Intl.PluralRules support in
 * browsers based on the locale. Browsers that are considered include:
 * Chrome, Firefox, Edge, and Safari.
 * PluralRules are supported in Chrome, Edge, Firefox, and Safari.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/
 */
export const USE_ECMASCRIPT_I18N_PLURALRULES = USE_ECMASCRIPT_I18N_2020;

/**
 * @type {boolean} USE_ECMASCRIPT_I18N_DATETIMEF is evaluated to enable
 * ECMAScript support for Intl.DateTimeFormat support in
 * browsers based on the locale. Browsers that are considered include:
 * Chrome, Firefox 85 and above, Edge, and Safari.
 */
export const USE_ECMASCRIPT_I18N_DATETIMEF = USE_ECMASCRIPT_I18N_2021;

/**
 * The locales natively supported in ListFormat by all modern browsers.
 * @const
 * @type {!Array<string>} ECMASCRIPT_LISTFORMAT_LOCALES
 */
export const ECMASCRIPT_LISTFORMAT_LOCALES = [
  'am',         'ar',         'ar-001',     'ar-AE',      'ar-BH',
  'ar-DJ',      'ar-DZ',      'ar-EG',      'ar-EH',      'ar-ER',
  'ar-IL',      'ar-IQ',      'ar-JO',      'ar-KM',      'ar-KW',
  'ar-LB',      'ar-LY',      'ar-MA',      'ar-MR',      'ar-OM',
  'ar-PS',      'ar-QA',      'ar-SA',      'ar-SD',      'ar-SO',
  'ar-SS',      'ar-SY',      'ar-TD',      'ar-TN',      'ar-YE',
  'bg',         'bg-BG',      'bn',         'bn-BD',      'bn-IN',
  'bs-Cyrl',    'bs-Cyrl-BA', 'ca',         'ca-AD',      'ca-ES',
  'ca-FR',      'ca-IT',      'cs',         'cs-CZ',      'da',
  'da-DK',      'da-GL',      'de',         'de-AT',      'de-BE',
  'de-CH',      'de-DE',      'de-IT',      'de-LI',      'de-LU',
  'el',         'el-CY',      'el-GR',      'en',         'en-001',
  'en-150',     'en-AE',      'en-AG',      'en-AI',      'en-AS',
  'en-AT',      'en-AU',      'en-BB',      'en-BE',      'en-BI',
  'en-BM',      'en-BS',      'en-BW',      'en-BZ',      'en-CA',
  'en-CC',      'en-CH',      'en-CK',      'en-CM',      'en-CX',
  'en-CY',      'en-DE',      'en-DG',      'en-DK',      'en-DM',
  'en-ER',      'en-FI',      'en-FJ',      'en-FK',      'en-FM',
  'en-GB',      'en-GD',      'en-GG',      'en-GH',      'en-GI',
  'en-GM',      'en-GU',      'en-GY',      'en-HK',      'en-IE',
  'en-IL',      'en-IM',      'en-IN',      'en-IO',      'en-JE',
  'en-JM',      'en-KE',      'en-KI',      'en-KN',      'en-KY',
  'en-LC',      'en-LR',      'en-LS',      'en-MG',      'en-MH',
  'en-MO',      'en-MP',      'en-MS',      'en-MT',      'en-MU',
  'en-MW',      'en-MY',      'en-NA',      'en-NF',      'en-NG',
  'en-NL',      'en-NR',      'en-NU',      'en-NZ',      'en-PG',
  'en-PH',      'en-PK',      'en-PN',      'en-PR',      'en-PW',
  'en-RW',      'en-SB',      'en-SC',      'en-SD',      'en-SE',
  'en-SG',      'en-SH',      'en-SI',      'en-SL',      'en-SS',
  'en-SX',      'en-SZ',      'en-TC',      'en-TK',      'en-TO',
  'en-TT',      'en-TV',      'en-TZ',      'en-UG',      'en-UM',
  'en-US',      'en-VC',      'en-VG',      'en-VI',      'en-VU',
  'en-WS',      'en-ZA',      'en-ZM',      'en-ZW',      'es',
  'es-419',     'es-AR',      'es-BO',      'es-BR',      'es-BZ',
  'es-CL',      'es-CO',      'es-CR',      'es-CU',      'es-DO',
  'es-EA',      'es-EC',      'es-ES',      'es-GQ',      'es-GT',
  'es-HN',      'es-IC',      'es-MX',      'es-NI',      'es-PA',
  'es-PE',      'es-PH',      'es-PR',      'es-PY',      'es-SV',
  'es-US',      'es-UY',      'es-VE',      'et',         'et-EE',
  'fa',         'fa-AF',      'fa-IR',      'fi',         'fi-FI',
  'fil',        'fil-PH',     'fr',         'fr-BE',      'fr-BF',
  'fr-BI',      'fr-BJ',      'fr-BL',      'fr-CA',      'fr-CD',
  'fr-CF',      'fr-CG',      'fr-CH',      'fr-CI',      'fr-CM',
  'fr-DJ',      'fr-DZ',      'fr-FR',      'fr-GA',      'fr-GF',
  'fr-GN',      'fr-GP',      'fr-GQ',      'fr-HT',      'fr-KM',
  'fr-LU',      'fr-MA',      'fr-MC',      'fr-MF',      'fr-MG',
  'fr-ML',      'fr-MQ',      'fr-MR',      'fr-MU',      'fr-NC',
  'fr-NE',      'fr-PF',      'fr-PM',      'fr-RE',      'fr-RW',
  'fr-SC',      'fr-SN',      'fr-SY',      'fr-TD',      'fr-TG',
  'fr-TN',      'fr-VU',      'fr-WF',      'fr-YT',      'gu',
  'gu-IN',      'he',         'he-IL',      'hi',         'hi-IN',
  'hr',         'hr-BA',      'hr-HR',      'hu',         'hu-HU',
  'id',         'id-ID',      'it',         'it-CH',      'it-IT',
  'it-SM',      'it-VA',      'ja',         'ja-JP',      'kn',
  'kn-IN',      'ko',         'ko-KP',      'ko-KR',      'lt',
  'lt-LT',      'lv',         'lv-LV',      'ml',         'ml-IN',
  'mr',         'mr-IN',      'ms',         'ms-BN',      'ms-ID',
  'ms-MY',      'ms-SG',      'nb',         'nl',         'nl-AW',
  'nl-BE',      'nl-BQ',      'nl-CW',      'nl-NL',      'nl-SR',
  'nl-SX',      'no',         'pl',         'pl-PL',      'pt',
  'pt-AO',      'pt-BR',      'pt-CH',      'pt-CV',      'pt-GQ',
  'pt-GW',      'pt-LU',      'pt-MO',      'pt-MZ',      'pt-PT',
  'pt-ST',      'pt-TL',      'ro',         'ro-MD',      'ro-RO',
  'ru',         'ru-BY',      'ru-KG',      'ru-KZ',      'ru-MD',
  'ru-RU',      'ru-UA',      'sk',         'sk-SK',      'sl',
  'sl-SI',      'sr',         'sr-Cyrl',    'sr-Cyrl-BA', 'sr-Cyrl-ME',
  'sr-Cyrl-RS', 'sr-Cyrl-XK', 'sr-Latn',    'sr-Latn-BA', 'sr-Latn-ME',
  'sr-Latn-RS', 'sr-Latn-XK', 'sv',         'sv-AX',      'sv-FI',
  'sv-SE',      'sw',         'sw-CD',      'sw-KE',      'sw-TZ',
  'sw-UG',      'ta',         'ta-IN',      'ta-LK',      'ta-MY',
  'ta-SG',      'te',         'te-IN',      'th',         'th-TH',
  'tr',         'tr-CY',      'tr-TR',      'uk',         'uk-UA',
  'vi',         'vi-VN',      'zh',         'zh-Hans',    'zh-Hans-CN',
  'zh-Hans-HK', 'zh-Hans-MO', 'zh-Hans-SG', 'zh-Hant',    'zh-Hant-HK',
  'zh-Hant-MO', 'zh-Hant-TW'
];

/**
 * @type {boolean} ECMASCRIPT_LISTFORMAT_COMMON_LOCALES_2022 is true if
 * google.LOCALE is one of the locales below that are supported by
 * modern browsers (Chrome, Firefox, Edge, Safari) as of January 2022.
 */
export const ECMASCRIPT_LISTFORMAT_COMMON_LOCALES_2022 =
    (google.LOCALE === 'am' || google.LOCALE === 'ar' || google.LOCALE === 'ar-001' ||
     google.LOCALE === 'ar-AE' || google.LOCALE === 'ar-BH' ||
     google.LOCALE === 'ar-DJ' || google.LOCALE === 'ar-DZ' ||
     google.LOCALE === 'ar-EG' || google.LOCALE === 'ar-EH' ||
     google.LOCALE === 'ar-ER' || google.LOCALE === 'ar-IL' ||
     google.LOCALE === 'ar-IQ' || google.LOCALE === 'ar-JO' ||
     google.LOCALE === 'ar-KM' || google.LOCALE === 'ar-KW' ||
     google.LOCALE === 'ar-LB' || google.LOCALE === 'ar-LY' ||
     google.LOCALE === 'ar-MA' || google.LOCALE === 'ar-MR' ||
     google.LOCALE === 'ar-OM' || google.LOCALE === 'ar-PS' ||
     google.LOCALE === 'ar-QA' || google.LOCALE === 'ar-SA' ||
     google.LOCALE === 'ar-SD' || google.LOCALE === 'ar-SO' ||
     google.LOCALE === 'ar-SS' || google.LOCALE === 'ar-SY' ||
     google.LOCALE === 'ar-TD' || google.LOCALE === 'ar-TN' ||
     google.LOCALE === 'ar-YE' || google.LOCALE === 'bg' ||
     google.LOCALE === 'bg-BG' || google.LOCALE === 'bn' ||
     google.LOCALE === 'bn-BD' || google.LOCALE === 'bn-IN' ||
     google.LOCALE === 'bs-Cyrl' || google.LOCALE === 'bs-Cyrl-BA' ||
     google.LOCALE === 'ca' || google.LOCALE === 'ca-AD' ||
     google.LOCALE === 'ca-ES' || google.LOCALE === 'ca-FR' ||
     google.LOCALE === 'ca-IT' || google.LOCALE === 'cs' ||
     google.LOCALE === 'cs-CZ' || google.LOCALE === 'da' ||
     google.LOCALE === 'da-DK' || google.LOCALE === 'da-GL' ||
     google.LOCALE === 'de' || google.LOCALE === 'de-AT' ||
     google.LOCALE === 'de-BE' || google.LOCALE === 'de-CH' ||
     google.LOCALE === 'de-DE' || google.LOCALE === 'de-IT' ||
     google.LOCALE === 'de-LI' || google.LOCALE === 'de-LU' ||
     google.LOCALE === 'el' || google.LOCALE === 'el-CY' ||
     google.LOCALE === 'el-GR' || google.LOCALE === 'en' ||
     google.LOCALE === 'en-001' || google.LOCALE === 'en-150' ||
     google.LOCALE === 'en-AE' || google.LOCALE === 'en-AG' ||
     google.LOCALE === 'en-AI' || google.LOCALE === 'en-AS' ||
     google.LOCALE === 'en-AT' || google.LOCALE === 'en-AU' ||
     google.LOCALE === 'en-BB' || google.LOCALE === 'en-BE' ||
     google.LOCALE === 'en-BI' || google.LOCALE === 'en-BM' ||
     google.LOCALE === 'en-BS' || google.LOCALE === 'en-BW' ||
     google.LOCALE === 'en-BZ' || google.LOCALE === 'en-CA' ||
     google.LOCALE === 'en-CC' || google.LOCALE === 'en-CH' ||
     google.LOCALE === 'en-CK' || google.LOCALE === 'en-CM' ||
     google.LOCALE === 'en-CX' || google.LOCALE === 'en-CY' ||
     google.LOCALE === 'en-DE' || google.LOCALE === 'en-DG' ||
     google.LOCALE === 'en-DK' || google.LOCALE === 'en-DM' ||
     google.LOCALE === 'en-ER' || google.LOCALE === 'en-FI' ||
     google.LOCALE === 'en-FJ' || google.LOCALE === 'en-FK' ||
     google.LOCALE === 'en-FM' || google.LOCALE === 'en-GB' ||
     google.LOCALE === 'en-GD' || google.LOCALE === 'en-GG' ||
     google.LOCALE === 'en-GH' || google.LOCALE === 'en-GI' ||
     google.LOCALE === 'en-GM' || google.LOCALE === 'en-GU' ||
     google.LOCALE === 'en-GY' || google.LOCALE === 'en-HK' ||
     google.LOCALE === 'en-IE' || google.LOCALE === 'en-IL' ||
     google.LOCALE === 'en-IM' || google.LOCALE === 'en-IN' ||
     google.LOCALE === 'en-IO' || google.LOCALE === 'en-JE' ||
     google.LOCALE === 'en-JM' || google.LOCALE === 'en-KE' ||
     google.LOCALE === 'en-KI' || google.LOCALE === 'en-KN' ||
     google.LOCALE === 'en-KY' || google.LOCALE === 'en-LC' ||
     google.LOCALE === 'en-LR' || google.LOCALE === 'en-LS' ||
     google.LOCALE === 'en-MG' || google.LOCALE === 'en-MH' ||
     google.LOCALE === 'en-MO' || google.LOCALE === 'en-MP' ||
     google.LOCALE === 'en-MS' || google.LOCALE === 'en-MT' ||
     google.LOCALE === 'en-MU' || google.LOCALE === 'en-MW' ||
     google.LOCALE === 'en-MY' || google.LOCALE === 'en-NA' ||
     google.LOCALE === 'en-NF' || google.LOCALE === 'en-NG' ||
     google.LOCALE === 'en-NL' || google.LOCALE === 'en-NR' ||
     google.LOCALE === 'en-NU' || google.LOCALE === 'en-NZ' ||
     google.LOCALE === 'en-PG' || google.LOCALE === 'en-PH' ||
     google.LOCALE === 'en-PK' || google.LOCALE === 'en-PN' ||
     google.LOCALE === 'en-PR' || google.LOCALE === 'en-PW' ||
     google.LOCALE === 'en-RW' || google.LOCALE === 'en-SB' ||
     google.LOCALE === 'en-SC' || google.LOCALE === 'en-SD' ||
     google.LOCALE === 'en-SE' || google.LOCALE === 'en-SG' ||
     google.LOCALE === 'en-SH' || google.LOCALE === 'en-SI' ||
     google.LOCALE === 'en-SL' || google.LOCALE === 'en-SS' ||
     google.LOCALE === 'en-SX' || google.LOCALE === 'en-SZ' ||
     google.LOCALE === 'en-TC' || google.LOCALE === 'en-TK' ||
     google.LOCALE === 'en-TO' || google.LOCALE === 'en-TT' ||
     google.LOCALE === 'en-TV' || google.LOCALE === 'en-TZ' ||
     google.LOCALE === 'en-UG' || google.LOCALE === 'en-UM' ||
     google.LOCALE === 'en-US' || google.LOCALE === 'en-VC' ||
     google.LOCALE === 'en-VG' || google.LOCALE === 'en-VI' ||
     google.LOCALE === 'en-VU' || google.LOCALE === 'en-WS' ||
     google.LOCALE === 'en-ZA' || google.LOCALE === 'en-ZM' ||
     google.LOCALE === 'en-ZW' || google.LOCALE === 'es' ||
     google.LOCALE === 'es-419' || google.LOCALE === 'es-AR' ||
     google.LOCALE === 'es-BO' || google.LOCALE === 'es-BR' ||
     google.LOCALE === 'es-BZ' || google.LOCALE === 'es-CL' ||
     google.LOCALE === 'es-CO' || google.LOCALE === 'es-CR' ||
     google.LOCALE === 'es-CU' || google.LOCALE === 'es-DO' ||
     google.LOCALE === 'es-EA' || google.LOCALE === 'es-EC' ||
     google.LOCALE === 'es-ES' || google.LOCALE === 'es-GQ' ||
     google.LOCALE === 'es-GT' || google.LOCALE === 'es-HN' ||
     google.LOCALE === 'es-IC' || google.LOCALE === 'es-MX' ||
     google.LOCALE === 'es-NI' || google.LOCALE === 'es-PA' ||
     google.LOCALE === 'es-PE' || google.LOCALE === 'es-PH' ||
     google.LOCALE === 'es-PR' || google.LOCALE === 'es-PY' ||
     google.LOCALE === 'es-SV' || google.LOCALE === 'es-US' ||
     google.LOCALE === 'es-UY' || google.LOCALE === 'es-VE' ||
     google.LOCALE === 'et' || google.LOCALE === 'et-EE' || google.LOCALE === 'fa' ||
     google.LOCALE === 'fa-AF' || google.LOCALE === 'fa-IR' ||
     google.LOCALE === 'fi' || google.LOCALE === 'fi-FI' || google.LOCALE === 'fil' ||
     google.LOCALE === 'fil-PH' || google.LOCALE === 'fr' ||
     google.LOCALE === 'fr-BE' || google.LOCALE === 'fr-BF' ||
     google.LOCALE === 'fr-BI' || google.LOCALE === 'fr-BJ' ||
     google.LOCALE === 'fr-BL' || google.LOCALE === 'fr-CA' ||
     google.LOCALE === 'fr-CD' || google.LOCALE === 'fr-CF' ||
     google.LOCALE === 'fr-CG' || google.LOCALE === 'fr-CH' ||
     google.LOCALE === 'fr-CI' || google.LOCALE === 'fr-CM' ||
     google.LOCALE === 'fr-DJ' || google.LOCALE === 'fr-DZ' ||
     google.LOCALE === 'fr-FR' || google.LOCALE === 'fr-GA' ||
     google.LOCALE === 'fr-GF' || google.LOCALE === 'fr-GN' ||
     google.LOCALE === 'fr-GP' || google.LOCALE === 'fr-GQ' ||
     google.LOCALE === 'fr-HT' || google.LOCALE === 'fr-KM' ||
     google.LOCALE === 'fr-LU' || google.LOCALE === 'fr-MA' ||
     google.LOCALE === 'fr-MC' || google.LOCALE === 'fr-MF' ||
     google.LOCALE === 'fr-MG' || google.LOCALE === 'fr-ML' ||
     google.LOCALE === 'fr-MQ' || google.LOCALE === 'fr-MR' ||
     google.LOCALE === 'fr-MU' || google.LOCALE === 'fr-NC' ||
     google.LOCALE === 'fr-NE' || google.LOCALE === 'fr-PF' ||
     google.LOCALE === 'fr-PM' || google.LOCALE === 'fr-RE' ||
     google.LOCALE === 'fr-RW' || google.LOCALE === 'fr-SC' ||
     google.LOCALE === 'fr-SN' || google.LOCALE === 'fr-SY' ||
     google.LOCALE === 'fr-TD' || google.LOCALE === 'fr-TG' ||
     google.LOCALE === 'fr-TN' || google.LOCALE === 'fr-VU' ||
     google.LOCALE === 'fr-WF' || google.LOCALE === 'fr-YT' ||
     google.LOCALE === 'gu' || google.LOCALE === 'gu-IN' || google.LOCALE === 'he' ||
     google.LOCALE === 'he-IL' || google.LOCALE === 'hi' ||
     google.LOCALE === 'hi-IN' || google.LOCALE === 'hr' ||
     google.LOCALE === 'hr-BA' || google.LOCALE === 'hr-HR' ||
     google.LOCALE === 'hu' || google.LOCALE === 'hu-HU' || google.LOCALE === 'id' ||
     google.LOCALE === 'id-ID' || google.LOCALE === 'it' ||
     google.LOCALE === 'it-CH' || google.LOCALE === 'it-IT' ||
     google.LOCALE === 'it-SM' || google.LOCALE === 'it-VA' ||
     google.LOCALE === 'ja' || google.LOCALE === 'ja-JP' || google.LOCALE === 'kn' ||
     google.LOCALE === 'kn-IN' || google.LOCALE === 'ko' ||
     google.LOCALE === 'ko-KP' || google.LOCALE === 'ko-KR' ||
     google.LOCALE === 'lt' || google.LOCALE === 'lt-LT' || google.LOCALE === 'lv' ||
     google.LOCALE === 'lv-LV' || google.LOCALE === 'ml' ||
     google.LOCALE === 'ml-IN' || google.LOCALE === 'mr' ||
     google.LOCALE === 'mr-IN' || google.LOCALE === 'ms' ||
     google.LOCALE === 'ms-BN' || google.LOCALE === 'ms-ID' ||
     google.LOCALE === 'ms-MY' || google.LOCALE === 'ms-SG' ||
     google.LOCALE === 'nb' || google.LOCALE === 'nl' || google.LOCALE === 'nl-AW' ||
     google.LOCALE === 'nl-BE' || google.LOCALE === 'nl-BQ' ||
     google.LOCALE === 'nl-CW' || google.LOCALE === 'nl-NL' ||
     google.LOCALE === 'nl-SR' || google.LOCALE === 'nl-SX' ||
     google.LOCALE === 'no' || google.LOCALE === 'pl' || google.LOCALE === 'pl-PL' ||
     google.LOCALE === 'pt' || google.LOCALE === 'pt-AO' ||
     google.LOCALE === 'pt-BR' || google.LOCALE === 'pt-CH' ||
     google.LOCALE === 'pt-CV' || google.LOCALE === 'pt-GQ' ||
     google.LOCALE === 'pt-GW' || google.LOCALE === 'pt-LU' ||
     google.LOCALE === 'pt-MO' || google.LOCALE === 'pt-MZ' ||
     google.LOCALE === 'pt-PT' || google.LOCALE === 'pt-ST' ||
     google.LOCALE === 'pt-TL' || google.LOCALE === 'ro' ||
     google.LOCALE === 'ro-MD' || google.LOCALE === 'ro-RO' ||
     google.LOCALE === 'ru' || google.LOCALE === 'ru-BY' ||
     google.LOCALE === 'ru-KG' || google.LOCALE === 'ru-KZ' ||
     google.LOCALE === 'ru-MD' || google.LOCALE === 'ru-RU' ||
     google.LOCALE === 'ru-UA' || google.LOCALE === 'sk' ||
     google.LOCALE === 'sk-SK' || google.LOCALE === 'sl' ||
     google.LOCALE === 'sl-SI' || google.LOCALE === 'sr' ||
     google.LOCALE === 'sr-Cyrl' || google.LOCALE === 'sr-Cyrl-BA' ||
     google.LOCALE === 'sr-Cyrl-ME' || google.LOCALE === 'sr-Cyrl-RS' ||
     google.LOCALE === 'sr-Cyrl-XK' || google.LOCALE === 'sr-Latn' ||
     google.LOCALE === 'sr-Latn-BA' || google.LOCALE === 'sr-Latn-ME' ||
     google.LOCALE === 'sr-Latn-RS' || google.LOCALE === 'sr-Latn-XK' ||
     google.LOCALE === 'sv' || google.LOCALE === 'sv-AX' ||
     google.LOCALE === 'sv-FI' || google.LOCALE === 'sv-SE' ||
     google.LOCALE === 'sw' || google.LOCALE === 'sw-CD' ||
     google.LOCALE === 'sw-KE' || google.LOCALE === 'sw-TZ' ||
     google.LOCALE === 'sw-UG' || google.LOCALE === 'ta' ||
     google.LOCALE === 'ta-IN' || google.LOCALE === 'ta-LK' ||
     google.LOCALE === 'ta-MY' || google.LOCALE === 'ta-SG' ||
     google.LOCALE === 'te' || google.LOCALE === 'te-IN' || google.LOCALE === 'th' ||
     google.LOCALE === 'th-TH' || google.LOCALE === 'tr' ||
     google.LOCALE === 'tr-CY' || google.LOCALE === 'tr-TR' ||
     google.LOCALE === 'uk' || google.LOCALE === 'uk-UA' || google.LOCALE === 'vi' ||
     google.LOCALE === 'vi-VN' || google.LOCALE === 'zh' ||
     google.LOCALE === 'zh-Hans' || google.LOCALE === 'zh-Hans-CN' ||
     google.LOCALE === 'zh-Hans-HK' || google.LOCALE === 'zh-Hans-MO' ||
     google.LOCALE === 'zh-Hans-SG' || google.LOCALE === 'zh-Hant' ||
     google.LOCALE === 'zh-Hant-HK' || google.LOCALE === 'zh-Hant-MO' ||
     google.LOCALE === 'zh-Hant-TW');

/**
 * @type {boolean} USE_ECMASCRIPT_I18N_LISTFORMAT is evaluated to enable
 * ECMAScript support for Intl.ListFormat support in browsers based on the
 * locale. As of January 2022, ListFormat is supported by Chrome, Edge,
 * Firefox, and Safari.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat
 */
export const USE_ECMASCRIPT_I18N_LISTFORMAT =
    (google.FEATURESET_YEAR >= 2022 &&
     ECMASCRIPT_LISTFORMAT_COMMON_LOCALES_2022 &&
     !ECMASCRIPT_INTL_OPT_OUT);
