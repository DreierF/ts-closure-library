/**
 * True if browser has ActiveXObject support.
 * Possible override if this test become wrong in coming IE versions.
 * @type {boolean}
 */
export let ACTIVEX_SUPPORT: boolean;
/**
 * Max XML size for MSXML2.  Used to prevent potential DoS attacks.
 * @type {number}
 */
export let MAX_ELEMENT_DEPTH: number;
/**
 * @fileoverview
 * XML utilities.
 */
/**
 * Max XML size for MSXML2.  Used to prevent potential DoS attacks.
 * @type {number}
 */
export let MAX_XML_SIZE_KB: number;
/**
 * Creates an XML document appropriate for the current JS runtime
 * @param {string=} opt_rootTagName The root tag name.
 * @param {string=} opt_namespaceUri Namespace URI of the document element.
 * @param {boolean=} opt_preferActiveX Whether to default to ActiveXObject to
 * create Document in IE. Use this if you need xpath support in IE (e.g.,
 * selectSingleNode or selectNodes), but be aware that the ActiveXObject does
 * not support various DOM-specific Document methods and attributes.
 * @return {?Document} The new document.
 * @throws {Error} if browser does not support creating new documents or
 * namespace is provided without a root tag name.
 */
export function createDocument(opt_rootTagName?: string | undefined, opt_namespaceUri?: string | undefined, opt_preferActiveX?: boolean | undefined): Document | null;
/**
 * Creates an XML document from a string
 * @param {string} xml The text.
 * @param {boolean=} opt_preferActiveX Whether to default to ActiveXObject to
 * create Document in IE. Use this if you need xpath support in IE (e.g.,
 * selectSingleNode or selectNodes), but be aware that the ActiveXObject does
 * not support various DOM-specific Document methods and attributes.
 * @return {?Document} XML document from the text.
 * @throws {Error} if browser does not support loading XML documents.
 */
export function loadXml(xml: string, opt_preferActiveX?: boolean | undefined): Document | null;
/**
 * Selects multiple nodes using an Xpath expression and a root node
 * @param {?Node} node The root node.
 * @param {string} path Xpath selector.
 * @return {(!NodeList<!Node>|!Array<!Node>)} The selected nodes, or empty array
 *     if no matching nodes.
 */
export function selectNodes(node: Node | null, path: string): (NodeList<Node> | Array<Node>);
/**
 * Selects a single node using an Xpath expression and a root node
 * @param {?Node} node The root node.
 * @param {string} path Xpath selector.
 * @return {?Node} The selected node, or null if no matching node.
 */
export function selectSingleNode(node: Node | null, path: string): Node | null;
/**
 * Serializes an XML document or subtree to string.
 * @param {Document|?Element} xml The document or the root node of the subtree.
 * @return {string} The serialized XML.
 * @throws {Error} if browser does not support XML serialization.
 */
export function serialize(xml: Document | (Element | null)): string;
/**
 * Sets multiple attributes on an element. Differs from dom.setProperties
 * in that it exclusively uses the element's setAttributes method. Use this
 * when you need to ensure that the exact property is available as an attribute
 * and can be read later by the native getAttribute method.
 * @param {!Element} element XML or DOM element to set attributes on.
 * @param {!Object<string, string>} attributes Map of property:value pairs.
 */
export function setAttributes(element: Element, attributes: {
    [x: string]: string;
}): void;
