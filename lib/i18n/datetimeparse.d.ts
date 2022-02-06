/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Date/Time parsing library with locale support.
 */
/**
 * Namespace for locale date/time parsing functions
 */
/**
 * DateTimeParse is for parsing date in a locale-sensitive manner. It allows
 * user to use any customized patterns to parse date-time string under certain
 * locale. Things varies across locales like month name, weekname, field
 * order, etc.
 *
 * This module is the counter-part of DateTimeFormat. They use the same
 * date/time pattern specification, which is borrowed from ICU/JDK.
 *
 * This implementation could parse partial date/time.
 *
 * Time Format Syntax: To specify the time format use a time pattern string.
 * In this pattern, following letters are reserved as pattern letters, which
 * are defined as the following:
 *
 * <pre>
 * Symbol   Meaning                 Presentation        Example
 * ------   -------                 ------------        -------
 * G        era designator          (Text)              AD
 * y#       year                    (Number)            1996
 * M        month in year           (Text & Number)     July & 07
 * d        day in month            (Number)            10
 * h        hour in am/pm (1~12)    (Number)            12
 * H        hour in day (0~23)      (Number)            0
 * m        minute in hour          (Number)            30
 * s        second in minute        (Number)            55
 * S        fractional second       (Number)            978
 * E        day of week             (Text)              Tuesday
 * D        day in year             (Number)            189
 * a        am/pm marker            (Text)              PM
 * k        hour in day (1~24)      (Number)            24
 * K        hour in am/pm (0~11)    (Number)            0
 * z        time zone               (Text)              Pacific Standard Time
 * Z        time zone (RFC 822)     (Number)            -0800
 * v        time zone (generic)     (Text)              Pacific Time
 * '        escape for text         (Delimiter)         'Date='
 * ''       single quote            (Literal)           'o''clock'
 * </pre>
 *
 * The count of pattern letters determine the format. <p>
 * (Text): 4 or more pattern letters--use full form,
 *         less than 4--use short or abbreviated form if one exists.
 *         In parsing, we will always try long format, then short. <p>
 * (Number): the minimum number of digits. <p>
 * (Text & Number): 3 or over, use text, otherwise use number. <p>
 * Any characters that not in the pattern will be treated as quoted text. For
 * instance, characters like ':', '.', ' ', '#' and '@' will appear in the
 * resulting time text even they are not embraced within single quotes. In our
 * current pattern usage, we didn't use up all letters. But those unused
 * letters are strongly discouraged to be used as quoted text without quote.
 * That's because we may use other letter for pattern in future. <p>
 *
 * Examples Using the US Locale:
 *
 * Format Pattern                         Result
 * --------------                         -------
 * "yyyy.MM.dd G 'at' HH:mm:ss vvvv" ->>  1996.07.10 AD at 15:08:56 Pacific Time
 * "EEE, MMM d, ''yy"                ->>  Wed, July 10, '96
 * "h:mm a"                          ->>  12:08 PM
 * "hh 'o''clock' a, zzzz"           ->>  12 o'clock PM, Pacific Daylight Time
 * "K:mm a, vvv"                     ->>  0:00 PM, PT
 * "yyyyy.MMMMM.dd GGG hh:mm aaa"    ->>  01996.July.10 AD 12:08 PM
 *
 * <p> When parsing a date string using the abbreviated year pattern ("yy"),
 * DateTimeParse must interpret the abbreviated year relative to some
 * century. It does this by adjusting dates to be within 80 years before and 20
 * years after the time the parse function is called. For example, using a
 * pattern of "MM/dd/yy" and a DateTimeParse instance created on Jan 1, 1997,
 * the string "01/11/12" would be interpreted as Jan 11, 2012 while the string
 * "05/04/64" would be interpreted as May 4, 1964. During parsing, only
 * strings consisting of exactly two digits, as defined by {@link
 * java.lang.Character#isDigit(char)}, will be parsed into the default
 * century. Any other numeric string, such as a one digit string, a three or
 * more digit string will be interpreted as its face value.
 *
 * <p> If the year pattern does not have exactly two 'y' characters, the year is
 * interpreted literally, regardless of the number of digits. So using the
 * pattern "MM/dd/yyyy", "01/11/12" parses to Jan 11, 12 A.D.
 *
 * <p> When numeric fields abut one another directly, with no intervening
 * delimiter characters, they constitute a run of abutting numeric fields. Such
 * runs are parsed specially. For example, the format "HHmmss" parses the input
 * text "123456" to 12:34:56, parses the input text "12345" to 1:23:45, and
 * fails to parse "1234". In other words, the leftmost field of the run is
 * flexible, while the others keep a fixed width. If the parse fails anywhere in
 * the run, then the leftmost field is shortened by one character, and the
 * entire run is parsed again. This is repeated until either the parse succeeds
 * or the leftmost field is one character in length. If the parse still fails at
 * that point, the parse of the run fails.
 *
 * <p> Now timezone parsing only support GMT:hhmm, GMT:+hhmm, GMT:-hhmm
 */
/**
 * Construct a DateTimeParse based on current locale.
 *     instance rather than the global symbols.
 * @final
 */
export class DateTimeParse {
    /**
     * Construct a DateTimeParse based on current locale.
     * @param {string|number} pattern pattern specification or pattern type.
     * @param {!Object=} opt_dateTimeSymbols Optional symbols to use for this
     *     instance rather than the global symbols.
     */
    constructor(pattern: string | number, opt_dateTimeSymbols?: any | undefined);
    patternParts_: any[];
    /**
     * Data structure with all the locale info needed for date formatting.
     * (day/month names, most common patterns, rules for week-end, etc.)
     * @const @private {!DateTimeSymbolsType}
     */
    private dateTimeSymbols_;
    /**
     * Apply a pattern to this Parser. The pattern string will be parsed and saved
     * in "compiled" form.
     * Note: this method is somewhat similar to the pattern parsing method in
     *       datetimeformat. If you see something wrong here, you might want
     *       to check the other.
     * @param {string} pattern It describes the format of date string that need to
     *     be parsed.
     * @private
     */
    private applyPattern_;
    /**
     * Apply a predefined pattern to this Parser.
     * @param {number} formatType A constant used to identified the predefined
     *     pattern string stored in locale repository.
     * @private
     */
    private applyStandardPattern_;
    /**
     * Calculate character repeat count in pattern.
     *
     * @param {string} pattern It describes the format of date string that need to
     *     be parsed.
     * @param {number} start The position of pattern character.
     *
     * @return {number} Repeat count.
     * @private
     */
    private getNextCharCount_;
    /**
     * Identify the start of an abutting numeric fields' run. Taking pattern
     * "HHmmss" as an example. It will try to parse 2/2/2 characters of the input
     * text, then if that fails, 1/2/2. We only adjust the width of the leftmost
     * field; the others remain fixed. This allows "123456" => 12:34:56, but
     * "12345" => 1:23:45. Likewise, for the pattern "yyyyMMdd" we try 4/2/2,
     * 3/2/2, 2/2/2, and finally 1/2/2. The first field of connected numeric
     * fields will be marked as abutStart, its width can be reduced to accommodate
     * others.
     *
     * @private
     */
    private markAbutStart_;
    /**
     * Check if the pattern part is a numeric field.
     *
     * @param {string} ch pattern character
     * @param {number} count pattern character count
     *
     * @return {boolean} true if the pattern part is numeric field.
     * @private
     */
    private isNumericField_;
    /**
     * Assert this object's pattern supports predictive parsing.
     * @private
     */
    private assertPatternSupportsPredictive_;
    /**
     * Parse the given string and fill parsed values into date object.
     *
     * The existing values of any temporal fields of `date` not parsed from `text`
     * are not directly changed, but may be affected by overflow. E.g. if a minutes
     * value of 70 is parsed, the implementation of `date` may increment the value
     * of its hours field by 1 while setting its minutes value to 10.
     *
     * @param {string} text The string being parsed.
     * @param {?DateLike} date The Date object to hold the parsed date.
     * @param {!Object=} options The options object.
     * @return {number} How many characters parser advanced.
     */
    parse(text: string, date: DateLike | null, options?: any | undefined): number;
    /**
     * Parse the given string and fill info into date object. This version will
     * validate that the result is a valid date/time.
     * @param {string} text The string being parsed.
     * @param {?DateLike} date The Date object to hold the parsed date.
     * @return {number} How many characters parser advanced.
     * @deprecated Use DateTimeParse.parse with the validate option
     *     instead.
     */
    strictParse(text: string, date: DateLike | null): number;
    /**
     * Parse a run of abutting numeric pattern parts. Take the pattern "HHmmss" as
     * an example. We will try to parse 2/2/2 characters of the input text, then if
     * that fails, 1/2/2. We only adjust the width of the leftmost field; the others
     * remain fixed. This allows "123456" => 12:34:56, but "12345" => 1:23:45.
     * Likewise, for the pattern "yyyyMMdd" we try 4/2/2, 3/2/2, 2/2/2, and finally
     * 1/2/2.
     *
     * @param {string} text the text to be parsed.
     * @param {Array<number>} pos parse position
     * @param {number} abutStart the index of the pattern part starting the run
     * @param {DateTimeParse.MyDate_} cal object that holds parsed value
     *
     * @return {number} how many pattern parts the parser advanced
     * @private
     */
    private subParseAbut_;
    /**
     * Protected method that converts one field of the input string into a
     * numeric field value.
     *
     * @param {string} text the text to be parsed.
     * @param {Array<number>} pos Parse position.
     * @param {?Object} part the pattern part for this field.
     * @param {number} digitCount when > 0, numeric parsing must obey the count.
     * @param {DateTimeParse.MyDate_} cal object that holds parsed value.
     * @param {boolean} predictive whether to apply predictive parsing rules.
     *
     * @return {boolean} True if it parses successfully.
     * @private
     */
    private subParse_;
    /**
     * Parse year field. Year field is special because
     * 1) two digit year need to be resolved.
     * 2) we allow year to take a sign.
     * 3) year field participate in abut processing.
     *
     * @param {string} text the text to be parsed.
     * @param {Array<number>} pos Parse position.
     * @param {?Object} part the pattern part for this field.
     * @param {number} digitCount when > 0, numeric parsing must obey the count.
     * @param {DateTimeParse.MyDate_} cal object to hold parsed value.
     *
     * @return {boolean} True if successful.
     * @private
     */
    private subParseYear_;
    /**
     * Parse Month field.
     *
     * @param {string} text the text to be parsed.
     * @param {Array<number>} pos Parse position.
     * @param {number} digitCount when > 0, numeric parsing must obey the count.
     * @param {?Object} part the pattern part
     * @param {DateTimeParse.MyDate_} cal object to hold parsed value.
     *
     * @return {boolean} True if parsing successful.
     * @private
     */
    private subParseMonth_;
    /**
     * Parse fractional seconds field.
     *
     * @param {string} text the text to be parsed.
     * @param {Array<number>} pos current parse position.
     * @param {number} digitCount when > 0, numeric parsing must obey the count.
     * @param {DateTimeParse.MyDate_} cal object to hold parsed value.
     *
     * @return {boolean} True if successful.
     * @private
     */
    private subParseFractionalSeconds_;
    /**
     * Parse GMT type timezone.
     *
     * @param {string} text the text to be parsed.
     * @param {Array<number>} pos Parse position.
     * @param {DateTimeParse.MyDate_} cal object to hold parsed value.
     *
     * @return {boolean} True if successful.
     * @private
     */
    private subParseTimeZoneInGMT_;
    /**
     * Parse unsigned integer pattern characters. These are symbols such as 'd' for
     * date.
     *
     * @param {string} text the text to be parsed.
     * @param {Array<number>} pos parse position
     * @param {?Object} part the pattern part for this field.
     * @param {number} maxChars when > 0, at most this many characters are parsed.
     * @param {function(number)} callback function to record the parsed value.
     * @param {boolean=} predictive whether to apply predictive parsing rules.
     *     defaults to false
     *
     * @return {boolean} True if it parses successfully.
     * @private
     */
    private subParseInt_;
    /**
     * Parse string pattern characters. These are symbols matching a set of strings
     * such as 'E' for day of week.
     *
     * @param {string} text the text to be parsed.
     * @param {Array<number>} pos parse position
     * @param {Array<Array<string>>} data Arrays of strings to match against,
     *     sequentially.
     * @param {function(number)} callback function to record the parsed value.
     * @param {boolean=} predictive whether to apply predictive parsing rules.
     *     defaults to false
     *
     * @return {boolean} True iff the input matches any of the strings in the data
     *     arrays.
     * @private
     */
    private subParseString_;
    /**
     * Parse literal pattern characters. These are any quoted characters and non-
     * alphabetic unquoted characters.
     *
     * @param {string} text the text to be parsed.
     * @param {Array<number>} pos parse position
     * @param {?Object} part the pattern part
     * @param {boolean} predictive whether to apply predictive parsing rules.
     *
     * @return {boolean} True if it parses successfully.
     * @private
     */
    private subParseLiteral_;
    /**
     * Skip space in the string.
     *
     * @param {string} text input string.
     * @param {Array<number>} pos where skip start, and return back where the skip
     *     stops.
     * @private
     */
    private skipSpace_;
    /**
     * Parse an integer string and return integer value.
     *
     * @param {string} text string being parsed.
     * @param {Array<number>} pos parse position.
     * @param {number} maxChars when > 0, at most this many characters are parsed.
     * @param {boolean=} allowSigned if true allows a single leading sign character
     *     (+|-) in the input. defaults to false
     *
     * @return {?number} integer value, or null if the integer cannot be parsed
     * @private
     */
    private parseInt_;
    /**
     * Attempt to match the text at a given position against an array of strings.
     * Since multiple strings in the array may match (for example, if the array
     * contains "a", "ab", and "abc", all will match the input string "abcd") the
     * longest match is returned.
     *
     * @param {string} text The string to match to.
     * @param {Array<number>} pos parsing position.
     * @param {Array<string>} data The string array of matching patterns.
     * @param {boolean} predictive whether to apply predictive parsing rules.
     *
     * @return {?number} the index of the best match in the array, or null
     *     indicating matching failure.
     * @private
     */
    private matchString_;
}
export namespace DateTimeParse {
    export const ambiguousYearCenturyStart: number;
    export const PATTERN_CHARS_: string;
    export const NUMERIC_FORMAT_CHARS_: string;
    export const PREDICTIVE_FORMAT_CHARS_: string;
    export function ParseOptions(): void;
    export { MyDate_ };
}
import { DateLike } from "../date/date.js";
declare class MyDate_ {
    /**
     * The date's era.
     * @type {?number}
     */
    era: number | null;
    /**
     * The date's year.
     * @type {?number}
     */
    year: number | null;
    /**
     * The date's month.
     * @type {?number}
     */
    month: number | null;
    /**
     * The date's day of month.
     * @type {?number}
     */
    day: number | null;
    /**
     * The date's hour.
     * @type {?number}
     */
    hours: number | null;
    /**
     * The date's before/afternoon denominator.
     * @type {?number}
     */
    ampm: number | null;
    /**
     * The date's minutes.
     * @type {?number}
     */
    minutes: number | null;
    /**
     * The date's seconds.
     * @type {?number}
     */
    seconds: number | null;
    /**
     * The date's milliseconds.
     * @type {?number}
     */
    milliseconds: number | null;
    /**
     * The date's timezone offset.
     * @type {?number}
     */
    tzOffset: number | null;
    /**
     * The date's day of week. Sunday is 0, Saturday is 6.
     * @type {?number}
     */
    dayOfWeek: number | null;
    /**
     * 2 digit year special handling. Assuming for example that the
     * defaultCenturyStart is 6/18/1903. This means that two-digit years will be
     * forced into the range 6/18/1903 to 6/17/2003. As a result, years 00, 01, and
     * 02 correspond to 2000, 2001, and 2002. Years 04, 05, etc. correspond
     * to 1904, 1905, etc. If the year is 03, then it is 2003 if the
     * other fields specify a date before 6/18, or 1903 if they specify a
     * date afterwards. As a result, 03 is an ambiguous year. All other
     * two-digit years are unambiguous.
     *
     * @param {number} year 2 digit year value before adjustment.
     * @return {number} disambiguated year.
     * @private
     * @suppress {checkTypes}
     */
    private setTwoDigitYear_;
    ambiguousYear: boolean | undefined;
    /**
     * Based on the fields set, fill a Date object. For those fields that not
     * set, use the passed in date object's value.
     *
     * @param {?DateLike} date Date object to be filled.
     * @param {boolean} validation If true, input date will be checked to make
     *     sure it is valid.
     *
     * @return {boolean} false if fields specify a invalid date.
     * @private
     * @suppress {checkTypes}
     */
    private calcDate_;
}
export {};
