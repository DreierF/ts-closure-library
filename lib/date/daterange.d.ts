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
     * Constructs a date range.
     * @param {?DateDate} startDate The first date in the range.
     * @param {?DateDate} endDate The last date in the range.
     */
    constructor(startDate: DateDate, endDate: DateDate);
    /**
     * The first date in the range.
     * @type {?DateDate}
     * @private
     */
    startDate_: DateDate | null;
    /**
     * The last date in the range.
     * @type {?DateDate}
     * @private
     */
    endDate_: DateDate | null;
    /**
     * @return {?DateDate} The first date in the range.
     */
    getStartDate(): DateDate;
    /**
     * @return {?DateDate} The last date in the range.
     */
    getEndDate(): DateDate;
    /**
     * Tests if a date falls within this range.
     *
     * @param {?DateDate} date The date to test.
     * @return {boolean} Whether the date is in the range.
     */
    contains(date: DateDate): boolean;
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
    constructor(dateRange: DateRange);
    /**
     * The next date.
     * @type {?DateDate}
     * @private
     */
    nextDate_: DateDate | null;
    /**
     * The end date, expressed as an integer: YYYYMMDD.
     * @type {number}
     * @private
     */
    endDate_: number;
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
