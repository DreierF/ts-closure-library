import {Iterator as IterIterator} from './../iter/iter.js';
import {StopIteration} from './../iter/iter.js';
import {Date as DateDate} from './date.js';
import {Interval} from './date.js';
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
 * @fileoverview Date range data structure. Based loosely on
 * com.google.common.util.DateRange.
 */

/**
 * Constructs a date range.
 * @class
 * @final
 */
class DateRange {

  /**
   * Constructs a date range.
   * @param {DateDate} startDate The first date in the range.
   * @param {DateDate} endDate The last date in the range.
   */
  constructor(startDate, endDate) {
    /**
     * The first date in the range.
     * @type {DateDate}
     * @private
     */
    this.startDate_ = startDate;
  
    /**
     * The last date in the range.
     * @type {DateDate}
     * @private
     */
    this.endDate_ = endDate;
  }

  /**
   * @return {DateDate} The first date in the range.
   */
  getStartDate() {
    return this.startDate_;
  };

  /**
   * @return {DateDate} The last date in the range.
   */
  getEndDate() {
    return this.endDate_;
  };

  /**
   * Tests if a date falls within this range.
   *
   * @param {DateDate} date The date to test.
   * @return {boolean} Whether the date is in the range.
   */
  contains(date) {
    return date.valueOf() >= this.startDate_.valueOf() &&
        date.valueOf() <= this.endDate_.valueOf();
  };

  /**
   * @return {!Iterator} An iterator over the date range.
   */
  iterator() {
    return new Iterator(this);
  };

  /**
   * Tests two {@link DateRange} objects for equality.
   * @param {DateRange} a A date range.
   * @param {DateRange} b A date range.
   * @return {boolean} Whether |a| is the same range as |b|.
   */
  static equals(a, b) {
    // Test for same object reference; type conversion is irrelevant.
    if (a === b) {
      return true;
    }
  
    if (a == null || b == null) {
      return false;
    }
  
    return a.startDate_.equals(b.startDate_) && a.endDate_.equals(b.endDate_);
  };

  /**
   * Calculates a date that is a number of days after a date. Does not modify its
   * input.
   * @param {DateDate} date The input date.
   * @param {number} offset Number of days.
   * @return {!DateDate} The date that is |offset| days after |date|.
   * @private
   */
  static offsetInDays_(date, offset) {
    var newDate = date.clone();
    newDate.add(new Interval(Interval.DAYS, offset));
    return newDate;
  };

  /**
   * Calculates a date that is a number of months after the first day in the
   * month that contains its input. Does not modify its input.
   * @param {DateDate} date The input date.
   * @param {number} offset Number of months.
   * @return {!DateDate} The date that is |offset| months after the first
   *     day in the month that contains |date|.
   * @private
   */
  static offsetInMonths_(date, offset) {
    var newDate = date.clone();
    newDate.setDate(1);
    newDate.add(new Interval(Interval.MONTHS, offset));
    return newDate;
  };

  /**
   * Returns the range from yesterday to yesterday.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The range that includes only yesterday.
   */
  static yesterday(opt_today) {
    var today = DateRange.cloneOrCreate_(opt_today);
    var yesterday = DateRange.offsetInDays_(today, -1);
    return new DateRange(yesterday, yesterday.clone());
  };

  /**
   * Returns the range from today to today.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The range that includes only today.
   */
  static today(opt_today) {
    var today = DateRange.cloneOrCreate_(opt_today);
    return new DateRange(today, today.clone());
  };

  /**
   * Returns the range that includes the seven days that end yesterday.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The range that includes the seven days that
   *     end yesterday.
   */
  static last7Days(opt_today) {
    var today = DateRange.cloneOrCreate_(opt_today);
    var yesterday = DateRange.offsetInDays_(today, -1);
    return new DateRange(
        DateRange.offsetInDays_(today, -7), yesterday);
  };

  /**
   * Returns the range that starts the first of this month and ends the last day
   * of this month.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The range that starts the first of this month
   *     and ends the last day of this month.
   */
  static thisMonth(opt_today) {
    var today = DateRange.cloneOrCreate_(opt_today);
    return new DateRange(
        DateRange.offsetInMonths_(today, 0),
        DateRange.offsetInDays_(
            DateRange.offsetInMonths_(today, 1), -1));
  };

  /**
   * Returns the range that starts the first of last month and ends the last day
   * of last month.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The range that starts the first of last month
   *     and ends the last day of last month.
   */
  static lastMonth(opt_today) {
    var today = DateRange.cloneOrCreate_(opt_today);
    return new DateRange(
        DateRange.offsetInMonths_(today, -1),
        DateRange.offsetInDays_(
            DateRange.offsetInMonths_(today, 0), -1));
  };

  /**
   * Returns the seven-day range that starts on the first day of the week
   * (see {@link goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK}) on or before today.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The range that starts the Monday on or before
   *     today and ends the Sunday on or after today.
   */
  static thisWeek(opt_today) {
    var today = DateRange.cloneOrCreate_(opt_today);
    var iso = today.getIsoWeekday();
    var firstDay = today.getFirstDayOfWeek();
    var i18nFirstDay = (iso >= firstDay) ? iso - firstDay : iso + (7 - firstDay);
    var start = DateRange.offsetInDays_(today, -i18nFirstDay);
    var end = DateRange.offsetInDays_(start, 6);
    return new DateRange(start, end);
  };

  /**
   * Returns the seven-day range that ends the day before the first day of
   * the week (see {@link goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK}) that
   * contains today.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The range that starts seven days before the
   *     Monday on or before today and ends the Sunday on or before yesterday.
   */
  static lastWeek(opt_today) {
    var thisWeek = DateRange.thisWeek(opt_today);
    var start = DateRange.offsetInDays_(thisWeek.getStartDate(), -7);
    var end = DateRange.offsetInDays_(thisWeek.getEndDate(), -7);
    return new DateRange(start, end);
  };

  /**
   * Returns the range that starts seven days before the Monday on or before
   * today and ends the Friday before today.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The range that starts seven days before the
   *     Monday on or before today and ends the Friday before today.
   */
  static lastBusinessWeek(opt_today) {
    // TODO(user): should be i18nized.
    var today = DateRange.cloneOrCreate_(opt_today);
    var start =
        DateRange.offsetInDays_(today, -7 - today.getIsoWeekday());
    var end = DateRange.offsetInDays_(start, 4);
    return new DateRange(start, end);
  };

  /**
   * Returns the range that includes all days between January 1, 1900 and
   * December 31, 9999.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The range that includes all days between
   *     January 1, 1900 and December 31, 9999.
   */
  static allTime(opt_today) {
    return new DateRange(
        DateRange.MINIMUM_DATE, DateRange.MAXIMUM_DATE);
  };

  /**
   * @param {string} dateRangeKey A standard date range key.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateRange} The date range that corresponds to that key.
   * @throws {Error} If no standard date range with that key exists.
   */
  static standardDateRange(dateRangeKey, opt_today) {
    switch (dateRangeKey) {
      case StandardDateRangeKeys.YESTERDAY:
        return DateRange.yesterday(opt_today);
  
      case StandardDateRangeKeys.TODAY:
        return DateRange.today(opt_today);
  
      case StandardDateRangeKeys.LAST_7_DAYS:
        return DateRange.last7Days(opt_today);
  
      case StandardDateRangeKeys.THIS_MONTH:
        return DateRange.thisMonth(opt_today);
  
      case StandardDateRangeKeys.LAST_MONTH:
        return DateRange.lastMonth(opt_today);
  
      case StandardDateRangeKeys.THIS_WEEK:
        return DateRange.thisWeek(opt_today);
  
      case StandardDateRangeKeys.LAST_WEEK:
        return DateRange.lastWeek(opt_today);
  
      case StandardDateRangeKeys.LAST_BUSINESS_WEEK:
        return DateRange.lastBusinessWeek(opt_today);
  
      case StandardDateRangeKeys.ALL_TIME:
        return DateRange.allTime(opt_today);
  
      default:
        throw new Error('no such date range key: ' + dateRangeKey);
    }
  };

  /**
   * Clones or creates new.
   * @param {DateDate=} opt_today The date to consider today.
   *     Defaults to today.
   * @return {!DateDate} cloned or new.
   * @private
   */
  static cloneOrCreate_(opt_today) {
    return opt_today ? opt_today.clone() : new DateDate();
  };
}

/**
 * The first possible day, as far as this class is concerned.
 * @type {DateDate}
 */
DateRange.MINIMUM_DATE = new DateDate(0, 0, 1);

/**
 * The last possible day, as far as this class is concerned.
 * @type {DateDate}
 */
DateRange.MAXIMUM_DATE = new DateDate(9999, 11, 31);

/**
 * Standard date range keys. Equivalent to the enum IDs in
 * DateRange.java http://go/datarange.java
 *
 * @enum {string}
 */
let StandardDateRangeKeys = {
  YESTERDAY: 'yesterday',
  TODAY: 'today',
  LAST_7_DAYS: 'last7days',
  THIS_MONTH: 'thismonth',
  LAST_MONTH: 'lastmonth',
  THIS_WEEK: 'thisweek',
  LAST_WEEK: 'lastweek',
  LAST_BUSINESS_WEEK: 'lastbusinessweek',
  ALL_TIME: 'alltime'
};

/**
 * Creates an iterator over the dates in a {@link DateRange}.
 * @class
 * @extends {IterIterator<DateDate>}
 * @final
 */
class Iterator extends IterIterator {

  /**
   * Creates an iterator over the dates in a {@link DateRange}.
   * @param {DateRange} dateRange The date range to iterate.
   */
  constructor(dateRange) {
    super();
  
    /**
     * The next date.
     * @type {DateDate}
     * @private
     */
    this.nextDate_ = dateRange.getStartDate().clone();
  
    /**
     * The end date, expressed as an integer: YYYYMMDD.
     * @type {number}
     * @private
     */
    this.endDate_ = Number(dateRange.getEndDate().toIsoString());
  }

  /** @override */
  next() {
    if (Number(this.nextDate_.toIsoString()) > this.endDate_) {
      throw StopIteration;
    }
  
    var rv = this.nextDate_.clone();
    this.nextDate_.add(new Interval(Interval.DAYS, 1));
    return rv;
  };
}

export {DateRange, Iterator, StandardDateRangeKeys};