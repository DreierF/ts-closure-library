/**
 * @fileoverview Popup Date Picker implementation.  Pairs a Ui_DatePicker
 * with a UiPopup allowing the DatePicker to be attached to elements.
 *
 * @see ../demos/popupdatepicker.html
 */
/**
 * Popup date picker widget. Fires EventType.SHOW or HIDE
 * events when its visibility changes.
 *
 *     enables the use of a custom date-picker instance.
 * @extends {Component}
 */
export class PopupDatePicker extends Component {
    /**
     * Popup date picker widget. Fires EventType.SHOW or HIDE
     * events when its visibility changes.
     *
     * @param {Ui_DatePicker=} opt_datePicker Optional DatePicker.  This
     *     enables the use of a custom date-picker instance.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     */
    constructor(opt_datePicker?: Ui_DatePicker | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * Instance of a date picker control.
     * @type {Ui_DatePicker?}
     * @private
     */
    private datePicker_;
    /**
     * Instance of UiPopup used to manage the behavior of the date picker.
     * @type {UiPopup?}
     * @private
     */
    private popup_;
    /**
     * Reference to the element that triggered the last popup.
     * @type {Element|null}
     * @private
     */
    private lastTarget_;
    /**
     * Whether the date picker can move the focus to its key event target when it
     * is shown.  The default is true.  Setting to false can break keyboard
     * navigation, but this is needed for certain scenarios, for example the
     * toolbar menu in trogedit which can't have the selection changed.
     * @type {boolean}
     * @private
     */
    private allowAutoFocus_;
    /**
     * Whether to reposition the popup when the date picker size changes (due to
     * going to a different month with more weeks) so that all weeks are visible
     * in the viewport.
     * @private {boolean}
     */
    private keepAllWeeksInViewport_;
    /**
     * @return {boolean} Whether the date picker is visible.
     */
    isVisible(): boolean;
    /**
     * @return {?Ui_DatePicker} The date picker instance.
     */
    getDatePicker(): Ui_DatePicker | null;
    /**
     * @return {?UiPopup} The popup instance.
     */
    getPopup(): UiPopup | null;
    /**
     * @return {DateDate?} The selected date, if any.  See
     *     Ui_DatePicker.getDate().
     */
    getDate(): DateDate | null;
    /**
     * Sets the selected date.  See Ui_DatePicker.setDate().
     * @param {DateDate?} date The date to select.
     */
    setDate(date: DateDate | null): void;
    /**
     * @return {?Element} The last element that triggered the popup.
     */
    getLastTarget(): Element | null;
    /**
     * Attaches the popup date picker to an element.
     * @param {?Element} element The element to attach to.
     */
    attach(element: Element | null): void;
    /**
     * Detatches the popup date picker from an element.
     * @param {?Element} element The element to detach from.
     */
    detach(element: Element | null): void;
    /**
     * Sets whether the date picker can automatically move focus to its key event
     * target when it is set to visible.
     * @param {boolean} allow Whether to allow auto focus.
     */
    setAllowAutoFocus(allow: boolean): void;
    /**
     * @return {boolean} Whether the date picker can automatically move focus to
     * its key event target when it is set to visible.
     */
    getAllowAutoFocus(): boolean;
    /**
     * Sets whether to reposition the popup when the date picker size changes so
     * that all weeks are visible in the viewport.
     * @param {boolean} keepAllWeeksInViewport
     */
    setKeepAllWeeksInViewport(keepAllWeeksInViewport: boolean): void;
    /**
     * @return {boolean} Whether to reposition the popup when the date picker size
     *     changes so that all weeks are visible in the viewport.
     */
    getKeepAllWeeksInViewport(): boolean;
    /**
     * Show the popup at the bottom-left corner of the specified element.
     * @param {?Element} element Reference element for displaying the popup -- popup
     *     will appear at the bottom-left corner of this element.
     * @param {boolean=} opt_keepDate Whether to keep the date picker's current
     *     date. If false, the date is set to null. Defaults to false.
     */
    showPopup(element: Element | null, opt_keepDate?: boolean | undefined): void;
    /**
     * Handles click events on the targets and shows the date picker.
     * @param {?EventsEvent} event The click event.
     * @private
     */
    private showPopup_;
    /**
     * Hides this popup.
     */
    hidePopup(): void;
    /**
     * Called when date selection is made.
     *
     * @param {!EventsEvent} event The date change event.
     * @private
     */
    private onDateSelected_;
    /**
     * Called when the date is changed.
     *
     * @param {!EventsEvent} event The date change event.
     * @private
     */
    private onDateChanged_;
    /**
     * Called when the container DatePicker's size increases.
     * @private
     */
    private onGridSizeIncrease_;
}
import { Component } from "./component.js";
import { DatePicker as Ui_DatePicker } from "./datepicker.js";
import { Popup as UiPopup } from "./popup.js";
import { Date as DateDate } from "../date/date.js";
import { DomHelper } from "../dom/dom.js";
