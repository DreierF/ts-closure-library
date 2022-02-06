/**
 * IMPORTANT: Datetime formatting results different between JavaScript and
 * native ECMAScript implementations.
 *
 * Native mode accepts a set of options for styles and also for specifying
 * a small set of choices for each individual field of a formatted output. These
 * effectively specify skeletons which direct the formatting according to
 * formats built into the ECMAScript DateTime implementation of
 * Intl.DateTimeFormat.
 *
 * The ECMAScript DateTimeFormat constructor and options are defined here:
 * {@link
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat}
 *
 * Datetime formatting functions in JavaScript mode are provided with
 * options to use standard styles, predefined patterns such as YEAR_FULL,
 * and other values in Format.
 *
 * Native mode date/time formatting is supported only for these standard
 * patterns because they can be directly mapped to native mode options.
 *
 * Native mode does not support custom patterns, which are discouraged.
 * Using such custom pattern strings will call the JavaScript (polyfill)
 * version of DateTimeFormat rather than native ECMAScript.
 *
 * Custom patterns can be used using the symbols below for date/time.
 * Other text can be included. However, standard patterns are preferred
 * because native EMCAScript code is more efficient in download size and time.
 *
 * The following symbols may be used in pattern specification, as defined
 * in JDK, ICU and CLDR, with minor modification for typical usage in JS.
 *
 * Pattern specification:
 * {@link http://userguide.icu-project.org/formatparse/datetime}
 * <pre>
 * Symbol   Meaning                    Presentation       Example
 * ------   -------                    ------------       -------
 * G#       era designator             (Text)             AD
 * y#       year                       (Number)           1996
 * Y        year (week of year)        (Number)           1997
 * u*       extended year              (Number)           4601
 * Q#       quarter                    (Text)             Q3 & 3rd quarter
 * M        month in year              (Text & Number)    July & 07
 * L        month in year (standalone) (Text & Number)    July & 07
 * d        day in month               (Number)           10
 * h        hour in am/pm (1~12)       (Number)           12
 * H        hour in day (0~23)         (Number)           0
 * m        minute in hour             (Number)           30
 * s        second in minute           (Number)           55
 * S        fractional second          (Number)           978
 * E#       day of week                (Text)             Tue & Tuesday
 * e*       day of week (local 1~7)    (Number)           2
 * c#       day of week (standalone)   (Text & Number)    2 & Tues & Tuesday & T
 * D*       day in year                (Number)           189
 * F*       day of week in month       (Number)           2 (2nd Wed in July)
 * w        week in year               (Number)           27
 * W*       week in month              (Number)           2
 * a        am/pm marker               (Text)             PM
 * k        hour in day (1~24)         (Number)           24
 * K        hour in am/pm (0~11)       (Number)           0
 * z        time zone                  (Text)             Pacific Standard Time
 * Z#       time zone (RFC 822)        (Number)           -0800
 * v#       time zone (generic)        (Text)             America/Los_Angeles
 * V#       time zone                  (Text)             Los Angeles Time
 * g*       Julian day                 (Number)           2451334
 * A*       milliseconds in day        (Number)           69540000
 * '        escape for text            (Delimiter)        'Date='
 * ''       single quote               (Literal)          'o''clock'
 *
 * Item marked with '*' are not supported yet.
 * Item marked with '#' works different than java
 *
 * The count of pattern letters determine the format.
 * (Text): 4 or more, use full form, <4, use short or abbreviated form if it
 * exists. (e.g., "EEEE" produces "Monday", "EEE" produces "Mon")
 *
 * (Number): the minimum number of digits. Shorter numbers are zero-padded to
 * this amount (e.g. if "m" produces "6", "mm" produces "06"). Year is handled
 * specially; that is, if the count of 'y' is 2, the Year will be truncated to
 * 2 digits. (e.g., if "yyyy" produces "1997", "yy" produces "97".) Unlike other
 * fields, fractional seconds are padded on the right with zero.
 *
 * :(Text & Number) 3 or over, use text, otherwise use number. (e.g., "M"
 * produces "1", "MM" produces "01", "MMM" produces "Jan", and "MMMM" produces
 * "January".)
 *
 * Any characters in the pattern that are not in the ranges of ['a'..'z'] and
 * ['A'..'Z'] will be treated as quoted text. For instance, characters like ':',
 * '.', ' ', '#' and '@' will appear in the resulting time text even they are
 * not embraced within single quotes.
 * </pre>
 */
/**
 * Construct a DateTimeFormat object based on current locale.
 *     instance rather than the global symbols.
 *     You can use some of the predefined SHORT / MEDIUM / LONG / FULL patterns,
 *     or the common patterns defined in goog.i18n.DateTimePatterns.
 *     Examples:
 *     <code><pre>
 *       let fmt = new DateTimeFormat(
 *           Format.FULL_DATE);
 *       let fmt = new DateTimeFormat(
 *           goog.i18n.DateTimePatterns.MONTH_DAY_YEAR_MEDIUM);
 *     </pre></code>
 *
 * {@see Format}
 * {@see goog.i18n.DateTimePatterns}
 * @final
 */
export class DateTimeFormat {
    /**
     * @param {!DateLike} date
     * @return {number}
     * @private
     */
    private static getHours_;
    /**
     * Sets if the usage of Ascii digits in formatting should be enforced in
     * formatted date/time even for locales where native digits are indicated.
     * Also sets whether to remove RLM unicode control characters when using
     * standard enumerated patterns (they exist e.g. in standard d/M/y for Arabic).
     * Production code should call this once before any `DateTimeFormat`
     * object is instantiated.
     * Caveats:
     *    * Enforcing ASCII digits affects all future formatting by new or existing
     * `DateTimeFormat` objects.
     *    * Removal of RLM characters only applies to `DateTimeFormat` objects
     * instantiated after this call.
     * @param {boolean} enforceAsciiDigits Whether Ascii digits should be enforced.
     */
    static setEnforceAsciiDigits(enforceAsciiDigits: boolean): void;
    /**
     * @return {boolean} Whether enforcing ASCII digits for all locales. See
     *     `#setEnforceAsciiDigits` for more details.
     */
    static isEnforceAsciiDigits(): boolean;
    /**
     * Localizes a string potentially containing numbers, replacing ASCII digits
     * with native digits if specified so by the locale. Leaves other characters.
     * @param {number|string} input the string to be localized, using ASCII digits.
     * @param {!Object=} opt_dateTimeSymbols Optional symbols to use rather than
     *     the global symbols.
     * @return {string} localized string, potentially using native digits.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    static localizeNumbers(input: number | string, opt_dateTimeSymbols?: any | undefined): string;
    /**
     * Validates is the DateLike object to format has a time.
     * DateLike means Date|DateDate, and DateDateTime inherits
     * from DateDate. But DateDate does not have time related
     * members (getHours, getMinutes, getSeconds).
     * Formatting can be done, if there are no time placeholders in the pattern.
     *
     * @param {!DateLike} date the object to validate.
     * @private
     */
    private static validateDateHasTime_;
    /**
     * Construct a DateTimeFormat object based on current locale.
     * @param {string|number} pattern pattern specification or pattern type.
     * @param {!Object=} opt_dateTimeSymbols Optional symbols to use for this
     *     instance rather than the global symbols.
     *     You can use some of the predefined SHORT / MEDIUM / LONG / FULL patterns,
     *     or the common patterns defined in goog.i18n.DateTimePatterns.
     *     Examples:
     *     <code><pre>
     *       let fmt = new DateTimeFormat(
     *           Format.FULL_DATE);
     *       let fmt = new DateTimeFormat(
     *           goog.i18n.DateTimePatterns.MONTH_DAY_YEAR_MEDIUM);
     *     </pre></code>
     *
     * {@see Format}
     * {@see goog.i18n.DateTimePatterns}
     */
    constructor(pattern: string | number, opt_dateTimeSymbols?: any | undefined);
    /**
     * Remember if the implementation is ECMAScript
     * @type {?Intl.DateTimeFormat}
     * @private
     */
    private intlFormatter_;
    /**
     * Remember the pattern applied for resetting Intl formatter.
     * @type {number|string}
     * @private @constant
     */
    private originalPattern_;
    patternParts_: any[];
    /**
     * Use polyfill implementation with data defining locale-specific data such
     * as (day/month names, most common patterns, rules for week-end, etc.)
     * @private {!DateTimeSymbolsType}
     * @const
     */
    private dateTimeSymbols_;
    /**
     * Apply specified pattern to this formatter object.
     * @param {string} pattern String specifying how the date should be formatted.
     * @private
     */
    private applyPattern_;
    /**
     * Format the given date object according to preset pattern and current locale.
     * @param {?DateLike|undefined} date The Date object that is being
     *     formatted.
     * @param {?TimeZone=} opt_timeZone optional, if specified, time
     *    related fields will be formatted based on its setting. When this field
     *    is not specified, "undefined" will be pass around and those function
     *    that really need time zone service will create a default one.
     * @return {string} Formatted string for the given date.
     *    Throws an error if the date is null or if one tries to format a date-only
     *    object (for instance DateDate) using a pattern with time fields.
     */
    format(date: (DateLike | undefined) | null, opt_timeZone?: (TimeZone | null) | undefined): string;
    /**
     * Create an ECMAScript Intl.DateTimeFormat object based on
     * a predefined skeleton of fields and settings.
     * @param {number|string} formatType A number that identified the predefined
     *     pattern.
     * @param {boolean} isUtc Should values be fixed in UTC?
     * @param {?TimeZone=} opt_timeZone explicit set time zone
     * @private
     */
    private applyStandardEnumNative_;
    /**
     * Apply a predefined pattern as identified by formatType, which is stored in
     * locale specific repository.
     * @param {number} formatType A number that identified the predefined pattern.
     * @private
     */
    private applyStandardPattern_;
    /**
     * Localizes a string potentially containing numbers, replacing ASCII digits
     * with native digits if specified so by the locale. Leaves other characters.
     * @param {string} input the string to be localized, using ASCII digits.
     * @return {string} localized string, potentially using native digits.
     * @private
     */
    private localizeNumbers_;
    /**
     * Formats Era field according to pattern specified.
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatEra_;
    /**
     * Formats Year field according to pattern specified
     *   JavaScript Date object seems incapable handling 1BC and
     *   year before. It can show you year 0 which does not exists.
     *   following we just keep consistent with javascript's
     *   toString method. But keep in mind those things should be
     *   unsupported.
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatYear_;
    /**
     * Formats Year (Week of Year) field according to pattern specified
     *   JavaScript Date object seems incapable handling 1BC and
     *   year before. It can show you year 0 which does not exists.
     *   following we just keep consistent with javascript's
     *   toString method. But keep in mind those things should be
     *   unsupported.
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatYearOfWeek_;
    /**
     * Formats Month field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatMonth_;
    /**
     * Formats (1..24) Hours field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats. This controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private format24Hours_;
    /**
     * Formats Fractional seconds field according to pattern
     * specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     *
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatFractionalSeconds_;
    /**
     * Formats Day of week field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatDayOfWeek_;
    /**
     * Formats Am/Pm field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatAmPm_;
    /**
     * Formats (1..12) Hours field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    private format1To12Hours_;
    /**
     * Formats (0..11) Hours field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    private format0To11Hours_;
    /**
     * Formats (0..23) Hours field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    private format0To23Hours_;
    /**
     * Formats Standalone weekday field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    private formatStandaloneDay_;
    /**
     * Formats Standalone Month field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    private formatStandaloneMonth_;
    /**
     * Formats Quarter field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatQuarter_;
    /**
     * Formats Date field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatDate_;
    /**
     * Formats Minutes field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatMinutes_;
    /**
     * Formats Seconds field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatSeconds_;
    /**
     * Formats the week of year field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatWeekOfYear_;
    /**
     * Formats TimeZone field following RFC
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @param {?TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    private formatTimeZoneRFC_;
    /**
     * Generate GMT timeZone string for given date
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date Whose value being evaluated.
     * @param {?TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} GMT timeZone string.
     * @private
     */
    private formatTimeZone_;
    /**
     * Generate GMT timeZone string for given date
     * @param {!DateLike} date Whose value being evaluated.
     * @param {?TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} GMT timeZone string.
     * @private
     */
    private formatTimeZoneId_;
    /**
     * Generate localized, location dependent time zone id
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date Whose value being evaluated.
     * @param {?TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} GMT timeZone string.
     * @private
     */
    private formatTimeZoneLocationId_;
    /**
     * Formatting one date field.
     * @param {string} patternStr The pattern string for the field being formatted.
     * @param {!DateLike} date represents the real date to be formatted.
     * @param {!DateLike} dateForDate used to resolve date fields
     *     for formatting.
     * @param {!DateLike} dateForTime used to resolve time fields
     *     for formatting.
     * @param {?TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} string representation for the given field.
     * @private
     */
    private formatField_;
}
export namespace DateTimeFormat {
    const TOKENS_: Array<RegExp>;
    namespace PartTypes_ {
        const QUOTED_STRING: number;
        const FIELD: number;
        const LITERAL: number;
    }
    /**
     * *
     */
    type PartTypes_ = number;
    const enforceAsciiDigits_: boolean;
    const resetEnforceAsciiDigits_: boolean;
    const removeRlmInPatterns_: boolean;
    /**
     * Parameters to Intl.DateTimeFormat constructor
     */
    type IntlOptions = {
        calendar: string | undefined;
        dateStyle: string | undefined;
        timeStyle: string | undefined;
        era: string | undefined;
        formatMatcher: string | undefined;
        localeMatcher: string | undefined;
        year: string | undefined;
        month: string | undefined;
        day: string | undefined;
        weekday: string | undefined;
        hour: string | undefined;
        hour12: boolean | undefined;
        minute: string | undefined;
        second: string | undefined;
        timeZone: string | undefined;
        numberingSystem: string | undefined;
        timeZoneName: string | undefined;
    };
}
/**
 * Enum to identify predefined Date/Time format pattern. The format pattern to
 * output mapping can be found at go/closure-localization#fconst.
 */
export type Format = number;
export namespace Format {
    const FULL_DATE: number;
    const LONG_DATE: number;
    const MEDIUM_DATE: number;
    const SHORT_DATE: number;
    const FULL_TIME: number;
    const LONG_TIME: number;
    const MEDIUM_TIME: number;
    const SHORT_TIME: number;
    const FULL_DATETIME: number;
    const LONG_DATETIME: number;
    const MEDIUM_DATETIME: number;
    const SHORT_DATETIME: number;
}
import { DateLike } from "../date/date.js";
import { TimeZone } from "./timezone.js";
