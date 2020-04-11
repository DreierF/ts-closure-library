import * as asserts from './../asserts/asserts.js';
import * as google from './../google.js';
import {DateTimeSymbols} from './../i18n/datetimesymbols.js';
import * as strings from './../string/string.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Functions and objects for date representation and manipulation.
 * @suppress {checkPrototypalTypes}
 */

/**  */

/**
 * Constants for weekdays.
 * @enum {number}
 */
let weekDay = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
  SAT: 5,
  SUN: 6
};

/**
 * Constants for months.
 * @enum {number}
 */
let month = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11
};

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
function formatMonthAndYear(monthName, yearNum) {
  /** @desc Month/year format given the month name and the numeric year. */
  var MSG_MONTH_AND_YEAR = google.getMsg(
      '{$monthName} {$yearNum}',
      {'monthName': monthName, 'yearNum': String(yearNum)});
  return MSG_MONTH_AND_YEAR;
};

/**
 * Regular expression for splitting date parts from ISO 8601 styled string.
 * Examples: '20060210' or '2005-02-22' or '20050222' or '2005-08'
 * or '2005-W22' or '2005W22' or '2005-W22-4', etc.
 * For explanation and more examples, see:
 * {@link http://en.wikipedia.org/wiki/ISO_8601}
 *
 * @type {RegExp}
 * @private
 */
let splitDateStringRegex_ = new RegExp(
    '^(\\d{4})(?:(?:-?(\\d{2})(?:-?(\\d{2}))?)|' +
    '(?:-?(\\d{3}))|(?:-?W(\\d{2})(?:-?([1-7]))?))?$');

/**
 * Regular expression for splitting time parts from ISO 8601 styled string.
 * Examples: '18:46:39.994' or '184639.994'
 *
 * @type {RegExp}
 * @private
 */
let splitTimeStringRegex_ =
    /^(\d{2})(?::?(\d{2})(?::?(\d{2})(\.\d+)?)?)?$/;

/**
 * Regular expression for splitting timezone parts from ISO 8601 styled string.
 * Example: The part after the '+' in '18:46:39+07:00'.  Or '09:30Z' (UTC).
 *
 * @type {RegExp}
 * @private
 */
let splitTimezoneStringRegex_ = /Z|(?:([-+])(\d{2})(?::?(\d{2}))?)$/;

/**
 * Regular expression for splitting duration parts from ISO 8601 styled string.
 * Example: '-P1Y2M3DT4H5M6.7S'
 *
 * @type {RegExp}
 * @private
 */
let splitDurationRegex_ = new RegExp(
    '^(-)?P(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)D)?' +
    '(T(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+(?:\\.\\d+)?)S)?)?$');

/**
 * Number of milliseconds in a day.
 * @type {number}
 */
let MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Returns whether the given year is a leap year.
 *
 * @param {number} year Year part of date.
 * @return {boolean} Whether the given year is a leap year.
 */
function isLeapYear(year) {
  // Leap year logic; the 4-100-400 rule
  return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
};

/**
 * Returns whether the given year is a long ISO year.
 * See {@link http://www.phys.uu.nl/~vgent/calendar/isocalendar_text3.htm}.
 *
 * @param {number} year Full year part of date.
 * @return {boolean} Whether the given year is a long ISO year.
 */
function isLongIsoYear(year) {
  var n = 5 * year + 12 - 4 * (Math.floor(year / 100) - Math.floor(year / 400));
  n += Math.floor((year - 100) / 400) - Math.floor((year - 102) / 400);
  n += Math.floor((year - 200) / 400) - Math.floor((year - 199) / 400);

  return n % 28 < 5;
};

/**
 * Returns the number of days for a given month.
 *
 * @param {number} year Year part of date.
 * @param {number} monthNumber Month part of date.
 * @return {number} The number of days for the given month.
 */
function getNumberOfDaysInMonth(year, monthNumber) {
  switch (monthNumber) {
    case month.FEB:
      return isLeapYear(year) ? 29 : 28;
    case month.JUN:
    case month.SEP:
    case month.NOV:
    case month.APR:
      return 30;
  }
  return 31;
};

/**
 * Returns true if the 2 dates are in the same day.
 * @param {DateLike} date The time to check.
 * @param {DateLike=} opt_now The current time.
 * @return {boolean} Whether the dates are on the same day.
 */
function isSameDay(date, opt_now) {
  var now = opt_now || new Date(google.now());
  return date.getDate() == now.getDate() && isSameMonth(date, now);
};

/**
 * Returns true if the 2 dates are in the same month.
 * @param {DateLike} date The time to check.
 * @param {DateLike=} opt_now The current time.
 * @return {boolean} Whether the dates are in the same calendar month.
 */
function isSameMonth(date, opt_now) {
  var now = opt_now || new Date(google.now());
  return date.getMonth() == now.getMonth() && isSameYear(date, now);
};

/**
 * Returns true if the 2 dates are in the same year.
 * @param {DateLike} date The time to check.
 * @param {DateLike=} opt_now The current time.
 * @return {boolean} Whether the dates are in the same calendar year.
 */
function isSameYear(date, opt_now) {
  var now = opt_now || new Date(google.now());
  return date.getFullYear() == now.getFullYear();
};

/**
 * Static function for the day of the same week that determines the week number
 * and year of week.
 *
 * @param {number} year Year part of date.
 * @param {number} monthNumber Month part of date (0-11).
 * @param {number} date Day part of date (1-31).
 * @param {number=} opt_weekDay Cut off weekday, defaults to Thursday.
 * @param {number=} opt_firstDayOfWeek First day of the week, defaults to
 *     Monday.
 *     Monday=0, Sunday=6.
 * @return {number} the cutoff day of the same week in millis since epoch.
 * @private
 */
function getCutOffSameWeek_(
    year, monthNumber, date, opt_weekDay, opt_firstDayOfWeek) {
  var d = new Date(year, monthNumber, date);

  // Default to Thursday for cut off as per ISO 8601.
  var cutoff =
      (opt_weekDay !== undefined) ? opt_weekDay : weekDay.THU;

  // Default to Monday for first day of the week as per ISO 8601.
  var firstday = opt_firstDayOfWeek || weekDay.MON;

  // The d.getDay() has to be converted first to ISO weekday (Monday=0).
  var isoday = (d.getDay() + 6) % 7;

  // Position of given day in the picker grid w.r.t. first day of week
  var daypos = (isoday - firstday + 7) % 7;

  // Position of cut off day in the picker grid w.r.t. first day of week
  var cutoffpos = (cutoff - firstday + 7) % 7;

  // Unix timestamp of the midnight of the cutoff day in the week of 'd'.
  // There might be +-1 hour shift in the result due to the daylight saving,
  // but it doesn't affect the year.
  return d.valueOf() + (cutoffpos - daypos) * MS_PER_DAY;
};

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
function getWeekNumber(
    year, monthNumber, date, opt_weekDay, opt_firstDayOfWeek) {
  var cutoffSameWeek = getCutOffSameWeek_(
      year, monthNumber, date, opt_weekDay, opt_firstDayOfWeek);

  // Unix timestamp of January 1 in the year of the week.
  var jan1 = new Date(new Date(cutoffSameWeek).getFullYear(), 0, 1).valueOf();

  // Number of week. The round() eliminates the effect of daylight saving.
  return Math.floor(
             Math.round((cutoffSameWeek - jan1) / MS_PER_DAY) / 7) +
      1;
};

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
function getYearOfWeek(
    year, monthNumber, date, opt_weekDay, opt_firstDayOfWeek) {
  var cutoffSameWeek = getCutOffSameWeek_(
      year, monthNumber, date, opt_weekDay, opt_firstDayOfWeek);

  return new Date(cutoffSameWeek).getFullYear();
};

/**
 * @param {T} date1 A datelike object.
 * @param {S} date2 Another datelike object.
 * @return {T|S} The earlier of them in time.
 * @template T,S
 */
function min(date1, date2) {
  return date1 < date2 ? date1 : date2;
};

/**
 * @param {T} date1 A datelike object.
 * @param {S} date2 Another datelike object.
 * @return {T|S} The later of them in time.
 * @template T,S
 */
function max(date1, date2) {
  return date1 > date2 ? date1 : date2;
};

/**
 * Parses a datetime string expressed in ISO 8601 format. Overwrites the date
 * and optionally the time part of the given object with the parsed values.
 *
 * @param {!DateTime} dateTime Object whose fields will be set.
 * @param {string} formatted A date or datetime expressed in ISO 8601 format.
 * @return {boolean} Whether the parsing succeeded.
 */
function setIso8601DateTime(dateTime, formatted) {
  formatted = strings.trim(formatted);
  var delim = formatted.indexOf('T') == -1 ? ' ' : 'T';
  var parts = formatted.split(delim);
  return setIso8601DateOnly_(dateTime, parts[0]) &&
      (parts.length < 2 || setIso8601TimeOnly_(dateTime, parts[1]));
};

/**
 * Sets date fields based on an ISO 8601 format string.
 *
 * @param {!date_Date} d Object whose fields will be set.
 * @param {string} formatted A date expressed in ISO 8601 format.
 * @return {boolean} Whether the parsing succeeded.
 * @private
 */
function setIso8601DateOnly_(d, formatted) {
  // split the formatted ISO date string into its date fields
  var parts = formatted.match(splitDateStringRegex_);
  if (!parts) {
    return false;
  }

  var year = Number(parts[1]);
  var month = Number(parts[2]);
  var date = Number(parts[3]);
  var dayOfYear = Number(parts[4]);
  var week = Number(parts[5]);
  // ISO weekdays start with 1, native getDay() values start with 0
  var dayOfWeek = Number(parts[6]) || 1;

  d.setFullYear(year);

  if (dayOfYear) {
    d.setDate(1);
    d.setMonth(0);
    var offset = dayOfYear - 1;  // offset, so 1-indexed, i.e., skip day 1
    d.add(new Interval(Interval.DAYS, offset));
  } else if (week) {
    setDateFromIso8601Week_(d, week, dayOfWeek);
  } else {
    if (month) {
      d.setDate(1);
      d.setMonth(month - 1);
    }
    if (date) {
      d.setDate(date);
    }
  }

  return true;
};

/**
 * Sets date fields based on an ISO 8601 week string.
 * See {@link http://en.wikipedia.org/wiki/ISO_week_date}, "Relation with the
 * Gregorian Calendar".  The first week of a new ISO year is the week with the
 * majority of its days in the new Gregorian year.  I.e., ISO Week 1's Thursday
 * is in that year.  ISO weeks always start on Monday. So ISO Week 1 can
 * contain a few days from the previous Gregorian year.  And ISO weeks always
 * end on Sunday, so the last ISO week (Week 52 or 53) can have a few days from
 * the following Gregorian year.
 * Example: '1997-W01' lasts from 1996-12-30 to 1997-01-05.  January 1, 1997 is
 * a Wednesday. So W01's Monday is Dec.30, 1996, and Sunday is January 5, 1997.
 *
 * @param {!date_Date} d Object whose fields will be set.
 * @param {number} week ISO week number.
 * @param {number} dayOfWeek ISO day of week.
 * @private
 */
function setDateFromIso8601Week_(d, week, dayOfWeek) {
  // calculate offset for first week
  d.setMonth(0);
  d.setDate(1);
  var jsDay = d.getDay();
  // switch Sunday (0) to index 7; ISO days are 1-indexed
  var jan1WeekDay = jsDay || 7;

  var THURSDAY = 4;
  if (jan1WeekDay <= THURSDAY) {
    // was extended back to Monday
    var startDelta = 1 - jan1WeekDay;  // e.g., Thu(4) ==> -3
  } else {
    // was extended forward to Monday
    startDelta = 8 - jan1WeekDay;  // e.g., Fri(5) ==> +3
  }

  // find the absolute number of days to offset from the start of year
  // to arrive close to the Gregorian equivalent (pending adjustments above)
  // Note: decrement week multiplier by one because 1st week is
  // represented by dayOfWeek value
  var absoluteDays = Number(dayOfWeek) + (7 * (Number(week) - 1));

  // convert from ISO weekday format to Gregorian calendar date
  // note: subtract 1 because 1-indexed; offset should not include 1st of month
  var delta = startDelta + absoluteDays - 1;
  var interval = new Interval(Interval.DAYS, delta);
  d.add(interval);
};

/**
 * Sets time fields based on an ISO 8601 format string.
 * Note: only time fields, not date fields.
 *
 * @param {!DateTime} d Object whose fields will be set.
 * @param {string} formatted A time expressed in ISO 8601 format.
 * @return {boolean} Whether the parsing succeeded.
 * @private
 */
function setIso8601TimeOnly_(d, formatted) {
  // first strip timezone info from the end
  var timezoneParts = formatted.match(splitTimezoneStringRegex_);

  var offsetMinutes;  // Offset from UTC if not local time
  var formattedTime;  // The time components of the input string; no timezone.

  if (timezoneParts) {
    // Trim off the timezone characters.
    formattedTime =
        formatted.substring(0, formatted.length - timezoneParts[0].length);

    // 'Z' indicates a UTC timestring.
    if (timezoneParts[0] === 'Z') {
      offsetMinutes = 0;
    } else {
      offsetMinutes = Number(timezoneParts[2]) * 60 + Number(timezoneParts[3]);
      offsetMinutes *= (timezoneParts[1] == '-') ? 1 : -1;
    }
  } else {
    formattedTime = formatted;
  }

  var timeParts = formattedTime.match(splitTimeStringRegex_);
  if (!timeParts) {
    return false;
  }

  // We have to branch on local vs non-local times because we can't always
  // calculate the correct UTC offset for the specified time. Specifically, the
  // offset for daylight-savings time depends on the date being set. Therefore,
  // when an offset is specified, we apply it verbatim.
  if (timezoneParts) {
    asserts.assertNumber(offsetMinutes);

    // Convert the date part into UTC. This is important because the local date
    // can differ from the UTC date, and the date part of an ISO 8601 string is
    // always set in terms of the local date.
    var year = d.getYear();
    var monthNumber = d.getMonth();
    var day = d.getDate();
    var hour = Number(timeParts[1]);
    var minute = Number(timeParts[2]) || 0;
    var second = Number(timeParts[3]) || 0;
    var millisecond = timeParts[4] ? Number(timeParts[4]) * 1000 : 0;
    var utc = Date.UTC(year, monthNumber, day, hour, minute, second, millisecond);

    d.setTime(utc + offsetMinutes * 60000);
  } else {
    d.setHours(Number(timeParts[1]));
    d.setMinutes(Number(timeParts[2]) || 0);
    d.setSeconds(Number(timeParts[3]) || 0);
    d.setMilliseconds(timeParts[4] ? Number(timeParts[4]) * 1000 : 0);
  }

  return true;
};

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
class Interval {

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
  constructor(
      opt_years, opt_months, opt_days, opt_hours, opt_minutes, opt_seconds) {
    if (typeof opt_years === 'string') {
      var type = opt_years;
      var interval = /** @type {number} */ (opt_months);
      /** @type {number} */
      this.years = type == Interval.YEARS ? interval : 0;
      /** @type {number} */
      this.months = type == Interval.MONTHS ? interval : 0;
      /** @type {number} */
      this.days = type == Interval.DAYS ? interval : 0;
      /** @type {number} */
      this.hours = type == Interval.HOURS ? interval : 0;
      /** @type {number} */
      this.minutes = type == Interval.MINUTES ? interval : 0;
      /** @type {number} */
      this.seconds = type == Interval.SECONDS ? interval : 0;
    } else {
      this.years = /** @type {number} */ (opt_years) || 0;
      this.months = opt_months || 0;
      this.days = opt_days || 0;
      this.hours = opt_hours || 0;
      this.minutes = opt_minutes || 0;
      this.seconds = opt_seconds || 0;
    }
  }

  /**
   * Parses an XML Schema duration (ISO 8601 extended).
   * @see http://www.w3.org/TR/xmlschema-2/#duration
   *
   * @param  {string} duration An XML schema duration in textual format.
   *     Recurring durations and weeks are not supported.
   * @return {Interval} The duration as a Interval or null
   *     if the parse fails.
   */
  static fromIsoString(duration) {
    var parts = duration.match(splitDurationRegex_);
    if (!parts) {
      return null;
    }
  
    var timeEmpty = !(parts[6] || parts[7] || parts[8]);
    var dateTimeEmpty = timeEmpty && !(parts[2] || parts[3] || parts[4]);
    if (dateTimeEmpty || timeEmpty && parts[5]) {
      return null;
    }
  
    var negative = parts[1];
    var years = parseInt(parts[2], 10) || 0;
    var months = parseInt(parts[3], 10) || 0;
    var days = parseInt(parts[4], 10) || 0;
    var hours = parseInt(parts[6], 10) || 0;
    var minutes = parseInt(parts[7], 10) || 0;
    var seconds = parseFloat(parts[8]) || 0;
    return negative ?
        new Interval(
            -years, -months, -days, -hours, -minutes, -seconds) :
        new Interval(years, months, days, hours, minutes, seconds);
  };

  /**
   * Serializes Interval into XML Schema duration (ISO 8601 extended).
   * @see http://www.w3.org/TR/xmlschema-2/#duration
   *
   * @param {boolean=} opt_verbose Include zero fields in the duration string.
   * @return {?string} An XML schema duration in ISO 8601 extended format,
   *     or null if the interval contains both positive and negative fields.
   */
  toIsoString(opt_verbose) {
    var minField = Math.min(
        this.years, this.months, this.days, this.hours, this.minutes,
        this.seconds);
    var maxField = Math.max(
        this.years, this.months, this.days, this.hours, this.minutes,
        this.seconds);
    if (minField < 0 && maxField > 0) {
      return null;
    }
  
    // Return 0 seconds if all fields are zero.
    if (!opt_verbose && minField == 0 && maxField == 0) {
      return 'PT0S';
    }
  
    var res = [];
  
    // Add sign and 'P' prefix.
    if (minField < 0) {
      res.push('-');
    }
    res.push('P');
  
    // Add date.
    if (this.years || opt_verbose) {
      res.push(Math.abs(this.years) + 'Y');
    }
    if (this.months || opt_verbose) {
      res.push(Math.abs(this.months) + 'M');
    }
    if (this.days || opt_verbose) {
      res.push(Math.abs(this.days) + 'D');
    }
  
    // Add time.
    if (this.hours || this.minutes || this.seconds || opt_verbose) {
      res.push('T');
      if (this.hours || opt_verbose) {
        res.push(Math.abs(this.hours) + 'H');
      }
      if (this.minutes || opt_verbose) {
        res.push(Math.abs(this.minutes) + 'M');
      }
      if (this.seconds || opt_verbose) {
        res.push(Math.abs(this.seconds) + 'S');
      }
    }
  
    return res.join('');
  };

  /**
   * Tests whether the given interval is equal to this interval.
   * Note, this is a simple field-by-field comparison, it doesn't
   * account for comparisons like "12 months == 1 year".
   *
   * @param {Interval} other The interval to test.
   * @return {boolean} Whether the intervals are equal.
   */
  equals(other) {
    return other.years == this.years && other.months == this.months &&
        other.days == this.days && other.hours == this.hours &&
        other.minutes == this.minutes && other.seconds == this.seconds;
  };

  /**
   * @return {!Interval} A clone of the interval object.
   */
  clone() {
    return new Interval(
        this.years, this.months, this.days, this.hours, this.minutes,
        this.seconds);
  };

  /**
   * @return {boolean} Whether all fields of the interval are zero.
   */
  isZero() {
    return this.years == 0 && this.months == 0 && this.days == 0 &&
        this.hours == 0 && this.minutes == 0 && this.seconds == 0;
  };

  /**
   * @return {!Interval} Negative of this interval.
   */
  getInverse() {
    return this.times(-1);
  };

  /**
   * Calculates n * (this interval) by memberwise multiplication.
   * @param {number} n An integer.
   * @return {!Interval} n * this.
   */
  times(n) {
    return new Interval(
        this.years * n, this.months * n, this.days * n, this.hours * n,
        this.minutes * n, this.seconds * n);
  };

  /**
   * Gets the total number of seconds in the time interval. Assumes that months
   * and years are empty.
   * @return {number} Total number of seconds in the interval.
   */
  getTotalSeconds() {
    asserts.assert(this.years == 0 && this.months == 0);
    return ((this.days * 24 + this.hours) * 60 + this.minutes) * 60 +
        this.seconds;
  };

  /**
   * Adds the Interval in the argument to this Interval field by field.
   *
   * @param {Interval} interval The Interval to add.
   */
  add(interval) {
    this.years += interval.years;
    this.months += interval.months;
    this.days += interval.days;
    this.hours += interval.hours;
    this.minutes += interval.minutes;
    this.seconds += interval.seconds;
  };
}

/**
 * Years constant for the date parts.
 * @type {string}
 */
Interval.YEARS = 'y';

/**
 * Months constant for the date parts.
 * @type {string}
 */
Interval.MONTHS = 'm';

/**
 * Days constant for the date parts.
 * @type {string}
 */
Interval.DAYS = 'd';

/**
 * Hours constant for the date parts.
 * @type {string}
 */
Interval.HOURS = 'h';

/**
 * Minutes constant for the date parts.
 * @type {string}
 */
Interval.MINUTES = 'n';

/**
 * Seconds constant for the date parts.
 * @type {string}
 */
Interval.SECONDS = 's';

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
class date_Date {

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
  constructor(opt_year, opt_month, opt_date) {
    /**
     * First day of week. 0 = Mon, 6 = Sun.
     * @type {number}
     * @private
     */
    this.firstDayOfWeek_ =
        /** @type {number} */(DateTimeSymbols.FIRSTDAYOFWEEK);
  
    /**
     * The cut off weekday used for week number calculations. 0 = Mon, 6 = Sun.
     * @type {number}
     * @private
     */
    this.firstWeekCutOffDay_ =
        /** @type {number} */(DateTimeSymbols.FIRSTWEEKCUTOFFDAY);
  
    /** @protected {!Date} The wrapped date or datetime. */
    this.date;
    // DateTime assumes that only this.date is added in this ctor.
    if (typeof opt_year === 'number') {
      this.date = this.buildDate_(opt_year, opt_month || 0, opt_date || 1);
      this.maybeFixDst_(opt_date || 1);
    } else if (google.isObject(opt_year)) {
      this.date = this.buildDate_(
          opt_year.getFullYear(), opt_year.getMonth(), opt_year.getDate());
      this.maybeFixDst_(opt_year.getDate());
    } else {
      this.date = new Date(google.now());
      var expectedDate = this.date.getDate();
      this.date.setHours(0);
      this.date.setMinutes(0);
      this.date.setSeconds(0);
      this.date.setMilliseconds(0);
      // In some time zones there is no "0" hour on certain days during DST.
      // Adjust here, if necessary. See:
      // https://github.com/google/closure-library/issues/34.
      this.maybeFixDst_(expectedDate);
    }
  }

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
  buildDate_(fullYear, monthNumber, date) {
    var d = new Date(fullYear, monthNumber, date);
    if (fullYear >= 0 && fullYear < 100) {
      // Can't just setFullYear as new Date() can flip over for e.g. month = 13.
      d.setFullYear(d.getFullYear() - 1900);
    }
    return d;
  };

  /**
   * @return {!date_Date} A clone of the date object.
   */
  clone() {
    var date = new date_Date(this.date);
    date.firstDayOfWeek_ = this.firstDayOfWeek_;
    date.firstWeekCutOffDay_ = this.firstWeekCutOffDay_;
  
    return date;
  };

  /**
   * @return {number} The four digit year of date.
   */
  getFullYear() {
    return this.date.getFullYear();
  };

  /**
   * Alias for getFullYear.
   *
   * @return {number} The four digit year of date.
   * @see #getFullYear
   */
  getYear() {
    return this.getFullYear();
  };

  /**
   * @return {month} The month of date, 0 = Jan, 11 = Dec.
   */
  getMonth() {
    return /** @type {month} */ (this.date.getMonth());
  };

  /**
   * @return {number} The date of month.
   */
  getDate() {
    return this.date.getDate();
  };

  /**
   * Returns the number of milliseconds since 1 January 1970 00:00:00.
   *
   * @return {number} The number of milliseconds since 1 January 1970 00:00:00.
   */
  getTime() {
    return this.date.getTime();
  };

  /**
   * @return {number} The day of week, US style. 0 = Sun, 6 = Sat.
   */
  getDay() {
    return this.date.getDay();
  };

  /**
   * @return {weekDay} The day of week, ISO style. 0 = Mon, 6 = Sun.
   */
  getIsoWeekday() {
    return /** @type {weekDay} */ ((this.getDay() + 6) % 7);
  };

  /**
   * @return {number} The day of week according to firstDayOfWeek setting.
   */
  getWeekday() {
    return (this.getIsoWeekday() - this.firstDayOfWeek_ + 7) % 7;
  };

  /**
   * @return {number} The four digit year of date according to universal time.
   */
  getUTCFullYear() {
    return this.date.getUTCFullYear();
  };

  /**
   * @return {month} The month of date according to universal time,
   *     0 = Jan, 11 = Dec.
   */
  getUTCMonth() {
    return /** @type {month} */ (this.date.getUTCMonth());
  };

  /**
   * @return {number} The date of month according to universal time.
   */
  getUTCDate() {
    return this.date.getUTCDate();
  };

  /**
   * @return {number} The day of week according to universal time, US style.
   *     0 = Sun, 1 = Mon, 6 = Sat.
   */
  getUTCDay() {
    return this.date.getDay();
  };

  /**
   * @return {number} The hours value according to universal time.
   */
  getUTCHours() {
    return this.date.getUTCHours();
  };

  /**
   * @return {number} The minutes value according to universal time.
   */
  getUTCMinutes() {
    return this.date.getUTCMinutes();
  };

  /**
   * @return {weekDay} The day of week according to universal time, ISO
   *     style. 0 = Mon, 6 = Sun.
   */
  getUTCIsoWeekday() {
    return /** @type {weekDay} */ ((this.date.getUTCDay() + 6) % 7);
  };

  /**
   * @return {number} The day of week according to universal time and
   *     firstDayOfWeek setting.
   */
  getUTCWeekday() {
    return (this.getUTCIsoWeekday() - this.firstDayOfWeek_ + 7) % 7;
  };

  /**
   * @return {number} The first day of the week. 0 = Mon, 6 = Sun.
   */
  getFirstDayOfWeek() {
    return this.firstDayOfWeek_;
  };

  /**
   * @return {number} The cut off weekday used for week number calculations.
   *     0 = Mon, 6 = Sun.
   */
  getFirstWeekCutOffDay() {
    return this.firstWeekCutOffDay_;
  };

  /**
   * @return {number} The number of days for the selected month.
   */
  getNumberOfDaysInMonth() {
    return getNumberOfDaysInMonth(this.getFullYear(), this.getMonth());
  };

  /**
   * @return {number} The week number.
   */
  getWeekNumber() {
    return getWeekNumber(
        this.getFullYear(), this.getMonth(), this.getDate(),
        this.firstWeekCutOffDay_, this.firstDayOfWeek_);
  };

  /**
   * Returns year in “Week of Year” based calendars in which the year transition
   * occurs on a week boundary.
   * @return {number} The four digit year in "Week of Year"
   */
  getYearOfWeek() {
    return getYearOfWeek(
        this.getFullYear(), this.getMonth(), this.getDate(),
        this.firstWeekCutOffDay_, this.firstDayOfWeek_);
  };

  /**
   * @return {number} The day of year.
   */
  getDayOfYear() {
    var dayOfYear = this.getDate();
    var year = this.getFullYear();
    for (var m = this.getMonth() - 1; m >= 0; m--) {
      dayOfYear += getNumberOfDaysInMonth(year, m);
    }
  
    return dayOfYear;
  };

  /**
   * Returns timezone offset. The timezone offset is the delta in minutes between
   * UTC and your local time. E.g., UTC+10 returns -600. Daylight savings time
   * prevents this value from being constant.
   *
   * @return {number} The timezone offset.
   */
  getTimezoneOffset() {
    return this.date.getTimezoneOffset();
  };

  /**
   * Returns timezone offset as a string. Returns offset in [+-]HH:mm format or Z
   * for UTC.
   *
   * @return {string} The timezone offset as a string.
   */
  getTimezoneOffsetString() {
    var tz;
    var offset = this.getTimezoneOffset();
  
    if (offset == 0) {
      tz = 'Z';
    } else {
      var n = Math.abs(offset) / 60;
      var h = Math.floor(n);
      var m = (n - h) * 60;
      tz = (offset > 0 ? '-' : '+') + strings.padNumber(h, 2) + ':' +
          strings.padNumber(m, 2);
    }
  
    return tz;
  };

  /**
   * Sets the date.
   *
   * @param {date_Date} date Date object to set date from.
   */
  set(date) {
    this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  /**
   * Sets the year part of the date.
   *
   * @param {number} year Four digit year.
   */
  setFullYear(year) {
    this.date.setFullYear(year);
  };

  /**
   * Alias for setFullYear.
   *
   * @param {number} year Four digit year.
   * @see #setFullYear
   */
  setYear(year) {
    this.setFullYear(year);
  };

  /**
   * Sets the month part of the date.
   *
   * TODO(nnaze): Update type to month.
   *
   * @param {number} month The month, where 0 = Jan, 11 = Dec.
   */
  setMonth(month) {
    this.date.setMonth(month);
  };

  /**
   * Sets the day part of the date.
   *
   * @param {number} date The day part.
   */
  setDate(date) {
    this.date.setDate(date);
  };

  /**
   * Sets the value of the date object as expressed in the number of milliseconds
   * since 1 January 1970 00:00:00.
   *
   * @param {number} ms Number of milliseconds since 1 Jan 1970.
   */
  setTime(ms) {
    this.date.setTime(ms);
  };

  /**
   * Sets the year part of the date according to universal time.
   *
   * @param {number} year Four digit year.
   */
  setUTCFullYear(year) {
    this.date.setUTCFullYear(year);
  };

  /**
   * Sets the month part of the date according to universal time.
   *
   * @param {number} month The month, where 0 = Jan, 11 = Dec.
   */
  setUTCMonth(month) {
    this.date.setUTCMonth(month);
  };

  /**
   * Sets the day part of the date according to universal time.
   *
   * @param {number} date The UTC date.
   */
  setUTCDate(date) {
    this.date.setUTCDate(date);
  };

  /**
   * Sets the first day of week.
   *
   * @param {number} day 0 = Mon, 6 = Sun.
   */
  setFirstDayOfWeek(day) {
    this.firstDayOfWeek_ = day;
  };

  /**
   * Sets cut off weekday used for week number calculations. 0 = Mon, 6 = Sun.
   *
   * @param {number} day The cut off weekday.
   */
  setFirstWeekCutOffDay(day) {
    this.firstWeekCutOffDay_ = day;
  };

  /**
   * Performs date calculation by adding the supplied interval to the date.
   *
   * @param {Interval} interval Date interval to add.
   */
  add(interval) {
    if (interval.years || interval.months) {
      // As months have different number of days adding a month to Jan 31 by just
      // setting the month would result in a date in early March rather than Feb
      // 28 or 29. Doing it this way overcomes that problem.
  
      // adjust year and month, accounting for both directions
      var monthNumber = this.getMonth() + interval.months + interval.years * 12;
      var year = this.getYear() + Math.floor(monthNumber / 12);
      monthNumber %= 12;
      if (monthNumber < 0) {
        monthNumber += 12;
      }
  
      var daysInTargetMonth = getNumberOfDaysInMonth(year, monthNumber);
      var date = Math.min(daysInTargetMonth, this.getDate());
  
      // avoid inadvertently causing rollovers to adjacent months
      this.setDate(1);
  
      this.setFullYear(year);
      this.setMonth(monthNumber);
      this.setDate(date);
    }
  
    if (interval.days) {
      // Convert the days to milliseconds and add it to the UNIX timestamp.
      // Taking noon helps to avoid 1 day error due to the daylight saving.
      var noon = new Date(this.getYear(), this.getMonth(), this.getDate(), 12);
      var result = new Date(noon.getTime() + interval.days * 86400000);
  
      // Set date to 1 to prevent rollover caused by setting the year or month.
      this.setDate(1);
      this.setFullYear(result.getFullYear());
      this.setMonth(result.getMonth());
      this.setDate(result.getDate());
  
      this.maybeFixDst_(result.getDate());
    }
  };

  /**
   * Returns ISO 8601 string representation of date.
   *
   * @param {boolean=} opt_verbose Whether the verbose format should be used
   *     instead of the default compact one.
   * @param {boolean=} opt_tz Whether the timezone offset should be included
   *     in the string.
   * @return {string} ISO 8601 string representation of date.
   */
  toIsoString(opt_verbose, opt_tz) {
    var str = [
      this.getFullYear(), strings.padNumber(this.getMonth() + 1, 2),
      strings.padNumber(this.getDate(), 2)
    ];
  
    return str.join((opt_verbose) ? '-' : '') +
        (opt_tz ? this.getTimezoneOffsetString() : '');
  };

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
  toUTCIsoString(opt_verbose, opt_tz) {
    var str = [
      this.getUTCFullYear(), strings.padNumber(this.getUTCMonth() + 1, 2),
      strings.padNumber(this.getUTCDate(), 2)
    ];
  
    return str.join((opt_verbose) ? '-' : '') + (opt_tz ? 'Z' : '');
  };

  /**
   * Tests whether given date is equal to this Date.
   * Note: This ignores units more precise than days (hours and below)
   * and also ignores timezone considerations.
   *
   * @param {date_Date} other The date to compare.
   * @return {boolean} Whether the given date is equal to this one.
   */
  equals(other) {
    return !!(
        other && this.getYear() == other.getYear() &&
        this.getMonth() == other.getMonth() && this.getDate() == other.getDate());
  };

  /**
   * Overloaded toString method for object.
   * @return {string} ISO 8601 string representation of date.
   * @override
   */
  toString() {
    return this.toIsoString();
  };

  /**
   * Fixes date to account for daylight savings time in browsers that fail to do
   * so automatically.
   * @param {number} expected Expected date.
   * @private
   */
  maybeFixDst_(expected) {
    if (this.getDate() != expected) {
      var dir = this.getDate() < expected ? 1 : -1;
      this.date.setUTCHours(this.date.getUTCHours() + dir);
    }
  };

  /**
   * @return {number} Value of wrapped date.
   * @override
   */
  valueOf() {
    return this.date.valueOf();
  };

  /**
   * Compares two dates.  May be used as a sorting function.
   * @see goog.array.sort
   * @param {!DateLike} date1 Date to compare.
   * @param {!DateLike} date2 Date to compare.
   * @return {number} Comparison result. 0 if dates are the same, less than 0 if
   *     date1 is earlier than date2, greater than 0 if date1 is later than date2.
   */
  static compare(date1, date2) {
    return date1.getTime() - date2.getTime();
  };

  /**
   * Parses an ISO 8601 string as a `date_Date`.
   * @param {string} formatted ISO 8601 string to parse.
   * @return {?date_Date} Parsed date or null if parse fails.
   */
  static fromIsoString(formatted) {
    var ret = new date_Date(2000);
    return setIso8601DateOnly_(ret, formatted) ? ret : null;
  };
}

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
class DateTime extends date_Date {

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
  constructor(
      opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds,
      opt_milliseconds) {
    super();
  
    if (typeof opt_year === 'number') {
      /** @override */
      this.date = new Date(
          opt_year, opt_month || 0, opt_date || 1, opt_hours || 0,
          opt_minutes || 0, opt_seconds || 0, opt_milliseconds || 0);
    } else {
      this.date = new Date(
          opt_year && opt_year.getTime ? opt_year.getTime() : google.now());
    }
  }

  /**
   * @param {number} timestamp Number of milliseconds since Epoch.
   * @return {!DateTime}
   */
  static fromTimestamp(timestamp) {
    var date = new DateTime();
    date.setTime(timestamp);
    return date;
  };

  /**
   * Creates a DateTime from a datetime string expressed in RFC 822 format.
   *
   * @param {string} formatted A date or datetime expressed in RFC 822 format.
   * @return {DateTime} Parsed date or null if parse fails.
   */
  static fromRfc822String(formatted) {
    var date = new Date(formatted);
    return !isNaN(date.getTime()) ? new DateTime(date) : null;
  };

  /**
   * Returns the hours part of the datetime.
   *
   * @return {number} An integer between 0 and 23, representing the hour.
   */
  getHours() {
    return this.date.getHours();
  };

  /**
   * Returns the minutes part of the datetime.
   *
   * @return {number} An integer between 0 and 59, representing the minutes.
   */
  getMinutes() {
    return this.date.getMinutes();
  };

  /**
   * Returns the seconds part of the datetime.
   *
   * @return {number} An integer between 0 and 59, representing the seconds.
   */
  getSeconds() {
    return this.date.getSeconds();
  };

  /**
   * Returns the milliseconds part of the datetime.
   *
   * @return {number} An integer between 0 and 999, representing the milliseconds.
   */
  getMilliseconds() {
    return this.date.getMilliseconds();
  };

  /**
   * Returns the day of week according to universal time, US style.
   *
   * @return {weekDay} Day of week, 0 = Sun, 1 = Mon, 6 = Sat.
   * @override
   */
  getUTCDay() {
    return /** @type {weekDay} */ (this.date.getUTCDay());
  };

  /**
   * Returns the hours part of the datetime according to universal time.
   *
   * @return {number} An integer between 0 and 23, representing the hour.
   * @override
   */
  getUTCHours() {
    return this.date.getUTCHours();
  };

  /**
   * Returns the minutes part of the datetime according to universal time.
   *
   * @return {number} An integer between 0 and 59, representing the minutes.
   * @override
   */
  getUTCMinutes() {
    return this.date.getUTCMinutes();
  };

  /**
   * Returns the seconds part of the datetime according to universal time.
   *
   * @return {number} An integer between 0 and 59, representing the seconds.
   */
  getUTCSeconds() {
    return this.date.getUTCSeconds();
  };

  /**
   * Returns the milliseconds part of the datetime according to universal time.
   *
   * @return {number} An integer between 0 and 999, representing the milliseconds.
   */
  getUTCMilliseconds() {
    return this.date.getUTCMilliseconds();
  };

  /**
   * Sets the hours part of the datetime.
   *
   * @param {number} hours An integer between 0 and 23, representing the hour.
   */
  setHours(hours) {
    this.date.setHours(hours);
  };

  /**
   * Sets the minutes part of the datetime.
   *
   * @param {number} minutes Integer between 0 and 59, representing the minutes.
   */
  setMinutes(minutes) {
    this.date.setMinutes(minutes);
  };

  /**
   * Sets the seconds part of the datetime.
   *
   * @param {number} seconds Integer between 0 and 59, representing the seconds.
   */
  setSeconds(seconds) {
    this.date.setSeconds(seconds);
  };

  /**
   * Sets the milliseconds part of the datetime.
   *
   * @param {number} ms Integer between 0 and 999, representing the milliseconds.
   */
  setMilliseconds(ms) {
    this.date.setMilliseconds(ms);
  };

  /**
   * Sets the hours part of the datetime according to universal time.
   *
   * @param {number} hours An integer between 0 and 23, representing the hour.
   */
  setUTCHours(hours) {
    this.date.setUTCHours(hours);
  };

  /**
   * Sets the minutes part of the datetime according to universal time.
   *
   * @param {number} minutes Integer between 0 and 59, representing the minutes.
   */
  setUTCMinutes(minutes) {
    this.date.setUTCMinutes(minutes);
  };

  /**
   * Sets the seconds part of the datetime according to universal time.
   *
   * @param {number} seconds Integer between 0 and 59, representing the seconds.
   */
  setUTCSeconds(seconds) {
    this.date.setUTCSeconds(seconds);
  };

  /**
   * Sets the seconds part of the datetime according to universal time.
   *
   * @param {number} ms Integer between 0 and 999, representing the milliseconds.
   */
  setUTCMilliseconds(ms) {
    this.date.setUTCMilliseconds(ms);
  };

  /**
   * @return {boolean} Whether the datetime is aligned to midnight.
   */
  isMidnight() {
    return this.getHours() == 0 && this.getMinutes() == 0 &&
        this.getSeconds() == 0 && this.getMilliseconds() == 0;
  };

  /**
   * Performs date calculation by adding the supplied interval to the date.
   *
   * @param {Interval} interval Date interval to add.
   * @override
   */
  add(interval) {
    date_Date.prototype.add.call(this, interval);
  
    if (interval.hours) {
      this.setUTCHours(this.date.getUTCHours() + interval.hours);
    }
    if (interval.minutes) {
      this.setUTCMinutes(this.date.getUTCMinutes() + interval.minutes);
    }
    if (interval.seconds) {
      this.setUTCSeconds(this.date.getUTCSeconds() + interval.seconds);
    }
  };

  /**
   * Returns ISO 8601 string representation of date/time.
   *
   * @param {boolean=} opt_verbose Whether the verbose format should be used
   *     instead of the default compact one.
   * @param {boolean=} opt_tz Whether the timezone offset should be included
   *     in the string.
   * @return {string} ISO 8601 string representation of date/time.
   * @override
   */
  toIsoString(opt_verbose, opt_tz) {
    var dateString = date_Date.prototype.toIsoString.call(this, opt_verbose);
  
    if (opt_verbose) {
      return dateString + 'T' + strings.padNumber(this.getHours(), 2) + ':' +
          strings.padNumber(this.getMinutes(), 2) + ':' +
          strings.padNumber(this.getSeconds(), 2) +
          (opt_tz ? this.getTimezoneOffsetString() : '');
    }
  
    return dateString + 'T' + strings.padNumber(this.getHours(), 2) +
        strings.padNumber(this.getMinutes(), 2) +
        strings.padNumber(this.getSeconds(), 2) +
        (opt_tz ? this.getTimezoneOffsetString() : '');
  };

  /**
   * Returns XML Schema 2 string representation of date/time.
   * The return value is also ISO 8601 compliant.
   *
   * @param {boolean=} opt_timezone Should the timezone offset be included in the
   *     string?.
   * @return {string} XML Schema 2 string representation of date/time.
   */
  toXmlDateTime(opt_timezone) {
    return date_Date.prototype.toIsoString.call(this, true) + 'T' +
        strings.padNumber(this.getHours(), 2) + ':' +
        strings.padNumber(this.getMinutes(), 2) + ':' +
        strings.padNumber(this.getSeconds(), 2) +
        (opt_timezone ? this.getTimezoneOffsetString() : '');
  };

  /**
   * Returns ISO 8601 string representation of date/time according to universal
   * time.
   *
   * @param {boolean=} opt_verbose Whether the opt_verbose format should be
   *     returned instead of the default compact one.
   * @param {boolean=} opt_tz Whether the timezone offset should be included in
   *     the string.
   * @return {string} ISO 8601 string representation of date/time according to
   *     universal time.
   * @override
   */
  toUTCIsoString(opt_verbose, opt_tz) {
    var dateStr = date_Date.prototype.toUTCIsoString.call(this, opt_verbose);
  
    if (opt_verbose) {
      return dateStr + 'T' + strings.padNumber(this.getUTCHours(), 2) + ':' +
          strings.padNumber(this.getUTCMinutes(), 2) + ':' +
          strings.padNumber(this.getUTCSeconds(), 2) + (opt_tz ? 'Z' : '');
    }
  
    return dateStr + 'T' + strings.padNumber(this.getUTCHours(), 2) +
        strings.padNumber(this.getUTCMinutes(), 2) +
        strings.padNumber(this.getUTCSeconds(), 2) + (opt_tz ? 'Z' : '');
  };

  /**
   * Returns RFC 3339 string representation of datetime in UTC.
   *
   * @return {string} A UTC datetime expressed in RFC 3339 format.
   */
  toUTCRfc3339String() {
    var date = this.toUTCIsoString(true);
    var millis = this.getUTCMilliseconds();
    return (millis ? date + '.' + strings.padNumber(millis, 3) : date) + 'Z';
  };

  /**
   * Tests whether given datetime is exactly equal to this DateTime.
   *
   * @param {date_Date} other The datetime to compare.
   * @return {boolean} Whether the given datetime is exactly equal to this one.
   * @override
   */
  equals(other) {
    return this.getTime() == other.getTime();
  };

  /**
   * Overloaded toString method for object.
   * @return {string} ISO 8601 string representation of date/time.
   * @override
   */
  toString() {
    return this.toIsoString();
  };

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
  toUsTimeString(
      opt_padHours, opt_showAmPm, opt_omitZeroMinutes) {
    var hours = this.getHours();
  
    // show am/pm marker by default
    if (opt_showAmPm === undefined) {
      opt_showAmPm = true;
    }
  
    // 12pm
    var isPM = hours == 12;
  
    // change from 1-24 to 1-12 basis
    if (hours > 12) {
      hours -= 12;
      isPM = true;
    }
  
    // midnight is expressed as "12am", but if am/pm marker omitted, keep as '0'
    if (hours == 0 && opt_showAmPm) {
      hours = 12;
    }
  
    var label = opt_padHours ? strings.padNumber(hours, 2) : String(hours);
    var minutes = this.getMinutes();
    if (!opt_omitZeroMinutes || minutes > 0) {
      label += ':' + strings.padNumber(minutes, 2);
    }
  
    // by default, show am/pm suffix
    if (opt_showAmPm) {
      label += isPM ? ' PM' : ' AM';
    }
    return label;
  };

  /**
   * Generates time label for the datetime in standard ISO 24-hour time format.
   * E.g., '06:00:00' or '23:30:15'.
   * @param {boolean=} opt_showSeconds Whether to shows seconds. Defaults to TRUE.
   * @return {string} The time label.
   */
  toIsoTimeString(opt_showSeconds) {
    var hours = this.getHours();
    var label = strings.padNumber(hours, 2) + ':' +
        strings.padNumber(this.getMinutes(), 2);
    if (opt_showSeconds === undefined || opt_showSeconds) {
      label += ':' + strings.padNumber(this.getSeconds(), 2);
    }
    return label;
  };

  /**
   * @return {!DateTime} A clone of the datetime object.
   * @override
   */
  clone() {
    var date = new DateTime(this.date);
    date.setFirstDayOfWeek(this.getFirstDayOfWeek());
    date.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());
    return date;
  };

  /**
   * Parses an ISO 8601 string as a `DateTime`.
   * @param {string} formatted ISO 8601 string to parse.
   * @return {?DateTime} Parsed date or null if parse fails.
   * @override
   */
  static fromIsoString(formatted) {
    var ret = new DateTime(2000);
    return setIso8601DateTime(ret, formatted) ? ret : null;
  };
}

// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Typedefs for working with dates.
 */

// circular reference

/**
 * @typedef {(Date|date_Date)}
 */
let DateLike;

export {DateLike, DateTime, Interval, MS_PER_DAY, date_Date as Date, formatMonthAndYear, getNumberOfDaysInMonth, getWeekNumber, getYearOfWeek, isLeapYear, isLongIsoYear, isSameDay, isSameMonth, isSameYear, max, min, month, setIso8601DateTime, weekDay};