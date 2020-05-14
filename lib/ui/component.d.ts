/**
 * Common events fired by components so that event propagation is useful.  Not
 * all components are expected to dispatch or listen for all event types.
 * Events dispatched before a state transition should be cancelable to prevent
 * the corresponding state change.
 */
export type EventType = string;
/**
 * Common component states.  Components may have distinct appearance depending
 * on what state(s) apply to them.  Not all components are expected to support
 * all states.
 */
export type State = number;
/**
 * Errors thrown by the component.
 */
export type Component_Error = string;
/**
 * @type {boolean} Whether to support calling decorate with an element that is
 *     not yet in the document. If true, we check if the element is in the
 *     document, and avoid calling enterDocument if it isn't. If false, we
 *     maintain legacy behavior (always call enterDocument from decorate).
 */
export const ALLOW_DETACHED_DECORATION: boolean;
/**
 * @fileoverview Abstract class for all UI components. This defines the standard
 * design pattern that all UI components should follow.
 *
 * @see ../demos/samplecomponent.html
 * @see http://code.google.com/p/closure-library/wiki/IntroToComponents
 */
/**
 * Default implementation of UI component.
 *
 * @extends {EventsEventTarget}
 * @suppress {underscore}
 */
export class Component extends EventsEventTarget {
    /**
     * Static helper method; returns the type of event components are expected to
     * dispatch when transitioning to or from the given state.
     * @param {?State} state State to/from which the component
     *     is transitioning.
     * @param {boolean} isEntering Whether the component is entering or leaving the
     *     state.
     * @return {?EventType} Event type to dispatch.
     */
    static getStateTransitionEvent(state: State | null, isEntering: boolean): EventType | null;
    /**
     * Set the default right-to-left value. This causes all component's created from
     * this point forward to have the given value. This is useful for cases where
     * a given page is always in one directionality, avoiding unnecessary
     * right to left determinations.
     * @param {?boolean} rightToLeft Whether the components should be rendered
     *     right-to-left. Null iff components should determine their directionality.
     */
    static setDefaultRightToLeft(rightToLeft: boolean | null): void;
    /**
     * Default implementation of UI component.
     *
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     * @suppress {underscore}
     */
    constructor(opt_domHelper?: DomHelper | undefined);
    /**
     * Generator for unique IDs.
     * @type {?IdGenerator}
     * @private
     */
    private idGenerator_;
    /**
     * DomHelper used to interact with the document, allowing components to be
     * created in a different window.
     * @protected {!DomHelper}
     * @suppress {underscore|visibility}
     */
    protected dom_: goog_dom.DomHelper;
    /**
     * Whether the component is rendered right-to-left.  Right-to-left is set
     * lazily when {@link #isRightToLeft} is called the first time, unless it has
     * been set by calling {@link #setRightToLeft} explicitly.
     * @private {?boolean}
     */
    private rightToLeft_;
    /**
     * Unique ID of the component, lazily initialized in {@link
     * Component#getId} if needed.  This property is strictly private and
     * must not be accessed directly outside of this class!
     * @private {?string}
     */
    private id_;
    /**
     * Whether the component is in the document.
     * @private {boolean}
     */
    private inDocument_;
    /**
     * The DOM element for the component.
     * @private {Element|null}
     */
    private element_;
    /**
     * Event handler.
     * TODO(user): rename it to handler_ after all component subclasses in
     * inside Google have been cleaned up.
     * Code search: http://go/component_code_search
     * @private {EventHandler|undefined}
     */
    private googUiComponentHandler_;
    /**
     * Arbitrary data object associated with the component.  Such as meta-data.
     * @private {*}
     */
    private model_;
    /**
     * Parent component to which events will be propagated.  This property is
     * strictly private and must not be accessed directly outside of this class!
     * @private {Component?}
     */
    private parent_;
    /**
     * Array of child components.  Lazily initialized on first use.  Must be kept
     * in sync with `childIndex_`.  This property is strictly private and
     * must not be accessed directly outside of this class!
     * @private {?Array<?Component>}
     */
    private children_;
    /**
     * Map of child component IDs to child components.  Used for constant-time
     * random access to child components by ID.  Lazily initialized on first use.
     * Must be kept in sync with `children_`.  This property is strictly
     * private and must not be accessed directly outside of this class!
     *
     * We use a plain Object, not a {@link goog.structs.Map}, for simplicity.
     * This means components can't have children with IDs such as 'constructor' or
     * 'valueOf', but this shouldn't really be an issue in practice, and if it is,
     * we can always fix it later without changing the API.
     *
     * @private {?Object}
     */
    private childIndex_;
    /**
     * Flag used to keep track of whether a component decorated an already
     * existing element or whether it created the DOM itself.
     *
     * If an element is decorated, dispose will leave the node in the document.
     * It is up to the app to remove the node.
     *
     * If an element was rendered, dispose will remove the node automatically.
     *
     * @private {boolean}
     */
    private wasDecorated_;
    /**
     * If true, listen for PointerEvent types rather than MouseEvent types. This
     * allows supporting drag gestures for touch/stylus input.
     * @private {boolean}
     */
    private pointerEventsEnabled_;
    /**
     * Gets the unique ID for the instance of this component.  If the instance
     * doesn't already have an ID, generates one on the fly.
     * @return {string} Unique component ID.
     */
    getId(): string;
    /**
     * Assigns an ID to this component instance.  It is the caller's responsibility
     * to guarantee that the ID is unique.  If the component is a child of a parent
     * component, then the parent component's child index is updated to reflect the
     * new ID; this may throw an error if the parent already has a child with an ID
     * that conflicts with the new ID.
     * @param {string} id Unique component ID.
     */
    setId(id: string): void;
    /**
     * Gets the component's element.
     * @return {?Element} The element for the component.
     */
    getElement(): Element | null;
    /**
     * Gets the component's element. This differs from getElement in that
     * it assumes that the element exists (i.e. the component has been
     * rendered/decorated) and will cause an assertion error otherwise (if
     * assertion is enabled).
     * @return {!Element} The element for the component.
     */
    getElementStrict(): Element;
    /**
     * Sets the component's root element to the given element.  Considered
     * protected and final.
     *
     * This should generally only be called during createDom. Setting the element
     * does not actually change which element is rendered, only the element that is
     * associated with this UI component.
     *
     * This should only be used by subclasses and its associated renderers.
     *
     * @param {?Element} element Root element for the component.
     */
    setElementInternal(element: Element | null): void;
    /**
     * Returns an array of all the elements in this component's DOM with the
     * provided className.
     * @param {string} className The name of the class to look for.
     * @return {!ArrayLike<!Element>} The items found with the class name provided.
     */
    getElementsByClass(className: string): ArrayLike<Element>;
    /**
     * Returns the first element in this component's DOM with the provided
     * className.
     * @param {string} className The name of the class to look for.
     * @return {?Element} The first item with the class name provided.
     */
    getElementByClass(className: string): Element | null;
    /**
     * Similar to `getElementByClass` except that it expects the
     * element to be present in the dom thus returning a required value. Otherwise,
     * will assert.
     * @param {string} className The name of the class to look for.
     * @return {!Element} The first item with the class name provided.
     */
    getRequiredElementByClass(className: string): Element;
    /**
     * Returns the event handler for this component, lazily created the first time
     * this method is called.
     * @return {!EventHandler<T>} Event handler for this component.
     * @protected
     * @this {T}
     * @template T
     */
    protected getHandler<T>(): EventHandler<T>;
    /**
     * Sets the parent of this component to use for event bubbling.  Throws an error
     * if the component already has a parent or if an attempt is made to add a
     * component to itself as a child.  Callers must use `removeChild`
     * or `removeChildAt` to remove components from their containers before
     * calling this method.
     * @see Component#removeChild
     * @see Component#removeChildAt
     * @param {?Component} parent The parent component.
     */
    setParent(parent: Component | null): void;
    /**
     * Returns the component's parent, if any.
     * @return {?Component} The parent component.
     */
    getParent(): Component | null;
    /**
     * Returns the dom helper that is being used on this component.
     * @return {!DomHelper} The dom helper used on this component.
     */
    getDomHelper(): DomHelper;
    /**
     * Determines whether the component has been added to the document.
     * @return {boolean} TRUE if rendered. Otherwise, FALSE.
     */
    isInDocument(): boolean;
    /**
     * Creates the initial DOM representation for the component.  The default
     * implementation is to set this.element_ = div.
     */
    createDom(): void;
    /**
     * Renders the component.  If a parent element is supplied, the component's
     * element will be appended to it.  If there is no optional parent element and
     * the element doesn't have a parentNode then it will be appended to the
     * document body.
     *
     * If this component has a parent component, and the parent component is
     * not in the document already, then this will not call `enterDocument`
     * on this component.
     *
     * Throws an Error if the component is already rendered.
     *
     * @param {?Element=} opt_parentElement Optional parent element to render the
     *    component into.
     */
    render(opt_parentElement?: (Element | null) | undefined): void;
    /**
     * Renders the component before another element. The other element should be in
     * the document already.
     *
     * Throws an Error if the component is already rendered.
     *
     * @param {?Node} sibling Node to render the component before.
     */
    renderBefore(sibling: Node | null): void;
    /**
     * Renders the component.  If a parent element is supplied, the component's
     * element will be appended to it.  If there is no optional parent element and
     * the element doesn't have a parentNode then it will be appended to the
     * document body.
     *
     * If this component has a parent component, and the parent component is
     * not in the document already, then this will not call `enterDocument`
     * on this component.
     *
     * Throws an Error if the component is already rendered.
     *
     * @param {?Element=} opt_parentElement Optional parent element to render the
     *    component into.
     * @param {Node=} opt_beforeNode Node before which the component is to
     *    be rendered.  If left out the node is appended to the parent element.
     * @private
     */
    private render_;
    /**
     * Decorates the element for the UI component. If the element is in the
     * document, the enterDocument method will be called.
     *
     * If ALLOW_DETACHED_DECORATION is false, the caller must
     * pass an element that is in the document.
     *
     * @param {?Element} element Element to decorate.
     */
    decorate(element: Element | null): void;
    /**
     * Determines if a given element can be decorated by this type of component.
     * This method should be overridden by inheriting objects.
     * @param {?Element} element Element to decorate.
     * @return {boolean} True if the element can be decorated, false otherwise.
     */
    canDecorate(element: Element | null): boolean;
    /**
     * @return {boolean} Whether the component was decorated.
     */
    wasDecorated(): boolean;
    /**
     * Actually decorates the element. Should be overridden by inheriting objects.
     * This method can assume there are checks to ensure the component has not
     * already been rendered have occurred and that enter document will be called
     * afterwards. This method is considered protected.
     * @param {?Element} element Element to decorate.
     * @protected
     */
    protected decorateInternal(element: Element | null): void;
    /**
     * Called when the component's element is known to be in the document. Anything
     * using document.getElementById etc. should be done at this stage.
     *
     * If the component contains child components, this call is propagated to its
     * children.
     */
    enterDocument(): void;
    /**
     * Called by dispose to clean up the elements and listeners created by a
     * component, or by a parent component/application who has removed the
     * component from the document but wants to reuse it later.
     *
     * If the component contains child components, this call is propagated to its
     * children.
     *
     * It should be possible for the component to be rendered again once this method
     * has been called.
     */
    exitDocument(): void;
    /**
     * Helper function for subclasses that gets a unique id for a given fragment,
     * this can be used by components to generate unique string ids for DOM
     * elements.
     * @param {string} idFragment A partial id.
     * @return {string} Unique element id.
     */
    makeId(idFragment: string): string;
    /**
     * Makes a collection of ids.  This is a convenience method for makeId.  The
     * object's values are the id fragments and the new values are the generated
     * ids.  The key will remain the same.
     * @param {?Object} object The object that will be used to create the ids.
     * @return {!Object<string, string>} An object of id keys to generated ids.
     */
    makeIds(object: any | null): {
        [x: string]: string;
    };
    /**
     * Returns the model associated with the UI component.
     * @return {*} The model.
     */
    getModel(): any;
    /**
     * Sets the model associated with the UI component.
     * @param {*} obj The model.
     */
    setModel(obj: any): void;
    /**
     * Helper function for returning the fragment portion of an id generated using
     * makeId().
     * @param {string} id Id generated with makeId().
     * @return {string} Fragment.
     */
    getFragmentFromId(id: string): string;
    /**
     * Helper function for returning an element in the document with a unique id
     * generated using makeId().
     * @param {string} idFragment The partial id.
     * @return {?Element} The element with the unique id, or null if it cannot be
     *     found.
     */
    getElementByFragment(idFragment: string): Element | null;
    /**
     * Adds the specified component as the last child of this component.  See
     * {@link Component#addChildAt} for detailed semantics.
     *
     * @see Component#addChildAt
     * @param {?Component} child The new child component.
     * @param {boolean=} opt_render If true, the child component will be rendered
     *    into the parent.
     */
    addChild(child: Component | null, opt_render?: boolean | undefined): void;
    /**
     * Adds the specified component as a child of this component at the given
     * 0-based index.
     *
     * Both `addChild` and `addChildAt` assume the following contract
     * between parent and child components:
     *  <ul>
     *    <li>the child component's element must be a descendant of the parent
     *        component's element, and
     *    <li>the DOM state of the child component must be consistent with the DOM
     *        state of the parent component (see `isInDocument`) in the
     *        steady state -- the exception is to addChildAt(child, i, false) and
     *        then immediately decorate/render the child.
     *  </ul>
     *
     * In particular, `parent.addChild(child)` will throw an error if the
     * child component is already in the document, but the parent isn't.
     *
     * Clients of this API may call `addChild` and `addChildAt` with
     * `opt_render` set to true.  If `opt_render` is true, calling these
     * methods will automatically render the child component's element into the
     * parent component's element. If the parent does not yet have an element, then
     * `createDom` will automatically be invoked on the parent before
     * rendering the child.
     *
     * Invoking {@code parent.addChild(child, true)} will throw an error if the
     * child component is already in the document, regardless of the parent's DOM
     * state.
     *
     * If `opt_render` is true and the parent component is not already
     * in the document, `enterDocument` will not be called on this component
     * at this point.
     *
     * Finally, this method also throws an error if the new child already has a
     * different parent, or the given index is out of bounds.
     *
     * @see Component#addChild
     * @param {?Component} child The new child component.
     * @param {number} index 0-based index at which the new child component is to be
     *    added; must be between 0 and the current child count (inclusive).
     * @param {boolean=} opt_render If true, the child component will be rendered
     *    into the parent.
     * @return {void} Nada.
     */
    addChildAt(child: Component | null, index: number, opt_render?: boolean | undefined): void;
    /**
     * Returns the DOM element into which child components are to be rendered,
     * or null if the component itself hasn't been rendered yet.  This default
     * implementation returns the component's root element.  Subclasses with
     * complex DOM structures must override this method.
     * @return {?Element} Element to contain child elements (null if none).
     */
    getContentElement(): Element | null;
    /**
     * Returns true if the component is rendered right-to-left, false otherwise.
     * The first time this function is invoked, the right-to-left rendering property
     * is set if it has not been already.
     * @return {boolean} Whether the control is rendered right-to-left.
     */
    isRightToLeft(): boolean;
    /**
     * Set is right-to-left. This function should be used if the component needs
     * to know the rendering direction during dom creation (i.e. before
     * {@link #enterDocument} is called and is right-to-left is set).
     * @param {boolean} rightToLeft Whether the component is rendered
     *     right-to-left.
     */
    setRightToLeft(rightToLeft: boolean): void;
    /**
     * Returns true if the component has children.
     * @return {boolean} True if the component has children.
     */
    hasChildren(): boolean;
    /**
     * Returns the number of children of this component.
     * @return {number} The number of children.
     */
    getChildCount(): number;
    /**
     * Returns an array containing the IDs of the children of this component, or an
     * empty array if the component has no children.
     * @return {!Array<string>} Child component IDs.
     */
    getChildIds(): Array<string>;
    /**
     * Returns the child with the given ID, or null if no such child exists.
     * @param {string} id Child component ID.
     * @return {?Component} The child with the given ID; null if none.
     */
    getChild(id: string): Component | null;
    /**
     * Returns the child at the given index, or null if the index is out of bounds.
     * @param {number} index 0-based index.
     * @return {?Component} The child at the given index; null if none.
     */
    getChildAt(index: number): Component | null;
    /**
     * Calls the given function on each of this component's children in order.  If
     * `opt_obj` is provided, it will be used as the 'this' object in the
     * function when called.  The function should take two arguments:  the child
     * component and its 0-based index.  The return value is ignored.
     * @param {function(this:T,?,number):?} f The function to call for every
     * child component; should take 2 arguments (the child and its index).
     * @param {T=} opt_obj Used as the 'this' object in f when called.
     * @template T
     */
    forEachChild<T>(f: (this: T, arg1: Component, arg2: number) => unknown, opt_obj?: T | undefined): void;
    /**
     * Returns the 0-based index of the given child component, or -1 if no such
     * child is found.
     * @param {?Component} child The child component.
     * @return {number} 0-based index of the child component; -1 if not found.
     */
    indexOfChild(child: Component | null): number;
    /**
     * Removes the given child from this component, and returns it.  Throws an error
     * if the argument is invalid or if the specified child isn't found in the
     * parent component.  The argument can either be a string (interpreted as the
     * ID of the child component to remove) or the child component itself.
     *
     * If `opt_unrender` is true, calls {@link goog.ui.component#exitDocument}
     * on the removed child, and subsequently detaches the child's DOM from the
     * document.  Otherwise it is the caller's responsibility to clean up the child
     * component's DOM.
     *
     * @see Component#removeChildAt
     * @param {string|Component|null} child The ID of the child to remove,
     *    or the child component itself.
     * @param {boolean=} opt_unrender If true, calls `exitDocument` on the
     *    removed child component, and detaches its DOM from the document.
     * @return {?Component} The removed component, if any.
     */
    removeChild(child: string | Component | null, opt_unrender?: boolean | undefined): Component | null;
    /**
     * Removes the child at the given index from this component, and returns it.
     * Throws an error if the argument is out of bounds, or if the specified child
     * isn't found in the parent.  See {@link Component#removeChild} for
     * detailed semantics.
     *
     * @see Component#removeChild
     * @param {number} index 0-based index of the child to remove.
     * @param {boolean=} opt_unrender If true, calls `exitDocument` on the
     *    removed child component, and detaches its DOM from the document.
     * @return {?Component} The removed component, if any.
     */
    removeChildAt(index: number, opt_unrender?: boolean | undefined): Component | null;
    /**
     * Removes every child component attached to this one and returns them.
     *
     * @see Component#removeChild
     * @param {boolean=} opt_unrender If true, calls {@link #exitDocument} on the
     *    removed child components, and detaches their DOM from the document.
     * @return {!Array<Component>} The removed components if any.
     */
    removeChildren(opt_unrender?: boolean | undefined): Array<Component>;
    /**
     * Returns whether this component should listen for PointerEvent types rather
     * than MouseEvent types. This allows supporting drag gestures for touch/stylus
     * input.
     * @return {boolean}
     */
    pointerEventsEnabled(): boolean;
    /**
     * Indicates whether this component should listen for PointerEvent types rather
     * than MouseEvent types. This allows supporting drag gestures for touch/stylus
     * input. Must be called before enterDocument to listen for the correct event
     * types.
     * @param {boolean} enable
     */
    setPointerEventsEnabled(enable: boolean): void;
}
export namespace Component {
    export const defaultRightToLeft_: boolean | null;
}
declare namespace Component_Error {
    export const NOT_SUPPORTED: string;
    export const DECORATE_INVALID: string;
    export const ALREADY_RENDERED: string;
    export const PARENT_UNABLE_TO_BE_SET: string;
    export const CHILD_INDEX_OUT_OF_BOUNDS: string;
    export const NOT_OUR_CHILD: string;
    export const NOT_IN_DOCUMENT: string;
    export const STATE_INVALID: string;
}
/**
 * @type {number} Defines the default BIDI directionality.
 *     0: Unknown.
 *     1: Left-to-right.
 *     -1: Right-to-left.
 */
export const DEFAULT_BIDI_DIR: number;
export namespace EventType {
    export const BEFORE_SHOW: string;
    export const SHOW: string;
    export const HIDE: string;
    export const DISABLE: string;
    export const ENABLE: string;
    export const HIGHLIGHT: string;
    export const UNHIGHLIGHT: string;
    export const ACTIVATE: string;
    export const DEACTIVATE: string;
    export const SELECT: string;
    export const UNSELECT: string;
    export const CHECK: string;
    export const UNCHECK: string;
    export const FOCUS: string;
    export const BLUR: string;
    export const OPEN: string;
    export const CLOSE: string;
    export const ENTER: string;
    export const LEAVE: string;
    export const ACTION: string;
    export const CHANGE: string;
}
export namespace State {
    export const ALL: number;
    export const DISABLED: number;
    export const HOVER: number;
    export const ACTIVE: number;
    export const SELECTED: number;
    export const CHECKED: number;
    export const FOCUSED: number;
    export const OPENED: number;
}
import { EventTarget as EventsEventTarget } from "../events/eventhandler.js";
import * as goog_dom from "../dom/dom.js";
import { EventHandler } from "../events/eventhandler.js";
import { DomHelper } from "../dom/dom.js";
export { Component_Error as Error };
