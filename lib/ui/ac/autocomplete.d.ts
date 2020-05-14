/**
 * Events associated with the autocomplete
 */
export type EventType = string;
/**
 * @fileoverview Gmail-like AutoComplete logic.
 *
 * @see ../../demos/autocomplete-basic.html
 */
/**
 * This is the central manager class for an AutoComplete instance. The matcher
 * can specify disabled rows that should not be hilited or selected by
 * implementing <code>isRowDisabled(row):boolean</code> for each autocomplete
 * row. No row will be considered disabled if this method is not implemented.
 *
 *        <code>requestMatchingRows(token, maxMatches, matchCallback)</code>.
 *        <code>
 *          isVisible():boolean<br>
 *          renderRows(rows:Array, token:string, target:Element);<br>
 *          hiliteId(row-id:number);<br>
 *          dismiss();<br>
 *          dispose():
 *        </code>.
 *        <code>
 *          selectRow(row);<br>
 *          update(opt_force);
 *        </code>.
 *
 * @extends {EventsEventTarget}
 * @suppress {underscore}
 */
export class AutoComplete extends events.EventTarget {
    /**
     * This is the central manager class for an AutoComplete instance. The matcher
     * can specify disabled rows that should not be hilited or selected by
     * implementing <code>isRowDisabled(row):boolean</code> for each autocomplete
     * row. No row will be considered disabled if this method is not implemented.
     *
     * @param {?Object} matcher A data source and row matcher, implements
     *        <code>requestMatchingRows(token, maxMatches, matchCallback)</code>.
     * @param {?Renderer} renderer An object that implements
     *        <code>
     *          isVisible():boolean<br>
     *          renderRows(rows:Array, token:string, target:Element);<br>
     *          hiliteId(row-id:number);<br>
     *          dismiss();<br>
     *          dispose():
     *        </code>.
     * @param {?Object} selectionHandler An object that implements
     *        <code>
     *          selectRow(row);<br>
     *          update(opt_force);
     *        </code>.
     *
     * @suppress {underscore}
     */
    constructor(matcher: any | null, renderer: Renderer | null, selectionHandler: any | null);
    /**
     * The maximum number of matches that should be returned
     * @type {number}
     * @private
     */
    private maxMatches_;
    /**
     * True iff the first row should automatically be highlighted
     * @type {boolean}
     * @private
     */
    private autoHilite_;
    /**
     * True iff the user can unhilight all rows by pressing the up arrow.
     * @type {boolean}
     * @private
     */
    private allowFreeSelect_;
    /**
     * True iff item selection should wrap around from last to first. If
     *     allowFreeSelect_ is on in conjunction, there is a step of free selection
     *     before wrapping.
     * @type {boolean}
     * @private
     */
    private wrap_;
    /**
     * Whether completion from suggestion triggers fetching new suggestion.
     * @type {boolean}
     * @private
     */
    private triggerSuggestionsOnUpdate_;
    /**
     * A data-source which provides autocomplete suggestions.
     *
     * TODO(chrishenry): Tighten the type to !AutoComplete.Matcher.
     *
     * @type {?Object}
     * @protected
     * @suppress {underscore|visibility}
     */
    protected matcher_: any | null;
    /**
     * A handler which interacts with the input DOM element (textfield, textarea,
     * or richedit).
     *
     * TODO(chrishenry): Tighten the type to !Object.
     *
     * @type {?Object}
     * @protected
     * @suppress {underscore|visibility}
     */
    protected selectionHandler_: any | null;
    /**
     * A renderer to render/show/highlight/hide the autocomplete menu.
     * @type {?Renderer}
     * @protected
     * @suppress {underscore|visibility}
     */
    protected renderer_: Renderer | null;
    /**
     * Currently typed token which will be used for completion.
     * @type {?string}
     * @protected
     * @suppress {underscore|visibility}
     */
    protected token_: string | null;
    /**
     * Autocomplete suggestion items.
     * @type {Array<?>}
     * @protected
     * @suppress {underscore|visibility}
     */
    protected rows_: Array<unknown>;
    /**
     * Id of the currently highlighted row.
     * @type {number}
     * @protected
     * @suppress {underscore|visibility}
     */
    protected hiliteId_: number;
    /**
     * Id of the first row in autocomplete menu. Note that new ids are assigned
     * every time new suggestions are fetched.
     *
     * TODO(chrishenry): Figure out what subclass does with this value
     * and whether we should expose a more proper API.
     *
     * @type {number}
     * @protected
     * @suppress {underscore|visibility}
     */
    protected firstRowId_: number;
    /**
     * The target HTML node for displaying.
     * @type {Element|null}
     * @protected
     * @suppress {underscore|visibility}
     */
    protected target_: Element | null;
    /**
     * The timer id for dismissing autocomplete menu with a delay.
     * @type {?number}
     * @private
     */
    private dismissTimer_;
    /**
     * Mapping from text input element to the anchor element. If the
     * mapping does not exist, the input element will act as the anchor
     * element.
     * @type {Object<Element>}
     * @private
     */
    private inputToAnchorMap_;
    /**
     * @return {!Object} The data source providing the `autocomplete
     *     suggestions.
     */
    getMatcher(): any;
    /**
     * Sets the data source providing the autocomplete suggestions.
     *
     * See constructor documentation for the interface.
     *
     * @param {!Object} matcher The matcher.
     * @protected
     */
    protected setMatcher(matcher: any): void;
    /**
     * @return {!Object} The handler used to interact with the input DOM
     *     element (textfield, textarea, or richedit), e.g. to update the
     *     input DOM element with selected value.
     * @protected
     */
    protected getSelectionHandler(): any;
    /**
     * @return {?EventsEventTarget} The renderer that
     *     renders/shows/highlights/hides the autocomplete menu.
     *     See constructor documentation for the expected renderer API.
     */
    getRenderer(): EventsEventTarget | null;
    /**
     * Sets the renderer that renders/shows/highlights/hides the autocomplete
     * menu.
     *
     * See constructor documentation for the expected renderer API.
     *
     * @param {?Renderer} renderer The renderer.
     * @protected
     */
    protected setRenderer(renderer: Renderer | null): void;
    /**
     * @return {?string} The currently typed token used for completion.
     * @protected
     */
    protected getToken(): string | null;
    /**
     * Sets the current token (without changing the rendered autocompletion).
     *
     * NOTE(chrishenry): This method will likely go away when we figure
     * out a better API.
     *
     * @param {?string} token The new token.
     * @protected
     */
    protected setTokenInternal(token: string | null): void;
    /**
     * @param {number} index The suggestion index, must be within the
     *     interval [0, this.getSuggestionCount()).
     * @return {?Object} The currently suggested item at the given index
     *     (or null if there is none).
     */
    getSuggestion(index: number): any | null;
    /**
     * @return {!Array<?>} The current autocomplete suggestion items.
     */
    getAllSuggestions(): Array<unknown>;
    /**
     * @return {number} The number of currently suggested items.
     */
    getSuggestionCount(): number;
    /**
     * @return {number} The id (not index!) of the currently highlighted row.
     */
    getHighlightedId(): number;
    /**
     * Generic event handler that handles any events this object is listening to.
     * @param {?EventsEvent} e Event Object.
     */
    handleEvent(e: EventsEvent | null): void;
    /**
     * Sets the max number of matches to fetch from the Matcher.
     *
     * @param {number} max Max number of matches.
     */
    setMaxMatches(max: number): void;
    /**
     * Sets whether or not the first row should be highlighted by default.
     *
     * @param {boolean} autoHilite true iff the first row should be
     *      highlighted by default.
     */
    setAutoHilite(autoHilite: boolean): void;
    /**
     * Sets whether or not the up/down arrow can unhilite all rows.
     *
     * @param {boolean} allowFreeSelect true iff the up arrow can unhilite all rows.
     */
    setAllowFreeSelect(allowFreeSelect: boolean): void;
    /**
     * Sets whether or not selections can wrap around the edges.
     *
     * @param {boolean} wrap true iff sections should wrap around the edges.
     */
    setWrap(wrap: boolean): void;
    /**
     * Sets whether or not to request new suggestions immediately after completion
     * of a suggestion.
     *
     * @param {boolean} triggerSuggestionsOnUpdate true iff completion should fetch
     *     new suggestions.
     */
    setTriggerSuggestionsOnUpdate(triggerSuggestionsOnUpdate: boolean): void;
    /**
     * Sets the token to match against.  This triggers calls to the Matcher to
     * fetch the matches (up to maxMatches), and then it triggers a call to
     * <code>renderer.renderRows()</code>.
     *
     * @param {string} token The string for which to search in the Matcher.
     * @param {string=} opt_fullString Optionally, the full string in the input
     *     field.
     */
    setToken(token: string, opt_fullString?: string | undefined): void;
    /**
     * Gets the current target HTML node for displaying autocomplete UI.
     * @return {?Element} The current target HTML node for displaying autocomplete
     *     UI.
     */
    getTarget(): Element | null;
    /**
     * Sets the current target HTML node for displaying autocomplete UI.
     * Can be an implementation specific definition of how to display UI in relation
     * to the target node.
     * This target will be passed into  <code>renderer.renderRows()</code>
     *
     * @param {?Element} target The current target HTML node for displaying
     *     autocomplete UI.
     */
    setTarget(target: Element | null): void;
    /**
     * @return {boolean} Whether the autocomplete's renderer is open.
     */
    isOpen(): boolean;
    /**
     * @return {number} Number of rows in the autocomplete.
     * @deprecated Use this.getSuggestionCount().
     */
    getRowCount(): number;
    /**
     * Moves the hilite to the next non-disabled row.
     * Calls renderer.hiliteId() when there's something to do.
     * @return {boolean} Returns true on a successful hilite.
     */
    hiliteNext(): boolean;
    /**
     * Moves the hilite to the previous non-disabled row.  Calls
     * renderer.hiliteId() when there's something to do.
     * @return {boolean} Returns true on a successful hilite.
     */
    hilitePrev(): boolean;
    /**
     * Hilites the id if it's valid and the row is not disabled, otherwise does
     * nothing.
     * @param {number} id A row id (not index).
     * @return {boolean} Whether the id was hilited. Returns false if the row is
     *     disabled.
     */
    hiliteId(id: number): boolean;
    /**
     * Hilites the index, if it's valid and the row is not disabled, otherwise does
     * nothing.
     * @param {number} index The row's index.
     * @return {boolean} Whether the index was hilited.
     */
    hiliteIndex(index: number): boolean;
    /**
     * If there are any current matches, this passes the hilited row data to
     * <code>selectionHandler.selectRow()</code>
     * @return {boolean} Whether there are any current matches.
     */
    selectHilited(): boolean;
    /**
     * Returns whether or not the autocomplete is open and has a highlighted row.
     * @return {boolean} Whether an autocomplete row is highlighted.
     */
    hasHighlight(): boolean;
    /**
     * Clears out the token, rows, and hilite, and calls
     * <code>renderer.dismiss()</code>
     */
    dismiss(): void;
    /**
     * Call a dismiss after a delay, if there's already a dismiss active, ignore.
     */
    dismissOnDelay(): void;
    /**
     * Cancels any delayed dismiss events immediately.
     * @return {boolean} Whether a delayed dismiss was cancelled.
     * @private
     */
    private immediatelyCancelDelayedDismiss_;
    /**
     * Cancel the active delayed dismiss if there is one.
     */
    cancelDelayedDismiss(): void;
    /**
     * Callback passed to Matcher when requesting matches for a token.
     * This might be called synchronously, or asynchronously, or both, for
     * any implementation of a Matcher.
     * If the Matcher calls this back, with the same token this AutoComplete
     * has set currently, then this will package the matching rows in object
     * of the form
     * <pre>
     * {
     *   id: an integer ID unique to this result set and AutoComplete instance,
     *   data: the raw row data from Matcher
     * }
     * </pre>
     *
     * @param {string} matchedToken Token that corresponds with the rows.
     * @param {!Array<?>} rows Set of data that match the given token.
     * @param {(boolean|RenderOptions)=} opt_options If true,
     *     keeps the currently hilited (by index) element hilited. If false not.
     *     Otherwise a RenderOptions object.
     * @private
     */
    private matchListener_;
    /**
     * Renders the rows and adds highlighting.
     * @param {!Array<?>} rows Set of data that match the given token.
     * @param {(boolean|RenderOptions)=} opt_options If true,
     *     keeps the currently hilited (by index) element hilited. If false not.
     *     Otherwise a RenderOptions object.
     */
    renderRows(rows: Array<unknown>, opt_options?: (boolean | RenderOptions) | undefined): void;
    /**
     * Gets the index corresponding to a particular id.
     * @param {number} id A unique id for the row.
     * @return {number} A valid index into rows_, or -1 if the id is invalid.
     * @protected
     */
    protected getIndexOfId(id: number): number;
    /**
     * Gets the id corresponding to a particular index.  (Does no checking.)
     * @param {number} index The index of a row in the result set.
     * @return {number} The id that currently corresponds to that index.
     * @private
     */
    private getIdOfIndex_;
    /**
     * Attach text areas or input boxes to the autocomplete by DOM reference.  After
     * elements are attached to the autocomplete, when a user types they will see
     * the autocomplete drop down.
     * @param {...Element} var_args Variable args: Input or text area elements to
     *     attach the autocomplete too.
     */
    attachInputs(...args: Element[]): void;
    /**
     * Detach text areas or input boxes to the autocomplete by DOM reference.
     * @param {...Element} var_args Variable args: Input or text area elements to
     *     detach from the autocomplete.
     */
    detachInputs(...args: Element[]): void;
    /**
     * Attaches the autocompleter to a text area or text input element
     * with an anchor element. The anchor element is the element the
     * autocomplete box will be positioned against.
     * @param {?Element} inputElement The input element. May be 'textarea',
     *     text 'input' element, or any other element that exposes similar
     *     interface.
     * @param {?Element} anchorElement The anchor element.
     */
    attachInputWithAnchor(inputElement: Element | null, anchorElement: Element | null): void;
    /**
     * Forces an update of the display.
     * @param {boolean=} opt_force Whether to force an update.
     */
    update(opt_force?: boolean | undefined): void;
}
export namespace AutoComplete {
    export type Matcher = {
        requestMatchingRows: Function | undefined;
        isRowDisabled: Function | undefined;
    };
}
export namespace EventType {
    export const ROW_HILITE: string;
    export const HILITE: string;
    export const SELECT: string;
    export const DISMISS: string;
    export const CANCEL_DISMISS: string;
    export const UPDATE: string;
    export const SUGGESTIONS_UPDATE: string;
}
import * as events from "../../events/eventhandler.js";
import { Renderer } from "./renderer.js";
import { EventTarget as EventsEventTarget } from "../../events/eventhandler.js";
import { Event as EventsEvent } from "../../events/event.js";
import { RenderOptions } from "./renderoptions.js";
