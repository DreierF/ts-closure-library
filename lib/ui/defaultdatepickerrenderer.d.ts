/**
 * @fileoverview The default renderer for {@link goog.ui.DatePicker}.
 *
 * @see ../demos/datepicker.html
 */
/**  Interface. */
/**
 * Default renderer for {@link goog.ui.DatePicker}. Renders the date picker's
 * navigation header and footer.
 *
 * @implements {DatePickerRenderer}
 */
export class DefaultDatePickerRenderer implements DatePickerRenderer {
    /**
     * Default renderer for {@link goog.ui.DatePicker}. Renders the date picker's
     * navigation header and footer.
     *
     * @param {string} baseCssClass Name of base CSS class of the date picker.
     * @param {DomHelper=} opt_domHelper DOM helper.
     */
    constructor(baseCssClass: string, opt_domHelper?: DomHelper | undefined);
    /**
     * Name of base CSS class of datepicker
     * @type {string}
     * @private
     */
    private baseCssClass_;
    /**
     * @type {!DomHelper}
     * @private
     */
    private dom_;
    /**
     * Returns the dom helper that is being used on this component.
     * @return {!DomHelper} The dom helper used on this component.
     */
    getDomHelper(): DomHelper;
    /**
     * Returns base CSS class. This getter is used to get base CSS class part.
     * All CSS class names in component are created as:
     *   google.getCssName(this.getBaseCssClass(), 'CLASS_NAME')
     * @return {string} Base CSS class.
     */
    getBaseCssClass(): string;
    /**
     * Render the navigation row (navigating months and maybe years).
     *
     * @param {!Element} row The parent element to render the component into.
     * @param {boolean} simpleNavigation Whether the picker should render a simple
     *     navigation menu that only contains controls for navigating to the next
     *     and previous month. The default navigation menu contains controls for
     *     navigating to the next/previous month, next/previous year, and menus for
     *     jumping to specific months and years.
     * @param {boolean} showWeekNum Whether week numbers should be shown.
     * @param {string} fullDateFormat The full date format.
     *     {@see goog.i18n.DateTimeSymbols}.
     * @override
     */
    renderNavigationRow(row: Element, simpleNavigation: boolean, showWeekNum: boolean, fullDateFormat: string): void;
    /**
     * Render the footer row (with select buttons).
     *
     * @param {!Element} row The parent element to render the component into.
     * @param {boolean} showWeekNum Whether week numbers should be shown.
     * @override
     */
    renderFooterRow(row: Element, showWeekNum: boolean): void;
    /**
     * Support function for button creation.
     *
     * @param {?Element} parentNode Container the button should be added to.
     * @param {string} label Button label.
     * @param {string=} opt_className Class name for button, which will be used
     *    in addition to "goog-date-picker-btn".
     * @private
     * @return {!Element} The created button element.
     */
    private createButton_;
}
import { DatePickerRenderer } from "./datepickerrenderer.js";
import { DomHelper } from "../dom/dom.js";
