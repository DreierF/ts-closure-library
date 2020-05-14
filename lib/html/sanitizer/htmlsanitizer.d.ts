/**
 * Type for attribute policy configuration.
 */
export type HtmlSanitizerAttributePolicy = {
    tagName: string;
    attributeName: string;
    policy: HtmlSanitizerPolicy | null;
};
/**
 * Type for a policy function.
 */
export type HtmlSanitizerPolicy = (arg0: string, arg1?: HtmlSanitizerPolicyHints | undefined, arg2?: HtmlSanitizerPolicyContext | undefined, arg3?: ((arg0: string, arg1: unknown | undefined, arg2: unknown | undefined, arg3: unknown | undefined) => string | null) | undefined) => string | null;
/**
 * Type for optional context objects to the policy handler functions.
 */
export type HtmlSanitizerPolicyContext = {
    cssStyle: ((CSSStyleDeclaration | undefined) | null);
};
/**
 * Type for optional hints to policy handler functions.
 */
export type HtmlSanitizerPolicyHints = {
    tagName: (string | undefined);
    attributeName: (string | undefined);
    cssProperty: (string | undefined);
};
/**
 * Type for a URL policy function.
 */
export type HtmlSanitizerUrlPolicy = (arg0: string, arg1?: HtmlSanitizerPolicyHints | undefined) => SafeUrl | null;
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
    private attributeWhitelist_;
    /**
     * A set of attribute handlers that should not inherit their default policy
     * during build().
     * @private @const {!Object<string, boolean>}
     */
    private attributeOverrideList_;
    /**
     * List of data attributes to whitelist. Data-attributes are inert and don't
     * require sanitization.
     * @private @const {!Array<string>}
     */
    private dataAttributeWhitelist_;
    /**
     * List of custom element tags to whitelist. Custom elements are inert on
     * their own and require code to actually be dangerous, so the risk is similar
     * to data-attributes.
     * @private @const {!Array<string>}
     */
    private customElementTagWhitelist_;
    /**
     * A tag blacklist, to effectively remove an element and its children from the
     * dom.
     * @private @const {!Object<string, boolean>}
     */
    private tagBlacklist_;
    /**
     * A tag whitelist, to effectively allow an element and its children from the
     * dom.
     * @private {!Object<string, boolean>}
     */
    private tagWhitelist_;
    /**
     * Whether non-whitelisted and non-blacklisted tags that have been converted
     * to &lt;span&rt; tags will contain the original tag in a data attribute.
     * @private {boolean}
     */
    private shouldAddOriginalTagNames_;
    /**
     * A function to be applied to URLs found on the parsing process which do not
     * trigger requests.
     * @private {!HtmlSanitizerUrlPolicy}
     */
    private urlPolicy_;
    /**
     * A function to be applied to urls found on the parsing process which may
     * trigger requests.
     * @private {!HtmlSanitizerUrlPolicy}
     */
    private networkRequestUrlPolicy_;
    /**
     * A function to be applied to names found on the parsing process.
     * @private {!HtmlSanitizerPolicy}
     */
    private namePolicy_;
    /**
     * A function to be applied to other tokens (i.e. classes and IDs) found on
     * the parsing process.
     * @private {!HtmlSanitizerPolicy}
     */
    private tokenPolicy_;
    /**
     * A function to sanitize inline CSS styles. Defaults to deny all.
     * @private {function(
     *     !HtmlSanitizerPolicy,
     *     string,
     *     !HtmlSanitizerPolicyHints,
     *     !HtmlSanitizerPolicyContext):?string}
     */
    private sanitizeInlineCssPolicy_;
    /**
     * An optional ID to restrict the scope of CSS rules when STYLE tags are
     * allowed.
     * @private {?string}
     */
    private styleContainerId_;
    /**
     * Whether rules in STYLE tags should be inlined into style attributes.
     * @private {boolean}
     */
    private inlineStyleRules_;
    /**
     * True iff policies have been installed for the instance.
     * @private {boolean}
     */
    private policiesInstalled_;
    /**
     * Extends the list of allowed data attributes.
     * @param {!Array<string>} dataAttributeWhitelist
     * @return {!Builder}
     */
    allowDataAttributes(dataAttributeWhitelist: Array<string>): Builder;
    /**
     * Extends the list of allowed custom element tags.
     * @param {!Array<string>} customElementTagWhitelist
     * @return {!Builder}
     */
    allowCustomElementTags(customElementTagWhitelist: Array<string>): Builder;
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
    withStyleContainer(opt_styleContainer?: string | undefined): Builder;
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
    onlyAllowTags(tagWhitelist: Array<string>): Builder;
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
    onlyAllowAttributes(attrWhitelist: Array<(string | HtmlSanitizerAttributePolicy)>): Builder;
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
    withCustomUrlPolicy(customUrlPolicy: HtmlSanitizerUrlPolicy): Builder;
    /**
     * Sets a custom name policy.
     * @param {!HtmlSanitizerPolicy} customNamePolicy
     * @return {!Builder}
     */
    withCustomNamePolicy(customNamePolicy: HtmlSanitizerPolicy): Builder;
    /**
     * Sets a custom token policy.
     * @param {!HtmlSanitizerPolicy} customTokenPolicy
     * @return {!Builder}
     */
    withCustomTokenPolicy(customTokenPolicy: HtmlSanitizerPolicy): Builder;
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
    private installPolicies_;
    alsoAllowTagsPrivateDoNotAccessOrElse(tags: Array<string>): Builder;
    alsoAllowAttributesPrivateDoNotAccessOrElse(attrs: Array<(string | HtmlSanitizerAttributePolicy)>): Builder;
    withCustomNetworkRequestUrlPolicy(customNetworkReqUrlPolicy: HtmlSanitizerUrlPolicy): Builder;
}
/**
 * Creates an HTML sanitizer.
 * @final @class
 * @extends {SafeDomTreeProcessor}
 */
export class HtmlSanitizer extends SafeDomTreeProcessor {
    /**
     * Transforms a {@link HtmlSanitizerUrlPolicy} into a
     * {@link HtmlSanitizerPolicy} by returning a wrapper that calls the {@link
     * HtmlSanitizerUrlPolicy} with the required arguments and unwraps the returned
     * {@link SafeUrl}. This is necessary because internally the sanitizer works
     * with {@HtmlSanitizerPolicy} to sanitize attributes, but its public API must
     * use {@HtmlSanitizerUrlPolicy} to ensure that callers do not violate SafeHtml
     * invariants in their custom handlers.
     * @param {!HtmlSanitizerUrlPolicy} urlPolicy
     * @return {!HtmlSanitizerPolicy}
     * @private
     */
    private static wrapUrlPolicy_;
    /**
     * Wraps a custom policy function with the sanitizer's default policy.
     * @param {?HtmlSanitizerPolicy} customPolicy The custom
     *     policy for the tag/attribute combination.
     * @param {!HtmlSanitizerPolicy} defaultPolicy The
     *     sanitizer's policy that is always called after the custom policy.
     * @return {!HtmlSanitizerPolicy}
     * @private
     */
    private static wrapPolicy_;
    /**
     * Installs the sanitizer's default policy for a specific tag/attribute
     * combination on the provided whitelist, but only if a policy already exists.
     * @param {!Object<string, !HtmlSanitizerPolicy>}
     *     whitelist The whitelist to modify.
     * @param {!Object<string, boolean>} overrideList The set of attributes handlers
     *     that should not be wrapped with a default policy.
     * @param {string} key The tag/attribute combination
     * @param {!HtmlSanitizerPolicy} defaultPolicy The
     *     sanitizer's policy.
     * @private
     */
    private static installDefaultPolicy_;
    /**
     * Returns a key into the attribute handlers dictionary given a node name and
     * an attribute name. If no node name is given, returns a key applying to all
     * nodes.
     * @param {?string} nodeName
     * @param {string} attributeName
     * @return {string} key into attribute handlers dict
     * @private
     */
    private static attrIdentifier_;
    /**
     * Sanitizes a list of CSS declarations.
     * @param {?HtmlSanitizerPolicy} policySanitizeUrl
     * @param {string} attrValue
     * @param {?HtmlSanitizerPolicyHints} policyHints
     * @param {?HtmlSanitizerPolicyContext} policyContext
     * @return {?string} sanitizedCss from the policyContext
     * @private
     */
    private static sanitizeCssDeclarationList_;
    /**
     * Cleans up an attribute value that we don't particularly want to do anything
     * to. At the moment we just trim the whitespace.
     * @param {string} attrValue
     * @return {string} sanitizedAttrValue
     * @private
     */
    private static cleanUpAttribute_;
    /**
     * Allows a set of attribute values.
     * @param {!Array<string>} allowedValues Set of allowed values lowercased.
     * @param {string} attrValue
     * @param {?HtmlSanitizerPolicyHints} policyHints
     * @return {?string} sanitizedAttrValue
     * @private
     */
    private static allowedAttributeValues_;
    /**
     * Sanitizes URL fragments.
     * @param {string} urlFragment
     * @param {?HtmlSanitizerPolicyHints} policyHints
     * @return {?string} sanitizedAttrValue
     * @private
     */
    private static sanitizeUrlFragment_;
    /**
     * Runs an attribute name through a name policy.
     * @param {?HtmlSanitizerPolicy} namePolicy
     * @param {string} attrName
     * @param {?HtmlSanitizerPolicyHints} policyHints
     * @return {?string} sanitizedAttrValue
     * @private
     */
    private static sanitizeName_;
    /**
     * Ensures that the class prefix is present on all space-separated tokens
     * (i.e. all class names).
     * @param {?HtmlSanitizerPolicy} tokenPolicy
     * @param {string} attrValue
     * @param {?HtmlSanitizerPolicyHints} policyHints
     * @return {?string} sanitizedAttrValue
     * @private
     */
    private static sanitizeClasses_;
    /**
     * Ensures that the id prefix is present.
     * @param {?HtmlSanitizerPolicy} tokenPolicy
     * @param {string} attrValue
     * @param {?HtmlSanitizerPolicyHints} policyHints
     * @return {?string} sanitizedAttrValue
     * @private
     */
    private static sanitizeId_;
    /**
     * Retrieves a HtmlSanitizerPolicyContext from a dirty node given an attribute
     * name.
     * @param {string} attributeName
     * @param {!Element} dirtyElement
     * @return {!HtmlSanitizerPolicyContext}
     * @private
     */
    private static getContext_;
    /**
     * Sanitizes a HTML string using a sanitizer with default options.
     * @param {string} unsanitizedHtml
     * @return {!SafeHtml} sanitizedHtml
     */
    static sanitize(unsanitizedHtml: string): SafeHtml;
    /**
     * Creates an HTML sanitizer.
     * @param {!Builder=} opt_builder
     */
    constructor(opt_builder?: Builder | undefined);
    /**
     * @private @const {!Object<string, !HtmlSanitizerPolicy>}
     */
    private attributeHandlers_;
    /** @private @const {!Object<string, boolean>} */
    private tagBlacklist_;
    /** @private @const {!Object<string, boolean>} */
    private tagWhitelist_;
    /** @private @const {boolean} */
    private shouldAddOriginalTagNames_;
    /** @private @const {!HtmlSanitizerUrlPolicy} */
    private networkRequestUrlPolicy_;
    /** @private @const {?string} */
    private styleContainerId_;
    /** @private {?string} */
    private currentStyleContainerId_;
    /** @private @const {boolean} */
    private inlineStyleRules_;
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
    /**
     * Gets the style container ID for the sanitized output, or creates a new random
     * one. If no style container is necessary or style containment is disabled,
     * returns null.
     * @return {?string}
     * @private
     */
    private getStyleContainerId_;
}
export namespace HtmlSanitizer {
    export const defaultUrlPolicy_: typeof SafeUrl.sanitize;
    export const defaultNetworkRequestUrlPolicy_: typeof goog_functions.NULL;
    export const defaultNamePolicy_: typeof goog_functions.NULL;
    export const defaultTokenPolicy_: typeof goog_functions.NULL;
}
/**
 * Type for a policy function.
 * @typedef {function(string, HtmlSanitizerPolicyHints=,
 *     HtmlSanitizerPolicyContext=,
 *     (function(string, ?=, ?=, ?=):?string)=):?string}
 */
export let HtmlSanitizerPolicy: any;
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
/**
 * Type for optional context objects to the policy handler functions.
 * @typedef {{
 *     cssStyle: (?CSSStyleDeclaration|undefined)
 *     }}
 */
export let HtmlSanitizerPolicyContext: any;
import { SafeUrl } from "../safeurl.js";
/**
 * Type for a URL policy function.
 *
 * @typedef {function(string, !HtmlSanitizerPolicyHints=):
 *     ?SafeUrl}
 */
export let HtmlSanitizerUrlPolicy: any;
import { SafeDomTreeProcessor } from "./safedomtreeprocessor.js";
import { SafeHtml } from "../safehtml.js";
import * as goog_functions from "../../functions/functions.js";
