import * as googarray from './../array/array.js';
import {DateLike} from './../date/date.js';
import * as goog_object from './../object/object.js';
import * as strings from './../string/string.js';
// Copyright 2008 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
class TimeZone {

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
   */
  constructor() {
    /**
     * The standard time zone id.
     * @type {string}
     * @private
     */
    this.timeZoneId_;
  
  
    /**
     * The standard, non-daylight time zone offset, in minutes WEST of UTC.
     * @type {number}
     * @private
     */
    this.standardOffset_;
  
  
    /**
     * An array of strings that can have 2 or 4 elements.  The first two elements
     * are the long and short names for standard time in this time zone, and the
     * last two elements (if present) are the long and short names for daylight
     * time in this time zone.
     * @type {Array<string>}
     * @private
     */
    this.tzNames_;
  
  
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
    this.tzNamesExt_;
  
  
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
    this.transitions_;
  }

  /**
   * This factory method creates a time zone instance.  It takes either an object
   * containing complete time zone information, or a single number representing a
   * constant time zone offset.  If the latter form is used, DST functionality is
   * not available.
   *
   * @param {number|Object} timeZoneData If this parameter is a number, it should
   *     indicate minutes WEST of UTC to be used as a constant time zone offset.
   *     Otherwise, it should be an object with these four fields:
   *     <ul>
   *     <li>id: A string ID for the time zone.
   *     <li>std_offset: The standard time zone offset in minutes EAST of UTC.
   *     <li>names: An array of four names (standard short name, standard long
   *           name, daylight short name, daylight long, name)
   *     <li>names_ext: A hash of four fields (standard long name gmt, daylight
   *           long name gmt, standard generic location, daylight generic
   *           location)
   *     <li>transitions: An array of numbers which are interpreted in pairs:
   *           [time1, adjustment1, time2, adjustment2, ...] where each time is
   *           a DST transition point given as a number of hours since 00:00 UTC,
   *           January 1, 1970, and each adjustment is the adjustment to apply
   *           for times after the DST transition, given as minutes EAST of UTC.
   *     </ul>
   * @return {!TimeZone} A TimeZone object for the given
   *     time zone data.
   */
  static createTimeZone(timeZoneData) {
    if (typeof timeZoneData == 'number') {
      return TimeZone.createSimpleTimeZone_(timeZoneData);
    }
    var tz = new TimeZone();
    tz.timeZoneId_ = timeZoneData['id'];
    tz.standardOffset_ = -timeZoneData['std_offset'];
    tz.tzNames_ = timeZoneData['names'];
    tz.tzNamesExt_ = timeZoneData['names_ext'];
    tz.transitions_ = timeZoneData['transitions'];
    return tz;
  };

  /**
   * This factory method creates a time zone object with a constant offset.
   * @param {number} timeZoneOffsetInMinutes Offset in minutes WEST of UTC.
   * @return {!TimeZone} A time zone object with the given constant
   *     offset.  Note that the time zone ID of this object will use the POSIX
   *     convention, which has a reversed sign ("Etc/GMT+8" means UTC-8 or PST).
   * @private
   */
  static createSimpleTimeZone_(timeZoneOffsetInMinutes) {
    var tz = new TimeZone();
    tz.standardOffset_ = timeZoneOffsetInMinutes;
    tz.timeZoneId_ =
        TimeZone.composePosixTimeZoneID_(timeZoneOffsetInMinutes);
    var str = TimeZone.composeUTCString_(timeZoneOffsetInMinutes);
    var strGMT = TimeZone.composeGMTString_(timeZoneOffsetInMinutes);
    tz.tzNames_ = [str, str];
    tz.tzNamesExt_ = {STD_LONG_NAME_GMT: strGMT, STD_GENERIC_LOCATION: strGMT};
    tz.transitions_ = [];
    return tz;
  };

  /**
   * Generate a GMT-relative string for a constant time zone offset.
   * @param {number} offset The time zone offset in minutes WEST of UTC.
   * @return {string} The GMT string for this offset, which will indicate
   *     hours EAST of UTC.
   * @private
   */
  static composeGMTString_(offset) {
    var parts = ['GMT'];
    parts.push(offset <= 0 ? '+' : '-');
    offset = Math.abs(offset);
    parts.push(
        strings.padNumber(Math.floor(offset / 60) % 100, 2), ':',
        strings.padNumber(offset % 60, 2));
    return parts.join('');
  };

  /**
   * Generate a POSIX time zone ID for a constant time zone offset.
   * @param {number} offset The time zone offset in minutes WEST of UTC.
   * @return {string} The POSIX time zone ID for this offset, which will indicate
   *     hours WEST of UTC.
   * @private
   */
  static composePosixTimeZoneID_(offset) {
    if (offset == 0) {
      return 'Etc/GMT';
    }
    var parts = ['Etc/GMT', offset < 0 ? '-' : '+'];
    offset = Math.abs(offset);
    parts.push(Math.floor(offset / 60) % 100);
    offset = offset % 60;
    if (offset != 0) {
      parts.push(':', strings.padNumber(offset, 2));
    }
    return parts.join('');
  };

  /**
   * Generate a UTC-relative string for a constant time zone offset.
   * @param {number} offset The time zone offset in minutes WEST of UTC.
   * @return {string} The UTC string for this offset, which will indicate
   *     hours EAST of UTC.
   * @private
   */
  static composeUTCString_(offset) {
    if (offset == 0) {
      return 'UTC';
    }
    var parts = ['UTC', offset < 0 ? '+' : '-'];
    offset = Math.abs(offset);
    parts.push(Math.floor(offset / 60) % 100);
    offset = offset % 60;
    if (offset != 0) {
      parts.push(':', offset);
    }
    return parts.join('');
  };

  /**
   * Convert the contents of time zone object to a timeZoneData object, suitable
   * for passing to TimeZone.createTimeZone.
   * @return {!Object} A timeZoneData object (see the documentation for
   *     TimeZone.createTimeZone).
   */
  getTimeZoneData() {
    return {
      'id': this.timeZoneId_,
      'std_offset': -this.standardOffset_,  // note createTimeZone flips the sign
      'names': googarray.clone(this.tzNames_),  // avoid aliasing the array
      'names_ext': goog_object.clone(this.tzNamesExt_),   // avoid aliasing
      'transitions': googarray.clone(this.transitions_)  // avoid aliasing
    };
  };

  /**
   * Return the DST adjustment to the time zone offset for a given time.
   * While Daylight Saving Time is in effect, this number is positive.
   * Otherwise, it is zero.
   * @param {DateLike} date The time to check.
   * @return {number} The DST adjustment in minutes EAST of UTC.
   */
  getDaylightAdjustment(date) {
    var timeInMs = Date.UTC(
        date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes());
    var timeInHours = timeInMs / TimeZone.MILLISECONDS_PER_HOUR_;
    var index = 0;
    while (index < this.transitions_.length &&
           timeInHours >= this.transitions_[index]) {
      index += 2;
    }
    return (index == 0) ? 0 : this.transitions_[index - 1];
  };

  /**
   * Return the GMT representation of this time zone object.
   * @param {DateLike} date The date for which time to retrieve
   *     GMT string.
   * @return {string} GMT representation string.
   */
  getGMTString(date) {
    return TimeZone.composeGMTString_(this.getOffset(date));
  };

  /**
   * Return the UTC representation of this time zone object.
   * @param {!DateLike} date The date for which time to retrieve
   *     UTC string.
   * @return {string} UTC representation string.
   */
  getUTCString(date) {
    return TimeZone.composeUTCString_(this.getOffset(date));
  };

  /**
   * Get the long time zone name for a given date/time.
   * @param {DateLike} date The time for which to retrieve
   *     the long time zone name.
   * @return {string} The long time zone name.
   */
  getLongName(date) {
    return this.tzNames_[this.isDaylightTime(date) ?
                             TimeZone.NameType.DLT_LONG_NAME :
                             TimeZone.NameType.STD_LONG_NAME];
  };

  /**
   * Get the time zone offset in minutes WEST of UTC for a given date/time.
   * @param {DateLike} date The time for which to retrieve
   *     the time zone offset.
   * @return {number} The time zone offset in minutes WEST of UTC.
   */
  getOffset(date) {
    return this.standardOffset_ - this.getDaylightAdjustment(date);
  };

  /**
   * Get the RFC representation of the time zone for a given date/time.
   * @param {DateLike} date The time for which to retrieve the
   *     RFC time zone string.
   * @return {string} The RFC time zone string.
   */
  getRFCTimeZoneString(date) {
    var offset = -this.getOffset(date);
    var parts = [offset < 0 ? '-' : '+'];
    offset = Math.abs(offset);
    parts.push(
        strings.padNumber(Math.floor(offset / 60) % 100, 2),
        strings.padNumber(offset % 60, 2));
    return parts.join('');
  };

  /**
   * Get the short time zone name for given date/time.
   * @param {DateLike} date The time for which to retrieve
   *     the short time zone name.
   * @return {string} The short time zone name.
   */
  getShortName(date) {
    return this.tzNames_[this.isDaylightTime(date) ?
                             TimeZone.NameType.DLT_SHORT_NAME :
                             TimeZone.NameType.STD_SHORT_NAME];
  };

  /**
   * Return the time zone ID for this time zone.
   * @return {string} The time zone ID.
   */
  getTimeZoneId() {
    return this.timeZoneId_;
  };

  /**
   * Check if Daylight Saving Time is in effect at a given time in this time zone.
   * @param {DateLike} date The time to check.
   * @return {boolean} True if Daylight Saving Time is in effect.
   */
  isDaylightTime(date) {
    return this.getDaylightAdjustment(date) > 0;
  };

  /**
   * Get the long GMT time zone name for a given date/time.
   * @param {!DateLike} date The time for which to retrieve
   *     the long GMT time zone name.
   * @return {string} The long GMT time zone name.
   */
  getLongNameGMT(date) {
    if (this.isDaylightTime(date)) {
      return (this.tzNamesExt_.DST_LONG_NAME_GMT !== undefined) ?
          this.tzNamesExt_.DST_LONG_NAME_GMT :
          this.tzNamesExt_['DST_LONG_NAME_GMT'];
    } else {
      return (this.tzNamesExt_.STD_LONG_NAME_GMT !== undefined) ?
          this.tzNamesExt_.STD_LONG_NAME_GMT :
          this.tzNamesExt_['STD_LONG_NAME_GMT'];
    }
  };

  /**
   * Get the generic location time zone name for a given date/time.
   * @param {!DateLike} date The time for which to retrieve
   *     the generic location time zone name.
   * @return {string} The generic location time zone name.
   */
  getGenericLocation(date) {
    if (this.isDaylightTime(date)) {
      return (this.tzNamesExt_.DST_GENERIC_LOCATION !== undefined) ?
          this.tzNamesExt_.DST_GENERIC_LOCATION :
          this.tzNamesExt_['DST_GENERIC_LOCATION'];
    } else {
      return (this.tzNamesExt_.STD_GENERIC_LOCATION !== undefined) ?
          this.tzNamesExt_.STD_GENERIC_LOCATION :
          this.tzNamesExt_['STD_GENERIC_LOCATION'];
    }
  };
}

/**
 * The number of milliseconds in an hour.
 * @type {number}
 * @private
 */
TimeZone.MILLISECONDS_PER_HOUR_ = 3600 * 1000;

/**
 * Indices into the array of time zone names.
 * @enum {number}
 */
TimeZone.NameType = {
  STD_SHORT_NAME: 0,
  STD_LONG_NAME: 1,
  DLT_SHORT_NAME: 2,
  DLT_LONG_NAME: 3
};

export {TimeZone};