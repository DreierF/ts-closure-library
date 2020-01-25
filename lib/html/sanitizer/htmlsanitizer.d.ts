/**
 * Type for attribute policy configuration.
 */
export type HtmlSanitizerAttributePolicy = {
    tagName: string;
    attributeName: string;
    policy: (arg0: string, arg1?: {
        tagName: string;
        attributeName: string;
        cssProperty: string;
    }, arg2?: {
        cssStyle: CSSStyleDeclaration;
    }, arg3?: (arg0: string, arg1?: any, arg2?: any, arg3?: any) => string) => string;
};
/**
 * Type for a policy function.
 */
export type HtmlSanitizerPolicy = (arg0: string, arg1?: {
    tagName: string;
    attributeName: string;
    cssProperty: string;
}, arg2?: {
    cssStyle: CSSStyleDeclaration;
}, arg3?: (arg0: string, arg1?: any, arg2?: any, arg3?: any) => string) => string;
/**
 * Type for optional context objects to the policy handler functions.
 */
export type HtmlSanitizerPolicyContext = {
    cssStyle: CSSStyleDeclaration;
};
/**
 * Type for optional hints to policy handler functions.
 */
export type HtmlSanitizerPolicyHints = {
    tagName: string;
    attributeName: string;
    cssProperty: string;
};
/**
 * Type for a URL policy function.
 */
export type HtmlSanitizerUrlPolicy = (arg0: string, arg1?: {
    tagName: string;
    attributeName: string;
    cssProperty: string;
}) => SafeUrl;
/**
 * The builder for the HTML Sanitizer. All methods except build return
 * `this`.
 * @final @class
 */
export class Builder {
    /**
     * A set of attribute sanitization functions. Default built-in handlers are
     * all tag-agnostic by design. Note that some attributes behave differently
     * when attached to different nodes (for example, the href attribute will
     * generally not make a network request, but &lt;link href=""&gt; does), and
     * so when necessary a tag-specific handler can be used to override a
     * tag-agnostic one.
     * @private {!Object<string, !HtmlSanitizerPolicy>}
     */
    attributeWhitelist_: {};
    /**
     * A set of attribute handlers that should not inherit their default policy
     * during build().
     * @private @const {!Object<string, boolean>}
     */
    attributeOverrideList_: {};
    /**
     * List of data attributes to whitelist. Data-attributes are inert and don't
     * require sanitization.
     * @private @const {!Array<string>}
     */
    dataAttributeWhitelist_: any[];
    /**
     * List of custom element tags to whitelist. Custom elements are inert on
     * their own and require code to actually be dangerous, so the risk is similar
     * to data-attributes.
     * @private @const {!Array<string>}
     */
    customElementTagWhitelist_: any[];
    /**
     * A tag blacklist, to effectively remove an element and its children from the
     * dom.
     * @private @const {!Object<string, boolean>}
     */
    tagBlacklist_: any;
    /**
     * A tag whitelist, to effectively allow an element and its children from the
     * dom.
     * @private {!Object<string, boolean>}
     */
    tagWhitelist_: any;
    /**
     * Whether non-whitelisted and non-blacklisted tags that have been converted
     * to &lt;span&rt; tags will contain the original tag in a data attribute.
     * @private {boolean}
     */
    shouldAddOriginalTagNames_: boolean;
    /**
     * A function to be applied to URLs found on the parsing process which do not
     * trigger requests.
     * @private {!HtmlSanitizerUrlPolicy}
     */
    urlPolicy_: (url: string | import("../../string/typedstring.js").TypedString) => SafeUrl;
    /**
     * A function to be applied to urls found on the parsing process which may
     * trigger requests.
     * @private {!HtmlSanitizerUrlPolicy}
     */
    networkRequestUrlPolicy_: typeof goog_functions.NULL;
    /**
     * A function to be applied to names found on the parsing process.
     * @private {!HtmlSanitizerPolicy}
     */
    namePolicy_: typeof goog_functions.NULL;
    /**
     * A function to be applied to other tokens (i.e. classes and IDs) found on
     * the parsing process.
     * @private {!HtmlSanitizerPolicy}
     */
    tokenPolicy_: typeof goog_functions.NULL;
    /**
     * A function to sanitize inline CSS styles. Defaults to deny all.
     * @private {function(
     *     !HtmlSanitizerPolicy,
     *     string,
     *     !HtmlSanitizerPolicyHints,
     *     !HtmlSanitizerPolicyContext):?string}
     */
    sanitizeInlineCssPolicy_: typeof goog_functions.NULL;
    /**
     * An optional ID to restrict the scope of CSS rules when STYLE tags are
     * allowed.
     * @private {?string}
     */
    styleContainerId_: string;
    /**
     * Whether rules in STYLE tags should be inlined into style attributes.
     * @private {boolean}
     */
    inlineStyleRules_: boolean;
    /**
     * True iff policies have been installed for the instance.
     * @private {boolean}
     */
    policiesInstalled_: boolean;
    /**
     * Extends the list of allowed data attributes.
     * @param {!Array<string>} dataAttributeWhitelist
     * @return {!Builder}
     */
    allowDataAttributes(dataAttributeWhitelist: string[]): Builder;
    /**
     * Extends the list of allowed custom element tags.
     * @param {!Array<string>} customElementTagWhitelist
     * @return {!Builder}
     */
    allowCustomElementTags(customElementTagWhitelist: string[]): Builder;
    /**
     * Allows form tags in the HTML. Without this all form tags and content will be
     * dropped.
     * @return {!Builder}
     */
    allowFormTag(): Builder;
    /**
     * Allows STYLE tags. Note that the sanitizer wraps the output of each call to
     * {@link sanitize} with a SPAN tag, give it a random ID unique across multiple
     * calls, and then restrict all CSS rules found inside STYLE tags to only apply
     * to children of the SPAN tag. This means that CSS rules in STYLE tags will
     * only apply to content provided in the same call to {@link sanitize}. This
     * feature is not compatible with {@link inlineStyleRules}.
     * @return {!Builder}
     */
    allowStyleTag(): Builder;
    /**
     * Fixes the ID of the style container used for CSS rules found in STYLE tags,
     * and disables automatic wrapping with the container. This allows multiple
     * calls to {@link sanitize} to share STYLE rules. If opt_styleContainer is
     * missing, the sanitizer will stop restricting the scope of CSS rules
     * altogether. Requires {@link allowStyleTag} to be called first.
     * @param {string=} opt_styleContainer An optional container ID to restrict the
     *     scope of any CSS rule found in STYLE tags.
     * @return {!Builder}
     */
    withStyleContainer(opt_styleContainer?: string): Builder;
    /**
     * Converts rules in STYLE tags into style attributes on the tags they apply to.
     * This feature is not compatible with {@link withStyleContainer} and {@link
     * allowStyleTag}. This method requires {@link allowCssStyles} (otherwise rules
     * would be deleted after being inlined), and is not compatible with {@link
     * allowStyleTag}.
     * @return {!Builder}
     */
    inlineStyleRules(): Builder;
    /**
     * Allows inline CSS styles.
     * @return {!Builder}
     */
    allowCssStyles(): Builder;
    /**
     * Allows only the provided whitelist of tags. Tags still need to be in the
     * TagWhitelist to be allowed.
     * <p>
     * SPAN tags are ALWAYS ALLOWED as part of the mechanism required to preserve
     * the HTML tree structure (when removing non-blacklisted tags and
     * non-whitelisted tags).
     * @param {!Array<string>} tagWhitelist
     * @return {!Builder}
     * @throws {Error} Thrown if an attempt is made to allow a non-whitelisted tag.
     */
    onlyAllowTags(tagWhitelist: string[]): Builder;
    /**
     * Allows only the provided whitelist of attributes, possibly setting a custom
     * policy for them. The set of tag/attribute combinations need to be a subset of
     * the currently allowed combinations.
     * <p>
     * Note that you cannot define a generic handler for an attribute if only a
     * tag-specific one is present, and vice versa. To configure the sanitizer to
     * accept an attribute only for a specific tag when only a generic handler is
     * whitelisted, use the HtmlSanitizerPolicyHints parameter
     * and simply reject the attribute in unwanted tags.
     * <p>
     * Also note that the sanitizer's policy is still called after the provided one,
     * to ensure that supplying misconfigured policy cannot introduce
     * vulnerabilities. To completely override an existing attribute policy or to
     * allow new attributes, see the goog.html.sanitizer.unsafe package.
     * @param {!Array<(string|!HtmlSanitizerAttributePolicy)>}
     *     attrWhitelist The subset of attributes that the sanitizer will accept.
     *     Attributes can come in of two forms:
     *     - string: allow all values for this attribute on all tags.
     *     - HtmlSanitizerAttributePolicy: allows specifying a policy for a
     *         particular tag. The tagName can be "*", which means all tags. If no
     *         policy is passed, the default is to allow all values.
     *     The tag and attribute names are case-insensitive.
     *     Note that the policy for id, URLs, names etc is controlled separately
     *     (using withCustom* methods).
     * @return {!Builder}
     * @throws {Error} Thrown if an attempt is made to allow a non-whitelisted
     *     attribute.
     */
    onlyAllowAttributes(attrWhitelist: (string | {
        tagName: string;
        attributeName: string;
        policy: (arg0: string, arg1?: {
            tagName: string;
            attributeName: string;
            cssProperty: string;
        }, arg2?: {
            cssStyle: CSSStyleDeclaration;
        }, arg3?: (arg0: string, arg1?: any, arg2?: any, arg3?: any) => string) => string;
    })[]): Builder;
    /**
     * Adds the original tag name in the data attribute 'original-tag' when unknown
     * tags are sanitized to &lt;span&rt;, so that caller can distinguish them from
     * actual &lt;span&rt; tags.
     * @return {!Builder}
     */
    addOriginalTagNames(): Builder;
    /**
     * Sets a custom non-network URL policy.
     * @param {!HtmlSanitizerUrlPolicy} customUrlPolicy
     * @return {!Builder}
     */
    withCustomUrlPolicy(customUrlPolicy: (arg0: string, arg1?: {
        tagName: string;
        attributeName: string;
        cssProperty: string;
    }) => SafeUrl): Builder;
    /**
     * Sets a custom name policy.
     * @param {!HtmlSanitizerPolicy} customNamePolicy
     * @return {!Builder}
     */
    withCustomNamePolicy(customNamePolicy: (arg0: string, arg1?: {
        tagName: string;
        attributeName: string;
        cssProperty: string;
    }, arg2?: {
        cssStyle: CSSStyleDeclaration;
    }, arg3?: (arg0: string, arg1?: any, arg2?: any, arg3?: any) => string) => string): Builder;
    /**
     * Sets a custom token policy.
     * @param {!HtmlSanitizerPolicy} customTokenPolicy
     * @return {!Builder}
     */
    withCustomTokenPolicy(customTokenPolicy: (arg0: string, arg1?: {
        tagName: string;
        attributeName: string;
        cssProperty: string;
    }, arg2?: {
        cssStyle: CSSStyleDeclaration;
    }, arg3?: (arg0: string, arg1?: any, arg2?: any, arg3?: any) => string) => string): Builder;
    /**
     * Builds and returns a HtmlSanitizer object.
     * @return {!HtmlSanitizer}
     */
    build(): HtmlSanitizer;
    /**
     * Installs the sanitization policies for the attributes.
     * May only be called once.
     * @private
     * @suppress {checkTypes}
     */
    installPolicies_(): void;
    alsoAllowTagsPrivateDoNotAccessOrElse(tags: string[]): Builder;
    alsoAllowAttributesPrivateDoNotAccessOrElse(attrs: (string | {
        tagName: string;
        attributeName: string;
        policy: (arg0: string, arg1?: {
            tagName: string;
            attributeName: string;
            cssProperty: string;
        }, arg2?: {
            cssStyle: CSSStyleDeclaration;
        }, arg3?: (arg0: string, arg1?: any, arg2?: any, arg3?: any) => string) => string;
    })[]): Builder;
    withCustomNetworkRequestUrlPolicy(customNetworkReqUrlPolicy: (arg0: string, arg1?: {
        tagName: string;
        attributeName: string;
        cssProperty: string;
    }) => SafeUrl): Builder;
}
/**
 * Creates an HTML sanitizer.
 * @final @class
 * @extends {SafeDomTreeProcessor}
 */
export class HtmlSanitizer extends SafeDomTreeProcessor {
    /**
     * Creates an HTML sanitizer.
     * @param {!Builder=} opt_builder
     */
    constructor(opt_builder?: Builder);
    /**
     * @private @const {!Object<string, !HtmlSanitizerPolicy>}
     */
    attributeHandlers_: any;
    /** @private @const {!Object<string, boolean>} */
    tagBlacklist_: any;
    /** @private @const {!Object<string, boolean>} */
    tagWhitelist_: any;
    /** @private @const {boolean} */
    shouldAddOriginalTagNames_: boolean;
    /** @private @const {!HtmlSanitizerUrlPolicy} */
    networkRequestUrlPolicy_: typeof goog_functions.NULL;
    /** @private @const {?string} */
    styleContainerId_: string;
    /** @private {?string} */
    currentStyleContainerId_: string;
    /** @private @const {boolean} */
    inlineStyleRules_: boolean;
    /**
     * Parses the DOM tree of a given HTML string, then walks the tree. For each
     * element, it creates a new sanitized version, applies sanitized attributes,
     * and returns a SafeHtml object representing the sanitized tree.
     * @param {string} unsanitizedHtml
     * @return {!SafeHtml} Sanitized HTML
     */
    sanitize(unsanitizedHtml: string): SafeHtml;
    /**
     * Parses the DOM tree of a given HTML string, then walks the tree. For each
     * element, it creates a new sanitized version, applies sanitized attributes,
     * and returns a span element containing the sanitized content. The root element
     * might define a class name to restrict the visibility of CSS rules contained
     * in tree.
     * @param {string} unsanitizedHtml
     * @return {!HTMLSpanElement} Sanitized HTML
     */
    sanitizeToDomNode(unsanitizedHtml: string): HTMLSpanElement;
    /** @override */
    processRoot(newRoot: any): void;
    /** @override */
    preProcessHtml(unsanitizedHtml: any): any;
    /**
     * Gets the style container ID for the sanitized output, or creates a new random
     * one. If no style container is necessary or style containment is disabled,
     * returns null.
     * @return {?string}
     * @private
     */
    getStyleContainerId_(): string;
    /** @override */
    createTextNode(dirtyNode: any): Text;
    /** @override */
    createElementWithoutAttributes(dirtyElement: any): any;
    /** @override */
    processElementAttribute(dirtyElement: any, attribute: any): any;
}
export namespace HtmlSanitizer {
    export const defaultUrlPolicy_: (url: string | import("../../string/typedstring.js").TypedString) => SafeUrl;
    export const defaultNetworkRequestUrlPolicy_: typeof goog_functions.NULL;
    export const defaultNamePolicy_: typeof goog_functions.NULL;
    export const defaultTokenPolicy_: typeof goog_functions.NULL;
}
/**
 * Type for attribute policy configuration.
 * @typedef {{
 *     tagName: string,
 *     attributeName: string,
 *     policy: ?HtmlSanitizerPolicy
 * }}
 */
export let HtmlSanitizerAttributePolicy: any;
/**
 * Type for a policy function.
 * @typedef {function(string, HtmlSanitizerPolicyHints=,
 *     HtmlSanitizerPolicyContext=,
 *     (function(string, ?=, ?=, ?=):?string)=):?string}
 */
export let HtmlSanitizerPolicy: any;
/**
 * Type for optional context objects to the policy handler functions.
 * @typedef {{
 *     cssStyle: (?CSSStyleDeclaration|undefined)
 *     }}
 */
export let HtmlSanitizerPolicyContext: any;
/**
 * @fileoverview An HTML sanitizer that can satisfy a variety of security
 * policies.
 *
 * This package provides html sanitizing functions. It does not enforce string
 * to string conversion, instead returning a dom-like element when possible.
 *
 * Examples of usage of the static `HtmlSanitizer.sanitize`:
 * <pre>
 *   var safeHtml = HtmlSanitizer.sanitize('<script src="xss.js" />');
 *   goog_dom.safe.setInnerHtml(el, safeHtml);
 * </pre>
 *
 * @supported IE 10+, Chrome 26+, Firefox 22+, Safari 7.1+, Opera 15+
 */
/**
 * Type for optional hints to policy handler functions.
 * @typedef {{
 *     tagName: (string|undefined),
 *     attributeName: (string|undefined),
 *     cssProperty: (string|undefined)
 *     }}
 */
export let HtmlSanitizerPolicyHints: any;
import { SafeUrl } from "../safeurl.js";
/**
 * Type for a URL policy function.
 *
 * @typedef {function(string, !HtmlSanitizerPolicyHints=):
 *     ?SafeUrl}
 */
export let HtmlSanitizerUrlPolicy: any;
import * as goog_functions from "../../functions/functions.js";
import { SafeDomTreeProcessor } from "./safedomtreeprocessor.js";
import { SafeHtml } from "../safehtml.js";
