/**
 * *
 */
export type EventType = string;
export namespace EventType {
    export const RESIZE: string;
}
/**
 * @fileoverview A content-aware textarea control that grows and shrinks
 * automatically. This implementation extends {@link Control}.
 * This code is inspired by Dojo Dijit's Textarea implementation with
 * modifications to support native (when available) textarea resizing and
 * minHeight and maxHeight enforcement.
 *
 * @see ../demos/textarea.html
 */
/**
 * A textarea control to handle growing/shrinking with textarea.value.
 *
 *     decorate the textarea. Defaults to {@link TextareaRenderer}.
 *     document interaction.
 * @extends {Control<TextareaRenderer>}
 */
export class Textarea extends Control<TextareaRenderer> {
    /**
     * A textarea control to handle growing/shrinking with textarea.value.
     *
     * @param {string} content Text to set as the textarea's value.
     * @param {TextareaRenderer=} opt_renderer Renderer used to render or
     *     decorate the textarea. Defaults to {@link TextareaRenderer}.
     * @param {DomHelper=} opt_domHelper Optional DOM helper, used for
     *     document interaction.
     */
    constructor(content: string, opt_renderer?: TextareaRenderer | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * True if the resizing function is executing, false otherwise.
     * @type {boolean}
     * @private
     */
    private isResizing_;
    /**
     * Represents if we have focus on the textarea element, used only
     * to render the placeholder if we don't have native placeholder
     * support.
     * @type {boolean}
     * @private
     */
    private hasFocusForPlaceholder_;
    /**
     * @type {boolean}
     * @private
     */
    private hasUserInput_;
    /**
     * The height of the textarea as last measured.
     * @type {number}
     * @private
     */
    private height_;
    /**
     * A maximum height for the textarea. When set to 0, the default, there is no
     * enforcement of this value during resize.
     * @type {number}
     * @private
     */
    private maxHeight_;
    /**
     * A minimum height for the textarea. When set to 0, the default, there is no
     * enforcement of this value during resize.
     * @type {number}
     * @private
     */
    private minHeight_;
    /**
     * Whether or not textarea rendering characteristics have been discovered.
     * Specifically we determine, at runtime:
     *    If the padding and border box is included in offsetHeight.
     *    @see {Textarea.prototype.needsPaddingBorderFix_}
     *    If the padding and border box is included in scrollHeight.
     *    @see {Textarea.prototype.scrollHeightIncludesPadding_} and
     *    @see {Textarea.prototype.scrollHeightIncludesBorder_}
     * TODO(user): See if we can determine Textarea.NEEDS_HELP_SHRINKING_.
     * @type {boolean}
     * @private
     */
    private hasDiscoveredTextareaCharacteristics_;
    /**
     * If a user agent doesn't correctly support the box-sizing:border-box CSS
     * value then we'll need to adjust our height calculations.
     * @see {Textarea.prototype.discoverTextareaCharacteristics_}
     * @type {boolean}
     * @private
     */
    private needsPaddingBorderFix_;
    /**
     * Whether or not scrollHeight of a textarea includes the padding box.
     * @type {boolean}
     * @private
     */
    private scrollHeightIncludesPadding_;
    /**
     * Whether or not scrollHeight of a textarea includes the border box.
     * @type {boolean}
     * @private
     */
    private scrollHeightIncludesBorder_;
    /**
     * For storing the padding box size during enterDocument, to prevent possible
     * measurement differences that can happen after text zooming.
     * Note: runtime padding changes will cause problems with this.
     * @type {?Box}
     * @private
     */
    private paddingBox_;
    /**
     * For storing the border box size during enterDocument, to prevent possible
     * measurement differences that can happen after text zooming.
     * Note: runtime border width changes will cause problems with this.
     * @type {?Box}
     * @private
     */
    private borderBox_;
    /**
     * Default text content for the textarea when it is unchanged and unfocussed.
     * We use the placeholder attribute for all browsers that have support for
     * it (new in HTML5 for the following browsers:
     *
     *   Internet Explorer 10.0
     *   Firefox 4.0
     *   Opera 11.6
     *   Chrome 4.0
     *   Safari 5.0
     *
     * For older browsers, we save the placeholderText_ and set it as the element's
     * value and add the TEXTAREA_PLACEHOLDER_CLASS to indicate that it's a
     * placeholder string.
     * @type {string}
     * @private
     */
    private placeholderText_;
    /**
     * Sets the default text for the textarea.
     * @param {string} text The default text for the textarea.
     */
    setPlaceholder(text: string): void;
    /**
     * @return {number} The padding plus the border box height.
     * @private
     */
    private getPaddingBorderBoxHeight_;
    /**
     * @return {number} The minHeight value.
     */
    getMinHeight(): number;
    /**
     * @return {number} The minHeight value with a potential padding fix.
     * @private
     */
    private getMinHeight_;
    /**
     * Sets a minimum height for the textarea, and calls resize if rendered.
     * @param {number} height New minHeight value.
     */
    setMinHeight(height: number): void;
    /**
     * @return {number} The maxHeight value.
     */
    getMaxHeight(): number;
    /**
     * @return {number} The maxHeight value with a potential padding fix.
     * @private
     */
    private getMaxHeight_;
    /**
     * Sets a maximum height for the textarea, and calls resize if rendered.
     * @param {number} height New maxHeight value.
     */
    setMaxHeight(height: number): void;
    /**
     * Sets the textarea's value.
     * @param {*} value The value property for the textarea, will be cast to a
     *     string by the browser when setting textarea.value.
     */
    setValue(value: any): void;
    /**
     * Gets the textarea's value.
     * @return {string} value The value of the textarea.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    getValue(): string;
    /**
     * Resizes the textarea vertically.
     */
    resize(): void;
    /**
     * @return {boolean} True if the element supports the placeholder attribute.
     * @private
     */
    private supportsNativePlaceholder_;
    /**
     * Sets the value of the textarea element to the default text.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private restorePlaceholder_;
    /**
     * Gets the textarea's content height + padding height + border height.
     * This is done by getting the scrollHeight and adjusting from there.
     * In the end this result is what we want the new offsetHeight to equal.
     * @return {number} The height of the textarea.
     * @private
     */
    private getHeight_;
    /**
     * Sets the textarea's height.
     * @param {number} height The height to set.
     * @private
     */
    private setHeight_;
    /**
     * Sets the textarea's rows attribute to be the number of newlines + 1.
     * This is necessary when the textarea is hidden, in which case scrollHeight
     * is not available.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private setHeightToEstimate_;
    /**
     * Gets the the height of (possibly present) horizontal scrollbar.
     * @return {number} The height of the horizontal scrollbar.
     * @private
     */
    private getHorizontalScrollBarHeight_;
    /**
     * In order to assess the correct height for a textarea, we need to know
     * whether the scrollHeight (the full height of the text) property includes
     * the values for padding and borders. We can also test whether the
     * box-sizing: border-box setting is working and then tweak accordingly.
     * Instead of hardcoding a list of currently known behaviors and testing
     * for quirksmode, we do a runtime check out of the flow. The performance
     * impact should be very small.
     * @private
     */
    private discoverTextareaCharacteristics_;
    /**
     * Called when the element goes out of focus.
     * @param {EventsEvent=} opt_e The browser event.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private blur_;
    /**
     * Resizes the textarea to grow/shrink to match its contents.
     * @param {EventsEvent=} opt_e The browser event.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private grow_;
    /**
     * Resizes the textarea to shrink to fit its contents. The way this works is
     * by increasing the padding of the textarea by 1px (it's important here that
     * we're in box-sizing: border-box mode). If the size of the textarea grows,
     * then the box is filled up to the padding box with text.
     * If it doesn't change, then we can shrink.
     * @private
     */
    private shrink_;
    /**
     * We use this listener to check if the textarea has been natively resized
     * and if so we reset minHeight so that we don't ever shrink smaller than
     * the user's manually set height. Note that we cannot check size on mousedown
     * and then just compare here because we cannot capture mousedown on
     * the textarea resizer, while mouseup fires reliably.
     * @param {?EventsBrowserEvent} e The mousedown event.
     * @private
     */
    private mouseUpListener_;
}
export namespace Textarea {
    export const NEEDS_HELP_SHRINKING_: boolean;
    export const TEXTAREA_PLACEHOLDER_CLASS: string;
}
import { TextareaRenderer } from "./textarearenderer.js";
import { Control } from "./control.js";
import { DomHelper } from "../dom/dom.js";
