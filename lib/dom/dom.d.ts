/**
 * Typedef for use with createDom and append.
 */
export type Appendable = any;
/**
 * Gets an element from the current document by element id.
 *
 * If an Element is passed in, it is returned.
 *
 * @param {string|?Element} element Element ID or a DOM node.
 * @return {?Element} The element with the given ID, or the node passed in.
 * @deprecated Use document.getElementById(id) instead
 */
export function $(element: string | (Element | null)): Element | null;
/**
 * Looks up elements by both tag and class name, using browser native functions
 * (`querySelectorAll`, `getElementsByTagName` or
 * `getElementsByClassName`) where possible. This function
 * is a useful, if limited, way of collecting a list of DOM elements
 * with certain characteristics.  `querySelectorAll` offers a
 * more powerful and general solution which allows matching on CSS3
 * selector expressions.
 *
 * Note that tag names are case sensitive in the SVG namespace, and this
 * function converts opt_tag to uppercase for comparisons. For queries in the
 * SVG namespace you should use querySelector or querySelectorAll instead.
 * https://bugzilla.mozilla.org/show_bug.cgi?id=963870
 * https://bugs.webkit.org/show_bug.cgi?id=83438
 *
 * @see {https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll}
 *
 * @param {(string|?TagName<T>)=} opt_tag Element tag name.
 * @param {?string=} opt_class Optional class name.
 * @param {(Document|?Element)=} opt_el Optional element to look in.
 * @return {!ArrayLike<R>} Array-like list of elements (only a length property
 *     and numerical indices are guaranteed to exist). The members of the array
 *     are {!Element} if opt_tag is not a member of TagName or more
 *     specific types if it is (e.g. {!HTMLAnchorElement} for
 *     TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
export function $$(opt_tag?: string | null | undefined, opt_class?: (string | null) | undefined, opt_el?: (Document | (Element | null)) | undefined): ArrayLike<Element>;
export function $$<T>(opt_tag?: TagName<T> | null | undefined, opt_class?: (string | null) | undefined, opt_el?: (Document | (Element | null)) | undefined): ArrayLike<T>;
/**
 * Returns a dom node with a set of attributes.  This function accepts varargs
 * for subsequent nodes to be added.  Subsequent nodes will be added to the
 * first node as childNodes.
 *
 * So:
 * <code>createDom(TagName.DIV, null, createDom(TagName.P),
 * createDom(TagName.P));</code> would return a div with two child
 * paragraphs
 *
 * This function uses {@link setProperties} to set attributes: the
 * `opt_attributes` parameter follows the same rules.
 *
 * @param {string|!TagName<T>} tagName Tag to create.
 * @param {?Object|?Array<string>|string=} opt_attributes If object, then a map
 *     of name-value pairs for attributes. If a string, then this is the
 *     className of the new element. If an array, the elements will be joined
 *     together as the className of the new element.
 * @param {...(Object|string|Array|NodeList|null|undefined)} var_args Further
 *     DOM nodes or strings for text nodes. If one of the var_args is an array
 *     or NodeList, its elements will be added as childNodes instead.
 * @return {R} Reference to a DOM node. The return type is {!Element} if tagName
 *     is a string or a more specific type if it is a member of
 *     TagName (e.g. {!HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
export function $dom(tagName: string, opt_attributes?: ((any | ((Array<string> | string) | null)) | null) | undefined, ...args: any[]): Element;
export function $dom<T>(tagName: TagName<T>, opt_attributes?: ((any | ((Array<string> | string) | null)) | null) | undefined, ...args: any[]): T;
/**
 * @fileoverview Utilities for manipulating the browser's Document Object Model
 * Inspiration taken *heavily* from mochikit (http://mochikit.com/).
 *
 * You can use {@link DomHelper} to create new dom helpers that refer
 * to a different document object.  This is useful if you are working with
 * frames or multiple windows.
 *
 * @suppress {strictMissingProperties}
 */
/**
 * @type {boolean} Whether we know at compile time that the browser is in
 * quirks mode.
 */
export const ASSUME_QUIRKS_MODE: boolean;
/**
 * @type {boolean} Whether we know at compile time that the browser is in
 * standards compliance mode.
 */
export const ASSUME_STANDARDS_MODE: boolean;
/**
 * Typedef for use with createDom and append.
 * @typedef {Object|string|Array|NodeList}
 */
export let Appendable: any;
/**
 * Create an instance of a DOM helper with a new document object.
 *     DOM helper.
 */
export class DomHelper {
    /**
     * Create an instance of a DOM helper with a new document object.
     * @param {Document=} opt_document Document object to associate with this
     *     DOM helper.
     */
    constructor(opt_document?: Document | undefined);
    /**
     * Reference to the document object to use
     * @type {!Document}
     * @private
     */
    private document_;
    /**
     * Gets the dom helper object for the document where the element resides.
     * @param {Node=} opt_node If present, gets the DomHelper for this node.
     * @return {!DomHelper} The DomHelper.
     */
    getDomHelper(opt_node?: Node | undefined): DomHelper;
    /**
     * Sets the document object.
     * @param {!Document} document Document object.
     */
    setDocument(document: Document): void;
    /**
     * Gets the document object being used by the dom library.
     * @return {!Document} Document object.
     */
    getDocument(): Document;
    /**
     * Alias for `getElementById`. If a DOM node is passed in then we just
     * return that.
     * @param {string|?Element} element Element ID or a DOM node.
     * @return {?Element} The element with the given ID, or the node passed in.
     */
    getElement(element: string | (Element | null)): Element | null;
    /**
     * Gets an element by id, asserting that the element is found.
     *
     * This is used when an element is expected to exist, and should fail with
     * an assertion error if it does not (if assertions are enabled).
     *
     * @param {string} id Element ID.
     * @return {!Element} The element with the given ID, if it exists.
     */
    getRequiredElement(id: string): Element;
    /**
     * Gets elements by tag name.
     * @param {!TagName<T>} tagName
     * @param {(!Document|!Element)=} opt_parent Parent element or document where to
     *     look for elements. Defaults to document of this DomHelper.
     * @return {!NodeList<R>} List of elements. The members of the list are
     *     {!Element} if tagName is not a member of TagName or more
     *     specific types if it is (e.g. {!HTMLAnchorElement} for
     *     TagName.A).
     * @template T
     * @template R := cond(isUnknown(T), 'Element', T) =:
     */
    getElementsByTagName<T, R>(tagName: TagName<T>, opt_parent?: (Document | Element) | undefined): any;
    /**
     * Looks up elements by both tag and class name, using browser native functions
     * (`querySelectorAll`, `getElementsByTagName` or
     * `getElementsByClassName`) where possible. The returned array is a live
     * NodeList or a static list depending on the code path taken.
     *
     * @param {(string|?TagName<T>)=} opt_tag Element tag name or * for all
     *     tags.
     * @param {?string=} opt_class Optional class name.
     * @param {(Document|?Element)=} opt_el Optional element to look in.
     * @return {!ArrayLike<R>} Array-like list of elements (only a length property
     *     and numerical indices are guaranteed to exist). The members of the array
     *     are {!Element} if opt_tag is not a member of TagName or more
     *     specific types if it is (e.g. {!HTMLAnchorElement} for
     *     TagName.A).
     * @template T
     * @template R := cond(isUnknown(T), 'Element', T) =:
     */
    getElementsByTagNameAndClass<T, R>(opt_tag?: string | TagName<T> | null | undefined, opt_class?: (string | null) | undefined, opt_el?: (Document | (Element | null)) | undefined): ArrayLike<R>;
    /**
     * Gets the first element matching the tag and the class.
     *
     * @param {(string|?TagName<T>)=} opt_tag Element tag name.
     * @param {?string=} opt_class Optional class name.
     * @param {(Document|?Element)=} opt_el Optional element to look in.
     * @return {?R} Reference to a DOM node. The return type is {Element|null} if
     *     tagName is a string or a more specific type if it is a member of
     *     TagName (e.g. {?HTMLAnchorElement} for TagName.A).
     * @template T
     * @template R := cond(isUnknown(T), 'Element', T) =:
     */
    getElementByTagNameAndClass<T, R_4>(opt_tag?: string | TagName<T> | null | undefined, opt_class?: (string | null) | undefined, opt_el?: (Document | (Element | null)) | undefined): R_4 | null;
    /**
     * Returns an array of all the elements with the provided className.
     * @param {string} className the name of the class to look for.
     * @param {?Element|Document=} opt_el Optional element to look in.
     * @return {!ArrayLike<!Element>} The items found with the class name provided.
     */
    getElementsByClass(className: string, opt_el?: ((Element | Document) | null) | undefined): ArrayLike<Element>;
    /**
     * Returns the first element we find matching the provided class name.
     * @param {string} className the name of the class to look for.
     * @param {(?Element|Document)=} opt_el Optional element to look in.
     * @return {?Element} The first item found with the class name provided.
     */
    getElementByClass(className: string, opt_el?: ((Element | Document) | null) | undefined): Element | null;
    /**
     * Ensures an element with the given className exists, and then returns the
     * first element with the provided className.
     * @param {string} className the name of the class to look for.
     * @param {(!Element|!Document)=} opt_root Optional element or document to look
     *     in.
     * @return {!Element} The first item found with the class name provided.
     * @throws {AssertionError} Thrown if no element is found.
     */
    getRequiredElementByClass(className: string, opt_root?: (Element | Document) | undefined): Element;
    /**
     * Sets a number of properties on a node.
     * @param {?Element} element DOM node to set properties on.
     * @param {?Object} properties Hash of property:value pairs.
     */
    setProperties(element: Element | null, properties: any | null): void;
    /**
     * Gets the dimensions of the viewport.
     * @param {Window=} opt_window Optional window element to test. Defaults to
     *     the window of the Dom Helper.
     * @return {!Size} Object with values 'width' and 'height'.
     */
    getViewportSize(opt_window?: Window | undefined): Size;
    /**
     * Calculates the height of the document.
     *
     * @return {number} The height of the document.
     */
    getDocumentHeight(): number;
    /**
     * Returns a dom node with a set of attributes.  This function accepts varargs
     * for subsequent nodes to be added.  Subsequent nodes will be added to the
     * first node as childNodes.
     *
     * So:
     * <code>createDom(TagName.DIV, null, createDom(TagName.P),
     * createDom(TagName.P));</code> would return a div with two child
     * paragraphs
     *
     * An easy way to move all child nodes of an existing element to a new parent
     * element is:
     * <code>createDom(TagName.DIV, null, oldElement.childNodes);</code>
     * which will remove all child nodes from the old element and add them as
     * child nodes of the new DIV.
     *
     * @param {string|!TagName<T>} tagName Tag to create.
     * @param {?Object|?Array<string>|string=} opt_attributes If object, then a map
     *     of name-value pairs for attributes. If a string, then this is the
     *     className of the new element. If an array, the elements will be joined
     *     together as the className of the new element.
     * @param {...(Appendable|undefined)} var_args Further DOM nodes or
     *     strings for text nodes. If one of the var_args is an array or
     *     NodeList, its elements will be added as childNodes instead.
     * @return {R} Reference to a DOM node. The return type is {!Element} if tagName
     *     is a string or a more specific type if it is a member of
     *     TagName (e.g. {!HTMLAnchorElement} for TagName.A).
     * @template T
     * @template R := cond(isUnknown(T), 'Element', T) =:
     */
    createDom<T_4, R_6>(tagName: string | TagName<T_4>, opt_attributes?: ((any | ((Array<string> | string) | null)) | null) | undefined, ...args: any[]): R_6;
    /**
     * Creates a new element.
     * @param {string|!TagName<T>} name Tag to create.
     * @return {R} The new element. The return type is {!Element} if name is
     *     a string or a more specific type if it is a member of TagName
     *     (e.g. {!HTMLAnchorElement} for TagName.A).
     * @template T
     * @template R := cond(isUnknown(T), 'Element', T) =:
     */
    createElement<T_5, R_8>(name: string | TagName<T_5>): R_8;
    /**
     * Creates a new text node.
     * @param {number|string} content Content.
     * @return {!Text} The new text node.
     */
    createTextNode(content: number | string): Text;
    /**
     * Create a table.
     * @param {number} rows The number of rows in the table.  Must be >= 1.
     * @param {number} columns The number of columns in the table.  Must be >= 1.
     * @param {boolean=} opt_fillWithNbsp If true, fills table entries with
     *     `Unicode.NBSP` characters.
     * @return {!HTMLElement} The created table.
     */
    createTable(rows: number, columns: number, opt_fillWithNbsp?: boolean | undefined): HTMLElement;
    /**
     * Converts an HTML into a node or a document fragment. A single Node is used if
     * `html` only generates a single node. If `html` generates multiple
     * nodes then these are put inside a `DocumentFragment`. This is a safe
     * version of `DomHelper#htmlToDocumentFragment` which is now
     * deleted.
     * @param {!SafeHtml} html The HTML markup to convert.
     * @return {!Node} The resulting node.
     */
    safeHtmlToNode(html: SafeHtml): Node;
    /**
     * Returns true if the browser is in "CSS1-compatible" (standards-compliant)
     * mode, false otherwise.
     * @return {boolean} True if in CSS1-compatible mode.
     */
    isCss1CompatMode(): boolean;
    /**
     * Gets the window object associated with the document.
     * @return {!Window} The window associated with the given document.
     */
    getWindow(): Window;
    /**
     * Gets the document scroll element.
     * @return {!Element} Scrolling element.
     */
    getDocumentScrollElement(): Element;
    /**
     * Gets the document scroll distance as a coordinate object.
     * @return {!Coordinate} Object with properties 'x' and 'y'.
     */
    getDocumentScroll(): Coordinate;
    /**
     * Determines the active element in the given document.
     * @param {Document=} opt_doc The document to look in.
     * @return {?Element} The active element.
     */
    getActiveElement(opt_doc?: Document | undefined): Element | null;
    /**
     * Appends a child to a node.
     * @param {?Node} parent Parent.
     * @param {?Node} child Child.
     */
    appendChild(parent: Node | null, child: Node | null): void;
    /**
     * Appends a node with text or other nodes.
     * @param {!Node} parent The node to append nodes to.
     * @param {...Appendable} var_args The things to append to the node.
     *     If this is a Node it is appended as is.
     *     If this is a string then a text node is appended.
     *     If this is an array like object then fields 0 to length - 1 are appended.
     */
    append(parent: Node, var_args: Appendable[]): void;
    /**
     * Determines if the given node can contain children, intended to be used for
     * HTML generation.
     *
     * @param {?Node} node The node to check.
     * @return {boolean} Whether the node can contain children.
     */
    canHaveChildren(node: Node | null): boolean;
    /**
     * Removes all the child nodes on a DOM node.
     * @param {?Node} node Node to remove children from.
     */
    removeChildren(node: Node | null): void;
    /**
     * Inserts a new node before an existing reference node (i.e., as the previous
     * sibling). If the reference node has no parent, then does nothing.
     * @param {?Node} newNode Node to insert.
     * @param {?Node} refNode Reference node to insert before.
     */
    insertSiblingBefore(newNode: Node | null, refNode: Node | null): void;
    /**
     * Inserts a new node after an existing reference node (i.e., as the next
     * sibling). If the reference node has no parent, then does nothing.
     * @param {?Node} newNode Node to insert.
     * @param {?Node} refNode Reference node to insert after.
     */
    insertSiblingAfter(newNode: Node | null, refNode: Node | null): void;
    /**
     * Insert a child at a given index. If index is larger than the number of child
     * nodes that the parent currently has, the node is inserted as the last child
     * node.
     * @param {?Element} parent The element into which to insert the child.
     * @param {?Node} child The element to insert.
     * @param {number} index The index at which to insert the new child node. Must
     *     not be negative.
     */
    insertChildAt(parent: Element | null, child: Node | null, index: number): void;
    /**
     * Removes a node from its parent.
     * @param {?Node} node The node to remove.
     * @return {?Node} The node removed if removed; else, null.
     */
    removeNode(node: Node | null): Node | null;
    /**
     * Replaces a node in the DOM tree. Will do nothing if `oldNode` has no
     * parent.
     * @param {?Node} newNode Node to insert.
     * @param {?Node} oldNode Node to replace.
     */
    replaceNode(newNode: Node | null, oldNode: Node | null): void;
    /**
     * Flattens an element. That is, removes it and replace it with its children.
     * @param {?Element} element The element to flatten.
     * @return {?Element|undefined} The original element, detached from the document
     *     tree, sans children, or undefined if the element was already not in the
     *     document.
     */
    flattenElement(element: Element | null): (Element | undefined) | null;
    /**
     * Returns an array containing just the element children of the given element.
     * @param {?Element} element The element whose element children we want.
     * @return {!(Array<!Element>|NodeList<!Element>)} An array or array-like list
     *     of just the element children of the given element.
     */
    getChildren(element: Element | null): (Array<Element> | NodeListOf<Element>);
    /**
     * Returns the first child node that is an element.
     * @param {?Node} node The node to get the first child element of.
     * @return {?Element} The first child node of `node` that is an element.
     */
    getFirstElementChild(node: Node | null): Element | null;
    /**
     * Returns the last child node that is an element.
     * @param {?Node} node The node to get the last child element of.
     * @return {?Element} The last child node of `node` that is an element.
     */
    getLastElementChild(node: Node | null): Element | null;
    /**
     * Returns the first next sibling that is an element.
     * @param {?Node} node The node to get the next sibling element of.
     * @return {?Element} The next sibling of `node` that is an element.
     */
    getNextElementSibling(node: Node | null): Element | null;
    /**
     * Returns the first previous sibling that is an element.
     * @param {?Node} node The node to get the previous sibling element of.
     * @return {?Element} The first previous sibling of `node` that is
     *     an element.
     */
    getPreviousElementSibling(node: Node | null): Element | null;
    /**
     * Returns the next node in source order from the given node.
     * @param {?Node} node The node.
     * @return {?Node} The next node in the DOM tree, or null if this was the last
     *     node.
     */
    getNextNode(node: Node | null): Node | null;
    /**
     * Returns the previous node in source order from the given node.
     * @param {?Node} node The node.
     * @return {?Node} The previous node in the DOM tree, or null if this was the
     *     first node.
     */
    getPreviousNode(node: Node | null): Node | null;
    /**
     * Whether the object looks like a DOM node.
     * @param {?} obj The object being tested for node likeness.
     * @return {boolean} Whether the object looks like a DOM node.
     */
    isNodeLike(obj: unknown): boolean;
    /**
     * Whether the object looks like an Element.
     * @param {?} obj The object being tested for Element likeness.
     * @return {boolean} Whether the object looks like an Element.
     */
    isElement(obj: unknown): boolean;
    /**
     * Returns true if the specified value is a Window object. This includes the
     * global window for HTML pages, and iframe windows.
     * @param {?} obj Variable to test.
     * @return {boolean} Whether the variable is a window.
     */
    isWindow(obj: unknown): boolean;
    /**
     * Returns an element's parent, if it's an Element.
     * @param {?Element} element The DOM element.
     * @return {?Element} The parent, or null if not an Element.
     */
    getParentElement(element: Element | null): Element | null;
    /**
     * Whether a node contains another node.
     * @param {?Node} parent The node that should contain the other node.
     * @param {?Node} descendant The node to test presence of.
     * @return {boolean} Whether the parent node contains the descendant node.
     */
    contains(parent: Node | null, descendant: Node | null): boolean;
    /**
     * Compares the document order of two nodes, returning 0 if they are the same
     * node, a negative number if node1 is before node2, and a positive number if
     * node2 is before node1.  Note that we compare the order the tags appear in the
     * document so in the tree <b><i>text</i></b> the B node is considered to be
     * before the I node.
     *
     * @param {?Node} node1 The first node to compare.
     * @param {?Node} node2 The second node to compare.
     * @return {number} 0 if the nodes are the same node, a negative number if node1
     *     is before node2, and a positive number if node2 is before node1.
     */
    compareNodeOrder(node1: Node | null, node2: Node | null): number;
    /**
     * Find the deepest common ancestor of the given nodes.
     * @param {...Node} var_args The nodes to find a common ancestor of.
     * @return {?Node} The common ancestor of the nodes, or null if there is none.
     *     null will only be returned if two or more of the nodes are from different
     *     documents.
     */
    findCommonAncestor(var_args: Node[]): Node | null;
    /**
     * Returns the owner document for a node.
     * @param {?Node} node The node to get the document for.
     * @return {!Document} The document owning the node.
     */
    getOwnerDocument(node: Node | null): Document;
    /**
     * Cross browser function for getting the document element of an iframe.
     * @param {?Element} iframe Iframe element.
     * @return {!Document} The frame content document.
     */
    getFrameContentDocument(iframe: Element | null): Document;
    /**
     * Cross browser function for getting the window of a frame or iframe.
     * @param {?Element} frame Frame element.
     * @return {?Window} The window associated with the given frame.
     */
    getFrameContentWindow(frame: Element | null): Window | null;
    /**
     * Sets the text content of a node, with cross-browser support.
     * @param {?Node} node The node to change the text content of.
     * @param {string|number} text The value that should replace the node's content.
     */
    setTextContent(node: Node | null, text: string | number): void;
    /**
     * Gets the outerHTML of a node, which islike innerHTML, except that it
     * actually contains the HTML of the node itself.
     * @param {?Element} element The element to get the HTML of.
     * @return {string} The outerHTML of the given element.
     */
    getOuterHtml(element: Element | null): string;
    /**
     * Finds the first descendant node that matches the filter function. This does
     * a depth first search.
     * @param {?Node} root The root of the tree to search.
     * @param {function(Node) : boolean} p The filter function.
     * @return {Node|undefined} The found node or undefined if none is found.
     */
    findNode(root: Node | null, p: (arg0: Node) => boolean): Node | undefined;
    /**
     * Finds all the descendant nodes that matches the filter function. This does a
     * depth first search.
     * @param {?Node} root The root of the tree to search.
     * @param {function(Node) : boolean} p The filter function.
     * @return {Array<Node>} The found nodes or an empty array if none are found.
     */
    findNodes(root: Node | null, p: (arg0: Node) => boolean): Array<Node>;
    /**
     * Returns true if the element has a tab index that allows it to receive
     * keyboard focus (tabIndex >= 0), false otherwise.  Note that some elements
     * natively support keyboard focus, even if they have no tab index.
     * @param {!Element} element Element to check.
     * @return {boolean} Whether the element has a tab index that allows keyboard
     *     focus.
     */
    isFocusableTabIndex(element: Element): boolean;
    /**
     * Enables or disables keyboard focus support on the element via its tab index.
     * Only elements for which {@link isFocusableTabIndex} returns true
     * (or elements that natively support keyboard focus, like form elements) can
     * receive keyboard focus.  See http://go/tabindex for more info.
     * @param {?Element} element Element whose tab index is to be changed.
     * @param {boolean} enable Whether to set or remove a tab index on the element
     *     that supports keyboard focus.
     */
    setFocusableTabIndex(element: Element | null, enable: boolean): void;
    /**
     * Returns true if the element can be focused, i.e. it has a tab index that
     * allows it to receive keyboard focus (tabIndex >= 0), or it is an element
     * that natively supports keyboard focus.
     * @param {!Element} element Element to check.
     * @return {boolean} Whether the element allows keyboard focus.
     */
    isFocusable(element: Element): boolean;
    /**
     * Returns the text contents of the current node, without markup. New lines are
     * stripped and whitespace is collapsed, such that each character would be
     * visible.
     *
     * In browsers that support it, innerText is used.  Other browsers attempt to
     * simulate it via node traversal.  Line breaks are canonicalized in IE.
     *
     * @param {?Node} node The node from which we are getting content.
     * @return {string} The text content.
     */
    getTextContent(node: Node | null): string;
    /**
     * Returns the text length of the text contained in a node, without markup. This
     * is equivalent to the selection length if the node was selected, or the number
     * of cursor movements to traverse the node. Images & BRs take one space.  New
     * lines are ignored.
     *
     * @param {?Node} node The node whose text content length is being calculated.
     * @return {number} The length of `node`'s text content.
     */
    getNodeTextLength(node: Node | null): number;
    /**
     * Returns the text offset of a node relative to one of its ancestors. The text
     * length is the same as the length calculated by
     * `getNodeTextLength`.
     *
     * @param {?Node} node The node whose offset is being calculated.
     * @param {Node=} opt_offsetParent Defaults to the node's owner document's body.
     * @return {number} The text offset.
     */
    getNodeTextOffset(node: Node | null, opt_offsetParent?: Node | undefined): number;
    /**
     * Returns the node at a given offset in a parent node.  If an object is
     * provided for the optional third parameter, the node and the remainder of the
     * offset will stored as properties of this object.
     * @param {?Node} parent The parent node.
     * @param {number} offset The offset into the parent node.
     * @param {Object=} opt_result Object to be used to store the return value. The
     *     return value will be stored in the form {node: Node, remainder: number}
     *     if this object is provided.
     * @return {?Node} The node at the given offset.
     */
    getNodeAtOffset(parent: Node | null, offset: number, opt_result?: any | undefined): Node | null;
    /**
     * Returns true if the object is a `NodeList`.  To qualify as a NodeList,
     * the object must have a numeric length property and an item function (which
     * has type 'string' on IE for some reason).
     * @param {?Object} val Object to test.
     * @return {boolean} Whether the object is a NodeList.
     */
    isNodeList(val: any | null): boolean;
    /**
     * Walks up the DOM hierarchy returning the first ancestor that has the passed
     * tag name and/or class name. If the passed element matches the specified
     * criteria, the element itself is returned.
     * @param {?Node} element The DOM node to start with.
     * @param {?(TagName<T>|string)=} opt_tag The tag name to match (or
     *     null/undefined to match only based on class name).
     * @param {?string=} opt_class The class name to match (or null/undefined to
     *     match only based on tag name).
     * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
     *     dom.
     * @return {?R} The first ancestor that matches the passed criteria, or
     *     null if no match is found. The return type is {Element|null} if opt_tag is
     *     not a member of TagName or a more specific type if it is (e.g.
     *     {?HTMLAnchorElement} for TagName.A).
     * @template T
     * @template R := cond(isUnknown(T), 'Element', T) =:
     */
    getAncestorByTagNameAndClass<T_6, R_10>(element: Node | null, opt_tag?: string | TagName<T_6> | null | undefined, opt_class?: (string | null) | undefined, opt_maxSearchSteps?: number | undefined): R_10 | null;
    /**
     * Walks up the DOM hierarchy returning the first ancestor that has the passed
     * class name. If the passed element matches the specified criteria, the
     * element itself is returned.
     * @param {?Node} element The DOM node to start with.
     * @param {string} className The class name to match.
     * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
     *     dom.
     * @return {?Element} The first ancestor that matches the passed criteria, or
     *     null if none match.
     */
    getAncestorByClass(element: Node | null, className: string, opt_maxSearchSteps?: number | undefined): Element | null;
    /**
     * Walks up the DOM hierarchy returning the first ancestor that passes the
     * matcher function.
     * @param {?Node} element The DOM node to start with.
     * @param {function(Node) : boolean} matcher A function that returns true if the
     *     passed node matches the desired criteria.
     * @param {boolean=} opt_includeNode If true, the node itself is included in
     *     the search (the first call to the matcher will pass startElement as
     *     the node to test).
     * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
     *     dom.
     * @return {?Node} DOM node that matched the matcher, or null if there was
     *     no match.
     */
    getAncestor(element: Node | null, matcher: (arg0: Node) => boolean, opt_includeNode?: boolean | undefined, opt_maxSearchSteps?: number | undefined): Node | null;
    /**
     * Gets '2d' context of a canvas. Shortcut for canvas.getContext('2d') with a
     * type information.
     * @param {!HTMLCanvasElement} canvas
     * @return {!CanvasRenderingContext2D}
     */
    getCanvasContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D;
    /**
     * Alias for `getElement`.
     * @param {string|?Element} element Element ID or a DOM node.
     * @return {?Element} The element with the given ID, or the node passed in.
     * @deprecated Use {@link DomHelper.prototype.getElement} instead.
     */
    $: (element: string | (Element | null)) => Element | null;
    /**
     * Alias for `getElementsByTagNameAndClass`.
     * @deprecated Use DomHelper getElementsByTagNameAndClass.
     *
     * @param {(string|?TagName<T>)=} opt_tag Element tag name.
     * @param {?string=} opt_class Optional class name.
     * @param {?Element=} opt_el Optional element to look in.
     * @return {!ArrayLike<R>} Array-like list of elements (only a length property
     *     and numerical indices are guaranteed to exist). The members of the array
     *     are {!Element} if opt_tag is a string or more specific types if it is
     *     a member of TagName (e.g. {!HTMLAnchorElement} for
     *     TagName.A).
     * @template T
     * @template R := cond(isUnknown(T), 'Element', T) =:
     */
    $$: <T, R>(opt_tag?: string | TagName<T> | null | undefined, opt_class?: (string | null) | undefined, opt_el?: (Document | (Element | null)) | undefined) => ArrayLike<R>;
    /**
     * Alias for `createDom`.
     * @param {string|!TagName<T>} tagName Tag to create.
     * @param {?Object|?Array<string>|string=} opt_attributes If object, then a map
     *     of name-value pairs for attributes. If a string, then this is the
     *     className of the new element. If an array, the elements will be joined
     *     together as the className of the new element.
     * @param {...(Appendable|undefined)} var_args Further DOM nodes or
     *     strings for text nodes.  If one of the var_args is an array, its children
     *     will be added as childNodes instead.
     * @return {R} Reference to a DOM node. The return type is {!Element} if tagName
     *     is a string or a more specific type if it is a member of
     *     TagName (e.g. {!HTMLAnchorElement} for TagName.A).
     * @template T
     * @template R := cond(isUnknown(T), 'Element', T) =:
     * @deprecated Use {@link DomHelper.prototype.createDom} instead.
     */
    $dom: <T_4, R_6>(tagName: string | TagName<T_4>, opt_attributes?: ((any | ((Array<string> | string) | null)) | null) | undefined, ...args: any[]) => R_6;
}
/**
 * Appends a node with text or other nodes.
 * @param {!Node} parent The node to append nodes to.
 * @param {...Appendable} var_args The things to append to the node.
 *     If this is a Node it is appended as is.
 *     If this is a string then a text node is appended.
 *     If this is an array like object then fields 0 to length - 1 are appended.
 */
export function append(parent: Node, ...args: any[]): void;
/**
 * Appends a child to a node.
 * @param {?Node} parent Parent.
 * @param {?Node} child Child.
 * @deprecated Use Element.appendChild instead (dom.appendChild(p,c) -> p.appendChild(c))
 */
export function appendChild(parent: Node | null, child: Node | null): void;
/**
 * Determines if the given node can contain children, intended to be used for
 * HTML generation.
 *
 * IE natively supports node.canHaveChildren but has inconsistent behavior.
 * Prior to IE8 the base tag allows children and in IE9 all nodes return true
 * for canHaveChildren.
 *
 * In practice all non-IE browsers allow you to add children to any node, but
 * the behavior is inconsistent:
 *
 * <pre>
 *   var a = createElement(TagName.BR);
 *   a.appendChild(document.createTextNode('foo'));
 *   a.appendChild(document.createTextNode('bar'));
 *   console.log(a.childNodes.length);  // 2
 *   console.log(a.innerHTML);  // Chrome: "", IE9: "foobar", FF3.5: "foobar"
 * </pre>
 *
 * For more information, see:
 * http://dev.w3.org/html5/markup/syntax.html#syntax-elements
 *
 * TODO(user): Rename shouldAllowChildren() ?
 *
 * @param {?Node} node The node to check.
 * @return {boolean} Whether the node can contain children.
 */
export function canHaveChildren(node: Node | null): boolean;
/**
 * Compares the document order of two nodes, returning 0 if they are the same
 * node, a negative number if node1 is before node2, and a positive number if
 * node2 is before node1.  Note that we compare the order the tags appear in the
 * document so in the tree <b><i>text</i></b> the B node is considered to be
 * before the I node.
 *
 * @param {?Node} node1 The first node to compare.
 * @param {?Node} node2 The second node to compare.
 * @return {number} 0 if the nodes are the same node, a negative number if node1
 *     is before node2, and a positive number if node2 is before node1.
 */
export function compareNodeOrder(node1: Node | null, node2: Node | null): number;
/**
 * Creates a new Node from constant strings of HTML markup.
 * @param {...!Const} var_args The HTML strings to concatenate then
 *     convert into a node.
 * @return {!Node}
 */
export function constHtmlToNode(...args: Const[]): Node;
/**
 * Whether a node contains another node.
 * @param {?Node|undefined} parent The node that should contain the other node.
 * @param {?Node|undefined} descendant The node to test presence of.
 * @return {boolean} Whether the parent node contains the descendant node.
 */
export function contains(parent: (Node | undefined) | null, descendant: (Node | undefined) | null): boolean;
/**
 * Returns a dom node with a set of attributes.  This function accepts varargs
 * for subsequent nodes to be added.  Subsequent nodes will be added to the
 * first node as childNodes.
 *
 * So:
 * <code>createDom(TagName.DIV, null, createDom(TagName.P),
 * createDom(TagName.P));</code> would return a div with two child
 * paragraphs
 *
 * This function uses {@link setProperties} to set attributes: the
 * `opt_attributes` parameter follows the same rules.
 *
 * @param {string|!TagName<T>} tagName Tag to create.
 * @param {?Object|?Array<string>|string=} opt_attributes If object, then a map
 *     of name-value pairs for attributes. If a string, then this is the
 *     className of the new element. If an array, the elements will be joined
 *     together as the className of the new element.
 * @param {...(Object|string|Array|NodeList|null|undefined)} var_args Further
 *     DOM nodes or strings for text nodes. If one of the var_args is an array
 *     or NodeList, its elements will be added as childNodes instead.
 * @return {R} Reference to a DOM node. The return type is {!Element} if tagName
 *     is a string or a more specific type if it is a member of
 *     TagName (e.g. {!HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
export function createDom(tagName: string, opt_attributes?: ((any | ((Array<string> | string) | null)) | null) | undefined, ...args: any[]): Element;
export function createDom<T>(tagName: TagName<T>, opt_attributes?: ((any | ((Array<string> | string) | null)) | null) | undefined, ...args: any[]): T;
/**
 * Creates a new element.
 * @param {string|!TagName<T>} name Tag to create.
 * @return {R} The new element. The return type is {!Element} if name is
 *     a string or a more specific type if it is a member of TagName
 *     (e.g. {!HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
export function createElement(name: string): Element;
export function createElement<T>(name: TagName<T>): T;
/**
 * Create a table.
 * @param {number} rows The number of rows in the table.  Must be >= 1.
 * @param {number} columns The number of columns in the table.  Must be >= 1.
 * @param {boolean=} opt_fillWithNbsp If true, fills table entries with
 *     `Unicode.NBSP` characters.
 * @return {!Element} The created table.
 */
export function createTable(rows: number, columns: number, opt_fillWithNbsp?: boolean | undefined): Element;
/**
 * Creates a new text node.
 * @param {number|string} content Content.
 * @return {!Text} The new text node.
 */
export function createTextNode(content: number | string): Text;
/**
 * Find the deepest common ancestor of the given nodes.
 * @param {...Node} var_args The nodes to find a common ancestor of.
 * @return {?Node} The common ancestor of the nodes, or null if there is none.
 *     null will only be returned if two or more of the nodes are from different
 *     documents.
 */
export function findCommonAncestor(...args: Node[]): Node | null;
/**
 * Finds the first descendant element (excluding `root`) that matches the filter
 * function, using depth first search. Prefer using `querySelector` if the
 * matching criteria can be expressed as a CSS selector.
 *
 * @param {!Element | !Document} root
 * @param {function(!Element): boolean} pred Filter function.
 * @return {Element|null} First matching element or null if there is none.
 */
export function findElement(root: Element | Document, pred: (arg0: Element) => boolean): Element | null;
/**
 * Finds all the descendant elements (excluding `root`) that match the filter
 * function, using depth first search. Prefer using `querySelectorAll` if the
 * matching criteria can be expressed as a CSS selector.
 *
 * @param {!Element | !Document} root
 * @param {function(!Element): boolean} pred Filter function.
 * @return {!Array<!Element>}
 */
export function findElements(root: Element | Document, pred: (arg0: Element) => boolean): Array<Element>;
/**
 * Finds the first descendant node that matches the filter function, using depth
 * first search. This function offers the most general purpose way of finding a
 * matching element.
 *
 * Prefer using `querySelector` if the matching criteria can be expressed as a
 * CSS selector, or `findElement` if you would filter for `nodeType ==
 * Node.ELEMENT_NODE`.
 *
 * @param {?Node} root The root of the tree to search.
 * @param {function(Node) : boolean} p The filter function.
 * @return {Node|undefined} The found node or undefined if none is found.
 */
export function findNode(root: Node | null, p: (arg0: Node) => boolean): Node | undefined;
/**
 * Finds all the descendant nodes that match the filter function, using depth
 * first search. This function offers the most general-purpose way
 * of finding a set of matching elements.
 *
 * Prefer using `querySelectorAll` if the matching criteria can be expressed as
 * a CSS selector, or `findElements` if you would filter for
 * `nodeType == Node.ELEMENT_NODE`.
 *
 * @param {?Node} root The root of the tree to search.
 * @param {function(Node) : boolean} p The filter function.
 * @return {!Array<!Node>} The found nodes or an empty array if none are found.
 */
export function findNodes(root: Node | null, p: (arg0: Node) => boolean): Array<Node>;
/**
 * Flattens an element. That is, removes it and replace it with its children.
 * Does nothing if the element is not in the document.
 * @param {?Element} element The element to flatten.
 * @return {?Element|undefined} The original element, detached from the document
 *     tree, sans children; or undefined, if the element was not in the document
 *     to begin with.
 */
export function flattenElement(element: Element | null): (Element | undefined) | null;
/**
 * Determines the active element in the given document.
 * @param {?Document} doc The document to look in.
 * @return {?Element} The active element.
 */
export function getActiveElement(doc: Document | null): Element | null;
/**
 * Walks up the DOM hierarchy returning the first ancestor that passes the
 * matcher function.
 * @param {?Node} element The DOM node to start with.
 * @param {function(Node) : boolean} matcher A function that returns true if the
 *     passed node matches the desired criteria.
 * @param {boolean=} opt_includeNode If true, the node itself is included in
 *     the search (the first call to the matcher will pass startElement as
 *     the node to test).
 * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
 *     dom.
 * @return {?Node} DOM node that matched the matcher, or null if there was
 *     no match.
 */
export function getAncestor(element: Node | null, matcher: (arg0: Node) => boolean, opt_includeNode?: boolean | undefined, opt_maxSearchSteps?: number | undefined): Node | null;
/**
 * Walks up the DOM hierarchy returning the first ancestor that has the passed
 * class name. If the passed element matches the specified criteria, the
 * element itself is returned.
 * @param {?Node} element The DOM node to start with.
 * @param {string} className The class name to match.
 * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
 *     dom.
 * @return {?Element} The first ancestor that matches the passed criteria, or
 *     null if none match.
 */
export function getAncestorByClass(element: Node | null, className: string, opt_maxSearchSteps?: number | undefined): Element | null;
/**
 * Walks up the DOM hierarchy returning the first ancestor that has the passed
 * tag name and/or class name. If the passed element matches the specified
 * criteria, the element itself is returned.
 * @param {?Node} element The DOM node to start with.
 * @param {?(TagName<T>|string)=} opt_tag The tag name to match (or
 *     null/undefined to match only based on class name).
 * @param {?string=} opt_class The class name to match (or null/undefined to
 *     match only based on tag name).
 * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
 *     dom.
 * @return {?R} The first ancestor that matches the passed criteria, or
 *     null if no match is found. The return type is {Element|null} if opt_tag is
 *     not a member of TagName or a more specific type if it is (e.g.
 *     {?HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
export function getAncestorByTagNameAndClass(element: Node | null, opt_tag?: string | null | undefined, opt_class?: (string | null) | undefined, opt_maxSearchSteps?: number | undefined): Element | null;
export function getAncestorByTagNameAndClass<T>(element: Node | null, opt_tag?: TagName<T> | null | undefined, opt_class?: (string | null) | undefined, opt_maxSearchSteps?: number | undefined): T | null;
/**
 * Gets '2d' context of a canvas. Shortcut for canvas.getContext('2d') with a
 * type information.
 * @param {!HTMLCanvasElement|!OffscreenCanvas} canvas
 * @return {!CanvasRenderingContext2D}
 */
export function getCanvasContext2D(canvas: HTMLCanvasElement | OffscreenCanvas): CanvasRenderingContext2D;
/**
 * Returns an array containing just the element children of the given element.
 * @param {?Element} element The element whose element children we want.
 * @return {!(Array<!Element>|NodeList<!Element>)} An array or array-like list
 *     of just the element children of the given element.
 */
export function getChildren(element: Element | null): (Array<Element> | NodeListOf<Element>);
/**
 * Gets the document object being used by the dom library.
 * @return {!Document} Document object.
 * @deprecated Use document instead
 */
export function getDocument(): Document;
/**
 * Calculates the height of the document.
 *
 * @return {number} The height of the current document.
 */
export function getDocumentHeight(): number;
/**
 * Calculates the height of the document of the given window.
 *
 * @param {!Window} win The window whose document height to retrieve.
 * @return {number} The height of the document of the given window.
 */
export function getDocumentHeightForWindow(win: Window): number;
/**
 * Gets the document scroll distance as a coordinate object.
 *
 * @return {!Coordinate} Object with values 'x' and 'y'.
 */
export function getDocumentScroll(): Coordinate;
/**
 * Gets the document scroll element.
 * @return {!Element} Scrolling element.
 */
export function getDocumentScrollElement(): Element;
/**
 * Gets the DomHelper object for the document where the element resides.
 * @param {(Node|Window)=} opt_element If present, gets the DomHelper for this
 *     element.
 * @return {!DomHelper} The DomHelper.
 */
export function getDomHelper(opt_element?: (Node | Window) | undefined): DomHelper;
/**
 * Gets an element from the current document by element id.
 *
 * If an Element is passed in, it is returned.
 *
 * @param {string|?Element} element Element ID or a DOM node.
 * @return {?Element} The element with the given ID, or the node passed in.
 * @deprecated Use document.getElementById(id) instead
 */
export function getElement(element: string | (Element | null)): Element | null;
/**
 * Returns the first element with the provided className.
 *
 * @param {string} className the name of the class to look for.
 * @param {?Element|Document=} opt_el Optional element to look in.
 * @return {?Element} The first item with the class name provided.
 * @deprecated Use document.querySelector('.classname') or element.querySelector('.classname') instead
 */
export function getElementByClass(className: string, opt_el?: ((Element | Document) | null) | undefined): Element | null;
/**
 * Gets the first element matching the tag and the class.
 *
 * @param {(string|?TagName<T>)=} opt_tag Element tag name.
 * @param {?string=} opt_class Optional class name.
 * @param {(Document|?Element)=} opt_el Optional element to look in.
 * @return {?R} Reference to a DOM node. The return type is {Element|null} if
 *     tagName is a string or a more specific type if it is a member of
 *     TagName (e.g. {?HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
export function getElementByTagNameAndClass(opt_tag?: string | null | undefined, opt_class?: (string | null) | undefined, opt_el?: (Document | (Element | null)) | undefined): Element | null;
export function getElementByTagNameAndClass<T>(opt_tag?: TagName<T> | null | undefined, opt_class?: (string | null) | undefined, opt_el?: (Document | (Element | null)) | undefined): T | null;
/**
 * Returns a static, array-like list of the elements with the provided
 * className.
 *
 * @param {string} className the name of the class to look for.
 * @param {(Document|?Element)=} opt_el Optional element to look in.
 * @return {!ArrayLike<!Element>} The items found with the class name provided.
 * @deprecated Use document.querySelectorAll('.classname') or element.querySelectorAll('.classname') instead
 */
export function getElementsByClass(className: string, opt_el?: (Document | (Element | null)) | undefined): ArrayLike<Element>;
/**
 * Gets elements by tag name.
 * @param {!TagName<T>} tagName
 * @param {(!Document|!Element)=} opt_parent Parent element or document where to
 *     look for elements. Defaults to document.
 * @return {!NodeList<R>} List of elements. The members of the list are
 *     {!Element} if tagName is not a member of TagName or more
 *     specific types if it is (e.g. {!HTMLAnchorElement} for
 *     TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
export function getElementsByTagName<T, R>(tagName: TagName<T>, opt_parent?: (Document | Element) | undefined): any;
/**
 * Looks up elements by both tag and class name, using browser native functions
 * (`querySelectorAll`, `getElementsByTagName` or
 * `getElementsByClassName`) where possible. This function
 * is a useful, if limited, way of collecting a list of DOM elements
 * with certain characteristics.  `querySelectorAll` offers a
 * more powerful and general solution which allows matching on CSS3
 * selector expressions.
 *
 * Note that tag names are case sensitive in the SVG namespace, and this
 * function converts opt_tag to uppercase for comparisons. For queries in the
 * SVG namespace you should use querySelector or querySelectorAll instead.
 * https://bugzilla.mozilla.org/show_bug.cgi?id=963870
 * https://bugs.webkit.org/show_bug.cgi?id=83438
 *
 * @see {https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll}
 *
 * @param {(string|?TagName<T>)=} opt_tag Element tag name.
 * @param {?string=} opt_class Optional class name.
 * @param {(Document|?Element)=} opt_el Optional element to look in.
 * @return {!ArrayLike<R>} Array-like list of elements (only a length property
 *     and numerical indices are guaranteed to exist). The members of the array
 *     are {!Element} if opt_tag is not a member of TagName or more
 *     specific types if it is (e.g. {!HTMLAnchorElement} for
 *     TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
export function getElementsByTagNameAndClass(opt_tag?: string | null | undefined, opt_class?: (string | null) | undefined, opt_el?: (Document | (Element | null)) | undefined): ArrayLike<Element>;
export function getElementsByTagNameAndClass<T>(opt_tag?: TagName<T> | null | undefined, opt_class?: (string | null) | undefined, opt_el?: (Document | (Element | null)) | undefined): ArrayLike<T>;
/**
 * Returns the first child node that is an element.
 * @param {?Node} node The node to get the first child element of.
 * @return {?Element} The first child node of `node` that is an element.
 */
export function getFirstElementChild(node: Node | null): Element | null;
/**
 * Cross-browser function for getting the document element of a frame or iframe.
 * @param {?Element} frame Frame element.
 * @return {!Document} The frame content document.
 */
export function getFrameContentDocument(frame: Element | null): Document;
/**
 * Cross-browser function for getting the window of a frame or iframe.
 * @param {?Element} frame Frame element.
 * @return {?Window} The window associated with the given frame, or null if none
 *     exists.
 */
export function getFrameContentWindow(frame: Element | null): Window | null;
/**
 * Returns the last child node that is an element.
 * @param {?Node} node The node to get the last child element of.
 * @return {?Element} The last child node of `node` that is an element.
 */
export function getLastElementChild(node: Node | null): Element | null;
/**
 * Returns the first next sibling that is an element.
 * @param {?Node} node The node to get the next sibling element of.
 * @return {?Element} The next sibling of `node` that is an element.
 */
export function getNextElementSibling(node: Node | null): Element | null;
/**
 * Returns the next node in source order from the given node.
 * @param {?Node} node The node.
 * @return {?Node} The next node in the DOM tree, or null if this was the last
 *     node.
 */
export function getNextNode(node: Node | null): Node | null;
/**
 * Returns the node at a given offset in a parent node.  If an object is
 * provided for the optional third parameter, the node and the remainder of the
 * offset will stored as properties of this object.
 * @param {?Node} parent The parent node.
 * @param {number} offset The offset into the parent node.
 * @param {Object=} opt_result Object to be used to store the return value. The
 *     return value will be stored in the form {node: Node, remainder: number}
 *     if this object is provided.
 * @return {?Node} The node at the given offset.
 */
export function getNodeAtOffset(parent: Node | null, offset: number, opt_result?: any | undefined): Node | null;
/**
 * Returns the text length of the text contained in a node, without markup. This
 * is equivalent to the selection length if the node was selected, or the number
 * of cursor movements to traverse the node. Images & BRs take one space.  New
 * lines are ignored.
 *
 * @param {?Node} node The node whose text content length is being calculated.
 * @return {number} The length of `node`'s text content.
 */
export function getNodeTextLength(node: Node | null): number;
/**
 * Returns the text offset of a node relative to one of its ancestors. The text
 * length is the same as the length calculated by getNodeTextLength.
 *
 * @param {?Node} node The node whose offset is being calculated.
 * @param {Node=} opt_offsetParent The node relative to which the offset will
 *     be calculated. Defaults to the node's owner document's body.
 * @return {number} The text offset.
 */
export function getNodeTextOffset(node: Node | null, opt_offsetParent?: Node | undefined): number;
/**
 * Gets the outerHTML of a node, which is like innerHTML, except that it
 * actually contains the HTML of the node itself.
 * @param {?Element} element The element to get the HTML of.
 * @return {string} The outerHTML of the given element.
 */
export function getOuterHtml(element: Element | null): string;
/**
 * Returns the owner document for a node.
 * @param {Node|Window} node The node to get the document for.
 * @return {!Document} The document owning the node.
 */
export function getOwnerDocument(node: Node | Window): Document;
/**
 * Gets the page scroll distance as a coordinate object.
 *
 * @param {Window=} opt_window Optional window element to test.
 * @return {!Coordinate} Object with values 'x' and 'y'.
 * @deprecated Use {@link getDocumentScroll} instead.
 */
export function getPageScroll(opt_window?: Window | undefined): Coordinate;
/**
 * Returns an element's parent, if it's an Element.
 * @param {?Element} element The DOM element.
 * @return {?Element} The parent, or null if not an Element.
 * @deprecated Use Element.parentElement (or Element.parentNode)
 */
export function getParentElement(element: Element | null): Element | null;
/**
 * Gives the current devicePixelRatio.
 *
 * By default, this is the value of window.devicePixelRatio (which should be
 * preferred if present).
 *
 * If window.devicePixelRatio is not present, the ratio is calculated with
 * window.matchMedia, if present. Otherwise, gives 1.0.
 *
 * Some browsers (including Chrome) consider the browser zoom level in the pixel
 * ratio, so the value may change across multiple calls.
 *
 * @return {number} The number of actual pixels per virtual pixel.
 */
export function getPixelRatio(): number;
/**
 * Returns the first previous sibling that is an element.
 * @param {?Node} node The node to get the previous sibling element of.
 * @return {?Element} The first previous sibling of `node` that is
 *     an element.
 */
export function getPreviousElementSibling(node: Node | null): Element | null;
/**
 * Returns the previous node in source order from the given node.
 * @param {?Node} node The node.
 * @return {?Node} The previous node in the DOM tree, or null if this was the
 *     first node.
 */
export function getPreviousNode(node: Node | null): Node | null;
/**
 * Returns the text content of the current node, without markup.
 *
 * Unlike `getTextContent` this method does not collapse whitespaces
 * or normalize lines breaks.
 *
 * @param {?Node} node The node from which we are getting content.
 * @return {string} The raw text content.
 */
export function getRawTextContent(node: Node | null): string;
/**
 * Gets an element by id, asserting that the element is found.
 *
 * This is used when an element is expected to exist, and should fail with
 * an assertion error if it does not (if assertions are enabled).
 *
 * @param {string} id Element ID.
 * @return {!Element} The element with the given ID, if it exists.
 */
export function getRequiredElement(id: string): Element;
/**
 * Ensures an element with the given className exists, and then returns the
 * first element with the provided className.
 *
 * @param {string} className the name of the class to look for.
 * @param {!Element|!Document=} opt_root Optional element or document to look
 *     in.
 * @return {!Element} The first item with the class name provided.
 * @throws {AssertionError} Thrown if no element is found.
 */
export function getRequiredElementByClass(className: string, opt_root?: (Element | Document) | undefined): Element;
/**
 * Returns the text content of the current node, without markup and invisible
 * symbols. New lines are stripped and whitespace is collapsed,
 * such that each character would be visible.
 *
 * In browsers that support it, innerText is used.  Other browsers attempt to
 * simulate it via node traversal.  Line breaks are canonicalized in IE.
 *
 * @param {?Node} node The node from which we are getting content.
 * @return {string} The text content.
 */
export function getTextContent(node: Node | null): string;
/**
 * Gets the dimensions of the viewport.
 *
 * Gecko Standards mode:
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * win.innerWidth     Width of viewport including scrollbar.
 * body.clientWidth   Width of body element.
 *
 * docEl.clientHeight Height of viewport excluding scrollbar.
 * win.innerHeight    Height of viewport including scrollbar.
 * body.clientHeight  Height of document.
 *
 * Gecko Backwards compatible mode:
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * win.innerWidth     Width of viewport including scrollbar.
 * body.clientWidth   Width of viewport excluding scrollbar.
 *
 * docEl.clientHeight Height of document.
 * win.innerHeight    Height of viewport including scrollbar.
 * body.clientHeight  Height of viewport excluding scrollbar.
 *
 * IE6/7 Standards mode:
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * win.innerWidth     Undefined.
 * body.clientWidth   Width of body element.
 *
 * docEl.clientHeight Height of viewport excluding scrollbar.
 * win.innerHeight    Undefined.
 * body.clientHeight  Height of document element.
 *
 * IE5 + IE6/7 Backwards compatible mode:
 * docEl.clientWidth  0.
 * win.innerWidth     Undefined.
 * body.clientWidth   Width of viewport excluding scrollbar.
 *
 * docEl.clientHeight 0.
 * win.innerHeight    Undefined.
 * body.clientHeight  Height of viewport excluding scrollbar.
 *
 * Opera 9 Standards and backwards compatible mode:
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * win.innerWidth     Width of viewport including scrollbar.
 * body.clientWidth   Width of viewport excluding scrollbar.
 *
 * docEl.clientHeight Height of document.
 * win.innerHeight    Height of viewport including scrollbar.
 * body.clientHeight  Height of viewport excluding scrollbar.
 *
 * WebKit:
 * Safari 2
 * docEl.clientHeight Same as scrollHeight.
 * docEl.clientWidth  Same as innerWidth.
 * win.innerWidth     Width of viewport excluding scrollbar.
 * win.innerHeight    Height of the viewport including scrollbar.
 * frame.innerHeight  Height of the viewport exluding scrollbar.
 *
 * Safari 3 (tested in 522)
 *
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * docEl.clientHeight Height of viewport excluding scrollbar in strict mode.
 * body.clientHeight  Height of viewport excluding scrollbar in quirks mode.
 *
 * @param {Window=} opt_window Optional window element to test.
 * @return {!Size} Object with values 'width' and 'height'.
 */
export function getViewportSize(opt_window?: Window | undefined): Size;
/**
 * Gets the window object associated with the given document.
 *
 * @param {Document=} opt_doc  Document object to get window for.
 * @return {!Window} The window associated with the given document.
 */
export function getWindow(opt_doc?: Document | undefined): Window;
/**
 * Insert a child at a given index. If index is larger than the number of child
 * nodes that the parent currently has, the node is inserted as the last child
 * node.
 * @param {?Element} parent The element into which to insert the child.
 * @param {?Node} child The element to insert.
 * @param {number} index The index at which to insert the new child node. Must
 *     not be negative.
 */
export function insertChildAt(parent: Element | null, child: Node | null, index: number): void;
/**
 * Inserts a new node after an existing reference node (i.e. as the next
 * sibling). If the reference node has no parent, then does nothing.
 * @param {?Node} newNode Node to insert.
 * @param {?Node} refNode Reference node to insert after.
 */
export function insertSiblingAfter(newNode: Node | null, refNode: Node | null): void;
/**
 * Inserts a new node before an existing reference node (i.e. as the previous
 * sibling). If the reference node has no parent, then does nothing.
 * @param {?Node} newNode Node to insert.
 * @param {?Node} refNode Reference node to insert before.
 */
export function insertSiblingBefore(newNode: Node | null, refNode: Node | null): void;
/**
 * Returns true if the browser is in "CSS1-compatible" (standards-compliant)
 * mode, false otherwise.
 * @return {boolean} True if in CSS1-compatible mode.
 */
export function isCss1CompatMode(): boolean;
/**
 * Whether the object looks like an Element.
 * @param {?} obj The object being tested for Element likeness.
 * @return {boolean} Whether the object looks like an Element.
 */
export function isElement(obj: unknown): boolean;
/**
 * Returns true if the element can be focused, i.e. it has a tab index that
 * allows it to receive keyboard focus (tabIndex >= 0), or it is an element
 * that natively supports keyboard focus.
 * @param {!Element} element Element to check.
 * @return {boolean} Whether the element allows keyboard focus.
 */
export function isFocusable(element: Element): boolean;
/**
 * Returns true if the element has a tab index that allows it to receive
 * keyboard focus (tabIndex >= 0), false otherwise.  Note that some elements
 * natively support keyboard focus, even if they have no tab index.
 * @param {!Element} element Element to check.
 * @return {boolean} Whether the element has a tab index that allows keyboard
 *     focus.
 */
export function isFocusableTabIndex(element: Element): boolean;
/**
 * Returns whether node is in a document or detached. Throws an error if node
 * itself is a document. This specifically handles two cases beyond naive use of
 * builtins: (1) it works correctly in IE, and (2) it works for elements from
 * different documents/iframes. If neither of these considerations are relevant
 * then a simple `document.contains(node)` may be used instead.
 * @param {!Node} node
 * @return {boolean}
 */
export function isInDocument(node: Node): boolean;
/**
 * Whether the object looks like a DOM node.
 * @param {?} obj The object being tested for node likeness.
 * @return {boolean} Whether the object looks like a DOM node.
 */
export function isNodeLike(obj: unknown): boolean;
/**
 * Returns true if the object is a `NodeList`.  To qualify as a NodeList,
 * the object must have a numeric length property and an item function (which
 * has type 'string' on IE for some reason).
 * @param {?Object} val Object to test.
 * @return {boolean} Whether the object is a NodeList.
 */
export function isNodeList(val: any | null): boolean;
/**
 * Returns true if the specified value is a Window object. This includes the
 * global window for HTML pages, and iframe windows.
 * @param {?} obj Variable to test.
 * @return {boolean} Whether the variable is a window.
 */
export function isWindow(obj: unknown): boolean;
/**
 * Removes all the child nodes on a DOM node.
 * @param {?Node} node Node to remove children from.
 */
export function removeChildren(node: Node | null): void;
/**
 * Removes a node from its parent.
 * @param {?Node} node The node to remove.
 * @return {?Node} The node removed if removed; else, null.
 * @deprecated Use node.parentNode?.removeChild(node) instead
 */
export function removeNode(node: Node | null): Node | null;
/**
 * Replaces a node in the DOM tree. Will do nothing if `oldNode` has no
 * parent.
 * @param {?Node} newNode Node to insert.
 * @param {?Node} oldNode Node to replace.
 */
export function replaceNode(newNode: Node | null, oldNode: Node | null): void;
/**
 * Converts HTML markup into a node. This is a safe version of
 * `goog.dom.htmlToDocumentFragment` which is now deleted.
 * @param {!SafeHtml} html The HTML markup to convert.
 * @return {!Node} The resulting node.
 */
export function safeHtmlToNode(html: SafeHtml): Node;
/**
 * Enables or disables keyboard focus support on the element via its tab index.
 * Only elements for which {@link isFocusableTabIndex} returns true
 * (or elements that natively support keyboard focus, like form elements) can
 * receive keyboard focus.  See http://go/tabindex for more info.
 * @param {?Element} element Element whose tab index is to be changed.
 * @param {boolean} enable Whether to set or remove a tab index on the element
 *     that supports keyboard focus.
 */
export function setFocusableTabIndex(element: Element | null, enable: boolean): void;
/**
 * Sets multiple properties, and sometimes attributes, on an element. Note that
 * properties are simply object properties on the element instance, while
 * attributes are visible in the DOM. Many properties map to attributes with the
 * same names, some with different names, and there are also unmappable cases.
 *
 * This method sets properties by default (which means that custom attributes
 * are not supported). These are the exeptions (some of which is legacy):
 * - "style": Even though this is an attribute name, it is translated to a
 *   property, "style.cssText". Note that this property sanitizes and formats
 *   its value, unlike the attribute.
 * - "class": This is an attribute name, it is translated to the "className"
 *   property.
 * - "for": This is an attribute name, it is translated to the "htmlFor"
 *   property.
 * - Entries in {@see DIRECT_ATTRIBUTE_MAP_} are set as attributes,
 *   this is probably due to browser quirks.
 * - "aria-*", "data-*": Always set as attributes, they have no property
 *   counterparts.
 *
 * @param {?Element} element DOM node to set properties on.
 * @param {?Object} properties Hash of property:value pairs.
 *     Property values can be strings or strings.TypedString values (such as
 *     goog.html.SafeUrl).
 */
export function setProperties(element: Element | null, properties: any | null): void;
/**
 * Sets the text content of a node, with cross-browser support.
 * @param {?Node} node The node to change the text content of.
 * @param {string|number} text The value that should replace the node's content.
 */
export function setTextContent(node: Node | null, text: string | number): void;
import { TagName } from "./tagname.js";
import { Size } from "../math/size.js";
import { SafeHtml } from "../html/safehtml.js";
import { Coordinate } from "../math/coordinate.js";
import { Const } from "../string/const.js";
