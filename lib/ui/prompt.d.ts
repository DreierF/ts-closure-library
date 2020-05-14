/**
 * @fileoverview DHTML prompt to replace javascript's prompt().
 *
 * @see ../demos/prompt.html
 */
/**
 * Creates an object that represents a prompt (used in place of javascript's
 * prompt). The html structure of the prompt is the same as the layout for
 * dialog.js except for the addition of a text box which is placed inside the
 * "Content area" and has the default class-name 'modal-dialog-userInput'
 *
 *     String is treated as plain text and it will be HTML-escaped.
 *     Cancel. The function should expect a single argument which represents
 *     what the user entered into the prompt. If the user presses cancel, the
 *     value of the argument will be null.
 *     the text box when the prompt appears.
 *     z-index issue by using a an iframe instead of a div for bg element.
 *    Component} for semantics.
 * @extends {Dialog}
 */
export class Prompt extends Dialog {
    /**
     * Creates an object that represents a prompt (used in place of javascript's
     * prompt). The html structure of the prompt is the same as the layout for
     * dialog.js except for the addition of a text box which is placed inside the
     * "Content area" and has the default class-name 'modal-dialog-userInput'
     *
     * @param {string} promptTitle The title of the prompt.
     * @param {string|!SafeHtml} promptBody The body of the prompt.
     *     String is treated as plain text and it will be HTML-escaped.
     * @param {?Function} callback The function to call when the user selects Ok or
     *     Cancel. The function should expect a single argument which represents
     *     what the user entered into the prompt. If the user presses cancel, the
     *     value of the argument will be null.
     * @param {string=} opt_defaultValue Optional default value that should be in
     *     the text box when the prompt appears.
     * @param {string=} opt_class Optional prefix for the classes.
     * @param {boolean=} opt_useIframeForIE For IE, workaround windowed controls
     *     z-index issue by using a an iframe instead of a div for bg element.
     * @param {DomHelper=} opt_domHelper Optional DOM helper; see {@link
     *    Component} for semantics.
     */
    constructor(promptTitle: string, promptBody: string | SafeHtml, callback: Function | null, opt_defaultValue?: string | undefined, opt_class?: string | undefined, opt_useIframeForIE?: boolean | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * Callback function which is invoked with the response to the prompt
     * @type {?Function}
     * @private
     */
    private callback_;
    /**
     * Default value to display in prompt window
     * @type {string}
     * @private
     */
    private defaultValue_;
    /**
     * Element in which user enters response (HTML <input> text box)
     * @type {?HTMLInputElement|?HTMLTextAreaElement}
     * @private
     */
    private userInputEl_;
    /**
     * Tracks whether the prompt is in the process of closing to prevent multiple
     * calls to the callback when the user presses enter.
     * @type {boolean}
     * @private
     */
    private isClosing_;
    /**
     * Number of rows in the user input element.
     * The default is 1 which means use an <input> element.
     * @type {number}
     * @private
     */
    private rows_;
    /**
     * Number of cols in the user input element.
     * The default is 0 which means use browser default.
     * @type {number}
     * @private
     */
    private cols_;
    /**
     * The input decorator function.
     * @type {?function(?Element)}
     * @private
     */
    private inputDecoratorFn_;
    /**
     * A validation function that takes a string and returns true if the string is
     * accepted, false otherwise.
     * @type {function(string):boolean}
     * @private
     */
    private validationFn_;
    /**
     * The id of the input element.
     * @type {string}
     * @private
     */
    private inputElementId_;
    /**
     * Sets the validation function that takes a string and returns true if the
     * string is accepted, false otherwise.
     * @param {function(string): boolean} fn The validation function to use on user
     *     input.
     */
    setValidationFunction(fn: (arg0: string) => boolean): void;
    /**
     * @return {?HTMLInputElement|?HTMLTextAreaElement} The user input element. May
     *     be null if the Prompt has not been rendered.
     */
    getInputElement(): (HTMLInputElement | (HTMLTextAreaElement | null)) | null;
    /**
     * Sets an input decorator function.  This function will be called in
     * #enterDocument and will be passed the input element.  This is useful for
     * attaching handlers to the input element for specific change events,
     * for example.
     * @param {function(?Element)} inputDecoratorFn A function to call on the input
     *     element on #enterDocument.
     */
    setInputDecoratorFn(inputDecoratorFn: (arg0: Element | null) => void): void;
    /**
     * Set the number of rows in the user input element.
     * A values of 1 means use an `<input>` element.  If the prompt is already
     * rendered then you cannot change from `<input>` to `<textarea>` or vice versa.
     * @param {number} rows Number of rows for user input element.
     * @throws {ComponentError.ALREADY_RENDERED} If the component is
     *    already rendered and an attempt to change between `<input>` and
     *    `<textarea>` is made.
     */
    setRows(rows: number): void;
    /**
     * @return {number} The number of rows in the user input element.
     */
    getRows(): number;
    /**
     * Set the number of cols in the user input element.
     * @param {number} cols Number of cols for user input element.
     */
    setCols(cols: number): void;
    /**
     * @return {number} The number of cols in the user input element.
     */
    getCols(): number;
    /**
     * Handles input change events on the input field.  Disables the OK button if
     * validation fails on the new input value.
     * @private
     */
    private handleInputChanged_;
    /**
     * Set OK button enabled/disabled state based on input.
     * @private
     */
    private updateOkButtonState_;
    /**
     * Sets the default value of the prompt when it is displayed.
     * @param {string} defaultValue The default value to display.
     */
    setDefaultValue(defaultValue: string): void;
    /**
     * Handles the closing of the prompt, invoking the callback function that was
     * registered to handle the value returned by the prompt.
     * @param {?DialogEvent} e The dialog's selection event.
     * @private
     */
    private onPromptExit_;
}
import { Dialog } from "./dialog.js";
import { SafeHtml } from "../html/safehtml.js";
import { DomHelper } from "../dom/dom.js";
