/**
 * @fileoverview Class for managing the interactions between an
 * auto-complete object and a text-input or textarea.
 *
 * IME note:
 *
 * We used to suspend autocomplete while there are IME preedit characters, but
 * now for parity with Search we do not. We still detect the beginning and end
 * of IME entry because we need to listen to more events while an IME commit is
 * happening, but we update continuously as the user types.
 *
 * IMEs vary across operating systems, browsers, and even input languages. This
 * class tries to handle IME for:
 * - Windows x {FF3, IE7, Chrome} x MS IME 2002 (Japanese)
 * - Mac     x {FF3, Safari3}     x Kotoeri (Japanese)
 * - Linux   x {FF3}              x UIM + Anthy (Japanese)
 *
 * TODO(user): We cannot handle {Mac, Linux} x FF3 correctly.
 * TODO(user): We need to support Windows x Google IME.
 *
 * This class was tested with hiragana input. The event sequence when inputting
 * 'ai<enter>' with IME on (which commits two characters) is as follows:
 *
 * Notation: [key down code, key press, key up code]
 *           key code or +: event fired
 *           -: event not fired
 *
 * - Win/FF3: [WIN_IME, +, A], [-, -, ENTER]
 *            Note: No events are fired for 'i'.
 *
 * - Win/IE7: [WIN_IME, -, A], [WIN_IME, -, I], [WIN_IME, -, ENTER]
 *
 * - Win/Chrome: Same as Win/IE7
 *
 * - Mac/FF3: [A, -, A], [I, -, I], [ENTER, -, ENTER]
 *
 * - Mac/Safari3: Same as Win/IE7
 *
 * - Linux/FF3: No events are generated.
 *
 * With IME off,
 *
 * - ALL: [A, +, A], [I, +, I], [ENTER, +, ENTER]
 *        Note: Key code of key press event varies across configuration.
 *
 * With Microsoft Pinyin IME 3.0 (Simplified Chinese),
 *
 * - Win/IE7: Same as Win/IE7 with MS IME 2002 (Japanese)
 *
 *   The issue with this IME is that the key sequence that ends preedit is not
 *   a single ENTER key up.
 *   - ENTER key up following either ENTER or SPACE ends preedit.
 *   - SPACE key up following even number of LEFT, RIGHT, or SPACE (any
 *     combination) ends preedit.
 *   TODO(user): We only support SPACE-then-ENTER sequence.
 *   TODO(mpd): With the change to autocomplete during IME, this might not be an
 *   issue. Remove this comment once tested.
 *
 * With Microsoft Korean IME 2002,
 *
 * - Win/IE7: Same as Win/IE7 with MS IME 2002 (Japanese), but there is no
 *   sequence that ends the preedit.
 *
 * The following is the algorithm we use to detect IME preedit:
 *
 * - WIN_IME key down starts predit.
 * - (1) ENTER key up or (2) CTRL-M key up ends preedit.
 * - Any key press not immediately following WIN_IME key down signifies that
 *   preedit has ended.
 *
 * If you need to change this algorithm, please note the OS, browser, language,
 * and behavior above so that we can avoid regressions. Contact mpd or yuzo
 * if you have questions or concerns.
 */
/**
 * Class for managing the interaction between an auto-complete object and a
 * text-input or textarea.
 *
 *     If none passed, uses ',' and ';'.
 *     (Default: true).
 *     keyevents with (Default: 150). Use -1 to disable updates on typing. Note
 *     that typing the separator will update autocomplete suggestions.
 * @extends {Disposable}
 */
export class InputHandler extends Disposable {
    /**
     * Class for managing the interaction between an auto-complete object and a
     * text-input or textarea.
     *
     * @param {?string=} opt_separators Separators to split multiple entries.
     *     If none passed, uses ',' and ';'.
     * @param {?string=} opt_literals Characters used to delimit text literals.
     * @param {?boolean=} opt_multi Whether to allow multiple entries
     *     (Default: true).
     * @param {?number=} opt_throttleTime Number of milliseconds to throttle
     *     keyevents with (Default: 150). Use -1 to disable updates on typing. Note
     *     that typing the separator will update autocomplete suggestions.
     */
    constructor(opt_separators?: (string | null) | undefined, opt_literals?: (string | null) | undefined, opt_multi?: (boolean | null) | undefined, opt_throttleTime?: (number | null) | undefined);
    /**
     * The AutoComplete instance this inputhandler is associated with.
     * @type {?AutoComplete}
     */
    ac_: AutoComplete | null;
    /**
     * Characters that can be used to split multiple entries in an input string
     * @type {string|null}
     * @private
     */
    private separators_;
    /**
     * The separator we use to reconstruct the string
     * @type {string|null}
     * @private
     */
    private defaultSeparator_;
    /**
     * Regular expression used from trimming tokens or null for no trimming.
     * @type {?RegExp}
     * @private
     */
    private trimmer_;
    /**
     * Regular expression to test whether a separator exists
     * @type {?RegExp}
     * @private
     */
    private separatorCheck_;
    /**
     * Should auto-completed tokens be wrapped in whitespace?  Used in selectRow.
     * @type {boolean}
     * @private
     */
    private whitespaceWrapEntries_;
    /**
     * Should the occurrence of a literal indicate a token boundary?
     * @type {boolean}
     * @private
     */
    private generateNewTokenOnLiteral_;
    /**
     * Whether to flip the orientation of up & down for hiliting next
     * and previous autocomplete entries.
     * @type {boolean}
     * @private
     */
    private upsideDown_;
    /**
     * If we're in 'multi' mode, does typing a separator force the updating of
     * suggestions?
     * For example, if somebody finishes typing "obama, hillary,", should the last
     * comma trigger updating suggestions in a guaranteed manner? Especially useful
     * when the suggestions depend on complete keywords. Note that "obama, hill"
     * (a leading sub-string of "obama, hillary" will lead to different and possibly
     * irrelevant suggestions.
     * @type {boolean}
     * @private
     */
    private separatorUpdates_;
    /**
     * If we're in 'multi' mode, does typing a separator force the current term to
     * autocomplete?
     * For example, if 'tomato' is a suggested completion and the user has typed
     * 'to,', do we autocomplete to turn that into 'tomato,'?
     * @type {boolean}
     * @private
     */
    private separatorSelects_;
    /**
     * The id of the currently active timeout, so it can be cleared if required.
     * @type {?number}
     * @private
     */
    private activeTimeoutId_;
    /**
     * The element that is currently active.
     * @type {Element|null}
     * @private
     */
    private activeElement_;
    /**
     * The previous value of the active element.
     * @type {string}
     * @private
     */
    private lastValue_;
    /**
     * Flag used to indicate that the IME key has been seen and we need to wait for
     * the up event.
     * @type {boolean}
     * @private
     */
    private waitingForIme_;
    /**
     * Flag used to indicate that the user just selected a row and we should
     * therefore ignore the change of the input value.
     * @type {boolean}
     * @private
     */
    private rowJustSelected_;
    /**
     * Flag indicating whether the result list should be updated continuously
     * during typing or only after a short pause.
     * @type {boolean}
     * @private
     */
    private updateDuringTyping_;
    /**
     * Whether this input accepts multiple values
     * @type {boolean}
     * @private
     */
    private multi_;
    /**
     * Characters that are used to delimit literal text. Separarator characters
     * found within literal text are not processed as separators
     * @type {string}
     * @private
     */
    private literals_;
    /**
     * Whether to prevent highlighted item selection when tab is pressed.
     * @type {boolean}
     * @private
     */
    private preventSelectionOnTab_;
    /**
     * Whether to prevent the default behavior (moving focus to another element)
     * when tab is pressed.  This occurs by default only for multi-value mode.
     * @type {boolean}
     * @private
     */
    private preventDefaultOnTab_;
    /**
     * A timer object used to monitor for changes when an element is active.
     *
     * TODO(user): Consider tuning the throttle time, so that it takes into
     * account the length of the token.  When the token is short it is likely to
     * match lots of rows, therefore we want to check less frequently.  Even
     * something as simple as <3-chars = 150ms, then 100ms otherwise.
     *
     * @type {?Timer}
     * @private
     */
    private timer_;
    /**
     * Event handler used by the input handler to manage events.
     * @type {EventHandler<!InputHandler>}
     * @private
     */
    private eh_;
    /**
     * Event handler to help us find an input element that already has the focus.
     * @type {EventHandler<!InputHandler>}
     * @private
     */
    private activateHandler_;
    /**
     * The keyhandler used for listening on most key events.  This takes care of
     * abstracting away some of the browser differences.
     * @type {?KeyHandler}
     * @private
     */
    private keyHandler_;
    /**
     * The last key down key code.
     * @type {number}
     * @private
     */
    private lastKeyCode_;
    /**
     * Attach an instance of an AutoComplete
     * @param {?AutoComplete} ac Autocomplete object.
     */
    attachAutoComplete(ac: AutoComplete | null): void;
    /**
     * Returns the associated autocomplete instance.
     * @return {?AutoComplete} The associated autocomplete instance.
     */
    getAutoComplete(): AutoComplete | null;
    /**
     * Returns the current active element.
     * @return {?Element} The currently active element.
     */
    getActiveElement(): Element | null;
    /**
     * Returns the value of the current active element.
     * @return {string} The value of the current active element.
     */
    getValue(): string;
    /**
     * Sets the value of the current active element.
     * @param {string} value The new value.
     */
    setValue(value: string): void;
    /**
     * Returns the current cursor position.
     * @return {number} The index of the cursor position.
     */
    getCursorPosition(): number;
    /**
     * Sets the cursor at the given position.
     * @param {number} pos The index of the cursor position.
     */
    setCursorPosition(pos: number): void;
    /**
     * Attaches the input handler to a target element. The target element
     * should be a textarea, input box, or other focusable element with the
     * same interface.
     * @param {?Element|EventsEventTarget} target An element to attach the
     *     input handler to.
     */
    attachInput(target: (Element | EventsEventTarget) | null): void;
    /**
     * Detaches the input handler from the provided element.
     * @param {?Element|EventsEventTarget} target An element to detach the
     *     input handler from.
     */
    detachInput(target: (Element | EventsEventTarget) | null): void;
    /**
     * Attaches the input handler to multiple elements.
     * @param {...Element} var_args Elements to attach the input handler too.
     */
    attachInputs(...args: Element[]): void;
    /**
     * Detaches the input handler from multuple elements.
     * @param {...Element} var_args Variable arguments for elements to unbind from.
     */
    detachInputs(...args: Element[]): void;
    /**
     * Selects the given row.  Implements the SelectionHandler interface.
     * @param {?} row The row to select.
     * @param {boolean=} opt_multi Should this be treated as a single or multi-token
     *     auto-complete?  Overrides previous setting of opt_multi on constructor.
     * @return {boolean} Whether to suppress the update event.
     */
    selectRow(row: unknown, opt_multi?: boolean | undefined): boolean;
    /**
     * Sets the text of the current token without updating the autocomplete
     * choices.
     * @param {string} tokenText The text for the current token.
     * @param {boolean=} opt_multi Should this be treated as a single or multi-token
     *     auto-complete?  Overrides previous setting of opt_multi on constructor.
     * @protected
     */
    protected setTokenText(tokenText: string, opt_multi?: boolean | undefined): void;
    /**
     * Sets the entry separator characters.
     *
     * @param {string} separators The separator characters to set.
     * @param {string=} opt_defaultSeparators The defaultSeparator character to set.
     */
    setSeparators(separators: string, opt_defaultSeparators?: string | undefined): void;
    /**
     * Sets whether to flip the orientation of up & down for hiliting next
     * and previous autocomplete entries.
     * @param {boolean} upsideDown Whether the orientation is upside down.
     */
    setUpsideDown(upsideDown: boolean): void;
    /**
     * Sets whether auto-completed tokens should be wrapped with whitespace.
     * @param {boolean} newValue boolean value indicating whether or not
     *     auto-completed tokens should be wrapped with whitespace.
     */
    setWhitespaceWrapEntries(newValue: boolean): void;
    /**
     * Sets whether new tokens should be generated from literals.  That is, should
     * hello'world be two tokens, assuming ' is a literal?
     * @param {boolean} newValue boolean value indicating whether or not
     * new tokens should be generated from literals.
     */
    setGenerateNewTokenOnLiteral(newValue: boolean): void;
    /**
     * Sets the regular expression used to trim the tokens before passing them to
     * the matcher:  every substring that matches the given regular expression will
     * be removed.  This can also be set to null to disable trimming.
     * @param {?RegExp} trimmer Regexp to use for trimming or null to disable it.
     */
    setTrimmingRegExp(trimmer: RegExp | null): void;
    /**
     * Sets the regular expression used to check whether the replacement (used to
     * update the text area after a row is selected) ends with a separator. This can
     * be set to null if the input handler should never automatically append a
     * separator to the replacement string.
     * @param {?RegExp} separatorCheck Regexp to use for checking whether the
     *     replacement ends with a separator.
     */
    setEndsWithSeparatorRegExp(separatorCheck: RegExp | null): void;
    /**
     * Sets whether we will prevent the default input behavior (moving focus to the
     * next focusable  element) on TAB.
     * @param {boolean} newValue Whether to preventDefault on TAB.
     */
    setPreventDefaultOnTab(newValue: boolean): void;
    /**
     * Sets whether we will prevent highlighted item selection on TAB.
     * @param {boolean} newValue Whether to prevent selection on TAB.
     */
    setPreventSelectionOnTab(newValue: boolean): void;
    /**
     * Sets whether separators perform autocomplete.
     * @param {boolean} newValue Whether to autocomplete on separators.
     */
    setSeparatorCompletes(newValue: boolean): void;
    /**
     * Sets whether separators perform autocomplete.
     * @param {boolean} newValue Whether to autocomplete on separators.
     */
    setSeparatorSelects(newValue: boolean): void;
    /**
     * Gets the time to wait before updating the results. If the update during
     * typing flag is switched on, this delay counts from the last update,
     * otherwise from the last keypress.
     * @return {number} Throttle time in milliseconds.
     */
    getThrottleTime(): number;
    /**
     * Sets whether a row has just been selected.
     * @param {boolean} justSelected Whether or not the row has just been selected.
     */
    setRowJustSelected(justSelected: boolean): void;
    /**
     * Sets the time to wait before updating the results.
     * @param {number} time New throttle time in milliseconds.
     */
    setThrottleTime(time: number): void;
    /**
     * Gets whether the result list is updated during typing.
     * @return {boolean} Value of the flag.
     */
    getUpdateDuringTyping(): boolean;
    /**
     * Sets whether the result list should be updated during typing.
     * @param {boolean} value New value of the flag.
     */
    setUpdateDuringTyping(value: boolean): void;
    /**
     * Handles a key event.
     * @param {?EventsBrowserEvent} e Browser event object.
     * @return {boolean} True if the key event was handled.
     * @protected
     */
    protected handleKeyEvent(e: EventsBrowserEvent | null): boolean;
    /**
     * Handles a key event for a separator key.
     * @param {?EventsBrowserEvent} e Browser event object.
     * @return {boolean} True if the key event was handled.
     * @private
     */
    private handleSeparator_;
    /**
     * @return {boolean} Whether this inputhandler need to listen on key-up.
     * @protected
     */
    protected needKeyUpListener(): boolean;
    /**
     * Handles the key up event. Registered only if needKeyUpListener returns true.
     * @param {?EventsEvent} e The keyup event.
     * @return {boolean} Whether an action was taken or not.
     * @protected
     */
    protected handleKeyUp(e: EventsEvent | null): boolean;
    /**
     * Adds the necessary input event handlers.
     * @private
     */
    private addEventHandlers_;
    /**
     * Removes the necessary input event handlers.
     * @private
     */
    private removeEventHandlers_;
    /**
     * Handles an element getting focus.
     * @param {?EventsEvent} e Browser event object.
     * @protected
     */
    protected handleFocus(e: EventsEvent | null): void;
    /**
     * Registers handlers for the active element when it receives focus.
     * @param {?Element} target The element to focus.
     * @protected
     */
    protected processFocus(target: Element | null): void;
    /**
     * Handles an element blurring.
     * @param {EventsEvent=} opt_e Browser event object.
     * @protected
     */
    protected handleBlur(opt_e?: EventsEvent | undefined): void;
    /**
     * Helper function that does the logic to handle an element blurring.
     * @protected
     */
    protected processBlur(): void;
    /**
     * Handles the timer's tick event.  Calculates the current token, and reports
     * any update to the autocomplete.
     * @param {?EventsEvent} e Browser event object.
     * @private
     */
    private onTick_;
    /**
     * Handles typing in an inactive input element. Activate it.
     * @param {?EventsBrowserEvent} e Browser event object.
     * @private
     */
    private onKeyDownOnInactiveElement_;
    /**
     * Handles typing in the active input element.  Checks if the key is a special
     * key and does the relevant action as appropriate.
     * @param {?EventsBrowserEvent} e Browser event object.
     * @private
     */
    private onKey_;
    /**
     * Handles a KEYPRESS event generated by typing in the active input element.
     * Checks if IME input is ended.
     * @param {?EventsBrowserEvent} e Browser event object.
     * @private
     */
    private onKeyPress_;
    /**
     * Handles the key-up event.  This is only ever used by Mac FF or when we are in
     * an IME entry scenario.
     * @param {?EventsBrowserEvent} e Browser event object.
     * @private
     */
    private onKeyUp_;
    /**
     * Handles mouse-down event.
     * @param {?EventsBrowserEvent} e Browser event object.
     * @private
     */
    private onMouseDown_;
    /**
     * For subclasses to override to handle the mouse-down event.
     * @param {?EventsBrowserEvent} e Browser event object.
     * @protected
     */
    protected handleMouseDown(e: EventsBrowserEvent | null): void;
    /**
     * Starts waiting for IME.
     * @private
     */
    private startWaitingForIme_;
    /**
     * Stops waiting for IME.
     * @private
     */
    private stopWaitingForIme_;
    /**
     * Handles the key-press event for IE, checking to see if the user typed a
     * separator character.
     * @param {?EventsBrowserEvent} e Browser event object.
     * @private
     */
    private onIeKeyPress_;
    /**
     * Checks if an update has occurred and notified the autocomplete of the new
     * token.
     * @param {boolean=} opt_force If true the menu will be forced to update.
     */
    update(opt_force?: boolean | undefined): void;
    /**
     * Parses a text area or input box for the currently highlighted token.
     * @return {string} Token to complete.
     * @protected
     */
    protected parseToken(): string;
    /**
     * Moves hilite up.  May hilite next or previous depending on orientation.
     * @return {boolean} True if successful.
     * @private
     */
    private moveUp_;
    /**
     * Moves hilite down.  May hilite next or previous depending on orientation.
     * @return {boolean} True if successful.
     * @private
     */
    private moveDown_;
    /**
     * Parses a text area or input box for the currently highlighted token.
     * @return {string} Token to complete.
     * @private
     */
    private parseToken_;
    /**
     * Trims a token of characters that we want to ignore
     * @param {string} text string to trim.
     * @return {string} Trimmed string.
     * @private
     */
    private trim_;
    /**
     * Gets the index of the currently highlighted token
     * @param {string} text string to parse.
     * @param {number} caret Position of cursor in string.
     * @return {number} Index of token.
     * @private
     */
    private getTokenIndex_;
    /**
     * Splits an input string of text at the occurrence of a character in
     * {@link InputHandler.prototype.separators_} and creates
     * an array of tokens.  Each token may contain additional whitespace and
     * formatting marks.  If necessary use
     * {@link InputHandler.prototype.trim_} to clean up the
     * entries.
     *
     * @param {string} text Input text.
     * @return {!Array<string>} Parsed array.
     * @private
     */
    private splitInput_;
}
export namespace InputHandler {
    export const REQUIRES_ASYNC_BLUR_: boolean;
    export const STANDARD_LIST_SEPARATORS: string;
    export const QUOTE_LITERALS: string;
}
import { Disposable } from "../../disposable/disposable.js";
import { AutoComplete } from "./autocomplete.js";
import { EventTarget as EventsEventTarget } from "../../events/eventhandler.js";
import { BrowserEvent as EventsBrowserEvent } from "../../events/browserevent.js";
import { Event as EventsEvent } from "../../events/event.js";
