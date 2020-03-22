/**
 * Class allowing different implementations to custom render the autocomplete.
 * Extending classes should override the render function.
 */
export class CustomRenderer {
    /**
     * Renders the autocomplete box. May be set to null.
     *
     * Because of the type, this function cannot be documented with param JSDoc.
     *
     * The function expects the following parameters:
     *
     * renderer, Renderer: The autocomplete renderer.
     * element, Element: The main element that controls the rendered autocomplete.
     * rows, Array: The current set of rows being displayed.
     * token, string: The current token that has been entered. *
     *
     * @param {?Renderer} renderer
     * @param {?Element} element
     * @param {?Array} rows
     * @param {string} token
     */
    render(renderer: Renderer | null, element: Element | null, rows: any[] | null, token: string): void;
    /**
     * Generic function that takes a row and renders a DOM structure for that row.
     * @param {?Object} row Object representing row.
     * @param {string} token Token to highlight.
     * @param {?Node} node The node to render into.
     */
    renderRow(row: any, token: string, node: Node | null): void;
}
/**
 * @fileoverview Class for rendering the results of an auto complete and
 * allow the user to select an row.
 */
/**
 * Class for rendering the results of an auto-complete in a drop down list.
 *
 *     that will hold the autocomplete elements. goog_dom.getDocument().body
 *     will be used if this is null.
 *     render each row. Should be something with a renderRow or render method.
 *     be right aligned. False by default.
 *     highlighting should be applied to each row of data. Standard highlighting
 *     bolds every matching substring for a given token in each row. True by
 *     default.
 * @extends {EventsEventTarget}
 * @suppress {underscore}
 */
export class Renderer extends goog_events.EventTarget {
    /**
     * Class for rendering the results of an auto-complete in a drop down list.
     *
     * @param {Element=} opt_parentNode optional reference to the parent element
     *     that will hold the autocomplete elements. goog_dom.getDocument().body
     *     will be used if this is null.
     * @param {?({renderRow}|{render})=} opt_customRenderer Custom full renderer to
     *     render each row. Should be something with a renderRow or render method.
     * @param {boolean=} opt_rightAlign Determines if the autocomplete will always
     *     be right aligned. False by default.
     * @param {boolean=} opt_useStandardHighlighting Determines if standard
     *     highlighting should be applied to each row of data. Standard highlighting
     *     bolds every matching substring for a given token in each row. True by
     *     default.
     * @suppress {underscore}
     */
    constructor(opt_parentNode?: Element | undefined, opt_customRenderer?: {
        renderRow: any;
    } | {
        render: any;
    } | null | undefined, opt_rightAlign?: boolean | undefined, opt_useStandardHighlighting?: boolean | undefined);
    /**
     * The anchor element to position the rendered autocompleter against.
     * @type {?Element}
     * @private
     */
    anchorElement_: Element | null;
    /**
     * The anchor element to position the rendered autocompleter against.
     * @protected
      * @type {?Element|undefined}
     */
    target_: (Element | undefined) | null;
    /**
     * The element on which to base the width of the autocomplete.
     * @protected
      * @type {?Node}
     */
    widthProvider_: Node | null;
    /**
     * The element on which to base the max width of the autocomplete.
     * @protected
      * @type {!Node|undefined}
     */
    maxWidthProvider_: Node | undefined;
    /**
     * The border width of the autocomplete dropdown, only used in calculating the
     * dropdown width.
     * @private
      * @type {number}
     */
    borderWidth_: number;
    /**
     * A flag used to make sure we highlight only one match in the rendered row.
     * @private
      * @type {boolean|null}
     */
    wasHighlightedAtLeastOnce_: boolean | null;
    /**
     * Reference to the parent element that will hold the autocomplete elements
     * @type {?Element}
     * @private
     */
    parent_: Element | null;
    /**
     * Dom helper for the parent element's document.
     * @type {?DomHelper}
     * @private
     */
    dom_: DomHelper | null;
    /**
     * Whether to reposition the autocomplete UI below the target node
     * @type {boolean}
     * @private
     */
    reposition_: boolean;
    /**
     * Reference to the main element that controls the rendered autocomplete
     * @type {Element|null}
     * @private
     */
    element_: Element | null;
    /**
     * The current token that has been entered
     * @type {string}
     * @private
     */
    token_: string;
    /**
     * Array used to store the current set of rows being displayed
     * @type {Array<!Object>}
     * @private
     */
    rows_: Array<Object>;
    /**
     * Array of the node divs that hold each result that is being displayed.
     * @type {Array<Element>}
     * @protected
     * @suppress {underscore|visibility}
     */
    rowDivs_: Array<Element>;
    /**
     * The index of the currently highlighted row
     * @type {number}
     * @protected
     * @suppress {underscore|visibility}
     */
    hilitedRow_: number;
    /**
     * The time that the rendering of the menu rows started
     * @type {number}
     * @protected
     * @suppress {underscore|visibility}
     */
    startRenderingRows_: number;
    /**
     * Store the current state for the renderer
     * @type {boolean}
     * @private
     */
    visible_: boolean;
    /**
     * Classname for the main element.  This must be a single valid class name.
     * @type {string}
     */
    className: string;
    /**
     * Classname for row divs.  This must be a single valid class name.
     * @type {string}
     */
    rowClassName: string;
    /**
     * The old class name for active row.  This name is deprecated because its
     * name is generic enough that a typical implementation would require a
     * descendant selector.
     * Active row will have rowClassName & activeClassName &
     * legacyActiveClassName.
     * @type {string}
     * @private
     */
    legacyActiveClassName_: string;
    /**
     * Class name for active row div.  This must be a single valid class name.
     * Active row will have rowClassName & activeClassName &
     * legacyActiveClassName.
     * @type {string}
     */
    activeClassName: string;
    /**
     * Class name for the bold tag highlighting the matched part of the text.
     * @type {string}
     */
    highlightedClassName: string;
    /**
     * Custom full renderer
     * @type {?({renderRow}|{render})}
     * @private
     */
    customRenderer_: any;
    /**
     * Flag to indicate whether standard highlighting should be applied.
     * this is set to true if left unspecified to retain existing
     * behaviour for autocomplete clients
     * @type {boolean}
     * @private
     */
    useStandardHighlighting_: boolean;
    /**
     * Flag to indicate whether matches should be done on whole words instead
     * of any string.
     * @type {boolean}
     * @private
     */
    matchWordBoundary_: boolean;
    /**
     * Flag to set all tokens as highlighted in the autocomplete row.
     * @type {boolean}
     * @private
     */
    highlightAllTokens_: boolean;
    /**
     * Determines if the autocomplete will always be right aligned
     * @type {boolean}
     * @private
     */
    rightAlign_: boolean;
    /**
     * Whether to align with top of target field
     * @type {boolean}
     * @private
     */
    topAlign_: boolean;
    /**
     * Duration (in msec) of fade animation when menu is shown/hidden.
     * Setting to 0 (default) disables animation entirely.
     * @type {number}
     * @private
     */
    menuFadeDuration_: number;
    /**
     * Whether we should limit the dropdown from extending past the bottom of the
     * screen and instead show a scrollbar on the dropdown.
     * @type {boolean}
     * @private
     */
    showScrollbarsIfTooLarge_: boolean;
    /**
     * Animation in progress, if any.
     * @type {Animation|undefined}
     */
    animation_: Animation | undefined;
    /**
     * Gets the renderer's element.
     * @return {?Element} The  main element that controls the rendered autocomplete.
     */
    getElement(): Element | null;
    /**
     * Sets the width provider element. The provider is only used on redraw and as
     * such will not automatically update on resize.
     * @param {?Node} widthProvider The element whose width should be mirrored.
     * @param {number=} opt_borderWidth The width of the border of the autocomplete,
     *     which will be subtracted from the width of the autocomplete dropdown.
     * @param {!Node=} maxWidthProvider The element whose width should be used
     *     as the autocomplete's max width.
     */
    setWidthProvider(widthProvider: Node | null, opt_borderWidth?: number | undefined, maxWidthProvider?: Node | undefined): void;
    /**
     * Set whether to align autocomplete to top of target element
     * @param {boolean} align If true, align to top.
     */
    setTopAlign(align: boolean): void;
    /**
     * @return {boolean} Whether we should be aligning to the top of
     *     the target element.
     */
    getTopAlign(): boolean;
    /**
     * Set whether to align autocomplete to the right of the target element.
     * @param {boolean} align If true, align to right.
     */
    setRightAlign(align: boolean): void;
    /**
     * @return {boolean} Whether the autocomplete menu should be right aligned.
     */
    getRightAlign(): boolean;
    /**
     * @param {boolean} show Whether we should limit the dropdown from extending
     *     past the bottom of the screen and instead show a scrollbar on the
     *     dropdown.
     */
    setShowScrollbarsIfTooLarge(show: boolean): void;
    /**
     * Set whether or not standard highlighting should be used when rendering rows.
     * @param {boolean} useStandardHighlighting true if standard highlighting used.
     */
    setUseStandardHighlighting(useStandardHighlighting: boolean): void;
    /**
     * @param {boolean} matchWordBoundary Determines whether matches should be
     *     higlighted only when the token matches text at a whole-word boundary.
     *     True by default.
     */
    setMatchWordBoundary(matchWordBoundary: boolean): void;
    /**
     * Set whether or not to highlight all matching tokens rather than just the
     * first.
     * @param {boolean} highlightAllTokens Whether to highlight all matching tokens
     *     rather than just the first.
     */
    setHighlightAllTokens(highlightAllTokens: boolean): void;
    /**
     * Sets the duration (in msec) of the fade animation when menu is shown/hidden.
     * Setting to 0 (default) disables animation entirely.
     * @param {number} duration Duration (in msec) of the fade animation (or 0 for
     *     no animation).
     */
    setMenuFadeDuration(duration: number): void;
    /**
     * Sets the anchor element for the subsequent call to renderRows.
     * @param {?Element} anchor The anchor element.
     */
    setAnchorElement(anchor: Element | null): void;
    /**
     * @return {?Element} The anchor element.
     * @protected
     */
    getAnchorElement(): Element | null;
    /**
     * Render the autocomplete UI
     *
     * @param {Array<!Object>} rows Matching UI rows.
     * @param {string} token Token we are currently matching against.
     * @param {Element=} opt_target Current HTML node, will position popup beneath
     *     this node.
     */
    renderRows(rows: any[], token: string, opt_target?: Element | undefined): void;
    /**
     * Hide the object.
     */
    dismiss(): void;
    /**
     * Show the object.
     */
    show(): void;
    /**
     * Toggle the ARIA markup to add popup semantics when the target is shown and
     * to remove them when it is hidden.
     * @param {boolean} isShown Whether the menu is being shown.
     * @private
     */
    toggleAriaMarkup_(isShown: boolean): void;
    /**
     * @return {boolean} True if the object is visible.
     */
    isVisible(): boolean;
    /**
     * Sets the 'active' class of the nth item.
     * @param {number} index Index of the item to highlight.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    hiliteRow(index: number): void;
    /**
     * Removes the 'active' class from the currently selected row.
     */
    hiliteNone(): void;
    /**
     * Sets the 'active' class of the item with a given id.
     * @param {number} id Id of the row to hilight. If id is -1 then no rows get
     *     hilited.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    hiliteId(id: number): void;
    /**
     * Sets CSS classes on autocomplete conatainer element.
     *
     * @param {?Element} elem The container element.
     * @private
     */
    setMenuClasses_(elem: Element | null): void;
    /**
     * If the main HTML element hasn't been made yet, creates it and appends it
     * to the parent.
     * @private
     */
    maybeCreateElement_(): void;
    /**
     * Redraw (or draw if this is the first call) the rendered auto-complete drop
     * down.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    redraw(): void;
    /**
     * @return {?Corner} The anchor corner to position the popup at.
     * @protected
     */
    getAnchorCorner(): goog_positioning.Corner | null;
    /**
     * Repositions the auto complete popup relative to the location node, if it
     * exists and the auto position has been set.
     */
    reposition(): void;
    /**
     * Sets whether the renderer should try to determine where to position the
     * drop down.
     * @param {boolean} auto Whether to autoposition the drop down.
     */
    setAutoPosition(auto: boolean): void;
    /**
     * @return {boolean} Whether the drop down will be autopositioned.
     * @protected
     */
    getAutoPosition(): boolean;
    /**
     * @return {?Element} The target element.
     * @protected
     */
    getTarget(): Element | null;
    /**
     * Generic function that takes a row and renders a DOM structure for that row.
     *
     * Normally this will only be matching a maximum of 20 or so items.  Even with
     * 40 rows, DOM this building is fine.
     * @param {?Object} row Object representing row.
     * @param {string} token Token to highlight.
     * @param {?Node} node The node to render into.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    renderRowContents_(row: any, token: string, node: Node | null): void;
    /**
     * Goes through a node and all of its child nodes, replacing HTML text that
     * matches a token with <b>token</b>.
     * The replacement will happen on the first match or all matches depending on
     * this.highlightAllTokens_ value.
     *
     * @param {?Node} node Node to match.
     * @param {string|Array<string>} tokenOrArray Token to match or array of tokens
     *     to match.  By default, only the first match will be highlighted.  If
     *     highlightAllTokens is set, then all tokens appearing at the start of a
     *     word, in whatever order and however many times, will be highlighted.
     * @private
     */
    startHiliteMatchingText_(node: Node | null, tokenOrArray: string | string[]): void;
    /**
     * @param {?Node} node Node to match.
     * @param {string|Array<string>} tokenOrArray Token to match or array of tokens
     *     to match.
     * @private
     */
    hiliteMatchingText_(node: Node | null, tokenOrArray: string | string[]): void;
    /**
     * Transforms a token into a string ready to be put into the regular expression
     * in hiliteMatchingText_.
     * @param {string|Array<string>} tokenOrArray The token or array to get the
     *     regex string from.
     * @return {string} The regex-ready token.
     * @suppress{checkTypes}
     * @private
     */
    getTokenRegExp_(tokenOrArray: string | string[]): string;
    /**
     * Render a row by creating a div and then calling row rendering callback or
     * default row handler
     *
     * @param {?Object} row Object representing row.
     * @param {string} token Token to highlight.
     * @return {!Element} An element with the rendered HTML.
     */
    renderRowHtml(row: any, token: string): Element;
    /**
     * Given an event target looks up through the parents till it finds a div.  Once
     * found it will then look to see if that is one of the childnodes, if it is
     * then the index is returned, otherwise -1 is returned.
     * @param {?Element} et HtmlElement.
     * @return {number} Index corresponding to event target.
     * @private
     */
    getRowFromEventTarget_(et: Element | null): number;
    /**
     * Handle the click events.  These are redirected to the AutoComplete object
     * which then makes a callback to select the correct row.
     * @param {?EventsEvent} e Browser event object.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleClick_(e: EventsEvent | null): void;
    /**
     * Handle the mousedown event and prevent the AC from losing focus.
     * @param {?EventsEvent} e Browser event object.
     * @private
     */
    handleMouseDown_(e: EventsEvent | null): void;
    /**
     * Handle the mousing events.  These are redirected to the AutoComplete object
     * which then makes a callback to set the correctly highlighted row.  This is
     * because the AutoComplete can move the focus as well, and there is no sense
     * duplicating the code
     * @param {?EventsEvent} e Browser event object.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleMouseOver_(e: EventsEvent | null): void;
    actualEventTarget_: Renderer;
}
export namespace Renderer {
    export const DELAY_BEFORE_MOUSEOVER: number;
}
import * as goog_events from "../../events/eventhandler.js";
import { DomHelper } from "../../dom/dom.js";
import { Animation } from "../../fx/animation.js";
import * as goog_positioning from "../../positioning/positioning.js";
import { Event as EventsEvent } from "../../events/event.js";
