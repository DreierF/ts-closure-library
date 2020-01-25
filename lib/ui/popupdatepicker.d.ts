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
    constructor(opt_datePicker?: Ui_DatePicker, opt_domHelper?: DomHelper);
    /**
     * Instance of a date picker control.
     * @type {Ui_DatePicker?}
     * @private
     */
    datePicker_: Ui_DatePicker | null;
    /**
     * Instance of UiPopup used to manage the behavior of the date picker.
     * @type {UiPopup?}
     * @private
     */
    popup_: UiPopup | null;
    /**
     * Reference to the element that triggered the last popup.
     * @type {?Element}
     * @private
     */
    lastTarget_: Element | null;
    /**
     * Whether the date picker can move the focus to its key event target when it
     * is shown.  The default is true.  Setting to false can break keyboard
     * navigation, but this is needed for certain scenarios, for example the
     * toolbar menu in trogedit which can't have the selection changed.
     * @type {boolean}
     * @private
     */
    allowAutoFocus_: boolean;
    /**
     * Whether to reposition the popup when the date picker size changes (due to
     * going to a different month with more weeks) so that all weeks are visible
     * in the viewport.
     * @private {boolean}
     */
    keepAllWeeksInViewport_: boolean;
    /**
     * @return {boolean} Whether the date picker is visible.
     */
    isVisible(): boolean;
    /**
     * @return {?Ui_DatePicker} The date picker instance.
     */
    getDatePicker(): Ui_DatePicker;
    /**
     * @return {?UiPopup} The popup instance.
     */
    getPopup(): UiPopup;
    /**
     * @return {DateDate?} The selected date, if any.  See
     *     Ui_DatePicker.getDate().
     */
    getDate(): DateDate;
    /**
     * Sets the selected date.  See Ui_DatePicker.setDate().
     * @param {DateDate?} date The date to select.
     */
    setDate(date: DateDate): void;
    /**
     * @return {?Element} The last element that triggered the popup.
     */
    getLastTarget(): Element;
    /**
     * Attaches the popup date picker to an element.
     * @param {?Element} element The element to attach to.
     */
    attach(element: Element): void;
    /**
     * Detatches the popup date picker from an element.
     * @param {?Element} element The element to detach from.
     */
    detach(element: Element): void;
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
    showPopup(element: Element, opt_keepDate?: boolean): void;
    /**
     * Handles click events on the targets and shows the date picker.
     * @param {?EventsEvent} event The click event.
     * @private
     */
    showPopup_(event: EventsEvent): void;
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
    onDateSelected_(event: EventsEvent): void;
    /**
     * Called when the date is changed.
     *
     * @param {!EventsEvent} event The date change event.
     * @private
     */
    onDateChanged_(event: EventsEvent): void;
    /**
     * Called when the container DatePicker's size increases.
     * @private
     */
    onGridSizeIncrease_(): void;
    actualEventTarget_: PopupDatePicker;
}
import { Component } from "./component.js";
import { DatePicker as Ui_DatePicker } from "./datepicker.js";
import { Popup as UiPopup } from "./popup.js";
import { Date as DateDate } from "../date/date.js";
import { Event as EventsEvent } from "../events/event.js";
import { DomHelper } from "../dom/dom.js";
