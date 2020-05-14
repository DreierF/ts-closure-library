/**
 * Constants for event names
 */
export type Events = string;
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
export class DatePicker extends Component {
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
    constructor(opt_date?: (DateDate | Date) | undefined, opt_dateTimeSymbols?: any | undefined, opt_domHelper?: DomHelper | undefined, opt_renderer?: DatePickerRenderer | undefined);
    /**
     * Flag indicating if the number of weeks shown should be fixed.
     * @type {boolean}
     * @private
     */
    private showFixedNumWeeks_;
    /**
     * Flag indicating if days from other months should be shown.
     * @type {boolean}
     * @private
     */
    private showOtherMonths_;
    /**
     * Range of dates which are selectable by the user.
     * @type {!DateRange}
     * @private
     */
    private userSelectableDateRange_;
    /**
     * Flag indicating if extra week(s) always should be added at the end. If not
     * set the extra week is added at the beginning if the number of days shown
     * from the previous month is less than the number from the next month.
     * @type {boolean}
     * @private
     */
    private extraWeekAtEnd_;
    /**
     * Flag indicating if week numbers should be shown.
     * @type {boolean}
     * @private
     */
    private showWeekNum_;
    /**
     * Flag indicating if weekday names should be shown.
     * @type {boolean}
     * @private
     */
    private showWeekdays_;
    /**
     * Flag indicating if none is a valid selection. Also controls if the none
     * button should be shown or not.
     * @type {boolean}
     * @private
     */
    private allowNone_;
    /**
     * Flag indicating if the today button should be shown.
     * @type {boolean}
     * @private
     */
    private showToday_;
    /**
     * Flag indicating if the picker should use a simple navigation menu that only
     * contains controls for navigating to the next and previous month. The default
     * navigation menu contains controls for navigating to the next/previous month,
     * next/previous year, and menus for jumping to specific months and years.
     * @type {boolean}
     * @private
     */
    private simpleNavigation_;
    /**
     * Custom decorator function. Takes a DateDate object, returns a String
     * representing a CSS class or null if no special styling applies
     * @type {?Function}
     * @private
     */
    private decoratorFunction_;
    /**
     * Flag indicating if the dates should be printed as a two charater date.
     * @type {boolean}
     * @private
     */
    private longDateFormat_;
    /**
     * Element for navigation row on a datepicker.
     * @type {Element|null}
     * @private
     */
    private elNavRow_;
    /**
     * Element for the month/year in the navigation row.
     * @type {Element|null}
     * @private
     */
    private elMonthYear_;
    /**
     * Element for footer row on a datepicker.
     * @type {Element|null}
     * @private
     */
    private elFootRow_;
    /**
     * Generator for unique table cell IDs.
     * @type {?IdGenerator}
     * @private
     */
    private cellIdGenerator_;
    /**
     * @deprecated Use isInDocument.
     */
    isCreated: () => boolean;
    /**
     * @deprecated Use decorate instead.
     */
    create: (element: Element | null) => void;
    /**
     * Date and time symbols to use.
     * @type {!DateTimeSymbolsType}
     * @private
     */
    private symbols_;
    wdayNames_: string[];
    i18nDateFormatterDay_: DateTimeFormat;
    i18nDateFormatterDay2_: DateTimeFormat;
    i18nDateFormatterWeek_: DateTimeFormat;
    i18nDateFormatterDayAriaLabel_: DateTimeFormat;
    i18nDateFormatterYear_: DateTimeFormat;
    i18nDateFormatterMonthYear_: DateTimeFormat;
    /**
     * @type {!DatePickerRenderer}
     * @private
     */
    private renderer_;
    /**
     * Selected date.
     * @type {?DateDate}
     * @private
     */
    private date_;
    /**
     * Active month.
     * @type {?DateDate}
     * @private
     */
    private activeMonth_;
    /**
     * Class names to apply to the weekday columns.
     * @type {Array<string>}
     * @private
     */
    private wdayStyles_;
    /**
     * Object that is being used to cache key handlers.
     * @type {?Object}
     * @private
     */
    private keyHandlers_;
    /**
     * Collection of dates that make up the date picker.
     * @type {!Array<!Array<!DateDate>>}
     * @private
     */
    private grid_;
    /**
     * TODO(tbreisacher): Remove external references to this field,
     * and make it private.
     * @type {?Element}
     */
    tableBody_: Element | null;
    /**
     * Number of rows in the picker table. Used for detecting size changes.
     * @private {number}
     */
    private lastNumberOfRowsInGrid_;
    /**
     * @return {number} The first day of week, 0 = Monday, 6 = Sunday.
     */
    getFirstWeekday(): number;
    /**
     * Returns the class name associated with specified weekday.
     * @param {number} wday The week day number to get the class name for.
     * @return {string} The class name associated with specified weekday.
     */
    getWeekdayClass(wday: number): string;
    /**
     * @return {boolean} Whether a fixed number of weeks should be showed. If not
     *     only weeks for the current month will be shown.
     */
    getShowFixedNumWeeks(): boolean;
    /**
     * @return {boolean} Whether a days from the previous and/or next month should
     *     be shown.
     */
    getShowOtherMonths(): boolean;
    /**
     * @return {boolean} Whether a the extra week(s) added always should be at the
     *     end. Only applicable if a fixed number of weeks are shown.
     */
    getExtraWeekAtEnd(): boolean;
    /**
     * @return {boolean} Whether week numbers should be shown.
     */
    getShowWeekNum(): boolean;
    /**
     * @return {boolean} Whether weekday names should be shown.
     */
    getShowWeekdayNames(): boolean;
    /**
     * @return {boolean} Whether none is a valid selection.
     */
    getAllowNone(): boolean;
    /**
     * @return {boolean} Whether the today button should be shown.
     */
    getShowToday(): boolean;
    /**
     * Returns base CSS class. This getter is used to get base CSS class part.
     * All CSS class names in component are created as:
     *   google.getCssName(this.getBaseCssClass(), 'CLASS_NAME')
     * @return {string} Base CSS class.
     */
    getBaseCssClass(): string;
    /**
     * Sets the first day of week
     *
     * @param {number} wday Week day, 0 = Monday, 6 = Sunday.
     */
    setFirstWeekday(wday: number): void;
    /**
     * Sets class name associated with specified weekday.
     *
     * @param {number} wday Week day, 0 = Monday, 6 = Sunday.
     * @param {string} className Class name.
     */
    setWeekdayClass(wday: number, className: string): void;
    /**
     * Sets whether a fixed number of weeks should be showed. If not only weeks
     * for the current month will be showed.
     *
     * @param {boolean} b Whether a fixed number of weeks should be showed.
     */
    setShowFixedNumWeeks(b: boolean): void;
    /**
     * Sets whether a days from the previous and/or next month should be shown.
     *
     * @param {boolean} b Whether a days from the previous and/or next month should
     *     be shown.
     */
    setShowOtherMonths(b: boolean): void;
    /**
     * Sets the range of dates which may be selected by the user.
     *
     * @param {!DateRange} dateRange The range of selectable dates.
     */
    setUserSelectableDateRange(dateRange: DateRange): void;
    /**
     * Gets the range of dates which may be selected by the user.
     *
     * @return {!DateRange} The range of selectable dates.
     */
    getUserSelectableDateRange(): DateRange;
    /**
     * Determine if a date may be selected by the user.
     *
     * @param {!DateDate} date The date to be tested.
     * @return {boolean} Whether the user may select this date.
     * @private
     */
    private isUserSelectableDate_;
    /**
     * Sets whether the picker should use a simple navigation menu that only
     * contains controls for navigating to the next and previous month. The default
     * navigation menu contains controls for navigating to the next/previous month,
     * next/previous year, and menus for jumping to specific months and years.
     *
     * @param {boolean} b Whether to use a simple navigation menu.
     */
    setUseSimpleNavigationMenu(b: boolean): void;
    /**
     * Sets whether a the extra week(s) added always should be at the end. Only
     * applicable if a fixed number of weeks are shown.
     *
     * @param {boolean} b Whether a the extra week(s) added always should be at the
     *     end.
     */
    setExtraWeekAtEnd(b: boolean): void;
    /**
     * Sets whether week numbers should be shown.
     *
     * @param {boolean} b Whether week numbers should be shown.
     */
    setShowWeekNum(b: boolean): void;
    /**
     * Sets whether weekday names should be shown.
     *
     * @param {boolean} b Whether weekday names should be shown.
     */
    setShowWeekdayNames(b: boolean): void;
    /**
     * Sets whether the picker uses narrow weekday names ('M', 'T', 'W', ...).
     *
     * The default behavior is to use short names ('Mon', 'Tue', 'Wed', ...).
     *
     * @param {boolean} b Whether to use narrow weekday names.
     */
    setUseNarrowWeekdayNames(b: boolean): void;
    /**
     * Sets whether none is a valid selection.
     *
     * @param {boolean} b Whether none is a valid selection.
     */
    setAllowNone(b: boolean): void;
    /**
     * Sets whether the today button should be shown.
     *
     * @param {boolean} b Whether the today button should be shown.
     */
    setShowToday(b: boolean): void;
    /**
     * Updates the display style of the None and Today buttons as well as hides the
     * table foot if both are hidden.
     * @private
     */
    private updateTodayAndNone_;
    /**
     * Sets the decorator function. The function should have the interface of
     *   {string} f({DateDate});
     * and return a String representing a CSS class to decorate the cell
     * corresponding to the date specified.
     *
     * @param {?Function} f The decorator function.
     */
    setDecorator(f: Function | null): void;
    /**
     * Sets whether the date will be printed in long format. In long format, dates
     * such as '1' will be printed as '01'.
     *
     * @param {boolean} b Whethere dates should be printed in long format.
     */
    setLongDateFormat(b: boolean): void;
    /**
     * Changes the active month to the previous one.
     */
    previousMonth(): void;
    /**
     * Changes the active month to the next one.
     */
    nextMonth(): void;
    /**
     * Changes the active year to the previous one.
     */
    previousYear(): void;
    /**
     * Changes the active year to the next one.
     */
    nextYear(): void;
    /**
     * Selects the current date.
     */
    selectToday(): void;
    /**
     * Clears the selection.
     */
    selectNone(): void;
    /**
     * @return {!DateDate} The active month displayed.
     */
    getActiveMonth(): DateDate;
    /**
     * @return {?DateDate} The selected date or null if nothing is selected.
     */
    getDate(): DateDate | null;
    /**
     * @param {number} row The row in the grid.
     * @param {number} col The column in the grid.
     * @return {?DateDate} The date in the grid or null if there is none.
     */
    getDateAt(row: number, col: number): DateDate | null;
    /**
     * Returns a date element given a row and column. In elTable_, the elements that
     * represent dates are 1 indexed because of other elements such as headers.
     * This corrects for the offset and makes the API 0 indexed.
     *
     * @param {number} row The row in the element table.
     * @param {number} col The column in the element table.
     * @return {?Element} The element in the grid or null if there is none.
     * @protected
     */
    protected getDateElementAt(row: number, col: number): Element | null;
    /**
     * Sets the selected date. Will always fire the SELECT event.
     *
     * @param {DateDate|Date} date Date to select or null to select nothing.
     */
    setDate(date: DateDate | Date): void;
    /**
     * Sets the selected date, and optionally fires the SELECT event based on param.
     *
     * @param {DateDate|Date} date Date to select or null to select nothing.
     * @param {boolean} fireSelection Whether to fire the selection event.
     * @private
     */
    private setDate_;
    /**
     * Updates the navigation row (navigating months and maybe years) in the navRow_
     * element of a created picker.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private updateNavigationRow_;
    elMonth_: Element | null | undefined;
    elYear_: Element | null | undefined;
    /**
     * Setup click handler with prevent default.
     *
     * @param {!Element} parentElement The parent element of the element. This is
     *     needed because the element in question might not be in the dom yet.
     * @param {string} cssName The CSS class name of the element to attach a click
     *     handler.
     * @param {?Function} handlerFunction The click handler function.
     * @private
     */
    private addPreventDefaultClickHandler_;
    /**
     * Updates the footer row (with select buttons) in the footRow_ element of a
     * created picker.
     * @private
     */
    private updateFooterRow_;
    elToday_: Element | null | undefined;
    elNone_: Element | null | undefined;
    tableFoot_: any;
    elTable_: any[] | null | undefined;
    /**
     * Click handler for date grid.
     * @param {?EventsBrowserEvent} event Click event.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private handleGridClick_;
    /**
     * Keypress handler for date grid.
     *
     * @param {?EventsBrowserEvent} event Keypress event.
     * @private
     */
    private handleGridKeyPress_;
    /**
     * Click handler for month button. Opens month selection menu.
     *
     * @param {?EventsBrowserEvent} event Click event.
     * @private
     */
    private showMonthMenu_;
    /**
     * Click handler for year button. Opens year selection menu.
     *
     * @param {?EventsBrowserEvent} event Click event.
     * @private
     */
    private showYearMenu_;
    /**
     * Call back function for month menu.
     *
     * @param {?Element} target Selected item.
     * @private
     */
    private handleMonthMenuClick_;
    /**
     * Call back function for year menu.
     *
     * @param {?Element} target Selected item.
     * @private
     */
    private handleYearMenuClick_;
    /**
     * Support function for menu creation.
     * @param {?Element} srcEl Button to create menu for.
     * @param {Array<string>} items List of items to populate menu with.
     * @param {function(?Element)} method Call back method.
     * @param {string} selected Item to mark as selected in menu.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private createMenu_;
    menuSelected_: any;
    menu_: any;
    menuCallback_: ((arg0: Element | null) => any) | undefined;
    /**
     * Click handler for menu.
     *
     * @param {?EventsBrowserEvent} event Click event.
     * @private
     */
    private handleMenuClick_;
    /**
     * Keypress handler for menu.
     * @param {?EventsBrowserEvent} event Keypress event.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private handleMenuKeyPress_;
    /**
     * Support function for menu destruction.
     * @private
     */
    private destroyMenu_;
    /**
     * Determines the dates/weekdays for the current month and builds an in memory
     * representation of the calendar.
     *
     * @private
     */
    private updateCalendarGrid_;
    /**
     * Draws calendar view from in memory representation and applies class names
     * depending on the selection, weekday and whatever the day belongs to the
     * active month or not.
     * @private
     */
    private redrawCalendarGrid_;
    selectedCell_: any;
    /**
     * Fires the CHANGE_ACTIVE_MONTH event.
     * @private
     */
    private fireChangeActiveMonthEvent_;
    /**
     * Draw weekday names, if enabled. Start with whatever day has been set as the
     * first day of week.
     * @private
     */
    private redrawWeekdays_;
    /**
     * Returns the key handler for an element and caches it so that it can be
     * retrieved at a later point.
     * @param {?Element} el The element to get the key handler for.
     * @return {?KeyHandler} The key handler for the element.
     * @private
     */
    private getKeyHandlerForElement_;
}
export namespace DatePicker {
    export const BASE_CSS_CLASS_: string;
    export const YEAR_MENU_RANGE_: number;
    export const MAX_NUM_WEEKS_: number;
}
/**
 * Object representing a date picker event.
 *
 * @extends {EventsEvent}
 * @final
 */
export class DatePickerEvent extends EventsEvent {
    /**
     * Object representing a date picker event.
     *
     * @param {string} type Event type.
     * @param {?DatePicker} target Date picker initiating event.
     * @param {?DateDate} date Selected date.
     */
    constructor(type: string, target: DatePicker | null, date: DateDate | null);
    /**
     * The selected date
     * @type {?DateDate}
     */
    date: DateDate | null;
}
export namespace Events {
    export const CHANGE: string;
    export const CHANGE_ACTIVE_MONTH: string;
    export const GRID_SIZE_INCREASE: string;
    export const SELECT: string;
}
import { Component } from "./component.js";
import { DateTimeFormat } from "../i18n/datetimeformat.js";
import { DateRange } from "../date/daterange.js";
import { Date as DateDate } from "../date/date.js";
import { DomHelper } from "../dom/dom.js";
import { DatePickerRenderer } from "./datepickerrenderer.js";
import { Event as EventsEvent } from "../events/event.js";
