import * as google from './../google.js';
import * as googdate from './date.js';
import {Date as DateDate} from './date.js';
import {DateLike} from './date.js';
import {Interval} from './date.js';
import {DateTime} from './date.js';
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
class UtcDateTime extends DateTime {

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
  constructor(
      opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds,
      opt_milliseconds) {
    super();
    /** @override */
    this.getFullYear =
        DateTime.prototype.getUTCFullYear;
  
    /** @override */
    this.getMonth =
        DateTime.prototype.getUTCMonth;
  
    /** @override */
    this.getDate =
        DateTime.prototype.getUTCDate;
  
    /** @override */
    this.getHours =
        DateTime.prototype.getUTCHours;
  
    /** @override */
    this.getMinutes =
        DateTime.prototype.getUTCMinutes;
  
    /** @override */
    this.getSeconds =
        DateTime.prototype.getUTCSeconds;
  
    /** @override */
    this.getMilliseconds =
        DateTime.prototype.getUTCMilliseconds;
  
    /** @override */
    this.getDay = DateTime.prototype.getUTCDay;
  
    /** @override */
    this.setFullYear =
        DateTime.prototype.setUTCFullYear;
  
    /** @override */
    this.setMonth =
        DateTime.prototype.setUTCMonth;
  
    /** @override */
    this.setDate =
        DateTime.prototype.setUTCDate;
  
    /** @override */
    this.setHours =
        DateTime.prototype.setUTCHours;
  
    /** @override */
    this.setMinutes =
        DateTime.prototype.setUTCMinutes;
  
    /** @override */
    this.setSeconds =
        DateTime.prototype.setUTCSeconds;
  
    /** @override */
    this.setMilliseconds =
        DateTime.prototype.setUTCMilliseconds;
  
  
    var timestamp;
    if (typeof opt_year === 'number') {
      timestamp = Date.UTC(
          opt_year, opt_month || 0, opt_date || 1, opt_hours || 0,
          opt_minutes || 0, opt_seconds || 0, opt_milliseconds || 0);
    } else {
      timestamp = opt_year ? opt_year.getTime() : google.now();
    }
    /** @override */
    this.date = new Date(timestamp);
  }

  /**
   * @param {number} timestamp Number of milliseconds since Epoch.
   * @return {!UtcDateTime}
   * @override
   */
  static fromTimestamp(timestamp) {
    var date = new UtcDateTime();
    date.setTime(timestamp);
    return date;
  };

  /**
   * Creates a DateTime from a UTC datetime string expressed in ISO 8601 format.
   *
   * @param {string} formatted A date or datetime expressed in ISO 8601 format.
   * @return {UtcDateTime} Parsed date or null if parse fails.
   * @override
   */
  static fromIsoString(formatted) {
    var ret = new UtcDateTime(2000);
    return googdate.setIso8601DateTime(ret, formatted) ? ret : null;
  };

  /**
   * Clones the UtcDateTime object.
   *
   * @return {!UtcDateTime} A clone of the datetime object.
   * @override
   */
  clone() {
    var date = new UtcDateTime(this.date);
    date.setFirstDayOfWeek(this.getFirstDayOfWeek());
    date.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());
    return date;
  };

  /** @override */
  add(interval) {
    if (interval.years || interval.months) {
      var yearsMonths = new Interval(interval.years, interval.months);
      DateDate.prototype.add.call(this, yearsMonths);
    }
    var daysAndTimeMillis = 1000 *
        (interval.seconds +
         60 * (interval.minutes + 60 * (interval.hours + 24 * interval.days)));
    this.date = new Date(this.date.getTime() + daysAndTimeMillis);
  };

  /** @override */
  getTimezoneOffset() {
    return 0;
  };
}

export {UtcDateTime};