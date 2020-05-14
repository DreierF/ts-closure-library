export type Methods = Function | null;
/**
 * Returns an element's attributes without falling prey to things like
 * <form><input name="attributes"></form>. Equivalent to
 * `node.attributes`.
 * @param {!Element} element
 * @return {!NamedNodeMap}
 */
export function getElementAttributes(element: Element): NamedNodeMap;
/**
 * Returns whether an element has a specific attribute, without falling prey to
 * things like <form><input name="hasAttribute"></form>.
 * Equivalent to {@code element.hasAttribute("foo")}.
 * @param {!Element} element
 * @param {string} attrName
 * @return {boolean}
 */
export function hasElementAttribute(element: Element, attrName: string): boolean;
/**
 * Returns a specific attribute from an element without falling prey to
 * things like <form><input name="getAttribute"></form>.
 * Equivalent to {@code element.getAttribute("foo")}.
 * @param {!Element} element
 * @param {string} attrName
 * @return {?string}
 */
export function getElementAttribute(element: Element, attrName: string): string | null;
/**
 * Sets an element's attributes without falling prey to things like
 * <form><input name="setAttribute"></form>. Equivalent to {@code
 * element.setAttribute("foo", "bar")}.
 * @param {!Element} element
 * @param {string} name
 * @param {string} value
 */
export function setElementAttribute(element: Element, name: string, value: string): void;
/**
 * Deletes a specific attribute from an element without falling prey to
 * things like <form><input name="removeAttribute"></form>.
 * Equivalent to {@code element.removeAttribute("foo")}.
 * @param {!Element} element
 * @param {string} attrName
 */
export function removeElementAttribute(element: Element, attrName: string): void;
/**
 * Returns a node's innerHTML property value without falling prey to things like
 * <form><input name="innerHTML"></form>. Equivalent to
 * `element.innerHTML`.
 * @param {!Element} element
 * @return {string}
 */
export function getElementInnerHTML(element: Element): string;
/**
 * Returns an element's style without falling prey to things like
 * <form><input name="style"></form>.
 * @param {!Element} element
 * @return {!CSSStyleDeclaration}
 */
export function getElementStyle(element: Element): CSSStyleDeclaration;
/**
 * Get the children of a specific tag matching the provided tag name without
 * falling prey to things like <form><input name="getElementsByTagName"></form>.
 * Equivalent to {@code element.getElementsByTagName("foo")}.
 * @param {!Element} element
 * @param {string} name
 * @return {!Array<!Element>}
 */
export function getElementsByTagName(element: Element, name: string): Array<Element>;
/**
 * Returns an element's style without falling prey to things like
 * <form><input name="style"></form>.
 * @param {!Element} element
 * @return {!CSSStyleSheet}
 */
export function getElementStyleSheet(element: Element): CSSStyleSheet;
/**
 * Returns true if the element would be selected by the provided selector,
 * without falling prey to things like <form><input name="setAttribute"></form>.
 * Equivalent to {@code element.matches("foo")}.
 * @param {!Element} element
 * @param {string} selector
 * @return {boolean}
 */
export function elementMatches(element: Element, selector: string): boolean;
/**
 * Asserts that a Node is an Element, without falling prey to things like
 * <form><input name="nodeType"></form>.
 * @param {!Node} node
 * @return {!Element}
 */
export function assertNodeIsElement(node: Node): Element;
/**
 * Returns whether the node is an Element, without falling prey to things like
 * <form><input name="nodeType"></form>.
 * @param {!Node} node
 * @return {boolean}
 */
export function isNodeElement(node: Node): boolean;
/**
 * Returns a node's nodeName without falling prey to things like
 * <form><input name="nodeName"></form>.
 * @param {!Node} node
 * @return {string}
 */
export function getNodeName(node: Node): string;
/**
 * Returns a node's nodeType without falling prey to things like
 * `<form><input name="nodeType"></form>`.
 * @param {!Node} node
 * @return {number}
 */
export function getNodeType(node: Node): number;
/**
 * Returns a node's parentNode without falling prey to things like
 * <form><input name="parentNode"></form>.
 * @param {!Node} node
 * @return {?Node}
 */
export function getParentNode(node: Node): Node | null;
/**
 * Returns the value of node.childNodes without falling prey to things like
 * <form><input name="childNodes"></form>.
 * @param {!Node} node
 * @return {!NodeList<!Node>}
 */
export function getChildNodes(node: Node): any;
/**
 * Appends a child to a node without falling prey to things like
 * <form><input name="appendChild"></form>.
 * @param {!Node} parent
 * @param {!Node} child
 * @return {!Node}
 */
export function appendNodeChild(parent: Node, child: Node): Node;
/**
 * Provides a way cross-browser way to get a CSS value from a CSS declaration.
 * @param {!CSSStyleDeclaration} cssStyle A CSS style object.
 * @param {string} propName A property name.
 * @return {string} Value of the property as parsed by the browser.
 * @supported IE8 and newer.
 */
export function getCssPropertyValue(cssStyle: CSSStyleDeclaration, propName: string): string;
/**
 * Provides a cross-browser way to set a CSS value on a CSS declaration.
 * @param {!CSSStyleDeclaration} cssStyle A CSS style object.
 * @param {string} propName A property name.
 * @param {string} sanitizedValue Sanitized value of the property to be set
 *     on the CSS style object.
 * @supported IE8 and newer.
 */
export function setCssProperty(cssStyle: CSSStyleDeclaration, propName: string, sanitizedValue: string): void;
export namespace Methods {
    export const ATTRIBUTES_GETTER: Function | null;
    export const HAS_ATTRIBUTE: Function | null;
    export const GET_ATTRIBUTE: Function | null;
    export const SET_ATTRIBUTE: Function | null;
    export const REMOVE_ATTRIBUTE: Function | null;
    export const INNER_HTML_GETTER: Function | null;
    export const GET_ELEMENTS_BY_TAG_NAME: Function | null;
    export const MATCHES: Function | null;
    export const NODE_NAME_GETTER: Function | null;
    export const NODE_TYPE_GETTER: Function | null;
    export const PARENT_NODE_GETTER: Function | null;
    export const CHILD_NODES_GETTER: Function | null;
    export const APPEND_CHILD: Function | null;
    export const STYLE_GETTER: Function | null;
    export const SHEET_GETTER: Function | null;
    export const GET_PROPERTY_VALUE: Function | null;
    export const SET_PROPERTY: Function | null;
}
