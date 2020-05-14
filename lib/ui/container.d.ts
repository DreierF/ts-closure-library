/**
 * *
 */
export type EventType = string;
/**
 * Container orientation constants.
 */
export type Orientation = string;
/**
 * @fileoverview Base class for containers that host {@link Control}s,
 * such as menus and toolbars.  Provides default keyboard and mouse event
 * handling and child management, based on a generalized version of
 * {@link goog.ui.Menu}.
 *
 * @see ../demos/container.html
 */
/**
 * Base class for containers.  Extends {@link Ui_Component} by adding
 * the following:
 *  <ul>
 *    <li>a {@link KeyHandler}, to simplify keyboard handling,
 *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
 *        containers without the need to subclass this class,
 *    <li>methods to manage child controls hosted in the container,
 *    <li>default mouse and keyboard event handling methods.
 *  </ul>
 *     orientation; defaults to `VERTICAL`.
 *     decorate the container; defaults to {@link ContainerRenderer}.
 *     interaction.
 * @extends {Ui_Component}
 * @template T
 */
export class Container<T> extends Ui_Component {
    /**
     * Base class for containers.  Extends {@link Ui_Component} by adding
     * the following:
     *  <ul>
     *    <li>a {@link KeyHandler}, to simplify keyboard handling,
     *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
     *        containers without the need to subclass this class,
     *    <li>methods to manage child controls hosted in the container,
     *    <li>default mouse and keyboard event handling methods.
     *  </ul>
     * @param {?Orientation=} opt_orientation Container
     *     orientation; defaults to `VERTICAL`.
     * @param {T=} opt_renderer Renderer used to render or
     *     decorate the container; defaults to {@link ContainerRenderer}.
     * @param {DomHelper=} opt_domHelper DOM helper, used for document
     *     interaction.
     * @template T
     */
    constructor(opt_orientation?: (Orientation | null) | undefined, opt_renderer?: T | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * Allows an alternative element to be set to receive key events, otherwise
     * defers to the renderer's element choice.
     * @type {?Element|undefined}
     * @private
     */
    private keyEventTarget_;
    /**
     * Keyboard event handler.
     * @type {KeyHandler?}
     * @private
     */
    private keyHandler_;
    /**
     * Whether the container is set to be visible.  Defaults to true.
     * @type {boolean}
     * @private
     */
    private visible_;
    /**
     * Whether the container is enabled and reacting to keyboard and mouse events.
     * Defaults to true.
     * @type {boolean}
     * @private
     */
    private enabled_;
    /**
     * Whether the container supports keyboard focus.  Defaults to true.  Focusable
     * containers have a `tabIndex` and can be navigated to via the keyboard.
     * @type {boolean}
     * @private
     */
    private focusable_;
    /**
     * The 0-based index of the currently highlighted control in the container
     * (-1 if none).
     * @type {number}
     * @private
     */
    private highlightedIndex_;
    /**
     * The currently open (expanded) control in the container (null if none).
     * @type {Control?}
     * @private
     */
    private openItem_;
    /**
     * Whether the mouse button is held down.  Defaults to false.  This flag is set
     * when the user mouses down over the container, and remains set until they
     * release the mouse button.
     * @type {boolean}
     * @private
     */
    private mouseButtonPressed_;
    /**
     * Whether focus of child components should be allowed.  Only effective if
     * focusable_ is set to false.
     * @type {boolean}
     * @private
     */
    private allowFocusableChildren_;
    /**
     * Whether highlighting a child component should also open it.
     * @type {boolean}
     * @private
     */
    private openFollowsHighlight_;
    /**
     * Map of DOM IDs to child controls.  Each key is the DOM ID of a child
     * control's root element; each value is a reference to the child control
     * itself.  Used for looking up the child control corresponding to a DOM
     * node in O(1) time.
     * @type {?Object}
     * @private
     */
    private childElementIdMap_;
    /**
     * Renderer for the container.  Defaults to {@link ContainerRenderer}.
     * @type {T|undefined}
     * @private
     */
    private renderer_;
    /**
     * Container orientation; determines layout and default keyboard navigation.
     * @type {?Orientation}
     * @private
     */
    private orientation_;
    /**
     * Returns the DOM element on which the container is listening for keyboard
     * events (null if none).
     * @return {?Element} Element on which the container is listening for key
     *     events.
     */
    getKeyEventTarget(): Element | null;
    /**
     * Attaches an element on which to listen for key events.
     * @param {?Element|undefined} element The element to attach, or null/undefined
     *     to attach to the default element.
     */
    setKeyEventTarget(element: (Element | undefined) | null): void;
    /**
     * Returns the keyboard event handler for this container, lazily created the
     * first time this method is called.  The keyboard event handler listens for
     * keyboard events on the container's key event target, as determined by its
     * renderer.
     * @return {!KeyHandler} Keyboard event handler for this container.
     */
    getKeyHandler(): KeyHandler;
    /**
     * Returns the renderer used by this container to render itself or to decorate
     * an existing element.
     * @return {T} Renderer used by the container.
     */
    getRenderer(): T;
    /**
     * Registers the given renderer with the container.  Changing renderers after
     * the container has already been rendered or decorated is an error.
     * @param {T} renderer Renderer used by the container.
     */
    setRenderer(renderer: T): void;
    /**
     * @param {!EventsBrowserEvent} e Event to handle.
     * @private
     */
    private preventPointerCapture_;
    /**
     * Sets up listening for events applicable to focusable containers.
     * @param {boolean} enable Whether to enable or disable focus handling.
     * @private
     */
    private enableFocusHandling_;
    /**
     * Handles ENTER events raised by child controls when they are navigated to.
     * @param {?EventsEvent} e ENTER event to handle.
     * @return {boolean} Whether to prevent handleMouseOver from handling
     *    the event.
     */
    handleEnterItem(e: EventsEvent | null): boolean;
    /**
     * Handles HIGHLIGHT events dispatched by items in the container when
     * they are highlighted.
     * @param {?EventsEvent} e Highlight event to handle.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleHighlightItem(e: EventsEvent | null): void;
    /**
     * Handles UNHIGHLIGHT events dispatched by items in the container when
     * they are unhighlighted.
     * @param {?EventsEvent} e Unhighlight event to handle.
     */
    handleUnHighlightItem(e: EventsEvent | null): void;
    /**
     * Handles OPEN events dispatched by items in the container when they are
     * opened.
     * @param {?EventsEvent} e Open event to handle.
     */
    handleOpenItem(e: EventsEvent | null): void;
    /**
     * Handles CLOSE events dispatched by items in the container when they are
     * closed.
     * @param {?EventsEvent} e Close event to handle.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleCloseItem(e: EventsEvent | null): void;
    /**
     * Handles mousedown events over the container.  The default implementation
     * sets the "mouse button pressed" flag and, if the container is focusable,
     * grabs keyboard focus.
     * @param {?EventsBrowserEvent} e Mousedown event to handle.
     */
    handleMouseDown(e: EventsBrowserEvent | null): void;
    /**
     * Handles mouseup events over the document.  The default implementation
     * clears the "mouse button pressed" flag.
     * @param {?EventsBrowserEvent} e Mouseup event to handle.
     */
    handleDocumentMouseUp(e: EventsBrowserEvent | null): void;
    /**
     * Handles mouse events originating from nodes belonging to the controls hosted
     * in the container.  Locates the child control based on the DOM node that
     * dispatched the event, and forwards the event to the control for handling.
     * @param {?EventsBrowserEvent} e Mouse event to handle.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleChildMouseEvents(e: EventsBrowserEvent | null): void;
    /**
     * Returns the child control that owns the given DOM node, or null if no such
     * control is found.
     * @param {?Node} node DOM node whose owner is to be returned.
     * @return {Control?} Control hosted in the container to which the node
     *     belongs (if found).
     * @protected
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    protected getOwnerControl(node: Node | null): Control | null;
    /**
     * Handles focus events raised when the container's key event target receives
     * keyboard focus.
     * @param {?EventsBrowserEvent} e Focus event to handle.
     */
    handleFocus(e: EventsBrowserEvent | null): void;
    /**
     * Handles blur events raised when the container's key event target loses
     * keyboard focus.  The default implementation clears the highlight index.
     * @param {?EventsBrowserEvent} e Blur event to handle.
     */
    handleBlur(e: EventsBrowserEvent | null): void;
    /**
     * Attempts to handle a keyboard event, if the control is enabled, by calling
     * {@link handleKeyEventInternal}.  Considered protected; should only be used
     * within this package and by subclasses.
     * @param {?KeyEvent} e Key event to handle.
     * @return {boolean} Whether the key event was handled.
     */
    handleKeyEvent(e: KeyEvent | null): boolean;
    /**
     * Attempts to handle a keyboard event; returns true if the event was handled,
     * false otherwise.  If the container is enabled, and a child is highlighted,
     * calls the child control's `handleKeyEvent` method to give the control
     * a chance to handle the event first.
     * @param {?KeyEvent} e Key event to handle.
     * @return {boolean} Whether the event was handled by the container (or one of
     *     its children).
     */
    handleKeyEventInternal(e: KeyEvent | null): boolean;
    /**
     * Creates a DOM ID for the child control and registers it to an internal
     * hash table to be able to find it fast by id.
     * @param {?Ui_Component} child The child control. Its root element has
     *     to be created yet.
     * @private
     */
    private registerChildId_;
    /**
     * Updates the highlighted index when children are added or moved.
     * @param {number} fromIndex Index of the child before it was moved, or -1 if
     *     the child was added.
     * @param {number} toIndex Index of the child after it was moved or added.
     * @private
     */
    private updateHighlightedIndex_;
    /**
     * Returns the container's orientation.
     * @return {?Orientation} Container orientation.
     */
    getOrientation(): Orientation | null;
    /**
     * Returns true if the container's visibility is set to visible, false if
     * it is set to hidden.  A container that is set to hidden is guaranteed
     * to be hidden from the user, but the reverse isn't necessarily true.
     * A container may be set to visible but can otherwise be obscured by another
     * element, rendered off-screen, or hidden using direct CSS manipulation.
     * @return {boolean} Whether the container is set to be visible.
     */
    isVisible(): boolean;
    /**
     * Shows or hides the container.  Does nothing if the container already has
     * the requested visibility.  Otherwise, dispatches a SHOW or HIDE event as
     * appropriate, giving listeners a chance to prevent the visibility change.
     * @param {boolean} visible Whether to show or hide the container.
     * @param {boolean=} opt_force If true, doesn't check whether the container
     *     already has the requested visibility, and doesn't dispatch any events.
     * @return {boolean} Whether the visibility was changed.
     */
    setVisible(visible: boolean, opt_force?: boolean | undefined): boolean;
    /**
     * Returns true if the container is enabled, false otherwise.
     * @return {boolean} Whether the container is enabled.
     */
    isEnabled(): boolean;
    /**
     * Enables/disables the container based on the `enable` argument.
     * Dispatches an `ENABLED` or `DISABLED` event prior to changing
     * the container's state, which may be caught and canceled to prevent the
     * container from changing state.  Also enables/disables child controls.
     * @param {boolean} enable Whether to enable or disable the container.
     */
    setEnabled(enable: boolean): void;
    /**
     * Returns true if the container is focusable, false otherwise.  The default
     * is true.  Focusable containers always have a tab index and allocate a key
     * handler to handle keyboard events while focused.
     * @return {boolean} Whether the component is focusable.
     */
    isFocusable(): boolean;
    /**
     * Sets whether the container is focusable.  The default is true.  Focusable
     * containers always have a tab index and allocate a key handler to handle
     * keyboard events while focused.
     * @param {boolean} focusable Whether the component is to be focusable.
     */
    setFocusable(focusable: boolean): void;
    /**
     * Returns true if the container allows children to be focusable, false
     * otherwise.  Only effective if the container is not focusable.
     * @return {boolean} Whether children should be focusable.
     */
    isFocusableChildrenAllowed(): boolean;
    /**
     * Sets whether the container allows children to be focusable, false
     * otherwise.  Only effective if the container is not focusable.
     * @param {boolean} focusable Whether the children should be focusable.
     */
    setFocusableChildrenAllowed(focusable: boolean): void;
    /**
     * @return {boolean} Whether highlighting a child component should also open it.
     */
    isOpenFollowsHighlight(): boolean;
    /**
     * Sets whether highlighting a child component should also open it.
     * @param {boolean} follow Whether highlighting a child component also opens it.
     */
    setOpenFollowsHighlight(follow: boolean): void;
    /**
     * Returns the index of the currently highlighted item (-1 if none).
     * @return {number} Index of the currently highlighted item.
     */
    getHighlightedIndex(): number;
    /**
     * Highlights the item at the given 0-based index (if any).  If another item
     * was previously highlighted, it is un-highlighted.
     * @param {number} index Index of item to highlight (-1 removes the current
     *     highlight).
     */
    setHighlightedIndex(index: number): void;
    /**
     * Highlights the given item if it exists and is a child of the container;
     * otherwise un-highlights the currently highlighted item.
     * @param {?Control} item Item to highlight.
     */
    setHighlighted(item: Control | null): void;
    /**
     * Returns the currently highlighted item (if any).
     * @return {Control?} Highlighted item (null if none).
     */
    getHighlighted(): Control | null;
    /**
     * Highlights the first highlightable item in the container
     */
    highlightFirst(): void;
    /**
     * Highlights the last highlightable item in the container.
     */
    highlightLast(): void;
    /**
     * Highlights the next highlightable item (or the first if nothing is currently
     * highlighted).
     */
    highlightNext(): void;
    /**
     * Highlights the previous highlightable item (or the last if nothing is
     * currently highlighted).
     */
    highlightPrevious(): void;
    /**
     * Helper function that manages the details of moving the highlight among
     * child controls in response to keyboard events.
     * @param {function(this: Container, number, number) : number} fn
     *     Function that accepts the current and maximum indices, and returns the
     *     next index to check.
     * @param {number} startIndex Start index.
     * @return {boolean} Whether the highlight has changed.
     * @protected
     */
    protected highlightHelper(fn: (args: Container, arg1: number, arg2: number) => number, startIndex: number): boolean;
    /**
     * Returns whether the given item can be highlighted.
     * @param {?Control} item The item to check.
     * @return {boolean} Whether the item can be highlighted.
     * @protected
     */
    protected canHighlightItem(item: Control | null): boolean;
    /**
     * Helper method that sets the highlighted index to the given index in response
     * to a keyboard event.  The base class implementation simply calls the
     * {@link #setHighlightedIndex} method, but subclasses can override this
     * behavior as needed.
     * @param {number} index Index of item to highlight.
     * @protected
     */
    protected setHighlightedIndexFromKeyEvent(index: number): void;
    /**
     * Returns the currently open (expanded) control in the container (null if
     * none).
     * @return {Control?} The currently open control.
     */
    getOpenItem(): Control | null;
    /**
     * Returns true if the mouse button is pressed, false otherwise.
     * @return {boolean} Whether the mouse button is pressed.
     */
    isMouseButtonPressed(): boolean;
    /**
     * Sets or clears the "mouse button pressed" flag.
     * @param {boolean} pressed Whether the mouse button is presed.
     */
    setMouseButtonPressed(pressed: boolean): void;
    setOrientation(orientation: Orientation | null): void;
}
/**
 * @fileoverview Base class for container renderers.
 */
/**
 * Default renderer for {@link Container}.  Can be used as-is, but
 * subclasses of Container will probably want to use renderers specifically
 * tailored for them by extending this class.
 */
export class ContainerRenderer {
    /** @return {!ContainerRenderer} @suppress {checkTypes} */
    static getInstance(): ContainerRenderer;
    /**
     * Constructs a new renderer and sets the CSS class that the renderer will use
     * as the base CSS class to apply to all elements rendered by that renderer.
     * An example to use this function using a menu is:
     *
     * <pre>
     * var myCustomRenderer = ContainerRenderer.getCustomRenderer(
     *     goog.ui.MenuRenderer, 'my-special-menu');
     * var newMenu = new goog.ui.Menu(opt_domHelper, myCustomRenderer);
     * </pre>
     *
     * Your styles for the menu can now be:
     * <pre>
     * .my-special-menu { }
     * </pre>
     *
     * <em>instead</em> of
     * <pre>
     * .CSS_MY_SPECIAL_MENU .goog-menu { }
     * </pre>
     *
     * You would want to use this functionality when you want an instance of a
     * component to have specific styles different than the other components of the
     * same type in your application.  This avoids using descendant selectors to
     * apply the specific styles to this component.
     *
     * @param {?Function} ctor The constructor of the renderer you want to create.
     * @param {string} cssClassName The name of the CSS class for this renderer.
     * @return {?ContainerRenderer} An instance of the desired renderer with
     *     its getCssClass() method overridden to return the supplied custom CSS
     *     class name.
     */
    static getCustomRenderer(ctor: Function | null, cssClassName: string): ContainerRenderer | null;
    /**
     * Default renderer for {@link Container}.  Can be used as-is, but
     * subclasses of Container will probably want to use renderers specifically
     * tailored for them by extending this class.
     * @param {string=} opt_ariaRole Optional ARIA role used for the element.
     */
    constructor(opt_ariaRole?: string | undefined);
    /** @private {string|undefined} */
    private ariaRole_;
    /**
     * Returns the ARIA role to be applied to the container.
     * See http://wiki/Main/ARIA for more info.
     * @return {undefined|string} ARIA role.
     */
    getAriaRole(): undefined | string;
    /**
     * Enables or disables the tab index of the element.  Only elements with a
     * valid tab index can receive focus.
     * @param {?Element} element Element whose tab index is to be changed.
     * @param {boolean} enable Whether to add or remove the element's tab index.
     */
    enableTabIndex(element: Element | null, enable: boolean): void;
    /**
     * Creates and returns the container's root element.  The default
     * simply creates a DIV and applies the renderer's own CSS class name to it.
     * To be overridden in subclasses.
     * @param {?Container} container Container to render.
     * @return {?Element} Root element for the container.
     */
    createDom(container: Container | null): Element | null;
    /**
     * Returns the DOM element into which child components are to be rendered,
     * or null if the container hasn't been rendered yet.
     * @param {?Element} element Root element of the container whose content element
     *     is to be returned.
     * @return {?Element} Element to contain child elements (null if none).
     */
    getContentElement(element: Element | null): Element | null;
    /**
     * Default implementation of `canDecorate`; returns true if the element
     * is a DIV, false otherwise.
     * @param {?Element} element Element to decorate.
     * @return {boolean} Whether the renderer can decorate the element.
     */
    canDecorate(element: Element | null): boolean;
    /**
     * Default implementation of `decorate` for {@link Container}s.
     * Decorates the element with the container, and attempts to decorate its child
     * elements.  Returns the decorated element.
     * @param {?Container} container Container to decorate the element.
     * @param {?Element} element Element to decorate.
     * @return {!Element} Decorated element.
     */
    decorate(container: Container | null, element: Element | null): Element;
    /**
     * Sets the container's state based on the given CSS class name, encountered
     * during decoration.  CSS class names that don't represent container states
     * are ignored.  Considered protected; subclasses should override this method
     * to support more states and CSS class names.
     * @param {?Container} container Container to update.
     * @param {string} className CSS class name.
     * @param {string} baseClass Base class name used as the root of state-specific
     *     class names (typically the renderer's own class name).
     * @protected
     * @suppress {missingRequire} Container
     */
    protected setStateFromClassName(container: Container | null, className: string, baseClass: string): void;
    /**
     * Takes a container and an element that may contain child elements, decorates
     * the child elements, and adds the corresponding components to the container
     * as child components.  Any non-element child nodes (e.g. empty text nodes
     * introduced by line breaks in the HTML source) are removed from the element.
     * @param {?Container} container Container whose children are to be
     *     discovered.
     * @param {?Element} element Element whose children are to be decorated.
     * @param {?Element=} opt_firstChild the first child to be decorated.
     */
    decorateChildren(container: Container | null, element: Element | null, opt_firstChild?: (Element | null) | undefined): void;
    /**
     * Inspects the element, and creates an instance of {@link Control} or
     * an appropriate subclass best suited to decorate it.  Returns the control (or
     * null if no suitable class was found).  This default implementation uses the
     * element's CSS class to find the appropriate control class to instantiate.
     * May be overridden in subclasses.
     * @param {?Element} element Element to decorate.
     * @return {Control?} A new control suitable to decorate the element
     *     (null if none).
     */
    getDecoratorForChild(element: Element | null): Control | null;
    /**
     * Initializes the container's DOM when the container enters the document.
     * Called from {@link Container#enterDocument}.
     * @param {?Container} container Container whose DOM is to be initialized
     *     as it enters the document.
     */
    initializeDom(container: Container | null): void;
    /**
     * Returns the element within the container's DOM that should receive keyboard
     * focus (null if none).  The default implementation returns the container's
     * root element.
     * @param {?Container} container Container whose key event target is
     *     to be returned.
     * @return {?Element} Key event target (null if none).
     */
    getKeyEventTarget(container: Container | null): Element | null;
    /**
     * Returns the CSS class to be applied to the root element of containers
     * rendered using this renderer.
     * @return {string} Renderer-specific CSS class.
     */
    getCssClass(): string;
    /**
     * Returns all CSS class names applicable to the given container, based on its
     * state.  The array of class names returned includes the renderer's own CSS
     * class, followed by a CSS class indicating the container's orientation,
     * followed by any state-specific CSS classes.
     * @param {?Container} container Container whose CSS classes are to be
     *     returned.
     * @return {!Array<string>} Array of CSS class names applicable to the
     *     container.
     */
    getClassNames(container: Container | null): Array<string>;
    /**
     * Returns the default orientation of containers rendered or decorated by this
     * renderer.  The base class implementation returns `VERTICAL`.
     * @return {?Orientation} Default orientation for containers
     *     created or decorated by this renderer.
     * @suppress {missingRequire} Container
     */
    getDefaultOrientation(): Orientation | null;
}
export namespace ContainerRenderer {
    export const instance_: undefined | ContainerRenderer;
    export const CSS_CLASS: string;
}
export namespace EventType {
    export const AFTER_SHOW: string;
    export const AFTER_HIDE: string;
}
export namespace Orientation {
    export const HORIZONTAL: string;
    export const VERTICAL: string;
}
import { Component as Ui_Component } from "./component.js";
import { KeyHandler } from "../events/keyhandler.js";
import { Event as EventsEvent } from "../events/event.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import { Control } from "./control.js";
import { KeyEvent } from "../events/keyhandler.js";
import { DomHelper } from "../dom/dom.js";
