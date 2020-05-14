/**
 * Constructs a {@link SafeDomTreeProcessor} object that safely parses an input
 * string into a DOM tree using an inert document, and creates a new tree based
 * on the original tree, optionally transforming it in the process. The
 * transformation is not specified in this abstract class; subclasses are
 * supposed to override its protected methods to define a transformation that
 * allows tags and attributes, drops entire subtrees, modifies tag names or
 * attributes, etc.
 @class @abstract
 */
export class SafeDomTreeProcessor {
    /**
     * Parses an HTML string and walks the resulting DOM forest to apply the
     * transformation function and generate a new forest. Returns the string
     * representation of the forest.
     * @param {string} html
     * @return {string}
     * @protected @final
     */
    protected processToString(html: string): string;
    /**
     * Parses an HTML string and walks the resulting DOM forest to apply the
     * transformation function and generate a copy of the forest. Returns the forest
     * wrapped in a common SPAN parent, so that the result is always a tree.
     * @param {string} html
     * @return {!HTMLSpanElement}
     * @protected @final
     */
    protected processToTree(html: string): HTMLSpanElement;
    /**
     * Creates the root SPAN element for the new tree. This function can be
     * overridden to add attributes to the tag. Note that if any attributes are
     * added to the element, then {@link processToString} will not strip it from the
     * generated string to preserve the attributes.
     * @param {!HTMLSpanElement} newRoot
     * @protected @abstract
     */
    protected processRoot(newRoot: HTMLSpanElement): void;
    /**
     * Pre-processes the input html before the main tree-based transformation.
     * @param {string} html
     * @return {string}
     * @protected @abstract
     */
    protected preProcessHtml(html: string): string;
    /**
     * Returns a new node based on the transformation of an original node, or null
     * if the node and all its children should not be copied over to the new tree.
     * @param {!Node} originalNode
     * @return {?Node}
     * @private
     */
    private createNode_;
    /**
     * Creates a new text node from the original text node, or null if the node
     * should not be copied over to the new tree.
     * @param {!Text} originalNode
     * @return {?Text}
     * @protected @abstract
     */
    protected createTextNode(originalNode: Text): Text | null;
    /**
     * Creates a new element from the original element, potentially applying
     * transformations to the element's tagname and attributes.
     * @param {!Element} originalElement
     * @return {Element|null}
     * @private
     */
    private createElement_;
    /**
     * Creates a new element from the original element. This function should only
     * either create a new element (optionally changing the tag name from the
     * original element) or return null to prevent the entire subtree from appearing
     * in the output. Note that TEMPLATE tags and their contents are automatically
     * dropped, and this function is not called to decide whether to keep them or
     * not.
     * @param {!Element} originalElement
     * @return {Element|null}
     * @protected @abstract
     */
    protected createElementWithoutAttributes(originalElement: Element): Element | null;
    /**
     * Copies over the attributes of an original node to its corresponding new node
     * generated with {@link processNode}.
     * @param {!Element} originalElement
     * @param {!Element} newElement
     * @private
     */
    private processElementAttributes_;
    /**
     * Returns the new value for an attribute, or null if the attribute should be
     * dropped.
     * @param {!Element} element
     * @param {!Attr} attribute
     * @return {?string}
     * @protected @abstract
     */
    protected processElementAttribute(element: Element, attribute: Attr): string | null;
}
export namespace SafeDomTreeProcessor {
    export { SAFE_PARSING_SUPPORTED };
}
/**
 * Whether the HTML sanitizer is supported. For now mainly exclude
 * IE9 or below, for which we know the sanitizer is insecure or broken.
 * @const {boolean}
 */
declare var SAFE_PARSING_SUPPORTED: boolean;
export {};
