export type DateLike = Date | date_Date;
/**
 * Constants for months.
 */
export type month = number;
/**
 * Constants for weekdays.
 */
export type weekDay = number;
/**
 * Class representing a date. Defaults to current date if none is specified.
 *
 * Implements most methods of the native js Date object (except the time related
 * ones, {@see DateTime}) and can be used interchangeably with it just
 * as if date_Date was a synonym of Date. To make this more transparent,
 * Closure APIs should accept DateLike instead of the real Date
 * object.
 *
 *     object. If not set, the created object will contain the date
 *     determined by google.now().
 * @class
 * @see DateTime
 */
declare class date_Date {
    /**
     * Compares two dates.  May be used as a sorting function.
     * @see goog.array.sort
     * @param {!DateLike} date1 Date to compare.
     * @param {!DateLike} date2 Date to compare.
     * @return {number} Comparison result. 0 if dates are the same, less than 0 if
     *     date1 is earlier than date2, greater than 0 if date1 is later than date2.
     */
    static compare(date1: DateLike, date2: DateLike): number;
    /**
     * Parses an ISO 8601 string as a `date_Date`.
     * @param {string} formatted ISO 8601 string to parse.
     * @return {?date_Date} Parsed date or null if parse fails.
     */
    static fromIsoString(formatted: string): date_Date | null;
    /**
     * Class representing a date. Defaults to current date if none is specified.
     *
     * Implements most methods of the native js Date object (except the time related
     * ones, {@see DateTime}) and can be used interchangeably with it just
     * as if date_Date was a synonym of Date. To make this more transparent,
     * Closure APIs should accept DateLike instead of the real Date
     * object.
     *
     * @param {number|DateLike=} opt_year Four digit year or a date-like
     *     object. If not set, the created object will contain the date
     *     determined by google.now().
     * @param {number=} opt_month Month, 0 = Jan, 11 = Dec.
     * @param {number=} opt_date Date of month, 1 - 31.
     * @see DateTime
     */
    constructor(opt_year?: (number | DateLike) | undefined, opt_month?: number | undefined, opt_date?: number | undefined);
    /**
     * First day of week. 0 = Mon, 6 = Sun.
     * @type {number}
     * @private
     */
    private firstDayOfWeek_;
    /**
     * The cut off weekday used for week number calculations. 0 = Mon, 6 = Sun.
     * @type {number}
     * @private
     */
    private firstWeekCutOffDay_;
    date: Date;
    /**
     * new Date(y, m, d) treats years in the interval [0, 100) as two digit years,
     * adding 1900 to them. This method ensures that calling the date constructor
     * as a copy constructor returns a value that is equal to the passed in
     * date value by explicitly setting the full year.
     * @private
     * @param {number} fullYear The full year (including century).
     * @param {number} monthNumber The month, from 0-11.
     * @param {number} date The day of the month.
     * @return {!Date} The constructed Date object.
     */
    private buildDate_;
    /**
     * @return {!date_Date} A clone of the date object.
     */
    clone(): date_Date;
    /**
     * @return {number} The four digit year of date.
     */
    getFullYear(): number;
    /**
     * Alias for getFullYear.
     *
     * @return {number} The four digit year of date.
     * @see #getFullYear
     */
    getYear(): number;
    /**
     * @return {month} The month of date, 0 = Jan, 11 = Dec.
     */
    getMonth(): month;
    /**
     * @return {number} The date of month.
     */
    getDate(): number;
    /**
     * Returns the number of milliseconds since 1 January 1970 00:00:00.
     *
     * @return {number} The number of milliseconds since 1 January 1970 00:00:00.
     */
    getTime(): number;
    /**
     * @return {number} The day of week, US style. 0 = Sun, 6 = Sat.
     */
    getDay(): number;
    /**
     * @return {weekDay} The day of week, ISO style. 0 = Mon, 6 = Sun.
     */
    getIsoWeekday(): weekDay;
    /**
     * @return {number} The day of week according to firstDayOfWeek setting.
     */
    getWeekday(): number;
    /**
     * @return {number} The four digit year of date according to universal time.
     */
    getUTCFullYear(): number;
    /**
     * @return {month} The month of date according to universal time,
     *     0 = Jan, 11 = Dec.
     */
    getUTCMonth(): month;
    /**
     * @return {number} The date of month according to universal time.
     */
    getUTCDate(): number;
    /**
     * @return {number} The day of week according to universal time, US style.
     *     0 = Sun, 1 = Mon, 6 = Sat.
     */
    getUTCDay(): number;
    /**
     * @return {number} The hours value according to universal time.
     */
    getUTCHours(): number;
    /**
     * @return {number} The minutes value according to universal time.
     */
    getUTCMinutes(): number;
    /**
     * @return {weekDay} The day of week according to universal time, ISO
     *     style. 0 = Mon, 6 = Sun.
     */
    getUTCIsoWeekday(): weekDay;
    /**
     * @return {number} The day of week according to universal time and
     *     firstDayOfWeek setting.
     */
    getUTCWeekday(): number;
    /**
     * @return {number} The first day of the week. 0 = Mon, 6 = Sun.
     */
    getFirstDayOfWeek(): number;
    /**
     * @return {number} The cut off weekday used for week number calculations.
     *     0 = Mon, 6 = Sun.
     */
    getFirstWeekCutOffDay(): number;
    /**
     * @return {number} The number of days for the selected month.
     */
    getNumberOfDaysInMonth(): number;
    /**
     * @return {number} The week number.
     */
    getWeekNumber(): number;
    /**
     * Returns year in “Week of Year” based calendars in which the year transition
     * occurs on a week boundary.
     * @return {number} The four digit year in "Week of Year"
     */
    getYearOfWeek(): number;
    /**
     * @return {number} The day of year.
     */
    getDayOfYear(): number;
    /**
     * Returns timezone offset. The timezone offset is the delta in minutes between
     * UTC and your local time. E.g., UTC+10 returns -600. Daylight savings time
     * prevents this value from being constant.
     *
     * @return {number} The timezone offset.
     */
    getTimezoneOffset(): number;
    /**
     * Returns timezone offset as a string. Returns offset in [+-]HH:mm format or Z
     * for UTC.
     *
     * @return {string} The timezone offset as a string.
     */
    getTimezoneOffsetString(): string;
    /**
     * Sets the date.
     *
     * @param {date_Date} date Date object to set date from.
     */
    set(date: date_Date): void;
    /**
     * Sets the year part of the date.
     *
     * @param {number} year Four digit year.
     */
    setFullYear(year: number): void;
    /**
     * Alias for setFullYear.
     *
     * @param {number} year Four digit year.
     * @see #setFullYear
     */
    setYear(year: number): void;
    /**
     * Sets the month part of the date.
     *
     * TODO(nnaze): Update type to month.
     *
     * @param {number} month The month, where 0 = Jan, 11 = Dec.
     */
    setMonth(month: number): void;
    /**
     * Sets the day part of the date.
     *
     * @param {number} date The day part.
     */
    setDate(date: number): void;
    /**
     * Sets the value of the date object as expressed in the number of milliseconds
     * since 1 January 1970 00:00:00.
     *
     * @param {number} ms Number of milliseconds since 1 Jan 1970.
     */
    setTime(ms: number): void;
    /**
     * Sets the year part of the date according to universal time.
     *
     * @param {number} year Four digit year.
     */
    setUTCFullYear(year: number): void;
    /**
     * Sets the month part of the date according to universal time.
     *
     * @param {number} month The month, where 0 = Jan, 11 = Dec.
     */
    setUTCMonth(month: number): void;
    /**
     * Sets the day part of the date according to universal time.
     *
     * @param {number} date The UTC date.
     */
    setUTCDate(date: number): void;
    /**
     * Sets the first day of week.
     *
     * @param {number} day 0 = Mon, 6 = Sun.
     */
    setFirstDayOfWeek(day: number): void;
    /**
     * Sets cut off weekday used for week number calculations. 0 = Mon, 6 = Sun.
     *
     * @param {number} day The cut off weekday.
     */
    setFirstWeekCutOffDay(day: number): void;
    /**
     * Performs date calculation by adding the supplied interval to the date.
     *
     * @param {?Interval} interval Date interval to add.
     */
    add(interval: Interval | null): void;
    /**
     * Returns ISO 8601 string representation of date.
     *
     * @param {boolean=} opt_verbose Whether the verbose format should be used
     *     instead of the default compact one.
     * @param {boolean=} opt_tz Whether the timezone offset should be included
     *     in the string.
     * @return {string} ISO 8601 string representation of date.
     */
    toIsoString(opt_verbose?: boolean | undefined, opt_tz?: boolean | undefined): string;
    /**
     * Returns ISO 8601 string representation of date according to universal time.
     *
     * @param {boolean=} opt_verbose Whether the verbose format should be used
     *     instead of the default compact one.
     * @param {boolean=} opt_tz Whether the timezone offset should be included in
     *     the string.
     * @return {string} ISO 8601 string representation of date according to
     *     universal time.
     */
    toUTCIsoString(opt_verbose?: boolean | undefined, opt_tz?: boolean | undefined): string;
    /**
     * Tests whether given date is equal to this Date.
     * Note: This ignores units more precise than days (hours and below)
     * and also ignores timezone considerations.
     *
     * @param {date_Date} other The date to compare.
     * @return {boolean} Whether the given date is equal to this one.
     */
    equals(other: date_Date): boolean;
    /**
     * Overloaded toString method for object.
     * @return {string} ISO 8601 string representation of date.
     * @override
     */
    toString(): string;
    /**
     * Fixes date to account for daylight savings time in browsers that fail to do
     * so automatically.
     * @param {number} expected Expected date.
     * @private
     */
    private maybeFixDst_;
    /**
     * @return {number} Value of wrapped date.
     * @override
     */
    valueOf(): number;
}
/**
 * @fileoverview Typedefs for working with dates.
 */
/**
 * @typedef {(Date|date_Date)}
 */
export let DateLike: any;
/**
 * Class representing a date and time. Defaults to current date and time if none
 * is specified.
 *
 * Implements most methods of the native js Date object and can be used
 * interchangeably with it just as if DateTime was a subclass of Date.
 *
 *     object. If not set, the created object will contain the date determined
 *     by google.now().
 * @class
 * @extends {date_Date}
 */
export class DateTime extends date_Date {
    /**
     * @param {number} timestamp Number of milliseconds since Epoch.
     * @return {!DateTime}
     */
    static fromTimestamp(timestamp: number): DateTime;
    /**
     * Creates a DateTime from a datetime string expressed in RFC 822 format.
     *
     * @param {string} formatted A date or datetime expressed in RFC 822 format.
     * @return {?DateTime} Parsed date or null if parse fails.
     */
    static fromRfc822String(formatted: string): DateTime | null;
    /**
     * Parses an ISO 8601 string as a `DateTime`.
     * @param {string} formatted ISO 8601 string to parse.
     * @return {?DateTime} Parsed date or null if parse fails.
     * @override
     */
    static fromIsoString(formatted: string): DateTime | null;
    /**
     * Class representing a date and time. Defaults to current date and time if none
     * is specified.
     *
     * Implements most methods of the native js Date object and can be used
     * interchangeably with it just as if DateTime was a subclass of Date.
     *
     * @param {(number|{getTime:?}|null)=} opt_year Four digit year or a date-like
     *     object. If not set, the created object will contain the date determined
     *     by google.now().
     * @param {number=} opt_month Month, 0 = Jan, 11 = Dec.
     * @param {number=} opt_date Date of month, 1 - 31.
     * @param {number=} opt_hours Hours, 0 - 23.
     * @param {number=} opt_minutes Minutes, 0 - 59.
     * @param {number=} opt_seconds Seconds, 0 - 61.
     * @param {number=} opt_milliseconds Milliseconds, 0 - 999.
     */
    constructor(opt_year?: (number | {
        getTime: unknown;
    } | null) | undefined, opt_month?: number | undefined, opt_date?: number | undefined, opt_hours?: number | undefined, opt_minutes?: number | undefined, opt_seconds?: number | undefined, opt_milliseconds?: number | undefined);
    /**
     * Returns the hours part of the datetime.
     *
     * @return {number} An integer between 0 and 23, representing the hour.
     */
    getHours(): number;
    /**
     * Returns the minutes part of the datetime.
     *
     * @return {number} An integer between 0 and 59, representing the minutes.
     */
    getMinutes(): number;
    /**
     * Returns the seconds part of the datetime.
     *
     * @return {number} An integer between 0 and 59, representing the seconds.
     */
    getSeconds(): number;
    /**
     * Returns the milliseconds part of the datetime.
     *
     * @return {number} An integer between 0 and 999, representing the milliseconds.
     */
    getMilliseconds(): number;
    /**
     * Returns the seconds part of the datetime according to universal time.
     *
     * @return {number} An integer between 0 and 59, representing the seconds.
     */
    getUTCSeconds(): number;
    /**
     * Returns the milliseconds part of the datetime according to universal time.
     *
     * @return {number} An integer between 0 and 999, representing the milliseconds.
     */
    getUTCMilliseconds(): number;
    /**
     * Sets the hours part of the datetime.
     *
     * @param {number} hours An integer between 0 and 23, representing the hour.
     */
    setHours(hours: number): void;
    /**
     * Sets the minutes part of the datetime.
     *
     * @param {number} minutes Integer between 0 and 59, representing the minutes.
     */
    setMinutes(minutes: number): void;
    /**
     * Sets the seconds part of the datetime.
     *
     * @param {number} seconds Integer between 0 and 59, representing the seconds.
     */
    setSeconds(seconds: number): void;
    /**
     * Sets the milliseconds part of the datetime.
     *
     * @param {number} ms Integer between 0 and 999, representing the milliseconds.
     */
    setMilliseconds(ms: number): void;
    /**
     * Sets the hours part of the datetime according to universal time.
     *
     * @param {number} hours An integer between 0 and 23, representing the hour.
     */
    setUTCHours(hours: number): void;
    /**
     * Sets the minutes part of the datetime according to universal time.
     *
     * @param {number} minutes Integer between 0 and 59, representing the minutes.
     */
    setUTCMinutes(minutes: number): void;
    /**
     * Sets the seconds part of the datetime according to universal time.
     *
     * @param {number} seconds Integer between 0 and 59, representing the seconds.
     */
    setUTCSeconds(seconds: number): void;
    /**
     * Sets the seconds part of the datetime according to universal time.
     *
     * @param {number} ms Integer between 0 and 999, representing the milliseconds.
     */
    setUTCMilliseconds(ms: number): void;
    /**
     * @return {boolean} Whether the datetime is aligned to midnight.
     */
    isMidnight(): boolean;
    /**
     * Returns XML Schema 2 string representation of date/time.
     * The return value is also ISO 8601 compliant.
     *
     * @param {boolean=} opt_timezone Should the timezone offset be included in the
     *     string?.
     * @return {string} XML Schema 2 string representation of date/time.
     */
    toXmlDateTime(opt_timezone?: boolean | undefined): string;
    /**
     * Returns RFC 3339 string representation of datetime in UTC.
     *
     * @return {string} A UTC datetime expressed in RFC 3339 format.
     */
    toUTCRfc3339String(): string;
    /**
     * Generates time label for the datetime, e.g., '5:30 AM'.
     * By default this does not pad hours (e.g., to '05:30') and it does add
     * an am/pm suffix.
     * TODO(user): i18n -- hardcoding time format like this is bad.  E.g., in CJK
     *               locales, need Chinese characters for hour and minute units.
     * @param {boolean=} opt_padHours Whether to pad hours, e.g., '05:30' vs '5:30'.
     * @param {boolean=} opt_showAmPm Whether to show the 'am' and 'pm' suffix.
     * @param {boolean=} opt_omitZeroMinutes E.g., '5:00pm' becomes '5pm',
     *                                      but '5:01pm' remains '5:01pm'.
     * @return {string} The time label.
     * @deprecated Use goog.i18n.DateTimeFormat with
     *     goog.i18n.DateTimeFormat.Format.FULL_TIME or
     *     goog.i18n.DateTimeFormat.Format.LONG_TIME or
     *     goog.i18n.DateTimeFormat.Format.MEDIUM_TIME or
     *     goog.i18n.DateTimeFormat.Format.SHORT_TIME.
     */
    toUsTimeString(opt_padHours?: boolean | undefined, opt_showAmPm?: boolean | undefined, opt_omitZeroMinutes?: boolean | undefined): string;
    /**
     * Generates time label for the datetime in standard ISO 24-hour time format.
     * E.g., '06:00:00' or '23:30:15'.
     * @param {boolean=} opt_showSeconds Whether to shows seconds. Defaults to TRUE.
     * @return {string} The time label.
     */
    toIsoTimeString(opt_showSeconds?: boolean | undefined): string;
}
/**
 * Class representing a date/time interval. Used for date calculations.
 * <pre>
 * new Interval(0, 1) // One month
 * new Interval(0, 0, 3, 1) // Three days and one hour
 * new Interval(Interval.DAYS, 1) // One day
 * </pre>
 *
 *     by first parameter.
 * @class
 * @final
 */
export class Interval {
    /**
     * Parses an XML Schema duration (ISO 8601 extended).
     * @see http://www.w3.org/TR/xmlschema-2/#duration
     *
     * @param  {string} duration An XML schema duration in textual format.
     *     Recurring durations and weeks are not supported.
     * @return {?Interval} The duration as a Interval or null
     *     if the parse fails.
     */
    static fromIsoString(duration: string): Interval | null;
    /**
     * Class representing a date/time interval. Used for date calculations.
     * <pre>
     * new Interval(0, 1) // One month
     * new Interval(0, 0, 3, 1) // Three days and one hour
     * new Interval(Interval.DAYS, 1) // One day
     * </pre>
     *
     * @param {number|string=} opt_years Years or string representing date part.
     * @param {number=} opt_months Months or number of whatever date part specified
     *     by first parameter.
     * @param {number=} opt_days Days.
     * @param {number=} opt_hours Hours.
     * @param {number=} opt_minutes Minutes.
     * @param {number=} opt_seconds Seconds.
     */
    constructor(opt_years?: (number | string) | undefined, opt_months?: number | undefined, opt_days?: number | undefined, opt_hours?: number | undefined, opt_minutes?: number | undefined, opt_seconds?: number | undefined);
    /** @type {number} */
    years: number;
    /** @type {number} */
    months: number;
    /** @type {number} */
    days: number;
    /** @type {number} */
    hours: number;
    /** @type {number} */
    minutes: number;
    /** @type {number} */
    seconds: number;
    /**
     * Serializes Interval into XML Schema duration (ISO 8601 extended).
     * @see http://www.w3.org/TR/xmlschema-2/#duration
     *
     * @param {boolean=} opt_verbose Include zero fields in the duration string.
     * @return {?string} An XML schema duration in ISO 8601 extended format,
     *     or null if the interval contains both positive and negative fields.
     */
    toIsoString(opt_verbose?: boolean | undefined): string | null;
    /**
     * Tests whether the given interval is equal to this interval.
     * Note, this is a simple field-by-field comparison, it doesn't
     * account for comparisons like "12 months == 1 year".
     *
     * @param {?Interval} other The interval to test.
     * @return {boolean} Whether the intervals are equal.
     */
    equals(other: Interval | null): boolean;
    /**
     * @return {!Interval} A clone of the interval object.
     */
    clone(): Interval;
    /**
     * @return {boolean} Whether all fields of the interval are zero.
     */
    isZero(): boolean;
    /**
     * @return {!Interval} Negative of this interval.
     */
    getInverse(): Interval;
    /**
     * Calculates n * (this interval) by memberwise multiplication.
     * @param {number} n An integer.
     * @return {!Interval} n * this.
     */
    times(n: number): Interval;
    /**
     * Gets the total number of seconds in the time interval. Assumes that months
     * and years are empty.
     * @return {number} Total number of seconds in the interval.
     */
    getTotalSeconds(): number;
    /**
     * Adds the Interval in the argument to this Interval field by field.
     *
     * @param {?Interval} interval The Interval to add.
     */
    add(interval: Interval | null): void;
}
export namespace Interval {
    export const YEARS: string;
    export const MONTHS: string;
    export const DAYS: string;
    export const HOURS: string;
    export const MINUTES: string;
    export const SECONDS: string;
}
/**
 * Number of milliseconds in a day.
 * @type {number}
 */
export let MS_PER_DAY: number;
/**
 * Formats a month/year string.
 * Example: "January 2008"
 *
 * @param {string} monthName The month name to use in the result.
 * @param {number} yearNum The numeric year to use in the result.
 * @return {string} A formatted month/year string.
 * @deprecated Use goog.i18n.DateTimeFormat with
 *     goog.i18n.DateTimeFormat.Format.YEAR_MONTH_ABBR or
 *     goog.i18n.DateTimeFormat.Format.YEAR_MONTH_FULL.
 */
export function formatMonthAndYear(monthName: string, yearNum: number): string;
/**
 * Returns the number of days for a given month.
 *
 * @param {number} year Year part of date.
 * @param {number} monthNumber Month part of date.
 * @return {number} The number of days for the given month.
 */
export function getNumberOfDaysInMonth(year: number, monthNumber: number): number;
/**
 * Static function for week number calculation. ISO 8601 implementation.
 *
 * @param {number} year Year part of date.
 * @param {number} monthNumber Month part of date (0-11).
 * @param {number} date Day part of date (1-31).
 * @param {number=} opt_weekDay Cut off weekday, defaults to Thursday.
 * @param {number=} opt_firstDayOfWeek First day of the week, defaults to
 *     Monday.
 *     Monday=0, Sunday=6.
 * @return {number} The week number (1-53).
 */
export function getWeekNumber(year: number, monthNumber: number, date: number, opt_weekDay?: number | undefined, opt_firstDayOfWeek?: number | undefined): number;
/**
 * Static function for year of the week. ISO 8601 implementation.
 *
 * @param {number} year Year part of date.
 * @param {number} monthNumber Month part of date (0-11).
 * @param {number} date Day part of date (1-31).
 * @param {number=} opt_weekDay Cut off weekday, defaults to Thursday.
 * @param {number=} opt_firstDayOfWeek First day of the week, defaults to
 *     Monday.
 *     Monday=0, Sunday=6.
 * @return {number} The four digit year of date.
 */
export function getYearOfWeek(year: number, monthNumber: number, date: number, opt_weekDay?: number | undefined, opt_firstDayOfWeek?: number | undefined): number;
/**
 * Returns whether the given year is a leap year.
 *
 * @param {number} year Year part of date.
 * @return {boolean} Whether the given year is a leap year.
 */
export function isLeapYear(year: number): boolean;
/**
 * Returns whether the given year is a long ISO year.
 * See {@link http://www.phys.uu.nl/~vgent/calendar/isocalendar_text3.htm}.
 *
 * @param {number} year Full year part of date.
 * @return {boolean} Whether the given year is a long ISO year.
 */
export function isLongIsoYear(year: number): boolean;
/**
 * Returns true if the 2 dates are in the same day.
 * @param {?DateLike} date The time to check.
 * @param {DateLike=} opt_now The current time.
 * @return {boolean} Whether the dates are on the same day.
 */
export function isSameDay(date: DateLike | null, opt_now?: DateLike | undefined): boolean;
/**
 * Returns true if the 2 dates are in the same month.
 * @param {?DateLike} date The time to check.
 * @param {DateLike=} opt_now The current time.
 * @return {boolean} Whether the dates are in the same calendar month.
 */
export function isSameMonth(date: DateLike | null, opt_now?: DateLike | undefined): boolean;
/**
 * Returns true if the 2 dates are in the same year.
 * @param {?DateLike} date The time to check.
 * @param {DateLike=} opt_now The current time.
 * @return {boolean} Whether the dates are in the same calendar year.
 */
export function isSameYear(date: DateLike | null, opt_now?: DateLike | undefined): boolean;
/**
 * @param {T} date1 A datelike object.
 * @param {S} date2 Another datelike object.
 * @return {T|S} The later of them in time.
 * @template T,S
 */
export function max<T, S>(date1: T, date2: S): T | S;
/**
 * @param {T} date1 A datelike object.
 * @param {S} date2 Another datelike object.
 * @return {T|S} The earlier of them in time.
 * @template T,S
 */
export function min<T, S>(date1: T, date2: S): T | S;
export namespace month {
    export const JAN: number;
    export const FEB: number;
    export const MAR: number;
    export const APR: number;
    export const MAY: number;
    export const JUN: number;
    export const JUL: number;
    export const AUG: number;
    export const SEP: number;
    export const OCT: number;
    export const NOV: number;
    export const DEC: number;
}
/**
 * Parses a datetime string expressed in ISO 8601 format. Overwrites the date
 * and optionally the time part of the given object with the parsed values.
 *
 * @param {!DateTime} dateTime Object whose fields will be set.
 * @param {string} formatted A date or datetime expressed in ISO 8601 format.
 * @return {boolean} Whether the parsing succeeded.
 */
export function setIso8601DateTime(dateTime: DateTime, formatted: string): boolean;
export namespace weekDay {
    export const MON: number;
    export const TUE: number;
    export const WED: number;
    export const THU: number;
    export const FRI: number;
    export const SAT: number;
    export const SUN: number;
}
export { date_Date as Date };
