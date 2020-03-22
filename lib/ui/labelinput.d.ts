/**
 * @fileoverview This behavior is applied to a text input and it shows a text
 * message inside the element if the user hasn't entered any text.
 *
 * This uses the HTML5 placeholder attribute where it is supported.
 *
 * This is ported from http://go/labelinput.js
 *
 * Known issue: Safari does not allow you get to the window object from a
 * document. We need that to listen to the onload event. For now we hard code
 * the window to the current window.
 *
 * Known issue: We need to listen to the form submit event but we attach the
 * event only once (when created or when it is changed) so if you move the DOM
 * node to another form it will not be cleared correctly before submitting.
 *
 * @see ../demos/labelinput.html
 */
/**
 * This creates the label input object.
 * @extends {Component}
 */
export class LabelInput extends Component {
    /**
     * This creates the label input object.
     * @param {string=} opt_label The text to show as the label.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     */
    constructor(opt_label?: string | undefined, opt_domHelper?: goog_dom.DomHelper | undefined);
    /**
     * Variable used to store the element value on keydown and restore it on
     * keypress.  See {@link #handleEscapeKeys_}
     * @type {?string}
     * @private
     */
    ffKeyRestoreValue_: string | null;
    /**
     * The label restore delay after leaving the input.
     * @type {number} Delay for restoring the label.
     * @protected
     */
    labelRestoreDelayMs: number;
    /** @private
      * @type {boolean|null} */
    inFocusAndSelect_: boolean | null;
    /** @private
      * @type {boolean|null} */
    formAttached_: boolean | null;
    /**
     * @type {?EventHandler}
     * @private
     */
    eventHandler_: EventHandler<any> | null;
    /**
     * @type {boolean}
     * @private
     */
    hasFocus_: boolean;
    /**
     * The CSS class name to add to the input when the user has not entered a
     * value.
     */
    labelCssClassName: string;
    /**
     * The text to show as the label.
     * @type {string}
     * @private
     */
    label_: string;
    /**
     * Attaches the events we need to listen to.
     * @private
     */
    attachEvents_(): void;
    /**
     * Adds a listener to the form so that we can clear the input before it is
     * submitted.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    attachEventsToForm_(): void;
    /**
     * Stops listening to the events.
     * @private
     */
    detachEvents_(): void;
    /**
     * Handler for the focus event.
     * @param {?EventsEvent} e The event object passed in to the event handler.
     * @private
     */
    handleFocus_(e: EventsEvent | null): void;
    /**
     * Handler for the blur event.
     * @param {?EventsEvent} e The event object passed in to the event handler.
     * @private
     */
    handleBlur_(e: EventsEvent | null): void;
    /**
     * Handler for key events in Firefox.
     *
     * If the escape key is pressed when a text input has not been changed manually
     * since being focused, the text input will revert to its previous value.
     * Firefox does not honor preventDefault for the escape key. The revert happens
     * after the keydown event and before every keypress. We therefore store the
     * element's value on keydown and restore it on keypress. The restore value is
     * nullified on keyup so that {@link #getValue} returns the correct value.
     *
     * IE and Chrome don't have this problem, Opera blurs in the input box
     * completely in a way that preventDefault on the escape key has no effect.
     * @param {?EventsBrowserEvent} e The event object passed in to
     *     the event handler.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleEscapeKeys_(e: EventsBrowserEvent | null): void;
    /**
     * Handler for the submit event of the form element.
     * @param {?EventsEvent} e The event object passed in to the event handler.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleFormSubmit_(e: EventsEvent | null): void;
    /**
     * Restore value after submit
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleAfterSubmit_(): void;
    /**
     * Handler for the load event the window. This is needed because
     * IE sets defaultValue upon load.
     * @param {?Event} e The event object passed in to the event handler.
     * @private
     */
    handleWindowLoad_(e: Event | null): void;
    /**
     * @return {boolean} Whether the control is currently focused on.
     */
    hasFocus(): boolean;
    /**
     * @return {boolean} Whether the value has been changed by the user.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    hasChanged(): boolean;
    /**
     * Clears the value of the input element without resetting the default text.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    clear(): void;
    /**
     * Clears the value of the input element and resets the default text.
     */
    reset(): void;
    /**
     * Use this to set the value through script to ensure that the label state is
     * up to date
     * @param {string} s The new value for the input.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    setValue(s: string): void;
    /**
     * Returns the current value of the text box, returning an empty string if the
     * search box is the default value
     * @return {string} The value of the input box.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    getValue(): string;
    /**
     * Sets the label text as aria-label, and placeholder when supported.
     * @param {string} label The text to show as the label.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    setLabel(label: string): void;
    /**
     * @return {string} The text to show as the label.
     */
    getLabel(): string;
    /**
     * Checks the state of the input element
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    check_(): void;
    /**
     * This method focuses the input and selects all the text. If the value hasn't
     * changed it will set the value to the label so that the label text is
     * selected.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    focusAndSelect(): void;
    /**
     * Enables/Disables the label input.
     * @param {boolean} enabled Whether to enable (true) or disable (false) the
     *     label input.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    setEnabled(enabled: boolean): void;
    /**
     * @return {boolean} True if the label input is enabled, false otherwise.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    isEnabled(): boolean;
    /**
     * @private
     */
    focusAndSelect_(): void;
    /**
     * Sets the value of the input element to label.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    restoreLabel_(): void;
    actualEventTarget_: LabelInput;
}
export namespace LabelInput {
    export const supportsPlaceholder_: boolean | null;
}
import { Component } from "./component.js";
import { EventHandler } from "../events/eventhandler.js";
import { Event as EventsEvent } from "../events/event.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import * as goog_dom from "../dom/dom.js";
