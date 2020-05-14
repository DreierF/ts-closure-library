/**
 * Standard date range keys. Equivalent to the enum IDs in
 * DateRange.java http://go/datarange.java
 */
export type StandardDateRangeKeys = string;
/**
 * @fileoverview Date range data structure. Based loosely on
 * com.google.common.util.DateRange.
 */
/**
 * Constructs a date range.
 * @class
 * @final
 */
export class DateRange {
    /**
     * Tests two {@link DateRange} objects for equality.
     * @param {?DateRange} a A date range.
     * @param {?DateRange} b A date range.
     * @return {boolean} Whether |a| is the same range as |b|.
     */
    static equals(a: DateRange | null, b: DateRange | null): boolean;
    /**
     * Calculates a date that is a number of days after a date. Does not modify its
     * input.
     * @param {?DateDate} date The input date.
     * @param {number} offset Number of days.
     * @return {!DateDate} The date that is |offset| days after |date|.
     * @private
     */
    private static offsetInDays_;
    /**
     * Calculates a date that is a number of months after the first day in the
     * month that contains its input. Does not modify its input.
     * @param {?DateDate} date The input date.
     * @param {number} offset Number of months.
     * @return {!DateDate} The date that is |offset| months after the first
     *     day in the month that contains |date|.
     * @private
     */
    private static offsetInMonths_;
    /**
     * Returns the range from yesterday to yesterday.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The range that includes only yesterday.
     */
    static yesterday(opt_today?: DateDate | undefined): DateRange;
    /**
     * Returns the range from today to today.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The range that includes only today.
     */
    static today(opt_today?: DateDate | undefined): DateRange;
    /**
     * Returns the range that includes the seven days that end yesterday.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The range that includes the seven days that
     *     end yesterday.
     */
    static last7Days(opt_today?: DateDate | undefined): DateRange;
    /**
     * Returns the range that starts the first of this month and ends the last day
     * of this month.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The range that starts the first of this month
     *     and ends the last day of this month.
     */
    static thisMonth(opt_today?: DateDate | undefined): DateRange;
    /**
     * Returns the range that starts the first of last month and ends the last day
     * of last month.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The range that starts the first of last month
     *     and ends the last day of last month.
     */
    static lastMonth(opt_today?: DateDate | undefined): DateRange;
    /**
     * Returns the seven-day range that starts on the first day of the week
     * (see {@link goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK}) on or before today.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The range that starts the Monday on or before
     *     today and ends the Sunday on or after today.
     */
    static thisWeek(opt_today?: DateDate | undefined): DateRange;
    /**
     * Returns the seven-day range that ends the day before the first day of
     * the week (see {@link goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK}) that
     * contains today.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The range that starts seven days before the
     *     Monday on or before today and ends the Sunday on or before yesterday.
     */
    static lastWeek(opt_today?: DateDate | undefined): DateRange;
    /**
     * Returns the range that starts seven days before the Monday on or before
     * today and ends the Friday before today.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The range that starts seven days before the
     *     Monday on or before today and ends the Friday before today.
     */
    static lastBusinessWeek(opt_today?: DateDate | undefined): DateRange;
    /**
     * Returns the range that includes all days between January 1, 1900 and
     * December 31, 9999.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The range that includes all days between
     *     January 1, 1900 and December 31, 9999.
     */
    static allTime(opt_today?: DateDate | undefined): DateRange;
    /**
     * @param {string} dateRangeKey A standard date range key.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateRange} The date range that corresponds to that key.
     * @throws {Error} If no standard date range with that key exists.
     */
    static standardDateRange(dateRangeKey: string, opt_today?: DateDate | undefined): DateRange;
    /**
     * Clones or creates new.
     * @param {DateDate=} opt_today The date to consider today.
     *     Defaults to today.
     * @return {!DateDate} cloned or new.
     * @private
     */
    private static cloneOrCreate_;
    /**
     * Constructs a date range.
     * @param {?DateDate} startDate The first date in the range.
     * @param {?DateDate} endDate The last date in the range.
     */
    constructor(startDate: DateDate | null, endDate: DateDate | null);
    /**
     * The first date in the range.
     * @type {?DateDate}
     * @private
     */
    private startDate_;
    /**
     * The last date in the range.
     * @type {?DateDate}
     * @private
     */
    private endDate_;
    /**
     * @return {?DateDate} The first date in the range.
     */
    getStartDate(): DateDate | null;
    /**
     * @return {?DateDate} The last date in the range.
     */
    getEndDate(): DateDate | null;
    /**
     * Tests if a date falls within this range.
     *
     * @param {?DateDate} date The date to test.
     * @return {boolean} Whether the date is in the range.
     */
    contains(date: DateDate | null): boolean;
    /**
     * @return {!Iterator} An iterator over the date range.
     */
    iterator(): Iterator;
}
export namespace DateRange {
    export const MINIMUM_DATE: DateDate | null;
    export const MAXIMUM_DATE: DateDate | null;
}
/**
 * Creates an iterator over the dates in a {@link DateRange}.
 * @class
 * @extends {IterIterator<DateDate>}
 * @final
 */
export class Iterator extends IterIterator<DateDate> {
    /**
     * Creates an iterator over the dates in a {@link DateRange}.
     * @param {?DateRange} dateRange The date range to iterate.
     */
    constructor(dateRange: DateRange | null);
    /**
     * The next date.
     * @type {?DateDate}
     * @private
     */
    private nextDate_;
    /**
     * The end date, expressed as an integer: YYYYMMDD.
     * @type {number}
     * @private
     */
    private endDate_;
}
export namespace StandardDateRangeKeys {
    export const YESTERDAY: string;
    export const TODAY: string;
    export const LAST_7_DAYS: string;
    export const THIS_MONTH: string;
    export const LAST_MONTH: string;
    export const THIS_WEEK: string;
    export const LAST_WEEK: string;
    export const LAST_BUSINESS_WEEK: string;
    export const ALL_TIME: string;
}
import { Date as DateDate } from "./date.js";
import { Iterator as IterIterator } from "../iter/iter.js";
