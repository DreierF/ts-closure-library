import * as aria from './../a11y/aria/aria.js';
import {State} from './../a11y/aria/attributes.js';
import * as asserts from './../asserts/asserts.js';
import {Date as DateDate} from './../date/date.js';
import {Interval} from './../date/date.js';
import {DateRange} from './../date/daterange.js';
import * as classlist from './../dom/classlist.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {NodeType} from './../dom/nodetype.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {KeyHandler} from './../events/keyhandler.js';
import {EventType} from './../events/keyhandler.js';
import * as google from './../google.js';
import {DateTimeFormat} from './../i18n/datetimeformat.js';
import {Format} from './../i18n/datetimeformat.js';
import {DateTimePatterns} from './../i18n/datetimepatterns.js';
import {DateTimeSymbols} from './../i18n/datetimesymbols.js';
import {DateTimeSymbolsType} from './../i18n/datetimesymbols.js';
import * as style from './../style/style.js';
import {Component} from './component.js';
import {DatePickerRenderer} from './datepickerrenderer.js';
import {DefaultDatePickerRenderer} from './defaultdatepickerrenderer.js';
import {IdGenerator} from './idgenerator.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Date picker implementation.
 *
 * @see ../demos/datepicker.html
 */

/**
 * DatePicker widget. Allows a single date to be selected from a calendar like
 * view.
 *
 *     with, defaults to the current date.
 *     Defaults to DateTimeSymbols if not set.
 *     renderer.
 * @extends {Component}
 */
class DatePicker extends Component {

  /**
   * DatePicker widget. Allows a single date to be selected from a calendar like
   * view.
   *
   * @param {DateDate|Date=} opt_date Date to initialize the date picker
   *     with, defaults to the current date.
   * @param {Object=} opt_dateTimeSymbols Date and time symbols to use.
   *     Defaults to DateTimeSymbols if not set.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   * @param {DatePickerRenderer=} opt_renderer Optional Date picker
   *     renderer.
   */
  constructor(
      opt_date, opt_dateTimeSymbols, opt_domHelper, opt_renderer) {
    super(opt_domHelper);
    /**
     * Flag indicating if the number of weeks shown should be fixed.
     * @type {boolean}
     * @private
     */
    this.showFixedNumWeeks_ = true;
  
    /**
     * Flag indicating if days from other months should be shown.
     * @type {boolean}
     * @private
     */
    this.showOtherMonths_ = true;
  
    /**
     * Range of dates which are selectable by the user.
     * @type {!DateRange}
     * @private
     */
    this.userSelectableDateRange_ =
        DateRange.allTime();
  
    /**
     * Flag indicating if extra week(s) always should be added at the end. If not
     * set the extra week is added at the beginning if the number of days shown
     * from the previous month is less than the number from the next month.
     * @type {boolean}
     * @private
     */
    this.extraWeekAtEnd_ = true;
  
    /**
     * Flag indicating if week numbers should be shown.
     * @type {boolean}
     * @private
     */
    this.showWeekNum_ = true;
  
    /**
     * Flag indicating if weekday names should be shown.
     * @type {boolean}
     * @private
     */
    this.showWeekdays_ = true;
  
    /**
     * Flag indicating if none is a valid selection. Also controls if the none
     * button should be shown or not.
     * @type {boolean}
     * @private
     */
    this.allowNone_ = true;
  
    /**
     * Flag indicating if the today button should be shown.
     * @type {boolean}
     * @private
     */
    this.showToday_ = true;
  
    /**
     * Flag indicating if the picker should use a simple navigation menu that only
     * contains controls for navigating to the next and previous month. The default
     * navigation menu contains controls for navigating to the next/previous month,
     * next/previous year, and menus for jumping to specific months and years.
     * @type {boolean}
     * @private
     */
    this.simpleNavigation_ = false;
  
    /**
     * Custom decorator function. Takes a DateDate object, returns a String
     * representing a CSS class or null if no special styling applies
     * @type {?Function}
     * @private
     */
    this.decoratorFunction_ = null;
  
    /**
     * Flag indicating if the dates should be printed as a two charater date.
     * @type {boolean}
     * @private
     */
    this.longDateFormat_ = false;
  
    /**
     * Element for navigation row on a datepicker.
     * @type {?Element}
     * @private
     */
    this.elNavRow_ = null;
  
    /**
     * Element for the month/year in the navigation row.
     * @type {?Element}
     * @private
     */
    this.elMonthYear_ = null;
  
    /**
     * Element for footer row on a datepicker.
     * @type {?Element}
     * @private
     */
    this.elFootRow_ = null;
  
    /**
     * Generator for unique table cell IDs.
     * @type {IdGenerator}
     * @private
     */
    this.cellIdGenerator_ =
        IdGenerator.getInstance();
  
    /**
     * @deprecated Use isInDocument.
     */
    this.isCreated =
        DatePicker.prototype.isInDocument;
  
    /**
     * @deprecated Use decorate instead.
     */
    this.create = DatePicker.prototype.decorate;
  
  
    /**
     * Date and time symbols to use.
     * @type {!DateTimeSymbolsType}
     * @private
     */
    this.symbols_ = /** @type {!DateTimeSymbolsType} */ (
        opt_dateTimeSymbols || DateTimeSymbols);
  
    this.wdayNames_ = this.symbols_.STANDALONESHORTWEEKDAYS;
  
    // Formatters for the various areas of the picker
    this.i18nDateFormatterDay_ = new DateTimeFormat('d', this.symbols_);
    this.i18nDateFormatterDay2_ =
        new DateTimeFormat('dd', this.symbols_);
    this.i18nDateFormatterWeek_ =
        new DateTimeFormat('w', this.symbols_);
    // Formatter for day grid aria label. This should always have the day first so
    // that a screenreader user can rapidly navigate within a month without always
    // hearing the month. It should read the month name instead of number to avoid
    // confusing people who are used to different orders.
    this.i18nDateFormatterDayAriaLabel_ =
        new DateTimeFormat('d MMM', this.symbols_);
  
    // Previous implementation did not use DateTimePatterns,
    // so it is likely most developers did not set it.
    // This is why the fallback to a hard-coded string (just in case).
    var patYear = DateTimePatterns.YEAR_FULL || 'y';
    this.i18nDateFormatterYear_ =
        new DateTimeFormat(patYear, this.symbols_);
    var patMMMMy = DateTimePatterns.YEAR_MONTH_FULL || 'MMMM y';
    this.i18nDateFormatterMonthYear_ =
        new DateTimeFormat(patMMMMy, this.symbols_);
  
    /**
     * @type {!DatePickerRenderer}
     * @private
     */
    this.renderer_ = opt_renderer ||
        new DefaultDatePickerRenderer(
            this.getBaseCssClass(), this.getDomHelper());
  
    /**
     * Selected date.
     * @type {DateDate}
     * @private
     */
    this.date_ = new DateDate(opt_date);
    this.date_.setFirstWeekCutOffDay(this.symbols_.FIRSTWEEKCUTOFFDAY);
    this.date_.setFirstDayOfWeek(this.symbols_.FIRSTDAYOFWEEK);
  
    /**
     * Active month.
     * @type {DateDate}
     * @private
     */
    this.activeMonth_ = this.date_.clone();
    this.activeMonth_.setDate(1);
  
    /**
     * Class names to apply to the weekday columns.
     * @type {Array<string>}
     * @private
     */
    this.wdayStyles_ = ['', '', '', '', '', '', ''];
    this.wdayStyles_[this.symbols_.WEEKENDRANGE[0]] =
        google.getCssName(this.getBaseCssClass(), 'wkend-start');
    this.wdayStyles_[this.symbols_.WEEKENDRANGE[1]] =
        google.getCssName(this.getBaseCssClass(), 'wkend-end');
  
    /**
     * Object that is being used to cache key handlers.
     * @type {Object}
     * @private
     */
    this.keyHandlers_ = {};
  
    /**
     * Collection of dates that make up the date picker.
     * @type {!Array<!Array<!DateDate>>}
     * @private
     */
    this.grid_ = [];
  
    /** @private {Array<!Array<Element>>} */
    this.elTable_;
  
    /**
     * TODO(tbreisacher): Remove external references to this field,
     * and make it private.
     * @type {Element}
     */
    this.tableBody_;
  
    /** @private {Element} */
    this.tableFoot_;
  
    /** @private {Element} */
    this.elYear_;
  
    /** @private {Element} */
    this.elMonth_;
  
    /** @private {Element} */
    this.elToday_;
  
    /** @private {Element} */
    this.elNone_;
  
    /** @private {Element} */
    this.menu_;
    /** @private {Element} */
    this.menuSelected_;
  
    /** @private {?Element} */
    this.selectedCell_;
  
    /** @private {function(Element)} */
    this.menuCallback_;
  
    /**
     * Number of rows in the picker table. Used for detecting size changes.
     * @private {number}
     */
    this.lastNumberOfRowsInGrid_ = 0;
  }

  /**
   * @return {number} The first day of week, 0 = Monday, 6 = Sunday.
   */
  getFirstWeekday() {
    return this.activeMonth_.getFirstDayOfWeek();
  };

  /**
   * Returns the class name associated with specified weekday.
   * @param {number} wday The week day number to get the class name for.
   * @return {string} The class name associated with specified weekday.
   */
  getWeekdayClass(wday) {
    return this.wdayStyles_[wday];
  };

  /**
   * @return {boolean} Whether a fixed number of weeks should be showed. If not
   *     only weeks for the current month will be shown.
   */
  getShowFixedNumWeeks() {
    return this.showFixedNumWeeks_;
  };

  /**
   * @return {boolean} Whether a days from the previous and/or next month should
   *     be shown.
   */
  getShowOtherMonths() {
    return this.showOtherMonths_;
  };

  /**
   * @return {boolean} Whether a the extra week(s) added always should be at the
   *     end. Only applicable if a fixed number of weeks are shown.
   */
  getExtraWeekAtEnd() {
    return this.extraWeekAtEnd_;
  };

  /**
   * @return {boolean} Whether week numbers should be shown.
   */
  getShowWeekNum() {
    return this.showWeekNum_;
  };

  /**
   * @return {boolean} Whether weekday names should be shown.
   */
  getShowWeekdayNames() {
    return this.showWeekdays_;
  };

  /**
   * @return {boolean} Whether none is a valid selection.
   */
  getAllowNone() {
    return this.allowNone_;
  };

  /**
   * @return {boolean} Whether the today button should be shown.
   */
  getShowToday() {
    return this.showToday_;
  };

  /**
   * Returns base CSS class. This getter is used to get base CSS class part.
   * All CSS class names in component are created as:
   *   google.getCssName(this.getBaseCssClass(), 'CLASS_NAME')
   * @return {string} Base CSS class.
   */
  getBaseCssClass() {
    return DatePicker.BASE_CSS_CLASS_;
  };

  /**
   * Sets the first day of week
   *
   * @param {number} wday Week day, 0 = Monday, 6 = Sunday.
   */
  setFirstWeekday(wday) {
    this.activeMonth_.setFirstDayOfWeek(wday);
    this.updateCalendarGrid_();
    this.redrawWeekdays_();
  };

  /**
   * Sets class name associated with specified weekday.
   *
   * @param {number} wday Week day, 0 = Monday, 6 = Sunday.
   * @param {string} className Class name.
   */
  setWeekdayClass(wday, className) {
    this.wdayStyles_[wday] = className;
    this.redrawCalendarGrid_();
  };

  /**
   * Sets whether a fixed number of weeks should be showed. If not only weeks
   * for the current month will be showed.
   *
   * @param {boolean} b Whether a fixed number of weeks should be showed.
   */
  setShowFixedNumWeeks(b) {
    this.showFixedNumWeeks_ = b;
    this.updateCalendarGrid_();
  };

  /**
   * Sets whether a days from the previous and/or next month should be shown.
   *
   * @param {boolean} b Whether a days from the previous and/or next month should
   *     be shown.
   */
  setShowOtherMonths(b) {
    this.showOtherMonths_ = b;
    this.redrawCalendarGrid_();
  };

  /**
   * Sets the range of dates which may be selected by the user.
   *
   * @param {!DateRange} dateRange The range of selectable dates.
   */
  setUserSelectableDateRange(dateRange) {
    this.userSelectableDateRange_ = dateRange;
  };

  /**
   * Gets the range of dates which may be selected by the user.
   *
   * @return {!DateRange} The range of selectable dates.
   */
  getUserSelectableDateRange() {
    return this.userSelectableDateRange_;
  };

  /**
   * Determine if a date may be selected by the user.
   *
   * @param {!DateDate} date The date to be tested.
   * @return {boolean} Whether the user may select this date.
   * @private
   */
  isUserSelectableDate_(date) {
    return this.userSelectableDateRange_.contains(date);
  };

  /**
   * Sets whether the picker should use a simple navigation menu that only
   * contains controls for navigating to the next and previous month. The default
   * navigation menu contains controls for navigating to the next/previous month,
   * next/previous year, and menus for jumping to specific months and years.
   *
   * @param {boolean} b Whether to use a simple navigation menu.
   */
  setUseSimpleNavigationMenu(b) {
    this.simpleNavigation_ = b;
    this.updateNavigationRow_();
    this.updateCalendarGrid_();
  };

  /**
   * Sets whether a the extra week(s) added always should be at the end. Only
   * applicable if a fixed number of weeks are shown.
   *
   * @param {boolean} b Whether a the extra week(s) added always should be at the
   *     end.
   */
  setExtraWeekAtEnd(b) {
    this.extraWeekAtEnd_ = b;
    this.updateCalendarGrid_();
  };

  /**
   * Sets whether week numbers should be shown.
   *
   * @param {boolean} b Whether week numbers should be shown.
   */
  setShowWeekNum(b) {
    this.showWeekNum_ = b;
    // The navigation and footer rows may rely on the number of visible columns,
    // so we update them when adding/removing the weeknum column.
    this.updateNavigationRow_();
    this.updateFooterRow_();
    this.updateCalendarGrid_();
  };

  /**
   * Sets whether weekday names should be shown.
   *
   * @param {boolean} b Whether weekday names should be shown.
   */
  setShowWeekdayNames(b) {
    this.showWeekdays_ = b;
    this.redrawWeekdays_();
    this.redrawCalendarGrid_();
  };

  /**
   * Sets whether the picker uses narrow weekday names ('M', 'T', 'W', ...).
   *
   * The default behavior is to use short names ('Mon', 'Tue', 'Wed', ...).
   *
   * @param {boolean} b Whether to use narrow weekday names.
   */
  setUseNarrowWeekdayNames(b) {
    this.wdayNames_ = b ? this.symbols_.STANDALONENARROWWEEKDAYS :
                          this.symbols_.STANDALONESHORTWEEKDAYS;
    this.redrawWeekdays_();
  };

  /**
   * Sets whether none is a valid selection.
   *
   * @param {boolean} b Whether none is a valid selection.
   */
  setAllowNone(b) {
    this.allowNone_ = b;
    if (this.elNone_) {
      this.updateTodayAndNone_();
    }
  };

  /**
   * Sets whether the today button should be shown.
   *
   * @param {boolean} b Whether the today button should be shown.
   */
  setShowToday(b) {
    this.showToday_ = b;
    if (this.elToday_) {
      this.updateTodayAndNone_();
    }
  };

  /**
   * Updates the display style of the None and Today buttons as well as hides the
   * table foot if both are hidden.
   * @private
   */
  updateTodayAndNone_() {
    style.setElementShown(this.elToday_, this.showToday_);
    style.setElementShown(this.elNone_, this.allowNone_);
    style.setElementShown(
        this.tableFoot_, this.showToday_ || this.allowNone_);
  };

  /**
   * Sets the decorator function. The function should have the interface of
   *   {string} f({DateDate});
   * and return a String representing a CSS class to decorate the cell
   * corresponding to the date specified.
   *
   * @param {Function} f The decorator function.
   */
  setDecorator(f) {
    this.decoratorFunction_ = f;
  };

  /**
   * Sets whether the date will be printed in long format. In long format, dates
   * such as '1' will be printed as '01'.
   *
   * @param {boolean} b Whethere dates should be printed in long format.
   */
  setLongDateFormat(b) {
    this.longDateFormat_ = b;
    this.redrawCalendarGrid_();
  };

  /**
   * Changes the active month to the previous one.
   */
  previousMonth() {
    this.activeMonth_.add(new Interval(Interval.MONTHS, -1));
    this.updateCalendarGrid_();
    this.fireChangeActiveMonthEvent_();
  };

  /**
   * Changes the active month to the next one.
   */
  nextMonth() {
    this.activeMonth_.add(new Interval(Interval.MONTHS, 1));
    this.updateCalendarGrid_();
    this.fireChangeActiveMonthEvent_();
  };

  /**
   * Changes the active year to the previous one.
   */
  previousYear() {
    this.activeMonth_.add(new Interval(Interval.YEARS, -1));
    this.updateCalendarGrid_();
    this.fireChangeActiveMonthEvent_();
  };

  /**
   * Changes the active year to the next one.
   */
  nextYear() {
    this.activeMonth_.add(new Interval(Interval.YEARS, 1));
    this.updateCalendarGrid_();
    this.fireChangeActiveMonthEvent_();
  };

  /**
   * Selects the current date.
   */
  selectToday() {
    this.setDate(new DateDate());
  };

  /**
   * Clears the selection.
   */
  selectNone() {
    if (this.allowNone_) {
      this.setDate(null);
    }
  };

  /**
   * @return {!DateDate} The active month displayed.
   */
  getActiveMonth() {
    return this.activeMonth_.clone();
  };

  /**
   * @return {DateDate} The selected date or null if nothing is selected.
   */
  getDate() {
    return this.date_ && this.date_.clone();
  };

  /**
   * @param {number} row The row in the grid.
   * @param {number} col The column in the grid.
   * @return {DateDate} The date in the grid or null if there is none.
   */
  getDateAt(row, col) {
    return this.grid_[row] ?
        this.grid_[row][col] ? this.grid_[row][col].clone() : null :
        null;
  };

  /**
   * Returns a date element given a row and column. In elTable_, the elements that
   * represent dates are 1 indexed because of other elements such as headers.
   * This corrects for the offset and makes the API 0 indexed.
   *
   * @param {number} row The row in the element table.
   * @param {number} col The column in the element table.
   * @return {Element} The element in the grid or null if there is none.
   * @protected
   */
  getDateElementAt(row, col) {
    if (row < 0 || col < 0) {
      return null;
    }
    var adjustedRow = row + 1;
    return this.elTable_[adjustedRow] ?
        this.elTable_[adjustedRow][col + 1] || null :
        null;
  };

  /**
   * Sets the selected date. Will always fire the SELECT event.
   *
   * @param {DateDate|Date} date Date to select or null to select nothing.
   */
  setDate(date) {
    this.setDate_(date, true);
  };

  /**
   * Sets the selected date, and optionally fires the SELECT event based on param.
   *
   * @param {DateDate|Date} date Date to select or null to select nothing.
   * @param {boolean} fireSelection Whether to fire the selection event.
   * @private
   */
  setDate_(date, fireSelection) {
    // Check if the month has been changed.
    var sameMonth = date == this.date_ ||
        date && this.date_ && date.getFullYear() == this.date_.getFullYear() &&
            date.getMonth() == this.date_.getMonth();
  
    // Check if the date has been changed.
    var sameDate =
        date == this.date_ || sameMonth && date.getDate() == this.date_.getDate();
  
    // Set current date to clone of supplied DateDate or Date.
    this.date_ = date && new DateDate(date);
  
    // Set current month
    if (date) {
      this.activeMonth_.set(this.date_);
      // Set years with two digits to their full year, not 19XX.
      this.activeMonth_.setFullYear(this.date_.getFullYear());
      this.activeMonth_.setDate(1);
    }
  
    // Update calendar grid even if the date has not changed as even if today is
    // selected another month can be displayed.
    this.updateCalendarGrid_();
  
    if (fireSelection) {
      // TODO(eae): Standardize selection and change events with other components.
      // Fire select event.
      var selectEvent = new DatePickerEvent(
          Events.SELECT, this, this.date_);
      this.dispatchEvent(selectEvent);
    }
  
    // Fire change event.
    if (!sameDate) {
      var changeEvent = new DatePickerEvent(
          Events.CHANGE, this, this.date_);
      this.dispatchEvent(changeEvent);
    }
  
    // Fire change active month event.
    if (!sameMonth) {
      this.fireChangeActiveMonthEvent_();
    }
  };

  /**
   * Updates the navigation row (navigating months and maybe years) in the navRow_
   * element of a created picker.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  updateNavigationRow_() {
    if (!this.elNavRow_) {
      return;
    }
    var row = this.elNavRow_;
  
    // Clear the navigation row.
    while (row.firstChild) {
      row.removeChild(row.firstChild);
    }
  
    var fullDateFormat =
        this.symbols_.DATEFORMATS[Format.FULL_DATE]
            .toLowerCase();
    this.renderer_.renderNavigationRow(
        row, this.simpleNavigation_, this.showWeekNum_, fullDateFormat);
  
    if (this.simpleNavigation_) {
      this.addPreventDefaultClickHandler_(
          row, google.getCssName(this.getBaseCssClass(), 'previousMonth'),
          this.previousMonth);
      var previousMonthElement = goog_dom.getElementByClass(
          google.getCssName(this.getBaseCssClass(), 'previousMonth'), row);
      if (previousMonthElement) {
        // Note: we're hiding the next and previous month buttons from screen
        // readers because keyboard navigation doesn't currently work correctly
        // with them. If that is fixed, we can show the buttons again.
        aria.setState(
            previousMonthElement, State.HIDDEN, true);
        previousMonthElement.tabIndex = -1;
      }
  
      this.addPreventDefaultClickHandler_(
          row, google.getCssName(this.getBaseCssClass(), 'nextMonth'),
          this.nextMonth);
      var nextMonthElement = goog_dom.getElementByClass(
          google.getCssName(this.getBaseCssClass(), 'nextMonth'), row);
      if (nextMonthElement) {
        aria.setState(
            nextMonthElement, State.HIDDEN, true);
        nextMonthElement.tabIndex = -1;
      }
  
      this.elMonthYear_ = goog_dom.getElementByClass(
          google.getCssName(this.getBaseCssClass(), 'monthyear'), row);
    } else {
      this.addPreventDefaultClickHandler_(
          row, google.getCssName(this.getBaseCssClass(), 'previousMonth'),
          this.previousMonth);
      this.addPreventDefaultClickHandler_(
          row, google.getCssName(this.getBaseCssClass(), 'nextMonth'),
          this.nextMonth);
      this.addPreventDefaultClickHandler_(
          row, google.getCssName(this.getBaseCssClass(), 'month'),
          this.showMonthMenu_);
  
      this.addPreventDefaultClickHandler_(
          row, google.getCssName(this.getBaseCssClass(), 'previousYear'),
          this.previousYear);
      this.addPreventDefaultClickHandler_(
          row, google.getCssName(this.getBaseCssClass(), 'nextYear'),
          this.nextYear);
      this.addPreventDefaultClickHandler_(
          row, google.getCssName(this.getBaseCssClass(), 'year'),
          this.showYearMenu_);
  
      this.elMonth_ = goog_dom.getElementByClass(
          google.getCssName(this.getBaseCssClass(), 'month'), row);
      this.elYear_ = goog_dom.getDomHelper().getElementByClass(
          google.getCssName(this.getBaseCssClass(), 'year'), row);
    }
  };

  /**
   * Setup click handler with prevent default.
   *
   * @param {!Element} parentElement The parent element of the element. This is
   *     needed because the element in question might not be in the dom yet.
   * @param {string} cssName The CSS class name of the element to attach a click
   *     handler.
   * @param {Function} handlerFunction The click handler function.
   * @private
   */
  addPreventDefaultClickHandler_(
      parentElement, cssName, handlerFunction) {
    var element = goog_dom.getElementByClass(cssName, parentElement);
    this.getHandler().listen(element, EventsEventType.CLICK, function(e) {
      e.preventDefault();
      handlerFunction.call(this, e);
    });
  };

  /**
   * Updates the footer row (with select buttons) in the footRow_ element of a
   * created picker.
   * @private
   */
  updateFooterRow_() {
    if (!this.elFootRow_) {
      return;
    }
  
    var row = this.elFootRow_;
  
    // Clear the footer row.
    goog_dom.removeChildren(row);
  
    this.renderer_.renderFooterRow(row, this.showWeekNum_);
  
    this.addPreventDefaultClickHandler_(
        row, google.getCssName(this.getBaseCssClass(), 'today-btn'),
        this.selectToday);
    this.addPreventDefaultClickHandler_(
        row, google.getCssName(this.getBaseCssClass(), 'none-btn'),
        this.selectNone);
  
    this.elToday_ = goog_dom.getElementByClass(
        google.getCssName(this.getBaseCssClass(), 'today-btn'), row);
    this.elNone_ = goog_dom.getElementByClass(
        google.getCssName(this.getBaseCssClass(), 'none-btn'), row);
  
    this.updateTodayAndNone_();
  };

  /**
   * @override
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  decorateInternal(el) {
    super.decorateInternal(el);
    asserts.assert(el);
    classlist.add(el, this.getBaseCssClass());
  
    var table =
        this.dom_.createDom(TagName.TABLE, {'role': 'presentation'});
    var thead = this.dom_.createDom(TagName.THEAD);
    var tbody = this.dom_.createDom(TagName.TBODY, {'role': 'grid'});
    var tfoot = this.dom_.createDom(TagName.TFOOT);
  
    tbody.tabIndex = 0;
  
    // As per comment in colorpicker: table.tBodies and table.tFoot should not be
    // used because of a bug in Safari, hence using an instance variable
    this.tableBody_ = tbody;
    this.tableFoot_ = tfoot;
  
    var row = this.dom_.createDom(TagName.TR, {'role': 'row'});
    row.className = google.getCssName(this.getBaseCssClass(), 'head');
    this.elNavRow_ = row;
    this.updateNavigationRow_();
  
    thead.appendChild(row);
  
    var cell;
    this.elTable_ = [];
    for (var i = 0; i < 7; i++) {
      row = this.dom_.createElement(TagName.TR);
      this.elTable_[i] = [];
      for (var j = 0; j < 8; j++) {
        cell = this.dom_.createElement(j == 0 || i == 0 ? 'th' : 'td');
        if ((j == 0 || i == 0) && j != i) {
          cell.className = (j == 0) ?
              google.getCssName(this.getBaseCssClass(), 'week') :
              google.getCssName(this.getBaseCssClass(), 'wday');
          aria.setRole(cell, j == 0 ? 'rowheader' : 'columnheader');
        } else if (i !== 0 && j !== 0) {
          aria.setRole(cell, 'gridcell');
          // Make the cells programmatically-focusable (see focus() call below).
          cell.setAttribute('tabindex', '-1');
        }
        row.appendChild(cell);
        this.elTable_[i][j] = cell;
      }
      tbody.appendChild(row);
    }
  
    row = this.dom_.createElement(TagName.TR);
    row.className = google.getCssName(this.getBaseCssClass(), 'foot');
    this.elFootRow_ = row;
    this.updateFooterRow_();
    tfoot.appendChild(row);
  
  
    table.cellSpacing = '0';
    table.cellPadding = '0';
    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    el.appendChild(table);
  
    this.redrawWeekdays_();
    this.updateCalendarGrid_();
  
    el.tabIndex = 0;
  };

  /** @override */
  createDom() {
    super.createDom();
    this.decorateInternal(this.getElement());
  };

  /** @override */
  enterDocument() {
    super.enterDocument();
  
    var eh = this.getHandler();
    eh.listen(
        this.tableBody_, EventsEventType.CLICK, this.handleGridClick_);
    eh.listen(
        this.getKeyHandlerForElement_(this.getElement()),
        EventType.KEY, this.handleGridKeyPress_);
  };

  /** @override */
  exitDocument() {
    super.exitDocument();
    this.destroyMenu_();
    for (var uid in this.keyHandlers_) {
      this.keyHandlers_[uid].dispose();
    }
    this.keyHandlers_ = {};
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
  
    this.elTable_ = null;
    this.tableBody_ = null;
    this.tableFoot_ = null;
    this.elNavRow_ = null;
    this.elFootRow_ = null;
    this.elMonth_ = null;
    this.elMonthYear_ = null;
    this.elYear_ = null;
    this.elToday_ = null;
    this.elNone_ = null;
  };

  /**
   * Click handler for date grid.
   * @param {EventsBrowserEvent} event Click event.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleGridClick_(event) {
    if (event.target.tagName == TagName.TD) {
      // colIndex/rowIndex is broken in Safari, find position by looping
      var el, x = -2, y = -2;  // first col/row is for weekday/weeknum
      for (el = event.target; el; el = el.previousSibling, x++) {
      }
      for (el = event.target.parentNode; el; el = el.previousSibling, y++) {
      }
      var obj = this.grid_[y][x];
      if (this.isUserSelectableDate_(obj)) {
        this.setDate(obj.clone());
      }
    }
  };

  /**
   * Keypress handler for date grid.
   *
   * @param {EventsBrowserEvent} event Keypress event.
   * @private
   */
  handleGridKeyPress_(event) {
    var months, days;
    switch (event.keyCode) {
      case 33:  // Page up
        event.preventDefault();
        months = -1;
        break;
      case 34:  // Page down
        event.preventDefault();
        months = 1;
        break;
      case 37:  // Left
        event.preventDefault();
        days = -1;
        break;
      case 39:  // Right
        event.preventDefault();
        days = 1;
        break;
      case 38:  // Down
        event.preventDefault();
        days = -7;
        break;
      case 40:  // Up
        event.preventDefault();
        days = 7;
        break;
      case 36:  // Home
        event.preventDefault();
        this.selectToday();
        break;
      case 46:  // Delete
        event.preventDefault();
        this.selectNone();
        break;
      case 13:  // Enter
      case 32:  // Space
        event.preventDefault();
        this.setDate_(this.date_, true /* fireSelection */);
      default:
        return;
    }
    var date;
    if (this.date_) {
      date = this.date_.clone();
      date.add(new Interval(0, months, days));
    } else {
      date = this.activeMonth_.clone();
      date.setDate(1);
    }
    if (this.isUserSelectableDate_(date)) {
      this.setDate_(date, false /* fireSelection */);
      // Focus the currently-selected cell to surface its aria-label for assistive
      // tech, (eg) allowing unsighted users to see what the arrow keys are doing.
      this.selectedCell_.focus();
    }
  };

  /**
   * Click handler for month button. Opens month selection menu.
   *
   * @param {EventsBrowserEvent} event Click event.
   * @private
   */
  showMonthMenu_(event) {
    event.stopPropagation();
  
    var list = [];
    for (var i = 0; i < 12; i++) {
      list.push(this.symbols_.STANDALONEMONTHS[i]);
    }
    this.createMenu_(
        this.elMonth_, list, this.handleMonthMenuClick_,
        this.symbols_.STANDALONEMONTHS[this.activeMonth_.getMonth()]);
  };

  /**
   * Click handler for year button. Opens year selection menu.
   *
   * @param {EventsBrowserEvent} event Click event.
   * @private
   */
  showYearMenu_(event) {
    event.stopPropagation();
  
    var list = [];
    var year = this.activeMonth_.getFullYear();
    var loopDate = this.activeMonth_.clone();
    for (var i = -DatePicker.YEAR_MENU_RANGE_;
         i <= DatePicker.YEAR_MENU_RANGE_; i++) {
      loopDate.setFullYear(year + i);
      list.push(this.i18nDateFormatterYear_.format(loopDate));
    }
    this.createMenu_(
        this.elYear_, list, this.handleYearMenuClick_,
        this.i18nDateFormatterYear_.format(this.activeMonth_));
  };

  /**
   * Call back function for month menu.
   *
   * @param {Element} target Selected item.
   * @private
   */
  handleMonthMenuClick_(target) {
    var itemIndex = Number(target.getAttribute('itemIndex'));
    this.activeMonth_.setMonth(itemIndex);
    this.updateCalendarGrid_();
  
    if (this.elMonth_.focus) {
      this.elMonth_.focus();
    }
  };

  /**
   * Call back function for year menu.
   *
   * @param {Element} target Selected item.
   * @private
   */
  handleYearMenuClick_(target) {
    if (target.firstChild.nodeType == NodeType.TEXT) {
      // We use the same technique used for months to get the position of the
      // item in the menu, as the year is not necessarily numeric.
      var itemIndex = Number(target.getAttribute('itemIndex'));
      var year = this.activeMonth_.getFullYear();
      this.activeMonth_.setFullYear(
          year + itemIndex - DatePicker.YEAR_MENU_RANGE_);
      this.updateCalendarGrid_();
    }
  
    this.elYear_.focus();
  };

  /**
   * Support function for menu creation.
   * @param {Element} srcEl Button to create menu for.
   * @param {Array<string>} items List of items to populate menu with.
   * @param {function(Element)} method Call back method.
   * @param {string} selected Item to mark as selected in menu.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  createMenu_(
      srcEl, items, method, selected) {
    this.destroyMenu_();
  
    var el = this.dom_.createElement(TagName.DIV);
    el.className = google.getCssName(this.getBaseCssClass(), 'menu');
  
    this.menuSelected_ = null;
  
    var ul = this.dom_.createElement(TagName.UL);
    for (var i = 0; i < items.length; i++) {
      var li = this.dom_.createDom(TagName.LI, null, items[i]);
      li.setAttribute('itemIndex', i);
      if (items[i] == selected) {
        this.menuSelected_ = li;
      }
      ul.appendChild(li);
    }
    el.appendChild(ul);
    srcEl = /** @type {!HTMLElement} */ (srcEl);
    el.style.left = srcEl.offsetLeft + srcEl.parentNode.offsetLeft + 'px';
    el.style.top = srcEl.offsetTop + 'px';
    el.style.width = srcEl.clientWidth + 'px';
    this.elMonth_.parentNode.appendChild(el);
  
    this.menu_ = el;
    if (!this.menuSelected_) {
      this.menuSelected_ = /** @type {Element} */ (ul.firstChild);
    }
    this.menuSelected_.className =
        google.getCssName(this.getBaseCssClass(), 'menu-selected');
    this.menuCallback_ = method;
  
    var eh = this.getHandler();
    eh.listen(this.menu_, EventsEventType.CLICK, this.handleMenuClick_);
    eh.listen(
        this.getKeyHandlerForElement_(this.menu_),
        EventType.KEY, this.handleMenuKeyPress_);
    eh.listen(
        this.dom_.getDocument(), EventsEventType.CLICK, this.destroyMenu_);
    el.tabIndex = 0;
    el.focus();
  };

  /**
   * Click handler for menu.
   *
   * @param {EventsBrowserEvent} event Click event.
   * @private
   */
  handleMenuClick_(event) {
    event.stopPropagation();
  
    this.destroyMenu_();
    if (this.menuCallback_) {
      this.menuCallback_(/** @type {Element} */ (event.target));
    }
  };

  /**
   * Keypress handler for menu.
   * @param {EventsBrowserEvent} event Keypress event.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleMenuKeyPress_(event) {
    // Prevent the grid keypress handler from catching the keypress event.
    event.stopPropagation();
  
    var el;
    var menuSelected = this.menuSelected_;
    switch (event.keyCode) {
      case 35:  // End
        event.preventDefault();
        el = menuSelected.parentNode.lastChild;
        break;
      case 36:  // Home
        event.preventDefault();
        el = menuSelected.parentNode.firstChild;
        break;
      case 38:  // Up
        event.preventDefault();
        el = menuSelected.previousSibling;
        break;
      case 40:  // Down
        event.preventDefault();
        el = menuSelected.nextSibling;
        break;
      case 13:  // Enter
      case 9:   // Tab
      case 0:   // Space
        event.preventDefault();
        this.destroyMenu_();
        this.menuCallback_(menuSelected);
        break;
    }
    if (el && el != menuSelected) {
      menuSelected.className = '';
      el.className = google.getCssName(this.getBaseCssClass(), 'menu-selected');
      this.menuSelected_ = /** @type {!Element} */ (el);
    }
  };

  /**
   * Support function for menu destruction.
   * @private
   */
  destroyMenu_() {
    if (this.menu_) {
      var eh = this.getHandler();
      eh.unlisten(this.menu_, EventsEventType.CLICK, this.handleMenuClick_);
      eh.unlisten(
          this.getKeyHandlerForElement_(this.menu_),
          EventType.KEY, this.handleMenuKeyPress_);
      eh.unlisten(
          this.dom_.getDocument(), EventsEventType.CLICK,
          this.destroyMenu_);
      goog_dom.removeNode(this.menu_);
      delete this.menu_;
    }
  };

  /**
   * Determines the dates/weekdays for the current month and builds an in memory
   * representation of the calendar.
   *
   * @private
   */
  updateCalendarGrid_() {
    if (!this.getElement()) {
      return;
    }
  
    var date = this.activeMonth_.clone();
    date.setDate(1);
  
    // Show year name of select month
    if (this.elMonthYear_) {
      goog_dom.setTextContent(
          this.elMonthYear_, this.i18nDateFormatterMonthYear_.format(date));
    }
    if (this.elMonth_) {
      goog_dom.setTextContent(
          this.elMonth_, this.symbols_.STANDALONEMONTHS[date.getMonth()]);
    }
    if (this.elYear_) {
      goog_dom.setTextContent(
          this.elYear_, this.i18nDateFormatterYear_.format(date));
    }
  
    var wday = date.getWeekday();
    var days = date.getNumberOfDaysInMonth();
  
    // Determine how many days to show for previous month
    date.add(new Interval(Interval.MONTHS, -1));
    date.setDate(date.getNumberOfDaysInMonth() - (wday - 1));
  
    if (this.showFixedNumWeeks_ && !this.extraWeekAtEnd_ && days + wday < 33) {
      date.add(new Interval(Interval.DAYS, -7));
    }
  
    // Create weekday/day grid
    var dayInterval = new Interval(Interval.DAYS, 1);
    this.grid_ = [];
    for (var y = 0; y < 6; y++) {  // Weeks
      this.grid_[y] = [];
      for (var x = 0; x < 7; x++) {  // Weekdays
        this.grid_[y][x] = date.clone();
        // Date.add breaks dates before year 100 by adding 1900 to the year
        // value. As a workaround we store the year before the add and reapply it
        // after (with special handling for January 1st).
        var year = date.getFullYear();
        date.add(dayInterval);
        if (date.getMonth() == 0 && date.getDate() == 1) {
          // Increase year on January 1st.
          year++;
        }
        date.setFullYear(year);
      }
    }
  
    this.redrawCalendarGrid_();
  };

  /**
   * Draws calendar view from in memory representation and applies class names
   * depending on the selection, weekday and whatever the day belongs to the
   * active month or not.
   * @private
   */
  redrawCalendarGrid_() {
    if (!this.getElement()) {
      return;
    }
  
    var month = this.activeMonth_.getMonth();
    var today = new DateDate();
    var todayYear = today.getFullYear();
    var todayMonth = today.getMonth();
    var todayDate = today.getDate();
    // The maximum number of weeks a month can have is 6. This is decreased below
    // if weeks are hidden.
    var numberOfWeeksInThisMonth = DatePicker.MAX_NUM_WEEKS_;
  
    // Draw calendar week by week, a worst case month has six weeks.
    for (var y = 0; y < DatePicker.MAX_NUM_WEEKS_; y++) {
      // Draw week number, if enabled
      if (this.showWeekNum_) {
        goog_dom.setTextContent(
            this.elTable_[y + 1][0],
            this.i18nDateFormatterWeek_.format(this.grid_[y][0]));
        classlist.set(
            this.elTable_[y + 1][0],
            google.getCssName(this.getBaseCssClass(), 'week'));
      } else {
        goog_dom.setTextContent(this.elTable_[y + 1][0], '');
        classlist.set(this.elTable_[y + 1][0], '');
      }
  
      for (var x = 0; x < 7; x++) {
        var o = this.grid_[y][x];
        var el = this.elTable_[y + 1][x + 1];
  
        // Assign a unique element id (required for setting the active descendant
        // ARIA role) unless already set.
        if (!el.id) {
          el.id = this.cellIdGenerator_.getNextUniqueId();
        }
        asserts.assert(el, 'The table DOM element cannot be null.');
        aria.setRole(el, 'gridcell');
        // Set the aria label of the grid cell to the month plus the day.
        aria.setLabel(
            el, this.i18nDateFormatterDayAriaLabel_.format(o));
  
        var classes = [google.getCssName(this.getBaseCssClass(), 'date')];
        if (!this.isUserSelectableDate_(o)) {
          classes.push(
              google.getCssName(this.getBaseCssClass(), 'unavailable-date'));
        }
        if (this.showOtherMonths_ || o.getMonth() == month) {
          // Date belongs to previous or next month
          if (o.getMonth() != month) {
            classes.push(google.getCssName(this.getBaseCssClass(), 'other-month'));
          }
  
          // Apply styles set by setWeekdayClass
          var wday = (x + this.activeMonth_.getFirstDayOfWeek() + 7) % 7;
          if (this.wdayStyles_[wday]) {
            classes.push(this.wdayStyles_[wday]);
          }
  
          // Current date
          if (o.getDate() == todayDate && o.getMonth() == todayMonth &&
              o.getFullYear() == todayYear) {
            classes.push(google.getCssName(this.getBaseCssClass(), 'today'));
          }
  
          // Selected date
          if (this.date_ && o.getDate() == this.date_.getDate() &&
              o.getMonth() == this.date_.getMonth() &&
              o.getFullYear() == this.date_.getFullYear()) {
            classes.push(google.getCssName(this.getBaseCssClass(), 'selected'));
            asserts.assert(
                this.tableBody_, 'The table body DOM element cannot be null');
            this.selectedCell_ = el;
          }
  
          // Custom decorator
          if (this.decoratorFunction_) {
            var customClass = this.decoratorFunction_(o);
            if (customClass) {
              classes.push(customClass);
            }
          }
  
          // Set cell text to the date and apply classes.
          var formattedDate = this.longDateFormat_ ?
              this.i18nDateFormatterDay2_.format(o) :
              this.i18nDateFormatterDay_.format(o);
          goog_dom.setTextContent(el, formattedDate);
          // Date belongs to previous or next month and showOtherMonths is false,
          // clear text and classes.
        } else {
          goog_dom.setTextContent(el, '');
        }
        classlist.set(el, classes.join(' '));
      }
  
      // Hide either the last one or last two weeks if they contain no days from
      // the active month and the showFixedNumWeeks is false. The first four weeks
      // are always shown as no month has less than 28 days).
      if (y >= 4) {
        var parentEl = /** @type {Element} */ (
            this.elTable_[y + 1][0].parentElement ||
            this.elTable_[y + 1][0].parentNode);
        var doesMonthHaveThisWeek = this.grid_[y][0].getMonth() == month;
        style.setElementShown(
            parentEl, doesMonthHaveThisWeek || this.showFixedNumWeeks_);
  
        if (!doesMonthHaveThisWeek) {
          numberOfWeeksInThisMonth = Math.min(numberOfWeeksInThisMonth, y);
        }
      }
    }
  
    var numberOfRowsInGrid =
        (this.showFixedNumWeeks_ ? DatePicker.MAX_NUM_WEEKS_ :
                                   numberOfWeeksInThisMonth) +
        (this.showWeekdays_ ? 1 : 0);
  
    if (this.lastNumberOfRowsInGrid_ != numberOfRowsInGrid) {
      if (this.lastNumberOfRowsInGrid_ < numberOfRowsInGrid) {
        this.dispatchEvent(Events.GRID_SIZE_INCREASE);
      }
      this.lastNumberOfRowsInGrid_ = numberOfRowsInGrid;
    }
  };

  /**
   * Fires the CHANGE_ACTIVE_MONTH event.
   * @private
   */
  fireChangeActiveMonthEvent_() {
    var changeMonthEvent = new DatePickerEvent(
        Events.CHANGE_ACTIVE_MONTH, this,
        this.getActiveMonth());
    this.dispatchEvent(changeMonthEvent);
  };

  /**
   * Draw weekday names, if enabled. Start with whatever day has been set as the
   * first day of week.
   * @private
   */
  redrawWeekdays_() {
    if (!this.getElement()) {
      return;
    }
    if (this.showWeekdays_) {
      for (var x = 0; x < 7; x++) {
        var el = this.elTable_[0][x + 1];
        var wday = (x + this.activeMonth_.getFirstDayOfWeek() + 7) % 7;
        goog_dom.setTextContent(el, this.wdayNames_[(wday + 1) % 7]);
      }
    }
    var parentEl = /** @type {Element} */ (
        this.elTable_[0][0].parentElement || this.elTable_[0][0].parentNode);
    style.setElementShown(parentEl, this.showWeekdays_);
  };

  /**
   * Returns the key handler for an element and caches it so that it can be
   * retrieved at a later point.
   * @param {Element} el The element to get the key handler for.
   * @return {KeyHandler} The key handler for the element.
   * @private
   */
  getKeyHandlerForElement_(el) {
    var uid = google.getUid(el);
    if (!(uid in this.keyHandlers_)) {
      this.keyHandlers_[uid] = new KeyHandler(el);
    }
    return this.keyHandlers_[uid];
  };
}

/**
 * Name of base CSS class of datepicker.
 * @type {string}
 * @private
 */
DatePicker.BASE_CSS_CLASS_ = google.getCssName('goog-date-picker');

/**
 * The numbers of years to show before and after the current one in the
 * year pull-down menu. A total of YEAR_MENU_RANGE * 2 + 1 will be shown.
 * Example: for range = 2 and year 2013 => [2011, 2012, 2013, 2014, 2015]
 * @const {number}
 * @private
 */
DatePicker.YEAR_MENU_RANGE_ = 5;

/**
 * The maximum number of rendered weeks a month can have.
 * @const {number}
 * @private
 */
DatePicker.MAX_NUM_WEEKS_ = 6;

/**
 * Constants for event names
 *
 * @enum {string}
 */
let Events = {
  CHANGE: 'change',
  CHANGE_ACTIVE_MONTH: 'changeActiveMonth',
  GRID_SIZE_INCREASE: 'gridSizeIncrease',
  SELECT: 'select'
};

/**
 * Object representing a date picker event.
 *
 * @extends {EventsEvent}
 * @final
 */
class DatePickerEvent extends EventsEvent {

  /**
   * Object representing a date picker event.
   *
   * @param {string} type Event type.
   * @param {DatePicker} target Date picker initiating event.
   * @param {DateDate} date Selected date.
   */
  constructor(type, target, date) {
    super(type, target);
  
    /**
     * The selected date
     * @type {DateDate}
     */
    this.date = date;
  }
}

export {DatePicker, DatePickerEvent, Events};