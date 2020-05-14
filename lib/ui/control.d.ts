/**
 * @fileoverview Base class for UI controls such as buttons, menus, menu items,
 * toolbar buttons, etc.  The implementation is based on a generalized version
 * of {@link goog.ui.MenuItem}.
 * TODO(attila):  If the renderer framework works well, pull it into Component.
 *
 * @see ../demos/control.html
 * @see http://code.google.com/p/closure-library/wiki/IntroToControls
 */
/**  */
/**
 * Base class for UI controls.  Extends {@link Ui_Component} by adding
 * the following:
 *  <ul>
 *    <li>a {@link KeyHandler}, to simplify keyboard handling,
 *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
 *        simple controls without the need to subclass this class,
 *    <li>the notion of component <em>content</em>, like a text caption or DOM
 *        structure displayed in the component (e.g. a button label),
 *    <li>getter and setter for component content, as well as a getter and
 *        setter specifically for caption text (for convenience),
 *    <li>support for hiding/showing the component,
      <li>fine-grained control over supported states and state transition
          events, and
 *    <li>default mouse and keyboard event handling.
 *  </ul>
 * This class has sufficient built-in functionality for most simple UI controls.
 * All controls dispatch SHOW, HIDE, ENTER, LEAVE, and ACTION events on show,
 * hide, mouseover, mouseout, and user action, respectively.  Additional states
 * are also supported.  See closure/demos/control.html
 * for example usage.
 *     to display as the content of the control (if any).
 *     decorate the component; defaults to {@link ControlRenderer}.
 *     document interaction.
 * @extends {Ui_Component}
 * @template T
 */
export class Control<T> extends Ui_Component {
    /**
     * Maps a CSS class name to a function that returns a new instance of
     * {@link Control} or a subclass thereof, suitable to decorate
     * an element that has the specified CSS class.  UI components that extend
     * {@link Control} and want {@link goog.ui.Container}s to be able
     * to discover and decorate elements using them should register a factory
     * function via this API.
     * @param {string} className CSS class name.
     * @param {?Function} decoratorFunction Function that takes no arguments and
     *     returns a new instance of a control to decorate an element with the
     *     given class.
     * @deprecated Use {@link setDecoratorByClassName} instead.
     */
    static registerDecorator(className: string, decoratorFunction: Function | null): void;
    /**
     * Takes an element and returns a new instance of {@link Control}
     * or a subclass, suitable to decorate it (based on the element's CSS class).
     * @param {?Element} element Element to decorate.
     * @return {Control?} New control instance to decorate the element
     *     (null if none).
     * @deprecated Use {@link getDecorator} instead.
     * @suppress {checkTypes}
     */
    static getDecorator(element: Element | null): Control | null;
    /**
     * Checks if a mouse event (mouseover or mouseout) occurred below an element.
     * @param {?EventsBrowserEvent} e Mouse event (should be mouseover or
     *     mouseout).
     * @param {?Element} elem The ancestor element.
     * @return {boolean} Whether the event has a relatedTarget (the element the
     *     mouse is coming from) and it's a descendant of elem.
     * @private
     */
    private static isMouseEventWithinElement_;
    /**
     * Base class for UI controls.  Extends {@link Ui_Component} by adding
     * the following:
     *  <ul>
     *    <li>a {@link KeyHandler}, to simplify keyboard handling,
     *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
     *        simple controls without the need to subclass this class,
     *    <li>the notion of component <em>content</em>, like a text caption or DOM
     *        structure displayed in the component (e.g. a button label),
     *    <li>getter and setter for component content, as well as a getter and
     *        setter specifically for caption text (for convenience),
     *    <li>support for hiding/showing the component,
          <li>fine-grained control over supported states and state transition
              events, and
     *    <li>default mouse and keyboard event handling.
     *  </ul>
     * This class has sufficient built-in functionality for most simple UI controls.
     * All controls dispatch SHOW, HIDE, ENTER, LEAVE, and ACTION events on show,
     * hide, mouseover, mouseout, and user action, respectively.  Additional states
     * are also supported.  See closure/demos/control.html
     * for example usage.
     * @param {ControlContent=} opt_content Text caption or DOM structure
     *     to display as the content of the control (if any).
     * @param {T=} opt_renderer Renderer used to render or
     *     decorate the component; defaults to {@link ControlRenderer}.
     * @param {DomHelper=} opt_domHelper Optional DOM helper, used for
     *     document interaction.
     * @template T
     */
    constructor(opt_content?: ControlContent | undefined, opt_renderer?: T | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * Text caption or DOM structure displayed in the component.
     * @type {?ControlContent}
     * @private
     */
    private content_;
    /**
     * Current component state; a bit mask of {@link State}s.
     * @type {number}
     * @private
     */
    private state_;
    /**
     * A bit mask of {@link State}s this component supports.
     * @type {number}
     * @private
     */
    private supportedStates_;
    /**
     * A bit mask of {@link State}s for which this component
     * provides default event handling.  For example, a component that handles
     * the HOVER state automatically will highlight itself on mouseover, whereas
     * a component that doesn't handle HOVER automatically will only dispatch
     * ENTER and LEAVE events but not call {@link setHighlighted} on itself.
     * By default, components provide default event handling for all states.
     * Controls hosted in containers (e.g. menu items in a menu, or buttons in a
     * toolbar) will typically want to have their container manage their highlight
     * state.  Selectable controls managed by a selection model will also typically
     * want their selection state to be managed by the model.
     * @type {number}
     * @private
     */
    private autoStates_;
    /**
     * A bit mask of {@link State}s for which this component
     * dispatches state transition events.  Because events are expensive, the
     * default behavior is to not dispatch any state transition events at all.
     * Use the {@link #setDispatchTransitionEvents} API to request transition
     * events  as needed.  Subclasses may enable transition events by default.
     * Controls hosted in containers or managed by a selection model will typically
     * want to dispatch transition events.
     * @type {number}
     * @private
     */
    private statesWithTransitionEvents_;
    /**
     * Component visibility.
     * @type {boolean}
     * @private
     */
    private visible_;
    /**
     * Keyboard event handler.
     * @type {?KeyHandler}
     * @private
     */
    private keyHandler_;
    /**
     * Additional class name(s) to apply to the control's root element, if any.
     * @type {Array<string>?}
     * @private
     */
    private extraClassNames_;
    /**
     * Whether the control should listen for and handle mouse events; defaults to
     * true.
     * @type {boolean}
     * @private
     */
    private handleMouseEvents_;
    /**
     * Whether the control allows text selection within its DOM.  Defaults to false.
     * @type {boolean}
     * @private
     */
    private allowTextSelection_;
    /**
     * The control's preferred ARIA role.
     * @type {?Role}
     * @private
     */
    private preferredAriaRole_;
    /**
     * Renderer associated with the component.
     * @type {T}
     * @private
     */
    private renderer_;
    /** @private {?string} The control's aria-label. */
    private ariaLabel_;
    /**
     * Returns true if the control is configured to handle its own mouse events,
     * false otherwise.  Controls not hosted in {@link goog.ui.Container}s have
     * to handle their own mouse events, but controls hosted in containers may
     * allow their parent to handle mouse events on their behalf.  Considered
     * protected; should only be used within this package and by subclasses.
     * @return {boolean} Whether the control handles its own mouse events.
     */
    isHandleMouseEvents(): boolean;
    /**
     * Enables or disables mouse event handling for the control.  Containers may
     * use this method to disable mouse event handling in their child controls.
     * Considered protected; should only be used within this package and by
     * subclasses.
     * @param {boolean} enable Whether to enable or disable mouse event handling.
     */
    setHandleMouseEvents(enable: boolean): void;
    /**
     * Returns the DOM element on which the control is listening for keyboard
     * events (null if none).
     * @return {?Element} Element on which the control is listening for key
     *     events.
     */
    getKeyEventTarget(): Element | null;
    /**
     * Returns the keyboard event handler for this component, lazily created the
     * first time this method is called.  Considered protected; should only be
     * used within this package and by subclasses.
     * @return {!KeyHandler} Keyboard event handler for this component.
     * @protected
     */
    protected getKeyHandler(): KeyHandler;
    /**
     * Returns the renderer used by this component to render itself or to decorate
     * an existing element.
     * @return {T|undefined} Renderer used by the component
     *     (undefined if none).
     */
    getRenderer(): T | undefined;
    /**
     * Registers the given renderer with the component.  Changing renderers after
     * the component has entered the document is an error.
     * @param {T} renderer Renderer used by the component.
     * @throws {Error} If the control is already in the document.
     */
    setRenderer(renderer: T): void;
    /**
     * Returns any additional class name(s) to be applied to the component's
     * root element, or null if no extra class names are needed.
     * @return {Array<string>?} Additional class names to be applied to
     *     the component's root element (null if none).
     */
    getExtraClassNames(): Array<string> | null;
    /**
     * Adds the given class name to the list of classes to be applied to the
     * component's root element.
     * @param {string} className Additional class name to be applied to the
     *     component's root element.
     */
    addClassName(className: string): void;
    /**
     * Removes the given class name from the list of classes to be applied to
     * the component's root element.
     * @param {string} className Class name to be removed from the component's root
     *     element.
     */
    removeClassName(className: string): void;
    /**
     * Adds or removes the given class name to/from the list of classes to be
     * applied to the component's root element.
     * @param {string} className CSS class name to add or remove.
     * @param {boolean} enable Whether to add or remove the class name.
     */
    enableClassName(className: string, enable: boolean): void;
    /**
     * Returns the control's preferred ARIA role. This can be used by a control to
     * override the role that would be assigned by the renderer.  This is useful in
     * cases where a different ARIA role is appropriate for a control because of the
     * context in which it's used.  E.g., a {@link goog.ui.MenuButton} added to a
     * {@link goog.ui.Select} should have an ARIA role of LISTBOX and not MENUITEM.
     * @return {?Role} This control's preferred ARIA role or null if
     *     no preferred ARIA role is set.
     */
    getPreferredAriaRole(): Role | null;
    /**
     * Sets the control's preferred ARIA role. This can be used to override the role
     * that would be assigned by the renderer.  This is useful in cases where a
     * different ARIA role is appropriate for a control because of the
     * context in which it's used.  E.g., a {@link goog.ui.MenuButton} added to a
     * {@link goog.ui.Select} should have an ARIA role of LISTBOX and not MENUITEM.
     * @param {?Role} role This control's preferred ARIA role.
     */
    setPreferredAriaRole(role: Role | null): void;
    /**
     * Gets the control's aria label.
     * @return {?string} This control's aria label.
     */
    getAriaLabel(): string | null;
    /**
     * Sets the control's aria label. This can be used to assign aria label to the
     * element after it is rendered.
     * @param {string} label The string to set as the aria label for this control.
     *     No escaping is done on this value.
     */
    setAriaLabel(label: string): void;
    /**
     * Enables or disables mouse event handling on the control.
     * @param {boolean} enable Whether to enable mouse event handling.
     * @private
     */
    private enableMouseEventHandling_;
    ieMouseEventSequenceSimulator_: any;
    /**
     * Returns the text caption or DOM structure displayed in the component.
     * @return {?ControlContent} Text caption or DOM structure
     *     comprising the component's contents.
     */
    getContent(): ControlContent | null;
    /**
     * Sets the component's content to the given text caption, element, or array of
     * nodes.  (If the argument is an array of nodes, it must be an actual array,
     * not an array-like object.)
     * @param {?ControlContent} content Text caption or DOM
     *     structure to set as the component's contents.
     */
    setContent(content: ControlContent | null): void;
    /**
     * Sets the component's content to the given text caption, element, or array
     * of nodes.  Unlike {@link #setContent}, doesn't modify the component's DOM.
     * Called by renderers during element decoration.
     *
     * This should only be used by subclasses and its associated renderers.
     *
     * @param {?ControlContent} content Text caption or DOM structure
     *     to set as the component's contents.
     */
    setContentInternal(content: ControlContent | null): void;
    /**
     * @return {string} Text caption of the control or empty string if none.
     * @suppress{checkTypes}
     */
    getCaption(): string;
    /**
     * Sets the text caption of the component.
     * @param {string} caption Text caption of the component.
     */
    setCaption(caption: string): void;
    /**
     * Returns true if the control allows text selection within its DOM, false
     * otherwise.  Controls that disallow text selection have the appropriate
     * unselectable styling applied to their elements.  Note that controls hosted
     * in containers will report that they allow text selection even if their
     * container disallows text selection.
     * @return {boolean} Whether the control allows text selection.
     */
    isAllowTextSelection(): boolean;
    /**
     * Allows or disallows text selection within the control's DOM.
     * @param {boolean} allow Whether the control should allow text selection.
     */
    setAllowTextSelection(allow: boolean): void;
    /**
     * Returns true if the component's visibility is set to visible, false if
     * it is set to hidden.  A component that is set to hidden is guaranteed
     * to be hidden from the user, but the reverse isn't necessarily true.
     * A component may be set to visible but can otherwise be obscured by another
     * element, rendered off-screen, or hidden using direct CSS manipulation.
     * @return {boolean} Whether the component is visible.
     */
    isVisible(): boolean;
    /**
     * Shows or hides the component.  Does nothing if the component already has
     * the requested visibility.  Otherwise, dispatches a SHOW or HIDE event as
     * appropriate, giving listeners a chance to prevent the visibility change.
     * When showing a component that is both enabled and focusable, ensures that
     * its key target has a tab index.  When hiding a component that is enabled
     * and focusable, blurs its key target and removes its tab index.
     * @param {boolean} visible Whether to show or hide the component.
     * @param {boolean=} opt_force If true, doesn't check whether the component
     *     already has the requested visibility, and doesn't dispatch any events.
     * @return {boolean} Whether the visibility was changed.
     */
    setVisible(visible: boolean, opt_force?: boolean | undefined): boolean;
    /**
     * Returns true if the component is enabled, false otherwise.
     * @return {boolean} Whether the component is enabled.
     */
    isEnabled(): boolean;
    /**
     * Returns true if the control has a parent that is itself disabled, false
     * otherwise.
     * @return {boolean} Whether the component is hosted in a disabled container.
     * @private
     */
    private isParentDisabled_;
    /**
     * Enables or disables the component.  Does nothing if this state transition
     * is disallowed.  If the component is both visible and focusable, updates its
     * focused state and tab index as needed.  If the component is being disabled,
     * ensures that it is also deactivated and un-highlighted first.  Note that the
     * component's enabled/disabled state is "locked" as long as it is hosted in a
     * {@link goog.ui.Container} that is itself disabled; this is to prevent clients
     * from accidentally re-enabling a control that is in a disabled container.
     * @param {boolean} enable Whether to enable or disable the component.
     * @see #isTransitionAllowed
     */
    setEnabled(enable: boolean): void;
    /**
     * Returns true if the component is currently highlighted, false otherwise.
     * @return {boolean} Whether the component is highlighted.
     */
    isHighlighted(): boolean;
    /**
     * Highlights or unhighlights the component.  Does nothing if this state
     * transition is disallowed.
     * @param {boolean} highlight Whether to highlight or unhighlight the component.
     * @see #isTransitionAllowed
     */
    setHighlighted(highlight: boolean): void;
    /**
     * Returns true if the component is active (pressed), false otherwise.
     * @return {boolean} Whether the component is active.
     */
    isActive(): boolean;
    /**
     * Activates or deactivates the component.  Does nothing if this state
     * transition is disallowed.
     * @param {boolean} active Whether to activate or deactivate the component.
     * @see #isTransitionAllowed
     */
    setActive(active: boolean): void;
    /**
     * Returns true if the component is selected, false otherwise.
     * @return {boolean} Whether the component is selected.
     */
    isSelected(): boolean;
    /**
     * Selects or unselects the component.  Does nothing if this state transition
     * is disallowed.
     * @param {boolean} select Whether to select or unselect the component.
     * @see #isTransitionAllowed
     */
    setSelected(select: boolean): void;
    /**
     * Returns true if the component is checked, false otherwise.
     * @return {boolean} Whether the component is checked.
     */
    isChecked(): boolean;
    /**
     * Checks or unchecks the component.  Does nothing if this state transition
     * is disallowed.
     * @param {boolean} check Whether to check or uncheck the component.
     * @see #isTransitionAllowed
     */
    setChecked(check: boolean): void;
    /**
     * Returns true if the component is styled to indicate that it has keyboard
     * focus, false otherwise.  Note that `isFocused()` returning true
     * doesn't guarantee that the component's key event target has keyboard focus,
     * only that it is styled as such.
     * @return {boolean} Whether the component is styled to indicate as having
     *     keyboard focus.
     */
    isFocused(): boolean;
    /**
     * Applies or removes styling indicating that the component has keyboard focus.
     * Note that unlike the other "set" methods, this method is called as a result
     * of the component's element having received or lost keyboard focus, not the
     * other way around, so calling `setFocused(true)` doesn't guarantee that
     * the component's key event target has keyboard focus, only that it is styled
     * as such.
     * @param {boolean} focused Whether to apply or remove styling to indicate that
     *     the component's element has keyboard focus.
     */
    setFocused(focused: boolean): void;
    /**
     * Returns true if the component is open (expanded), false otherwise.
     * @return {boolean} Whether the component is open.
     */
    isOpen(): boolean;
    /**
     * Opens (expands) or closes (collapses) the component.  Does nothing if this
     * state transition is disallowed.
     * @param {boolean} open Whether to open or close the component.
     * @see #isTransitionAllowed
     */
    setOpen(open: boolean): void;
    /**
     * Returns the component's state as a bit mask of {@link
     * State}s.
     * @return {number} Bit mask representing component state.
     */
    getState(): number;
    /**
     * Returns true if the component is in the specified state, false otherwise.
     * @param {?State} state State to check.
     * @return {boolean} Whether the component is in the given state.
     */
    hasState(state: State | null): boolean;
    /**
     * Sets or clears the given state on the component, and updates its styling
     * accordingly.  Does nothing if the component is already in the correct state
     * or if it doesn't support the specified state.  Doesn't dispatch any state
     * transition events; use advisedly.
     * @param {?State} state State to set or clear.
     * @param {boolean} enable Whether to set or clear the state (if supported).
     * @param {boolean=} opt_calledFrom Prevents looping with setEnabled.
     */
    setState(state: State | null, enable: boolean, opt_calledFrom?: boolean | undefined): void;
    /**
     * Sets the component's state to the state represented by a bit mask of
     * {@link State}s.  Unlike {@link #setState}, doesn't
     * update the component's styling, and doesn't reject unsupported states.
     * Called by renderers during element decoration.  Considered protected;
     * should only be used within this package and by subclasses.
     *
     * This should only be used by subclasses and its associated renderers.
     *
     * @param {number} state Bit mask representing component state.
     */
    setStateInternal(state: number): void;
    /**
     * Returns true if the component supports the specified state, false otherwise.
     * @param {?State} state State to check.
     * @return {boolean} Whether the component supports the given state.
     */
    isSupportedState(state: State | null): boolean;
    /**
     * Enables or disables support for the given state. Disabling support
     * for a state while the component is in that state is an error.
     * @param {?State} state State to support or de-support.
     * @param {boolean} support Whether the component should support the state.
     * @throws {Error} If disabling support for a state the control is currently in.
     */
    setSupportedState(state: State | null, support: boolean): void;
    /**
     * Returns true if the component provides default event handling for the state,
     * false otherwise.
     * @param {?State} state State to check.
     * @return {boolean} Whether the component provides default event handling for
     *     the state.
     */
    isAutoState(state: State | null): boolean;
    /**
     * Enables or disables automatic event handling for the given state(s).
     * @param {number} states Bit mask of {@link State}s for which
     *     default event handling is to be enabled or disabled.
     * @param {boolean} enable Whether the component should provide default event
     *     handling for the state(s).
     */
    setAutoStates(states: number, enable: boolean): void;
    /**
     * Returns true if the component is set to dispatch transition events for the
     * given state, false otherwise.
     * @param {?State} state State to check.
     * @return {boolean} Whether the component dispatches transition events for
     *     the state.
     */
    isDispatchTransitionEvents(state: State | null): boolean;
    /**
     * Enables or disables transition events for the given state(s).  Controls
     * handle state transitions internally by default, and only dispatch state
     * transition events if explicitly requested to do so by calling this method.
     * @param {number} states Bit mask of {@link State}s for
     *     which transition events should be enabled or disabled.
     * @param {boolean} enable Whether transition events should be enabled.
     */
    setDispatchTransitionEvents(states: number, enable: boolean): void;
    /**
     * Returns true if the transition into or out of the given state is allowed to
     * proceed, false otherwise.  A state transition is allowed under the following
     * conditions:
     * <ul>
     *   <li>the component supports the state,
     *   <li>the component isn't already in the target state,
     *   <li>either the component is configured not to dispatch events for this
     *       state transition, or a transition event was dispatched and wasn't
     *       canceled by any event listener, and
     *   <li>the component hasn't been disposed of
     * </ul>
     * Considered protected; should only be used within this package and by
     * subclasses.
     * @param {?State} state State to/from which the control is
     *     transitioning.
     * @param {boolean} enable Whether the control is entering or leaving the state.
     * @return {boolean} Whether the state transition is allowed to proceed.
     * @protected
     */
    protected isTransitionAllowed(state: State | null, enable: boolean): boolean;
    /**
     * Handles mouseover events.  Dispatches an ENTER event; if the event isn't
     * canceled, the component is enabled, and it supports auto-highlighting,
     * highlights the component.  Considered protected; should only be used
     * within this package and by subclasses.
     * @param {?EventsBrowserEvent} e Mouse event to handle.
     */
    handleMouseOver(e: EventsBrowserEvent | null): void;
    /**
     * Handles mouseout events.  Dispatches a LEAVE event; if the event isn't
     * canceled, and the component supports auto-highlighting, deactivates and
     * un-highlights the component.  Considered protected; should only be used
     * within this package and by subclasses.
     * @param {?EventsBrowserEvent} e Mouse event to handle.
     */
    handleMouseOut(e: EventsBrowserEvent | null): void;
    /**
     * @param {!EventsBrowserEvent} e Event to handle.
     * @private
     */
    private preventPointerCapture_;
    /**
     * Handles contextmenu events.
     * @param {?EventsBrowserEvent} e Event to handle.
     */
    handleContextMenu(e: EventsBrowserEvent | null): void;
    /**
     * Handles mousedown events.  If the component is enabled, highlights and
     * activates it.  If the component isn't configured for keyboard access,
     * prevents it from receiving keyboard focus.  Considered protected; should
     * only be used within this package and by subclasses.
     * @param {?EventsEvent} e Mouse event to handle.
     */
    handleMouseDown(e: EventsEvent | null): void;
    /**
     * Handles mouseup events.  If the component is enabled, highlights it.  If
     * the component has previously been activated, performs its associated action
     * by calling {@link performActionInternal}, then deactivates it.  Considered
     * protected; should only be used within this package and by subclasses.
     * @param {?EventsEvent} e Mouse event to handle.
     */
    handleMouseUp(e: EventsEvent | null): void;
    /**
     * Handles dblclick events.  Should only be registered if the user agent is
     * IE.  If the component is enabled, performs its associated action by calling
     * {@link performActionInternal}.  This is used to allow more performant
     * buttons in IE.  In IE, no mousedown event is fired when that mousedown will
     * trigger a dblclick event.  Because of this, a user clicking quickly will
     * only cause ACTION events to fire on every other click.  This is a workaround
     * to generate ACTION events for every click.  Unfortunately, this workaround
     * won't ever trigger the ACTIVE state.  This is roughly the same behaviour as
     * if this were a 'button' element with a listener on mouseup.  Considered
     * protected; should only be used within this package and by subclasses.
     * @param {?EventsEvent} e Mouse event to handle.
     */
    handleDblClick(e: EventsEvent | null): void;
    /**
     * Performs the appropriate action when the control is activated by the user.
     * The default implementation first updates the checked and selected state of
     * controls that support them, then dispatches an ACTION event.  Considered
     * protected; should only be used within this package and by subclasses.
     * @param {?EventsEvent} e Event that triggered the action.
     * @return {boolean} Whether the action is allowed to proceed.
     * @protected
     * @suppress {checkTypes}
     */
    protected performActionInternal(e: EventsEvent | null): boolean;
    /**
     * Handles focus events on the component's key event target element.  If the
     * component is focusable, updates its state and styling to indicate that it
     * now has keyboard focus.  Considered protected; should only be used within
     * this package and by subclasses.  <b>Warning:</b> IE dispatches focus and
     * blur events asynchronously!
     * @param {?EventsEvent} e Focus event to handle.
     */
    handleFocus(e: EventsEvent | null): void;
    /**
     * Handles blur events on the component's key event target element.  Always
     * deactivates the component.  In addition, if the component is focusable,
     * updates its state and styling to indicate that it no longer has keyboard
     * focus.  Considered protected; should only be used within this package and
     * by subclasses.  <b>Warning:</b> IE dispatches focus and blur events
     * asynchronously!
     * @param {?EventsEvent} e Blur event to handle.
     */
    handleBlur(e: EventsEvent | null): void;
    /**
     * Attempts to handle a keyboard event, if the component is enabled and visible,
     * by calling {@link handleKeyEventInternal}.  Considered protected; should only
     * be used within this package and by subclasses.
     * @param {?KeyEvent} e Key event to handle.
     * @return {boolean} Whether the key event was handled.
     */
    handleKeyEvent(e: KeyEvent | null): boolean;
    /**
     * Attempts to handle a keyboard event; returns true if the event was handled,
     * false otherwise.  Considered protected; should only be used within this
     * package and by subclasses.
     * @param {?KeyEvent} e Key event to handle.
     * @return {boolean} Whether the key event was handled.
     * @protected
     */
    protected handleKeyEventInternal(e: KeyEvent | null): boolean;
}
export namespace Control {
    export { IeMouseEventSequenceSimulator_ };
}
/**
 * @fileoverview Base class for control renderers.
 * TODO(attila):  If the renderer framework works well, pull it into Component.
 */
/**
 * Default renderer for {@link Control}s.  Can be used as-is, but
 * subclasses of Control will probably want to use renderers specifically
 * tailored for them by extending this class.  Controls that use renderers
 * delegate one or more of the following API methods to the renderer:
 * <ul>
 *    <li>`createDom` - renders the DOM for the component
 *    <li>`canDecorate` - determines whether an element can be decorated
 *        by the component
 *    <li>`decorate` - decorates an existing element with the component
 *    <li>`setState` - updates the appearance of the component based on
 *        its state
 *    <li>`getContent` - returns the component's content
 *    <li>`setContent` - sets the component's content
 * </ul>
 * Controls are stateful; renderers, on the other hand, should be stateless and
 * reusable.
 * @template CONTROL
 */
export class ControlRenderer<CONTROL> {
    /** @return {!ControlRenderer} @suppress {checkTypes} */
    static getInstance(): ControlRenderer;
    /**
     * Constructs a new renderer and sets the CSS class that the renderer will use
     * as the base CSS class to apply to all elements rendered by that renderer.
     * An example to use this function using a color palette:
     *
     * <pre>
     * var myCustomRenderer = ControlRenderer.getCustomRenderer(
     *     goog.ui.PaletteRenderer, 'my-special-palette');
     * var newColorPalette = new goog.ui.ColorPalette(
     *     colors, myCustomRenderer, opt_domHelper);
     * </pre>
     *
     * Your CSS can look like this now:
     * <pre>
     * .my-special-palette { }
     * .my-special-palette-table { }
     * .my-special-palette-cell { }
     * etc.
     * </pre>
     *
     * <em>instead</em> of
     * <pre>
     * .CSS_MY_SPECIAL_PALETTE .goog-palette { }
     * .CSS_MY_SPECIAL_PALETTE .goog-palette-table { }
     * .CSS_MY_SPECIAL_PALETTE .goog-palette-cell { }
     * etc.
     * </pre>
     *
     * You would want to use this functionality when you want an instance of a
     * component to have specific styles different than the other components of the
     * same type in your application.  This avoids using descendant selectors to
     * apply the specific styles to this component.
     *
     * @param {?Function} ctor The constructor of the renderer you are trying to
     *     create.
     * @param {string} cssClassName The name of the CSS class for this renderer.
     * @return {?ControlRenderer} An instance of the desired renderer with
     *     its getCssClass() method overridden to return the supplied custom CSS
     *     class name.
     */
    static getCustomRenderer(ctor: Function | null, cssClassName: string): ControlRenderer | null;
    /**
     * Returns the appropriate ARIA attribute based on ARIA role if the ARIA
     * attribute is an ARIA state.
     * @param {!Element} element The element from which to get the ARIA role for
     * matching ARIA state.
     * @param {?AriaState} attr The ARIA attribute to check to see if it
     * can be applied to the given ARIA role.
     * @return {?AriaState} An ARIA attribute that can be applied to the
     * given ARIA role.
     * @private
     */
    private static getAriaStateForAriaRole_;
    /**
     * Determines if the given ARIA attribute is an ARIA property or ARIA state.
     * @param {?AriaState} attr The ARIA attribute to classify.
     * @return {boolean} If the ARIA attribute is an ARIA state.
     * @private
     */
    private static isAriaState_;
    /**
     * Returns the ARIA role to be applied to the control.
     * See http://wiki/Main/ARIA for more info.
     * @return {Role|undefined} ARIA role.
     */
    getAriaRole(): Role | undefined;
    /**
     * Returns the control's contents wrapped in a DIV, with the renderer's own
     * CSS class and additional state-specific classes applied to it.
     * @param {?CONTROL} control Control to render.
     * @return {?Element} Root element for the control.
     */
    createDom(control: CONTROL | null): Element | null;
    /**
     * Takes the control's root element and returns the parent element of the
     * control's contents.  Since by default controls are rendered as a single
     * DIV, the default implementation returns the element itself.  Subclasses
     * with more complex DOM structures must override this method as needed.
     * @param {?Element} element Root element of the control whose content element
     *     is to be returned.
     * @return {?Element} The control's content element.
     */
    getContentElement(element: Element | null): Element | null;
    /**
     * Updates the control's DOM by adding or removing the specified class name
     * to/from its root element. May add additional combined classes as needed in
     * IE6 and lower. Because of this, subclasses should use this method when
     * modifying class names on the control's root element.
     * @param {CONTROL|?Element} control Control instance (or root element)
     *     to be updated.
     * @param {string} className CSS class name to add or remove.
     * @param {boolean} enable Whether to add or remove the class name.
     */
    enableClassName(control: Element | CONTROL | null, className: string, enable: boolean): void;
    /**
     * Updates the control's DOM by adding or removing the specified extra class
     * name to/from its element.
     * @param {?CONTROL} control Control to be updated.
     * @param {string} className CSS class name to add or remove.
     * @param {boolean} enable Whether to add or remove the class name.
     */
    enableExtraClassName(control: CONTROL | null, className: string, enable: boolean): void;
    /**
     * Returns true if this renderer can decorate the element, false otherwise.
     * The default implementation always returns true.
     * @param {?Element} element Element to decorate.
     * @return {boolean} Whether the renderer can decorate the element.
     */
    canDecorate(element: Element | null): boolean;
    /**
     * Default implementation of `decorate` for {@link Control}s.
     * Initializes the control's ID, content, and state based on the ID of the
     * element, its child nodes, and its CSS classes, respectively.  Returns the
     * element.
     * @param {?CONTROL} control Control instance to decorate the element.
     * @param {?Element} element Element to decorate.
     * @return {?Element} Decorated element.
     */
    decorate(control: CONTROL | null, element: Element | null): Element | null;
    /**
     * Initializes the control's DOM by configuring properties that can only be set
     * after the DOM has entered the document.  This implementation sets up BiDi
     * and keyboard focus.  Called from {@link Control#enterDocument}.
     * @param {?CONTROL} control Control whose DOM is to be initialized
     *     as it enters the document.
     */
    initializeDom(control: CONTROL | null): void;
    /**
     * Sets the element's ARIA role.
     * @param {?Element} element Element to update.
     * @param {?Role=} opt_preferredRole The preferred ARIA role.
     */
    setAriaRole(element: Element | null, opt_preferredRole?: (Role | null) | undefined): void;
    /**
     * Sets the element's ARIA attributes, including distinguishing between
     * universally supported ARIA properties and ARIA states that are only
     * supported by certain ARIA roles. Only attributes which are initialized to be
     * true will be set.
     * @param {!Control} control Control whose ARIA state will be updated.
     * @param {!Element} element Element whose ARIA state is to be updated.
     */
    setAriaStates(control: Control, element: Element): void;
    /**
     * Sets the element's ARIA label. This should be overriden by subclasses that
     * don't apply the role directly on control.element_.
     * @param {!Element} element Element whose ARIA label is to be updated.
     * @param {string} ariaLabel Label to add to the element.
     */
    setAriaLabel(element: Element, ariaLabel: string): void;
    /**
     * Allows or disallows text selection within the control's DOM.
     * @param {?Element} element The control's root element.
     * @param {boolean} allow Whether the element should allow text selection.
     */
    setAllowTextSelection(element: Element | null, allow: boolean): void;
    /**
     * Applies special styling to/from the control's element if it is rendered
     * right-to-left, and removes it if it is rendered left-to-right.
     * @param {?Element} element The control's root element.
     * @param {boolean} rightToLeft Whether the component is rendered
     *     right-to-left.
     */
    setRightToLeft(element: Element | null, rightToLeft: boolean): void;
    /**
     * Returns true if the control's key event target supports keyboard focus
     * (based on its `tabIndex` attribute), false otherwise.
     * @param {?CONTROL} control Control whose key event target is to be
     *     checked.
     * @return {boolean} Whether the control's key event target is focusable.
     */
    isFocusable(control: CONTROL | null): boolean;
    /**
     * Updates the control's key event target to make it focusable or non-focusable
     * via its `tabIndex` attribute.  Does nothing if the control doesn't
     * support the `FOCUSED` state, or if it has no key event target.
     * @param {?CONTROL} control Control whose key event target is to be
     *     updated.
     * @param {boolean} focusable Whether to enable keyboard focus support on the
     *     control's key event target.
     */
    setFocusable(control: CONTROL | null, focusable: boolean): void;
    /**
     * Shows or hides the element.
     * @param {?Element} element Element to update.
     * @param {boolean} visible Whether to show the element.
     */
    setVisible(element: Element | null, visible: boolean): void;
    /**
     * Updates the appearance of the control in response to a state change.
     * @param {?CONTROL} control Control instance to update.
     * @param {?State} state State to enable or disable.
     * @param {boolean} enable Whether the control is entering or exiting the state.
     */
    setState(control: CONTROL | null, state: State | null, enable: boolean): void;
    /**
     * Updates the element's ARIA (accessibility) attributes , including
     * distinguishing between universally supported ARIA properties and ARIA states
     * that are only supported by certain ARIA roles.
     * @param {?Element} element Element whose ARIA state is to be updated.
     * @param {?State} state Component state being enabled or
     *     disabled.
     * @param {boolean} enable Whether the state is being enabled or disabled.
     * @protected
     */
    protected updateAriaState(element: Element | null, state: State | null, enable: boolean): void;
    /**
     * Takes a control's root element, and sets its content to the given text
     * caption or DOM structure.  The default implementation replaces the children
     * of the given element.  Renderers that create more complex DOM structures
     * must override this method accordingly.
     * @suppress{checkTypes}
     * @param {?Element} element The control's root element.
     * @param {?ControlContent} content Text caption or DOM structure to be
     *     set as the control's content. The DOM nodes will not be cloned, they
     *     will only moved under the content element of the control.
     */
    setContent(element: Element | null, content: ControlContent | null): void;
    /**
     * Returns the element within the component's DOM that should receive keyboard
     * focus (null if none).  The default implementation returns the control's root
     * element.
     * @param {?CONTROL} control Control whose key event target is to be
     *     returned.
     * @return {?Element} The key event target.
     */
    getKeyEventTarget(control: CONTROL | null): Element | null;
    /**
     * Returns the CSS class name to be applied to the root element of all
     * components rendered or decorated using this renderer.  The class name
     * is expected to uniquely identify the renderer class, i.e. no two
     * renderer classes are expected to share the same CSS class name.
     * @return {string} Renderer-specific CSS class name.
     */
    getCssClass(): string;
    /**
     * Returns an array of combinations of classes to apply combined class names for
     * in IE6 and below. See {@link IE6_CLASS_COMBINATIONS} for more detail. This
     * method doesn't reference {@link IE6_CLASS_COMBINATIONS} so that it can be
     * compiled out, but subclasses should return their IE6_CLASS_COMBINATIONS
     * static constant instead.
     * @return {Array<Array<string>>} Array of class name combinations.
     */
    getIe6ClassCombinations(): Array<Array<string>>;
    /**
     * Returns the name of a DOM structure-specific CSS class to be applied to the
     * root element of all components rendered or decorated using this renderer.
     * Unlike the class name returned by {@link #getCssClass}, the structural class
     * name may be shared among different renderers that generate similar DOM
     * structures.  The structural class name also serves as the basis of derived
     * class names used to identify and style structural elements of the control's
     * DOM, as well as the basis for state-specific class names.  The default
     * implementation returns the same class name as {@link #getCssClass}, but
     * subclasses are expected to override this method as needed.
     * @return {string} DOM structure-specific CSS class name (same as the renderer-
     *     specific CSS class name by default).
     */
    getStructuralCssClass(): string;
    /**
     * Returns all CSS class names applicable to the given control, based on its
     * state.  The return value is an array of strings containing
     * <ol>
     *   <li>the renderer-specific CSS class returned by {@link #getCssClass},
     *       followed by
     *   <li>the structural CSS class returned by {@link getStructuralCssClass} (if
     *       different from the renderer-specific CSS class), followed by
     *   <li>any state-specific classes returned by {@link #getClassNamesForState},
     *       followed by
     *   <li>any extra classes returned by the control's `getExtraClassNames`
     *       method and
     *   <li>for IE6 and lower, additional combined classes from
     *       {@link getAppliedCombinedClassNames_}.
     * </ol>
     * Since all controls have at least one renderer-specific CSS class name, this
     * method is guaranteed to return an array of at least one element.
     * @param {?CONTROL} control Control whose CSS classes are to be
     *     returned.
     * @return {!Array<string>} Array of CSS class names applicable to the control.
     * @protected
     */
    protected getClassNames(control: CONTROL | null): Array<string>;
    /**
     * Returns an array of all the combined class names that should be applied based
     * on the given list of classes. Checks the result of
     * {@link getIe6ClassCombinations} for any combinations that have all
     * members contained in classes. If a combination matches, the members are
     * joined with an underscore (in order), and added to the return array.
     *
     * If opt_includedClass is provided, return only the combined classes that have
     * all members contained in classes AND include opt_includedClass as well.
     * opt_includedClass is added to classes as well.
     * @param {ArrayLike<string>} classes Array-like thing of classes to
     *     return matching combined classes for.
     * @param {?string=} opt_includedClass If provided, get only the combined
     *     classes that include this one.
     * @return {!Array<string>} Array of combined class names that should be
     *     applied.
     * @private
     */
    private getAppliedCombinedClassNames_;
    /**
     * Takes a bit mask of {@link State}s, and returns an array
     * of the appropriate class names representing the given state, suitable to be
     * applied to the root element of a component rendered using this renderer, or
     * null if no state-specific classes need to be applied.  This default
     * implementation uses the renderer's {@link getClassForState} method to
     * generate each state-specific class.
     * @param {number} state Bit mask of component states.
     * @return {!Array<string>} Array of CSS class names representing the given
     *     state.
     * @protected
     */
    protected getClassNamesForState(state: number): Array<string>;
    /**
     * Takes a single {@link State}, and returns the
     * corresponding CSS class name (null if none).
     * @param {?State} state Component state.
     * @return {string|undefined} CSS class representing the given state (undefined
     *     if none).
     * @protected
     */
    protected getClassForState(state: State | null): string | undefined;
    /**
     * Takes a single CSS class name which may represent a component state, and
     * returns the corresponding component state (0x00 if none).
     * @param {string} className CSS class name, possibly representing a component
     *     state.
     * @return {?State} state Component state corresponding
     *     to the given CSS class (0x00 if none).
     * @protected
     */
    protected getStateFromClass(className: string): State | null;
    /**
     * Creates the lookup table of states to classes, used during state changes.
     * @private
     */
    private createClassByStateMap_;
    /**
     * Map of component states to state-specific structural class names,
     * used when changing the DOM in response to a state change.  Precomputed
     * and cached on first use to minimize object allocations and string
     * concatenation.
     * @type {?Object}
     * @private
     */
    private classByState_;
    /**
     * Creates the lookup table of classes to states, used during decoration.
     * @private
     */
    private createStateByClassMap_;
    /**
     * Map of state-specific structural class names to component states,
     * used during element decoration.  Precomputed and cached on first use
     * to minimize object allocations and string concatenation.
     * @type {?Object}
     * @private
     */
    private stateByClass_;
}
export namespace ControlRenderer {
    export const instance_: undefined | ControlRenderer;
    export const CSS_CLASS: string;
    export const IE6_CLASS_COMBINATIONS: Array<Array<string>>;
    export const ariaAttributeMap_: any;
    export const TOGGLE_ARIA_STATE_MAP_: any;
}
/**
 * Returns an instance of {@link Ui_Component} or a subclass suitable to
 * decorate the given element, based on its CSS class.
 *
 * TODO(nnaze): Type of element should be {!Element}.
 *
 * @param {?Element} element Element to decorate.
 * @return {Ui_Component?} Component to decorate the element (null if
 *     none).
 */
export function getDecorator(element: Element | null): Ui_Component | null;
/**
 * Returns the {@link Ui_Component} instance created by the decorator
 * factory function registered for the given CSS class name, or null if no
 * decorator factory function was found.
 * @param {string} className CSS class name.
 * @return {Ui_Component?} Component instance.
 */
export function getDecoratorByClassName(className: string): Ui_Component | null;
/**
 * @fileoverview Global renderer and decorator registry.
 */
/**
 * Given a {@link Ui_Component} constructor, returns an instance of its
 * default renderer.  If the default renderer is a singleton, returns the
 * singleton instance; otherwise returns a new instance of the renderer class.
 * @param {?Function} componentCtor Component constructor function (for example
 *     `goog.ui.Button`).
 * @return {ControlRenderer?} Renderer instance (for example the
 *     singleton instance of `goog.ui.ButtonRenderer`), or null if
 *     no default renderer was found.
 */
export function getDefaultRenderer(componentCtor: Function | null): ControlRenderer | null;
/**
 * Resets the global renderer and decorator registry.
 */
export function reset(): void;
/**
 * Maps a CSS class name to a function that returns a new instance of
 * {@link Ui_Component} or a subclass, suitable to decorate an element
 * that has the specified CSS class.
 * @param {string} className CSS class name.
 * @param {?Function} decoratorFn No-argument function that returns a new
 *     instance of a {@link Ui_Component} to decorate an element.
 * @throws {Error} If the class name or the decorator function is invalid.
 */
export function setDecoratorByClassName(className: string, decoratorFn: Function | null): void;
/**
 * Sets the default renderer for the given {@link Ui_Component}
 * constructor.
 * @param {?Function} componentCtor Component constructor function (for example
 *     `goog.ui.Button`).
 * @param {?Function} rendererCtor Renderer constructor function (for example
 *     `goog.ui.ButtonRenderer`).
 * @throws {Error} If the arguments aren't functions.
 */
export function setDefaultRenderer(componentCtor: Function | null, rendererCtor: Function | null): void;
import { Component as Ui_Component } from "./component.js";
import { KeyHandler } from "../events/keyhandler.js";
import { Role } from "../a11y/aria/roles.js";
import { ControlContent } from "./controlcontent.js";
import { State } from "./component.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import { Event as EventsEvent } from "../events/event.js";
import { KeyEvent } from "../events/keyhandler.js";
import { DomHelper } from "../dom/dom.js";
declare class IeMouseEventSequenceSimulator_ extends Disposable {
    /**
     * @param {!MouseEvent} e
     * @param {?EventsEventType} typeArg
     * @return {!MouseEvent}
     * @private
     */
    private static makeLeftMouseEvent_;
    /**
     * A singleton that helps Control instances play well with screen
     * readers.  It necessitated by shortcomings in IE, and need not be
     * instantiated in any other browser.
     *
     * In most cases, a click on a Control results in a sequence of events:
     * MOUSEDOWN, MOUSEUP and CLICK.  UI controls rely on this sequence since most
     * behavior is trigged by MOUSEDOWN and MOUSEUP.  But when IE is used with some
     * traditional screen readers (JAWS, NVDA and perhaps others), IE only sends
     * the CLICK event, resulting in the control being unresponsive.  This class
     * monitors the sequence of these events, and if it detects a CLICK event not
     * not preceded by a MOUSEUP event, directly calls the control's event handlers
     * for MOUSEDOWN, then MOUSEUP.  While the resulting sequence is different from
     * the norm (the CLICK comes first instead of last), testing thus far shows
     * the resulting behavior to be correct.
     *
     * See http://goo.gl/qvQR4C for more details.
     *
     * @param {!Control} control
     * @private
     */
    private constructor();
    /** @private {Control}*/
    private control_;
    /** @private {boolean} */
    private clickExpected_;
    /** @private @const {!EventHandler<
     *                       !Control.IeMouseEventSequenceSimulator_>}
     */
    private handler_;
    /** @private */
    private handleMouseDown_;
    /** @private */
    private handleMouseUp_;
    /**
     * @param {!EventsEvent} e
     * @private
     */
    private handleClick_;
}
import { Disposable } from "../disposable/disposable.js";
export {};
