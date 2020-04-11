import * as asserts from './../asserts/asserts.js';
import * as googdate from './../date/date.js';
import {Date as DateDate} from './../date/date.js';
import {DateTime as DateDateTime} from './../date/date.js';
import {DateLike} from './../date/date.js';
import * as strings from './../string/string.js';
import {DateTimeSymbols} from './datetimesymbols.js';
import {DateTimeSymbolsType} from './datetimesymbols.js';
import {TimeZone} from './timezone.js';
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
 * @fileoverview Functions for dealing with date/time formatting.
 */

/**
 * Namespace for i18n date/time formatting functions
 */

/**
 * Datetime formatting functions following the pattern specification as defined
 * in JDK, ICU and CLDR, with minor modification for typical usage in JS.
 * Pattern specification:
 * {@link http://userguide.icu-project.org/formatparse/datetime}
 * <pre>
 * Symbol   Meaning                    Presentation       Example
 * ------   -------                    ------------       -------
 * G#       era designator             (Text)             AD
 * y#       year                       (Number)           1996
 * Y        year (week of year)        (Number)           1997
 * u*       extended year              (Number)           4601
 * Q#       quarter                    (Text)             Q3 & 3rd quarter
 * M        month in year              (Text & Number)    July & 07
 * L        month in year (standalone) (Text & Number)    July & 07
 * d        day in month               (Number)           10
 * h        hour in am/pm (1~12)       (Number)           12
 * H        hour in day (0~23)         (Number)           0
 * m        minute in hour             (Number)           30
 * s        second in minute           (Number)           55
 * S        fractional second          (Number)           978
 * E#       day of week                (Text)             Tue & Tuesday
 * e*       day of week (local 1~7)    (Number)           2
 * c#       day of week (standalone)   (Text & Number)    2 & Tues & Tuesday & T
 * D*       day in year                (Number)           189
 * F*       day of week in month       (Number)           2 (2nd Wed in July)
 * w        week in year               (Number)           27
 * W*       week in month              (Number)           2
 * a        am/pm marker               (Text)             PM
 * k        hour in day (1~24)         (Number)           24
 * K        hour in am/pm (0~11)       (Number)           0
 * z        time zone                  (Text)             Pacific Standard Time
 * Z#       time zone (RFC 822)        (Number)           -0800
 * v#       time zone (generic)        (Text)             America/Los_Angeles
 * V#       time zone                  (Text)             Los Angeles Time
 * g*       Julian day                 (Number)           2451334
 * A*       milliseconds in day        (Number)           69540000
 * '        escape for text            (Delimiter)        'Date='
 * ''       single quote               (Literal)          'o''clock'
 *
 * Item marked with '*' are not supported yet.
 * Item marked with '#' works different than java
 *
 * The count of pattern letters determine the format.
 * (Text): 4 or more, use full form, <4, use short or abbreviated form if it
 * exists. (e.g., "EEEE" produces "Monday", "EEE" produces "Mon")
 *
 * (Number): the minimum number of digits. Shorter numbers are zero-padded to
 * this amount (e.g. if "m" produces "6", "mm" produces "06"). Year is handled
 * specially; that is, if the count of 'y' is 2, the Year will be truncated to
 * 2 digits. (e.g., if "yyyy" produces "1997", "yy" produces "97".) Unlike other
 * fields, fractional seconds are padded on the right with zero.
 *
 * :(Text & Number) 3 or over, use text, otherwise use number. (e.g., "M"
 * produces "1", "MM" produces "01", "MMM" produces "Jan", and "MMMM" produces
 * "January".)
 *
 * Any characters in the pattern that are not in the ranges of ['a'..'z'] and
 * ['A'..'Z'] will be treated as quoted text. For instance, characters like ':',
 * '.', ' ', '#' and '@' will appear in the resulting time text even they are
 * not embraced within single quotes.
 * </pre>
 */

/**
 * Construct a DateTimeFormat object based on current locale.
 *     instance rather than the global symbols.
 *     You can use some of the predefined SHORT / MEDIUM / LONG / FULL patterns,
 *     or the common patterns defined in goog.i18n.DateTimePatterns.
 *     Examples:
 *     <code><pre>
 *       var fmt = new DateTimeFormat(
 *           Format.FULL_DATE);
 *       var fmt = new DateTimeFormat(
 *           goog.i18n.DateTimePatterns.MONTH_DAY_YEAR_MEDIUM);
 *     </pre></code>
 *
 * {@see Format}
 * {@see goog.i18n.DateTimePatterns}
 * @final
 */
class DateTimeFormat {

  /**
   * Construct a DateTimeFormat object based on current locale.
   * @param {string|number} pattern pattern specification or pattern type.
   * @param {!Object=} opt_dateTimeSymbols Optional symbols to use for this
   *     instance rather than the global symbols.
   *     You can use some of the predefined SHORT / MEDIUM / LONG / FULL patterns,
   *     or the common patterns defined in goog.i18n.DateTimePatterns.
   *     Examples:
   *     <code><pre>
   *       var fmt = new DateTimeFormat(
   *           Format.FULL_DATE);
   *       var fmt = new DateTimeFormat(
   *           goog.i18n.DateTimePatterns.MONTH_DAY_YEAR_MEDIUM);
   *     </pre></code>
   *
   * {@see Format}
   * {@see goog.i18n.DateTimePatterns}
   */
  constructor(pattern, opt_dateTimeSymbols) {
    asserts.assert(pattern !== undefined, 'Pattern must be defined');
    asserts.assert(
        opt_dateTimeSymbols !== undefined ||
            DateTimeSymbols !== undefined,
        'goog.i18n.DateTimeSymbols or explicit symbols must be defined');
  
    this.patternParts_ = [];
  
    /**
     * Data structure that with all the locale info needed for date formatting.
     * (day/month names, most common patterns, rules for week-end, etc.)
     * @private {!DateTimeSymbolsType}
     */
    this.dateTimeSymbols_ = /** @type {!DateTimeSymbolsType} */ (
        opt_dateTimeSymbols || DateTimeSymbols);
    if (typeof pattern == 'number') {
      this.applyStandardPattern_(pattern);
    } else {
      this.applyPattern_(pattern);
    }
  }

  /**
   * @param {!DateLike} date
   * @return {number}
   * @private
   */
  static getHours_(date) {
    return date.getHours ? date.getHours() : 0;
  };

  /**
   * Apply specified pattern to this formatter object.
   * @param {string} pattern String specifying how the date should be formatted.
   * @private
   */
  applyPattern_(pattern) {
    if (DateTimeFormat.removeRlmInPatterns_) {
      // Remove RLM unicode control character from pattern.
      pattern = pattern.replace(/\u200f/g, '');
    }
    // lex the pattern, once for all uses
    while (pattern) {
      var previousPattern = pattern;
      for (var i = 0; i < DateTimeFormat.TOKENS_.length; ++i) {
        var m = pattern.match(DateTimeFormat.TOKENS_[i]);
        if (m) {
          var part = m[0];
          pattern = pattern.substring(part.length);
          if (i == DateTimeFormat.PartTypes_.QUOTED_STRING) {
            if (part == '\'\'') {
              part = '\'';  // '' -> '
            } else {
              part = part.substring(
                  1,
                  m[1] == '\'' ? part.length - 1 : part.length);  // strip quotes
              part = part.replace(/\'\'/g, '\'');
            }
          }
          this.patternParts_.push({text: part, type: i});
          break;
        }
      }
      if (previousPattern === pattern) {
        // On every iteration, part of the pattern string must be consumed.
        throw new Error('Malformed pattern part: ' + pattern);
      }
    }
  };

  /**
   * Format the given date object according to preset pattern and current locale.
   * @param {DateLike} date The Date object that is being formatted.
   * @param {TimeZone=} opt_timeZone optional, if specified, time
   *    related fields will be formatted based on its setting. When this field
   *    is not specified, "undefined" will be pass around and those function
   *    that really need time zone service will create a default one.
   * @return {string} Formatted string for the given date.
   *    Throws an error if the date is null or if one tries to format a date-only
   *    object (for instance DateDate) using a pattern with time fields.
   */
  format(date, opt_timeZone) {
    if (!date) throw new Error('The date to format must be non-null.');
  
    // We don't want to write code to calculate each date field because we
    // want to maximize performance and minimize code size.
    // JavaScript only provide API to render local time.
    // Suppose target date is: 16:00 GMT-0400
    // OS local time is:       12:00 GMT-0800
    // We want to create a Local Date Object : 16:00 GMT-0800, and fix the
    // time zone display ourselves.
    // Thing get a little bit tricky when daylight time transition happens. For
    // example, suppose OS timeZone is America/Los_Angeles, it is impossible to
    // represent "2006/4/2 02:30" even for those timeZone that has no transition
    // at this time. Because 2:00 to 3:00 on that day does not exist in
    // America/Los_Angeles time zone. To avoid calculating date field through
    // our own code, we uses 3 Date object instead, one for "Year, month, day",
    // one for time within that day, and one for timeZone object since it need
    // the real time to figure out actual time zone offset.
    var diff = opt_timeZone ?
        (date.getTimezoneOffset() - opt_timeZone.getOffset(date)) * 60000 :
        0;
    var dateForDate = diff ? new Date(date.getTime() + diff) : date;
    var dateForTime = dateForDate;
    // When the time manipulation applied above spans the DST on/off hour, this
    // could alter the time incorrectly by adding or subtracting an additional
    // hour.
    // We can mitigate this by:
    // - Adding the difference in timezone offset to the date. This ensures that
    //   the dateForDate is still within the right day if the extra DST hour
    //   affected the date.
    // - Move the time one day forward if we applied a timezone offset backwards,
    //   or vice versa. This trick ensures that the time is in the same offset
    //   as the original date, so we remove the additional hour added or
    //   subtracted by the DST switch.
    if (opt_timeZone &&
        dateForDate.getTimezoneOffset() != date.getTimezoneOffset()) {
      var dstDiff =
          (dateForDate.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
      dateForDate = new Date(dateForDate.getTime() + dstDiff);
  
      diff += diff > 0 ? -googdate.MS_PER_DAY : googdate.MS_PER_DAY;
      dateForTime = new Date(date.getTime() + diff);
    }
  
    var out = [];
    for (var i = 0; i < this.patternParts_.length; ++i) {
      var text = this.patternParts_[i].text;
      if (DateTimeFormat.PartTypes_.FIELD ==
          this.patternParts_[i].type) {
        out.push(this.formatField_(
            text, date, dateForDate, dateForTime, opt_timeZone));
      } else {
        out.push(text);
      }
    }
    return out.join('');
  };

  /**
   * Apply a predefined pattern as identified by formatType, which is stored in
   * locale specific repository.
   * @param {number} formatType A number that identified the predefined pattern.
   * @private
   */
  applyStandardPattern_(
      formatType) {
    var pattern;
    if (formatType < 4) {
      pattern = this.dateTimeSymbols_.DATEFORMATS[formatType];
    } else if (formatType < 8) {
      pattern = this.dateTimeSymbols_.TIMEFORMATS[formatType - 4];
    } else if (formatType < 12) {
      pattern = this.dateTimeSymbols_.DATETIMEFORMATS[formatType - 8];
      pattern = pattern.replace(
          '{1}', this.dateTimeSymbols_.DATEFORMATS[formatType - 8]);
      pattern = pattern.replace(
          '{0}', this.dateTimeSymbols_.TIMEFORMATS[formatType - 8]);
    } else {
      this.applyStandardPattern_(Format.MEDIUM_DATETIME);
      return;
    }
    this.applyPattern_(pattern);
  };

  /**
   * Localizes a string potentially containing numbers, replacing ASCII digits
   * with native digits if specified so by the locale. Leaves other characters.
   * @param {string} input the string to be localized, using ASCII digits.
   * @return {string} localized string, potentially using native digits.
   * @private
   */
  localizeNumbers_(input) {
    return DateTimeFormat.localizeNumbers(input, this.dateTimeSymbols_);
  };

  /**
   * Sets if the usage of Ascii digits in formatting should be enforced in
   * formatted date/time even for locales where native digits are indicated.
   * Also sets whether to remove RLM unicode control characters when using
   * standard enumerated patterns (they exist e.g. in standard d/M/y for Arabic).
   * Production code should call this once before any `DateTimeFormat`
   * object is instantiated.
   * Caveats:
   *    * Enforcing ASCII digits affects all future formatting by new or existing
   * `DateTimeFormat` objects.
   *    * Removal of RLM characters only applies to `DateTimeFormat` objects
   * instantiated after this call.
   * @param {boolean} enforceAsciiDigits Whether Ascii digits should be enforced.
   */
  static setEnforceAsciiDigits(enforceAsciiDigits) {
    DateTimeFormat.enforceAsciiDigits_ = enforceAsciiDigits;
  
    // Also setting removal of RLM chracters when forcing ASCII digits since it's
    // the right thing to do for Arabic standard patterns. One could add an
    // optional argument here or to the `DateTimeFormat` constructor to
    // enable an alternative behavior.
    DateTimeFormat.removeRlmInPatterns_ = enforceAsciiDigits;
  };

  /**
   * @return {boolean} Whether enforcing ASCII digits for all locales. See
   *     `#setEnforceAsciiDigits` for more details.
   */
  static isEnforceAsciiDigits() {
    return DateTimeFormat.enforceAsciiDigits_;
  };

  /**
   * Localizes a string potentially containing numbers, replacing ASCII digits
   * with native digits if specified so by the locale. Leaves other characters.
   * @param {number|string} input the string to be localized, using ASCII digits.
   * @param {!Object=} opt_dateTimeSymbols Optional symbols to use rather than
   *     the global symbols.
   * @return {string} localized string, potentially using native digits.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  static localizeNumbers(
      input, opt_dateTimeSymbols) {
    input = String(input);
    var dateTimeSymbols = opt_dateTimeSymbols || DateTimeSymbols;
    if (dateTimeSymbols.ZERODIGIT === undefined ||
        DateTimeFormat.enforceAsciiDigits_) {
      return input;
    }
  
    var parts = [];
    for (var i = 0; i < input.length; i++) {
      var c = input.charCodeAt(i);
      parts.push(
          (0x30 <= c && c <= 0x39) ?  // '0' <= c <= '9'
              String.fromCharCode(dateTimeSymbols.ZERODIGIT + c - 0x30) :
              input.charAt(i));
    }
    return parts.join('');
  };

  /**
   * Formats Era field according to pattern specified.
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatEra_(count, date) {
    var value = date.getFullYear() > 0 ? 1 : 0;
    return count >= 4 ? this.dateTimeSymbols_.ERANAMES[value] :
                        this.dateTimeSymbols_.ERAS[value];
  };

  /**
   * Formats Year field according to pattern specified
   *   JavaScript Date object seems incapable handling 1BC and
   *   year before. It can show you year 0 which does not exists.
   *   following we just keep consistent with javascript's
   *   toString method. But keep in mind those things should be
   *   unsupported.
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatYear_(count, date) {
    var value = date.getFullYear();
    if (value < 0) {
      value = -value;
    }
    if (count == 2) {
      // See comment about special casing 'yy' at the start of the file, this
      // matches ICU and CLDR behaviour. See also:
      // http://icu-project.org/apiref/icu4j/com/ibm/icu/text/SimpleDateFormat.html
      // http://www.unicode.org/reports/tr35/tr35-dates.html
      value = value % 100;
    }
    return this.localizeNumbers_(strings.padNumber(value, count));
  };

  /**
   * Formats Year (Week of Year) field according to pattern specified
   *   JavaScript Date object seems incapable handling 1BC and
   *   year before. It can show you year 0 which does not exists.
   *   following we just keep consistent with javascript's
   *   toString method. But keep in mind those things should be
   *   unsupported.
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatYearOfWeek_(count, date) {
    var value = googdate.getYearOfWeek(
        date.getFullYear(), date.getMonth(), date.getDate(),
        this.dateTimeSymbols_.FIRSTWEEKCUTOFFDAY,
        this.dateTimeSymbols_.FIRSTDAYOFWEEK);
  
    if (value < 0) {
      value = -value;
    }
    if (count == 2) {
      // See comment about special casing 'yy' at the start of the file, this
      // matches ICU and CLDR behaviour. See also:
      // http://icu-project.org/apiref/icu4j/com/ibm/icu/text/SimpleDateFormat.html
      // http://www.unicode.org/reports/tr35/tr35-dates.html
      value = value % 100;
    }
    return this.localizeNumbers_(strings.padNumber(value, count));
  };

  /**
   * Formats Month field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatMonth_(count, date) {
    var value = date.getMonth();
    switch (count) {
      case 5:
        return this.dateTimeSymbols_.NARROWMONTHS[value];
      case 4:
        return this.dateTimeSymbols_.MONTHS[value];
      case 3:
        return this.dateTimeSymbols_.SHORTMONTHS[value];
      default:
        return this.localizeNumbers_(strings.padNumber(value + 1, count));
    }
  };

  /**
   * Validates is the DateLike object to format has a time.
   * DateLike means Date|DateDate, and DateDateTime inherits
   * from DateDate. But DateDate does not have time related
   * members (getHours, getMinutes, getSeconds).
   * Formatting can be done, if there are no time placeholders in the pattern.
   *
   * @param {!DateLike} date the object to validate.
   * @private
   */
  static validateDateHasTime_(date) {
    if (date.getHours && date.getSeconds && date.getMinutes) return;
    // if (date instanceof Date || date instanceof DateDateTime)
    throw new Error(
        'The date to format has no time (probably a DateDate). ' +
        'Use Date or DateDateTime, or use a pattern without time fields.');
  };

  /**
   * Formats (1..24) Hours field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats. This controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  format24Hours_(count, date) {
    DateTimeFormat.validateDateHasTime_(date);
    var hours = DateTimeFormat.getHours_(date) || 24;
    return this.localizeNumbers_(strings.padNumber(hours, count));
  };

  /**
   * Formats Fractional seconds field according to pattern
   * specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   *
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatFractionalSeconds_(
      count, date) {
    // Fractional seconds left-justify, append 0 for precision beyond 3
    var value = date.getMilliseconds() / 1000;
    return this.localizeNumbers_(
        value.toFixed(Math.min(3, count)).substr(2) +
        (count > 3 ? strings.padNumber(0, count - 3) : ''));
  };

  /**
   * Formats Day of week field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatDayOfWeek_(count, date) {
    var value = date.getDay();
    return count >= 4 ? this.dateTimeSymbols_.WEEKDAYS[value] :
                        this.dateTimeSymbols_.SHORTWEEKDAYS[value];
  };

  /**
   * Formats Am/Pm field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatAmPm_(count, date) {
    DateTimeFormat.validateDateHasTime_(date);
    var hours = DateTimeFormat.getHours_(date);
    return this.dateTimeSymbols_.AMPMS[hours >= 12 && hours < 24 ? 1 : 0];
  };

  /**
   * Formats (1..12) Hours field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} formatted string that represent this field.
   * @private
   */
  format1To12Hours_(count, date) {
    DateTimeFormat.validateDateHasTime_(date);
    var hours = DateTimeFormat.getHours_(date) % 12 || 12;
    return this.localizeNumbers_(strings.padNumber(hours, count));
  };

  /**
   * Formats (0..11) Hours field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} formatted string that represent this field.
   * @private
   */
  format0To11Hours_(count, date) {
    DateTimeFormat.validateDateHasTime_(date);
    var hours = DateTimeFormat.getHours_(date) % 12;
    return this.localizeNumbers_(strings.padNumber(hours, count));
  };

  /**
   * Formats (0..23) Hours field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} formatted string that represent this field.
   * @private
   */
  format0To23Hours_(count, date) {
    DateTimeFormat.validateDateHasTime_(date);
    var hours = DateTimeFormat.getHours_(date);
    return this.localizeNumbers_(strings.padNumber(hours, count));
  };

  /**
   * Formats Standalone weekday field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} formatted string that represent this field.
   * @private
   */
  formatStandaloneDay_(
      count, date) {
    var value = date.getDay();
    switch (count) {
      case 5:
        return this.dateTimeSymbols_.STANDALONENARROWWEEKDAYS[value];
      case 4:
        return this.dateTimeSymbols_.STANDALONEWEEKDAYS[value];
      case 3:
        return this.dateTimeSymbols_.STANDALONESHORTWEEKDAYS[value];
      default:
        return this.localizeNumbers_(strings.padNumber(value, 1));
    }
  };

  /**
   * Formats Standalone Month field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} formatted string that represent this field.
   * @private
   */
  formatStandaloneMonth_(
      count, date) {
    var value = date.getMonth();
    switch (count) {
      case 5:
        return this.dateTimeSymbols_.STANDALONENARROWMONTHS[value];
      case 4:
        return this.dateTimeSymbols_.STANDALONEMONTHS[value];
      case 3:
        return this.dateTimeSymbols_.STANDALONESHORTMONTHS[value];
      default:
        return this.localizeNumbers_(strings.padNumber(value + 1, count));
    }
  };

  /**
   * Formats Quarter field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatQuarter_(count, date) {
    var value = Math.floor(date.getMonth() / 3);
    return count < 4 ? this.dateTimeSymbols_.SHORTQUARTERS[value] :
                       this.dateTimeSymbols_.QUARTERS[value];
  };

  /**
   * Formats Date field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatDate_(count, date) {
    return this.localizeNumbers_(strings.padNumber(date.getDate(), count));
  };

  /**
   * Formats Minutes field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatMinutes_(count, date) {
    DateTimeFormat.validateDateHasTime_(date);
    return this.localizeNumbers_(strings.padNumber(
        /** @type {!DateDateTime} */ (date).getMinutes(), count));
  };

  /**
   * Formats Seconds field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatSeconds_(count, date) {
    DateTimeFormat.validateDateHasTime_(date);
    return this.localizeNumbers_(strings.padNumber(
        /** @type {!DateDateTime} */ (date).getSeconds(), count));
  };

  /**
   * Formats the week of year field according to pattern specified
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatWeekOfYear_(count, date) {
    var weekNum = googdate.getWeekNumber(
        date.getFullYear(), date.getMonth(), date.getDate(),
        this.dateTimeSymbols_.FIRSTWEEKCUTOFFDAY,
        this.dateTimeSymbols_.FIRSTDAYOFWEEK);
  
    return this.localizeNumbers_(strings.padNumber(weekNum, count));
  };

  /**
   * Formats TimeZone field following RFC
   *
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date It holds the date object to be formatted.
   * @param {TimeZone=} opt_timeZone This holds current time zone info.
   * @return {string} Formatted string that represent this field.
   * @private
   */
  formatTimeZoneRFC_(
      count, date, opt_timeZone) {
    opt_timeZone = opt_timeZone ||
        TimeZone.createTimeZone(date.getTimezoneOffset());
  
    // RFC 822 formats should be kept in ASCII, but localized GMT formats may need
    // to use native digits.
    return count < 4 ? opt_timeZone.getRFCTimeZoneString(date) :
                       this.localizeNumbers_(opt_timeZone.getGMTString(date));
  };

  /**
   * Generate GMT timeZone string for given date
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date Whose value being evaluated.
   * @param {TimeZone=} opt_timeZone This holds current time zone info.
   * @return {string} GMT timeZone string.
   * @private
   */
  formatTimeZone_(
      count, date, opt_timeZone) {
    opt_timeZone = opt_timeZone ||
        TimeZone.createTimeZone(date.getTimezoneOffset());
    return count < 4 ? opt_timeZone.getShortName(date) :
                       opt_timeZone.getLongName(date);
  };

  /**
   * Generate GMT timeZone string for given date
   * @param {!DateLike} date Whose value being evaluated.
   * @param {TimeZone=} opt_timeZone This holds current time zone info.
   * @return {string} GMT timeZone string.
   * @private
   */
  formatTimeZoneId_(
      date, opt_timeZone) {
    opt_timeZone = opt_timeZone ||
        TimeZone.createTimeZone(date.getTimezoneOffset());
    return opt_timeZone.getTimeZoneId();
  };

  /**
   * Generate localized, location dependent time zone id
   * @param {number} count Number of time pattern char repeats, it controls
   *     how a field should be formatted.
   * @param {!DateLike} date Whose value being evaluated.
   * @param {TimeZone=} opt_timeZone This holds current time zone info.
   * @return {string} GMT timeZone string.
   * @private
   */
  formatTimeZoneLocationId_(
      count, date, opt_timeZone) {
    opt_timeZone = opt_timeZone ||
        TimeZone.createTimeZone(date.getTimezoneOffset());
    return count <= 2 ? opt_timeZone.getTimeZoneId() :
                        opt_timeZone.getGenericLocation(date);
  };

  /**
   * Formatting one date field.
   * @param {string} patternStr The pattern string for the field being formatted.
   * @param {!DateLike} date represents the real date to be formatted.
   * @param {!DateLike} dateForDate used to resolve date fields
   *     for formatting.
   * @param {!DateLike} dateForTime used to resolve time fields
   *     for formatting.
   * @param {TimeZone=} opt_timeZone This holds current time zone info.
   * @return {string} string representation for the given field.
   * @private
   */
  formatField_(
      patternStr, date, dateForDate, dateForTime, opt_timeZone) {
    var count = patternStr.length;
    switch (patternStr.charAt(0)) {
      case 'G':
        return this.formatEra_(count, dateForDate);
      case 'y':
        return this.formatYear_(count, dateForDate);
      case 'Y':
        return this.formatYearOfWeek_(count, dateForDate);
      case 'M':
        return this.formatMonth_(count, dateForDate);
      case 'k':
        return this.format24Hours_(count, dateForTime);
      case 'S':
        return this.formatFractionalSeconds_(count, dateForTime);
      case 'E':
        return this.formatDayOfWeek_(count, dateForDate);
      case 'a':
        return this.formatAmPm_(count, dateForTime);
      case 'h':
        return this.format1To12Hours_(count, dateForTime);
      case 'K':
        return this.format0To11Hours_(count, dateForTime);
      case 'H':
        return this.format0To23Hours_(count, dateForTime);
      case 'c':
        return this.formatStandaloneDay_(count, dateForDate);
      case 'L':
        return this.formatStandaloneMonth_(count, dateForDate);
      case 'Q':
        return this.formatQuarter_(count, dateForDate);
      case 'd':
        return this.formatDate_(count, dateForDate);
      case 'm':
        return this.formatMinutes_(count, dateForTime);
      case 's':
        return this.formatSeconds_(count, dateForTime);
      case 'v':
        return this.formatTimeZoneId_(date, opt_timeZone);
      case 'V':
        return this.formatTimeZoneLocationId_(count, date, opt_timeZone);
      case 'w':
        return this.formatWeekOfYear_(count, dateForTime);
      case 'z':
        return this.formatTimeZone_(count, date, opt_timeZone);
      case 'Z':
        return this.formatTimeZoneRFC_(count, date, opt_timeZone);
      default:
        return '';
    }
  };
}

/**
 * Enum to identify predefined Date/Time format pattern.
 * @enum {number}
 */
let Format = {
  FULL_DATE: 0,
  LONG_DATE: 1,
  MEDIUM_DATE: 2,
  SHORT_DATE: 3,
  FULL_TIME: 4,
  LONG_TIME: 5,
  MEDIUM_TIME: 6,
  SHORT_TIME: 7,
  FULL_DATETIME: 8,
  LONG_DATETIME: 9,
  MEDIUM_DATETIME: 10,
  SHORT_DATETIME: 11
};

/**
 * regular expression pattern for parsing pattern string
 * @type {Array<RegExp>}
 * @private
 */
DateTimeFormat.TOKENS_ = [
  // quote string
  /^\'(?:[^\']|\'\')*(\'|$)/,
  // pattern chars
  /^(?:G+|y+|Y+|M+|k+|S+|E+|a+|h+|K+|H+|c+|L+|Q+|d+|m+|s+|v+|V+|w+|z+|Z+)/,
  // and all the other chars
  /^[^\'GyYMkSEahKHcLQdmsvVwzZ]+/  // and all the other chars
];

/**
 * These are token types, corresponding to above token definitions.
 * @enum {number}
 * @private
 */
DateTimeFormat.PartTypes_ = {
  QUOTED_STRING: 0,
  FIELD: 1,
  LITERAL: 2
};

/**
 * If the usage of Ascii digits should be enforced regardless of locale.
 * @type {boolean}
 * @private
 */
DateTimeFormat.enforceAsciiDigits_ = false;

/**
 * If RLM unicode characters should be removed from date/time patterns (useful
 * when enforcing ASCII digits for Arabic). See `#setEnforceAsciiDigits`.
 * @type {boolean}
 * @private
 */
DateTimeFormat.removeRlmInPatterns_ = false;

export {DateTimeFormat, Format};