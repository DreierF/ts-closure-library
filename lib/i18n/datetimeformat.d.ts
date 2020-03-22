/**
 * Enum to identify predefined Date/Time format pattern.
 */
export type Format = number;
/**
 * @fileoverview Functions for dealing with date/time formatting.
 */
/**
 * Namespace for i18n date/time formatting functions
 */
/**
 * Datetime formatting functions following the pattern specification as defined
 * in JDK, ICU and CLDR, with minor modification for typical usage in JS.
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
 *       var fmt = new DateTimeFormat(
 *           Format.FULL_DATE);
 *       var fmt = new DateTimeFormat(
 *           goog.i18n.DateTimePatterns.MONTH_DAY_YEAR_MEDIUM);
 *     </pre></code>
 *
 * {@see Format}
 * {@see goog.i18n.DateTimePatterns}
 * @final
 */
export class DateTimeFormat {
    /**
     * Construct a DateTimeFormat object based on current locale.
     * @param {string|number} pattern pattern specification or pattern type.
     * @param {!Object=} opt_dateTimeSymbols Optional symbols to use for this
     *     instance rather than the global symbols.
     *     You can use some of the predefined SHORT / MEDIUM / LONG / FULL patterns,
     *     or the common patterns defined in goog.i18n.DateTimePatterns.
     *     Examples:
     *     <code><pre>
     *       var fmt = new DateTimeFormat(
     *           Format.FULL_DATE);
     *       var fmt = new DateTimeFormat(
     *           goog.i18n.DateTimePatterns.MONTH_DAY_YEAR_MEDIUM);
     *     </pre></code>
     *
     * {@see Format}
     * {@see goog.i18n.DateTimePatterns}
     */
    constructor(pattern: string | number, opt_dateTimeSymbols?: any);
    patternParts_: any[];
    /**
     * Data structure that with all the locale info needed for date formatting.
     * (day/month names, most common patterns, rules for week-end, etc.)
     * @private {!DateTimeSymbolsType}
     */
    dateTimeSymbols_: DateTimeSymbolsType;
    /**
     * Apply specified pattern to this formatter object.
     * @param {string} pattern String specifying how the date should be formatted.
     * @private
     */
    applyPattern_(pattern: string): void;
    /**
     * Format the given date object according to preset pattern and current locale.
     * @param {?DateLike} date The Date object that is being formatted.
     * @param {TimeZone=} opt_timeZone optional, if specified, time
     *    related fields will be formatted based on its setting. When this field
     *    is not specified, "undefined" will be pass around and those function
     *    that really need time zone service will create a default one.
     * @return {string} Formatted string for the given date.
     *    Throws an error if the date is null or if one tries to format a date-only
     *    object (for instance DateDate) using a pattern with time fields.
     */
    format(date: Date | googdate.Date | null, opt_timeZone?: TimeZone | undefined): string;
    /**
     * Apply a predefined pattern as identified by formatType, which is stored in
     * locale specific repository.
     * @param {number} formatType A number that identified the predefined pattern.
     * @private
     */
    applyStandardPattern_(formatType: number): void;
    /**
     * Localizes a string potentially containing numbers, replacing ASCII digits
     * with native digits if specified so by the locale. Leaves other characters.
     * @param {string} input the string to be localized, using ASCII digits.
     * @return {string} localized string, potentially using native digits.
     * @private
     */
    localizeNumbers_(input: string): string;
    /**
     * Formats Era field according to pattern specified.
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatEra_(count: number, date: Date | googdate.Date): string;
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
    formatYear_(count: number, date: Date | googdate.Date): string;
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
    formatYearOfWeek_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats Month field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatMonth_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats (1..24) Hours field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats. This controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    format24Hours_(count: number, date: Date | googdate.Date): string;
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
    formatFractionalSeconds_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats Day of week field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatDayOfWeek_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats Am/Pm field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatAmPm_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats (1..12) Hours field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    format1To12Hours_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats (0..11) Hours field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    format0To11Hours_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats (0..23) Hours field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    format0To23Hours_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats Standalone weekday field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    formatStandaloneDay_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats Standalone Month field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} formatted string that represent this field.
     * @private
     */
    formatStandaloneMonth_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats Quarter field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatQuarter_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats Date field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatDate_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats Minutes field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatMinutes_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats Seconds field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatSeconds_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats the week of year field according to pattern specified
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatWeekOfYear_(count: number, date: Date | googdate.Date): string;
    /**
     * Formats TimeZone field following RFC
     *
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date It holds the date object to be formatted.
     * @param {TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} Formatted string that represent this field.
     * @private
     */
    formatTimeZoneRFC_(count: number, date: Date | googdate.Date, opt_timeZone?: TimeZone | undefined): string;
    /**
     * Generate GMT timeZone string for given date
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date Whose value being evaluated.
     * @param {TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} GMT timeZone string.
     * @private
     */
    formatTimeZone_(count: number, date: Date | googdate.Date, opt_timeZone?: TimeZone | undefined): string;
    /**
     * Generate GMT timeZone string for given date
     * @param {!DateLike} date Whose value being evaluated.
     * @param {TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} GMT timeZone string.
     * @private
     */
    formatTimeZoneId_(date: Date | googdate.Date, opt_timeZone?: TimeZone | undefined): string;
    /**
     * Generate localized, location dependent time zone id
     * @param {number} count Number of time pattern char repeats, it controls
     *     how a field should be formatted.
     * @param {!DateLike} date Whose value being evaluated.
     * @param {TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} GMT timeZone string.
     * @private
     */
    formatTimeZoneLocationId_(count: number, date: Date | googdate.Date, opt_timeZone?: TimeZone | undefined): string;
    /**
     * Formatting one date field.
     * @param {string} patternStr The pattern string for the field being formatted.
     * @param {!DateLike} date represents the real date to be formatted.
     * @param {!DateLike} dateForDate used to resolve date fields
     *     for formatting.
     * @param {!DateLike} dateForTime used to resolve time fields
     *     for formatting.
     * @param {TimeZone=} opt_timeZone This holds current time zone info.
     * @return {string} string representation for the given field.
     * @private
     */
    formatField_(patternStr: string, date: Date | googdate.Date, dateForDate: Date | googdate.Date, dateForTime: Date | googdate.Date, opt_timeZone?: TimeZone | undefined): string;
}
export namespace DateTimeFormat {
    export const TOKENS_: Array<RegExp>;
    export namespace PartTypes_ {
        export const QUOTED_STRING: number;
        export const FIELD: number;
        export const LITERAL: number;
    }
    /**
     * These are token types, corresponding to above token definitions.
     */
    export type PartTypes_ = number;
    export const enforceAsciiDigits_: boolean;
    export const removeRlmInPatterns_: boolean;
}
export namespace Format {
    export const FULL_DATE: number;
    export const LONG_DATE: number;
    export const MEDIUM_DATE: number;
    export const SHORT_DATE: number;
    export const FULL_TIME: number;
    export const LONG_TIME: number;
    export const MEDIUM_TIME: number;
    export const SHORT_TIME: number;
    export const FULL_DATETIME: number;
    export const LONG_DATETIME: number;
    export const MEDIUM_DATETIME: number;
    export const SHORT_DATETIME: number;
}
import { DateTimeSymbolsType } from "./datetimesymbols.js";
import * as googdate from "../date/date.js";
import { TimeZone } from "./timezone.js";
