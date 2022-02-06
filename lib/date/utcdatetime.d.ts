/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Locale independent date/time class.
 */
/**
 * Class representing a date/time in GMT+0 time zone, without daylight saving.
 * Defaults to current date and time if none is specified. The get... and the
 * getUTC... methods are equivalent.
 *
 *     date-like object.  If not set, the created object will contain the
 *     date determined by google.now().
 * @class
 * @extends {DateTime}
 */
export class UtcDateTime extends googdate.DateTime {
    /**
     * @param {number} timestamp Number of milliseconds since Epoch.
     * @return {!UtcDateTime}
     * @override
     */
    static fromTimestamp(timestamp: number): UtcDateTime;
    /**
     * Creates a DateTime from a UTC datetime string expressed in ISO 8601 format.
     *
     * @param {string} formatted A date or datetime expressed in ISO 8601 format.
     * @return {?UtcDateTime} Parsed date or null if parse fails.
     * @override
     */
    static fromIsoString(formatted: string): UtcDateTime | null;
    /**
     * Class representing a date/time in GMT+0 time zone, without daylight saving.
     * Defaults to current date and time if none is specified. The get... and the
     * getUTC... methods are equivalent.
     *
     * @param {number|DateLike=} opt_year Four digit UTC year or a
     *     date-like object.  If not set, the created object will contain the
     *     date determined by google.now().
     * @param {number=} opt_month UTC month, 0 = Jan, 11 = Dec.
     * @param {number=} opt_date UTC date of month, 1 - 31.
     * @param {number=} opt_hours UTC hours, 0 - 23.
     * @param {number=} opt_minutes UTC minutes, 0 - 59.
     * @param {number=} opt_seconds UTC seconds, 0 - 59.
     * @param {number=} opt_milliseconds UTC milliseconds, 0 - 999.
     */
    constructor(opt_year?: (number | DateLike) | undefined, opt_month?: number | undefined, opt_date?: number | undefined, opt_hours?: number | undefined, opt_minutes?: number | undefined, opt_seconds?: number | undefined, opt_milliseconds?: number | undefined);
}
import * as googdate from "./date.js";
import { DateLike } from "./date.js";
