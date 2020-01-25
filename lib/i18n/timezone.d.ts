/**
 * @fileoverview Functions to provide timezone information for use with
 * date/time format.
 */
/**
 *  DateLike represents a Date or a
 * google.Date object. It is a parameter in the following methods:
 * - getDaylightAdjustment
 * - getGMTString
 * - getLongName
 * - getOffset
 * - getRFCTimeZoneString
 * - getShortName
 * - getUTCString
 * - isDaylightTime
 * - getLongNameGMT
 * - getGenericLocation
 * Lint warns that this require is unnecessary but the closure compiler needs
 * it in order to accept a Date or a google.Date object as a DateLike
 * parameter in any of these methods.
 */
/**
 * TimeZone class implemented a time zone resolution and name information
 * source for client applications. The time zone object is initiated from
 * a time zone information object. Application can initiate a time zone
 * statically, or it may choose to initiate from a data obtained from server.
 * Each time zone information array is small, but the whole set of data
 * is too much for client application to download. If end user is allowed to
 * change time zone setting, dynamic retrieval should be the method to use.
 * In case only time zone offset is known, there is a decent fallback
 * that only use the time zone offset to create a TimeZone object.
 *
 * @final
 */
export class TimeZone {
    /**
     * The standard time zone id.
     * @type {string}
     * @private
     */
    timeZoneId_: string;
    /**
     * The standard, non-daylight time zone offset, in minutes WEST of UTC.
     * @type {number}
     * @private
     */
    standardOffset_: number;
    /**
     * An array of strings that can have 2 or 4 elements.  The first two elements
     * are the long and short names for standard time in this time zone, and the
     * last two elements (if present) are the long and short names for daylight
     * time in this time zone.
     * @type {Array<string>}
     * @private
     */
    tzNames_: Array<string>;
    /**
     * An object of 2 to 4 elements. The STD_* are always available, while the
     * DST_* are only available when daylight saving time is available for this
     * time zone.
     * <ul>
     * <li>STD_LONG_NAME_GMT: long GMT name for standard time</li>
     * <li>STD_GENERIC_LOCATION: generic location for standard time</li>
     * <li>DST_LONG_NAME_GMT: long GMT for daylight saving time</li>
     * <li>DST_GENERIC_LOCATION: generic location for daylight saving time</li>
     * </ul>
     * @type {{
     *   STD_LONG_NAME_GMT: string,
     *   STD_GENERIC_LOCATION: string,
     *   DST_LONG_NAME_GMT: (string|undefined),
     *   DST_GENERIC_LOCATION: (string|undefined)
     * }}
     * @private
     */
    tzNamesExt_: {
        STD_LONG_NAME_GMT: string;
        STD_GENERIC_LOCATION: string;
        DST_LONG_NAME_GMT: (string | undefined);
        DST_GENERIC_LOCATION: (string | undefined);
    };
    /**
     * This array specifies the Daylight Saving Time transitions for this time
     * zone.  This is a flat array of numbers which are interpreted in pairs:
     * [time1, adjustment1, time2, adjustment2, ...] where each time is a DST
     * transition point given as a number of hours since 00:00 UTC, January 1,
     * 1970, and each adjustment is the adjustment to apply for times after the
     * DST transition, given as minutes EAST of UTC.
     * @type {Array<number>}
     * @private
     */
    transitions_: Array<number>;
    /**
     * Convert the contents of time zone object to a timeZoneData object, suitable
     * for passing to TimeZone.createTimeZone.
     * @return {!Object} A timeZoneData object (see the documentation for
     *     TimeZone.createTimeZone).
     */
    getTimeZoneData(): any;
    /**
     * Return the DST adjustment to the time zone offset for a given time.
     * While Daylight Saving Time is in effect, this number is positive.
     * Otherwise, it is zero.
     * @param {?DateLike} date The time to check.
     * @return {number} The DST adjustment in minutes EAST of UTC.
     */
    getDaylightAdjustment(date: Date | import("../date/date.js").Date): number;
    /**
     * Return the GMT representation of this time zone object.
     * @param {?DateLike} date The date for which time to retrieve
     *     GMT string.
     * @return {string} GMT representation string.
     */
    getGMTString(date: Date | import("../date/date.js").Date): string;
    /**
     * Return the UTC representation of this time zone object.
     * @param {!DateLike} date The date for which time to retrieve
     *     UTC string.
     * @return {string} UTC representation string.
     */
    getUTCString(date: Date | import("../date/date.js").Date): string;
    /**
     * Get the long time zone name for a given date/time.
     * @param {?DateLike} date The time for which to retrieve
     *     the long time zone name.
     * @return {string} The long time zone name.
     */
    getLongName(date: Date | import("../date/date.js").Date): string;
    /**
     * Get the time zone offset in minutes WEST of UTC for a given date/time.
     * @param {?DateLike} date The time for which to retrieve
     *     the time zone offset.
     * @return {number} The time zone offset in minutes WEST of UTC.
     */
    getOffset(date: Date | import("../date/date.js").Date): number;
    /**
     * Get the RFC representation of the time zone for a given date/time.
     * @param {?DateLike} date The time for which to retrieve the
     *     RFC time zone string.
     * @return {string} The RFC time zone string.
     */
    getRFCTimeZoneString(date: Date | import("../date/date.js").Date): string;
    /**
     * Get the short time zone name for given date/time.
     * @param {?DateLike} date The time for which to retrieve
     *     the short time zone name.
     * @return {string} The short time zone name.
     */
    getShortName(date: Date | import("../date/date.js").Date): string;
    /**
     * Return the time zone ID for this time zone.
     * @return {string} The time zone ID.
     */
    getTimeZoneId(): string;
    /**
     * Check if Daylight Saving Time is in effect at a given time in this time zone.
     * @param {?DateLike} date The time to check.
     * @return {boolean} True if Daylight Saving Time is in effect.
     */
    isDaylightTime(date: Date | import("../date/date.js").Date): boolean;
    /**
     * Get the long GMT time zone name for a given date/time.
     * @param {!DateLike} date The time for which to retrieve
     *     the long GMT time zone name.
     * @return {string} The long GMT time zone name.
     */
    getLongNameGMT(date: Date | import("../date/date.js").Date): string;
    /**
     * Get the generic location time zone name for a given date/time.
     * @param {!DateLike} date The time for which to retrieve
     *     the generic location time zone name.
     * @return {string} The generic location time zone name.
     */
    getGenericLocation(date: Date | import("../date/date.js").Date): string;
}
export namespace TimeZone {
    export const MILLISECONDS_PER_HOUR_: number;
    export namespace NameType {
        export const STD_SHORT_NAME: number;
        export const STD_LONG_NAME: number;
        export const DLT_SHORT_NAME: number;
        export const DLT_LONG_NAME: number;
    }
    /**
     * Indices into the array of time zone names.
     */
    export type NameType = number;
}
