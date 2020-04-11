import * as googarray from './../../array/array.js';
import * as goog_asserts from './../../asserts/asserts.js';
import {AssertionError} from './../../asserts/asserts.js';
import * as goog_dom from './../../dom/dom.js';
import {TagName} from './../../dom/tagname.js';
import * as goog_functions from './../../functions/functions.js';
import * as google from './../../google.js';
import * as goog_object from './../../object/object.js';
import {Const} from './../../string/const.js';
import * as strings from './../../string/string.js';
import {SafeHtml} from './../safehtml.js';
import {SafeStyle} from './../safestyle.js';
import {SafeStyleSheet} from './../safestylesheet.js';
import {SafeUrl} from './../safeurl.js';
import * as uncheckedconversions from './../uncheckedconversions.js';
import {AttributeWhitelist} from './attributewhitelist.js';
import {AttributeSanitizedWhitelist} from './attributewhitelist.js';
import * as CssSanitizer from './csssanitizer.js';
import * as noclobber from './noclobber.js';
import {SafeDomTreeProcessor} from './safedomtreeprocessor.js';
import {TagBlacklist} from './tagblacklist.js';
import {TagWhitelist} from './tagwhitelist.js';
// Copyright 2016 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
let HtmlSanitizerPolicyHints;

/**
 * Type for optional context objects to the policy handler functions.
 * @typedef {{
 *     cssStyle: (?CSSStyleDeclaration|undefined)
 *     }}
 */
let HtmlSanitizerPolicyContext;

/**
 * Type for a policy function.
 * @typedef {function(string, HtmlSanitizerPolicyHints=,
 *     HtmlSanitizerPolicyContext=,
 *     (function(string, ?=, ?=, ?=):?string)=):?string}
 */
let HtmlSanitizerPolicy;

/**
 * Type for a URL policy function.
 *
 * @typedef {function(string, !HtmlSanitizerPolicyHints=):
 *     ?SafeUrl}
 */
let HtmlSanitizerUrlPolicy;

/**
 * Type for attribute policy configuration.
 * @typedef {{
 *     tagName: string,
 *     attributeName: string,
 *     policy: ?HtmlSanitizerPolicy
 * }}
 */
let HtmlSanitizerAttributePolicy;

/**
 * Prefix used by all internal html sanitizer booking properties.
 * @private @const {string}
 */
let HTML_SANITIZER_BOOKKEEPING_PREFIX_ = 'data-sanitizer-';

/**
 * Attribute name added to span tags that replace unknown tags. The value of
 * this attribute is the name of the tag before the sanitization occurred.
 * @private @const {string}
 */
let HTML_SANITIZER_SANITIZED_ATTR_NAME_ =
    HTML_SANITIZER_BOOKKEEPING_PREFIX_ + 'original-tag';

/**
 * A list of tags that contain '-' but are invalid custom element tags.
 * @private @const @dict {boolean}
 */
let HTML_SANITIZER_INVALID_CUSTOM_TAGS_ = {
  'ANNOTATION-XML': true,
  'COLOR-PROFILE': true,
  'FONT-FACE': true,
  'FONT-FACE-SRC': true,
  'FONT-FACE-URI': true,
  'FONT-FACE-FORMAT': true,
  'FONT-FACE-NAME': true,
  'MISSING-GLYPH': true,
};

/**
 * Special value for the STYLE container ID, which makes the sanitizer choose
 * a new random ID on each call to {@link sanitize}.
 * @private @const {string}
 */
let RANDOM_CONTAINER_ = '*';

/**
 * Creates an HTML sanitizer.
 * @final @class
 * @extends {SafeDomTreeProcessor}
 */
class HtmlSanitizer extends SafeDomTreeProcessor {

  /**
   * Creates an HTML sanitizer.
   * @param {!Builder=} opt_builder
   */
  constructor(opt_builder) {
    super();
  
    var builder = opt_builder || new Builder();
  
    builder.installPolicies_();
  
    /**
     * @private @const {!Object<string, !HtmlSanitizerPolicy>}
     */
    this.attributeHandlers_ = goog_object.clone(builder.attributeWhitelist_);
  
    /** @private @const {!Object<string, boolean>} */
    this.tagBlacklist_ = goog_object.clone(builder.tagBlacklist_);
  
    /** @private @const {!Object<string, boolean>} */
    this.tagWhitelist_ = goog_object.clone(builder.tagWhitelist_);
  
    /** @private @const {boolean} */
    this.shouldAddOriginalTagNames_ = builder.shouldAddOriginalTagNames_;
  
    // Add whitelist data-* attributes from the builder to the attributeHandlers
    // with a default cleanUpAttribute function. data-* attributes are inert as
    // per HTML5 specs, so not much sanitization needed.
    googarray.forEach(builder.dataAttributeWhitelist_, function(dataAttr) {
      if (!strings.startsWith(dataAttr, 'data-')) {
        throw new AssertionError(
            'Only "data-" attributes allowed, got: %s.', [dataAttr]);
      }
      if (strings.startsWith(
              dataAttr, HTML_SANITIZER_BOOKKEEPING_PREFIX_)) {
        throw new AssertionError(
            'Attributes with "%s" prefix are not allowed, got: %s.',
            [HTML_SANITIZER_BOOKKEEPING_PREFIX_, dataAttr]);
      }
  
      this.attributeHandlers_['* ' + dataAttr.toUpperCase()] =
          /** @type {!HtmlSanitizerPolicy} */ (
              HtmlSanitizer.cleanUpAttribute_);
    }, this);
  
    // Add whitelist custom element tags, ensures that they contains at least one
    // '-' and that they are not part of the reserved names.
    googarray.forEach(builder.customElementTagWhitelist_, function(customTag) {
      customTag = customTag.toUpperCase();
  
      if (!strings.contains(customTag, '-') ||
          HTML_SANITIZER_INVALID_CUSTOM_TAGS_[customTag]) {
        throw new AssertionError(
            'Only valid custom element tag names allowed, got: %s.', [customTag]);
      }
  
      this.tagWhitelist_[customTag] = true;
    }, this);
  
    /** @private @const {!HtmlSanitizerUrlPolicy} */
    this.networkRequestUrlPolicy_ = builder.networkRequestUrlPolicy_;
  
    /** @private @const {?string} */
    this.styleContainerId_ = builder.styleContainerId_;
  
    /** @private {?string} */
    this.currentStyleContainerId_ = null;
  
    /** @private @const {boolean} */
    this.inlineStyleRules_ = builder.inlineStyleRules_;
  }

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
  static wrapUrlPolicy_(urlPolicy) {
    return /** @type {!HtmlSanitizerPolicy} */ (function(
        url, policyHints) {
      var trimmed = HtmlSanitizer.cleanUpAttribute_(url);
      var safeUrl = urlPolicy(trimmed, policyHints);
      if (safeUrl &&
          SafeUrl.unwrap(safeUrl) !=
              SafeUrl.INNOCUOUS_STRING) {
        return SafeUrl.unwrap(safeUrl);
      } else {
        return null;
      }
    });
  };

  /**
   * Wraps a custom policy function with the sanitizer's default policy.
   * @param {?HtmlSanitizerPolicy} customPolicy The custom
   *     policy for the tag/attribute combination.
   * @param {!HtmlSanitizerPolicy} defaultPolicy The
   *     sanitizer's policy that is always called after the custom policy.
   * @return {!HtmlSanitizerPolicy}
   * @private
   */
  static wrapPolicy_(
      customPolicy, defaultPolicy) {
    return /** @type {!HtmlSanitizerPolicy} */ (function(
        value, hints, ctx, policy) {
      var result = customPolicy(value, hints, ctx, policy);
      return result == null ? null : defaultPolicy(result, hints, ctx, policy);
    });
  };

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
  static installDefaultPolicy_(
      whitelist, overrideList, key, defaultPolicy) {
    if (whitelist[key] && !overrideList[key]) {
      whitelist[key] = HtmlSanitizer.wrapPolicy_(
          whitelist[key], defaultPolicy);
    }
  };

  /**
   * Returns a key into the attribute handlers dictionary given a node name and
   * an attribute name. If no node name is given, returns a key applying to all
   * nodes.
   * @param {?string} nodeName
   * @param {string} attributeName
   * @return {string} key into attribute handlers dict
   * @private
   */
  static attrIdentifier_(
      nodeName, attributeName) {
    if (!nodeName) {
      nodeName = '*';
    }
    return (nodeName + ' ' + attributeName).toUpperCase();
  };

  /**
   * Sanitizes a list of CSS declarations.
   * @param {HtmlSanitizerPolicy} policySanitizeUrl
   * @param {string} attrValue
   * @param {HtmlSanitizerPolicyHints} policyHints
   * @param {HtmlSanitizerPolicyContext} policyContext
   * @return {?string} sanitizedCss from the policyContext
   * @private
   */
  static sanitizeCssDeclarationList_(
      policySanitizeUrl, attrValue, policyHints, policyContext) {
    if (!policyContext.cssStyle) {
      return null;
    }
    function naiveUriRewriter(uri, prop) {
      policyHints.cssProperty = prop;
      var sanitizedUrl = policySanitizeUrl(uri, policyHints);
      if (sanitizedUrl == null) {
        return null;
      }
      return uncheckedconversions
          .safeUrlFromStringKnownToSatisfyTypeContract(
              Const.from(
                  'HtmlSanitizerPolicy created with networkRequestUrlPolicy_ ' +
                  'when installing \'* STYLE\' handler.'),
              sanitizedUrl);
    };
    var sanitizedStyle = SafeStyle.unwrap(
        CssSanitizer.sanitizeInlineStyle(
            policyContext.cssStyle, naiveUriRewriter));
    return sanitizedStyle == '' ? null : sanitizedStyle;
  };

  /**
   * Cleans up an attribute value that we don't particularly want to do anything
   * to. At the moment we just trim the whitespace.
   * @param {string} attrValue
   * @return {string} sanitizedAttrValue
   * @private
   */
  static cleanUpAttribute_(attrValue) {
    return strings.trim(attrValue);
  };

  /**
   * Allows a set of attribute values.
   * @param {!Array<string>} allowedValues Set of allowed values lowercased.
   * @param {string} attrValue
   * @param {HtmlSanitizerPolicyHints} policyHints
   * @return {?string} sanitizedAttrValue
   * @private
   */
  static allowedAttributeValues_(
      allowedValues, attrValue, policyHints) {
    var trimmed = strings.trim(attrValue);
    return googarray.contains(allowedValues, trimmed.toLowerCase()) ? trimmed :
                                                                       null;
  };

  /**
   * Sanitizes URL fragments.
   * @param {string} urlFragment
   * @param {HtmlSanitizerPolicyHints} policyHints
   * @return {?string} sanitizedAttrValue
   * @private
   */
  static sanitizeUrlFragment_(
      urlFragment, policyHints) {
    var trimmed = strings.trim(urlFragment);
    if (trimmed && trimmed.charAt(0) == '#') {
      // We do not apply the name or token policy to Url Fragments by design.
      return trimmed;
    }
    return null;
  };

  /**
   * Runs an attribute name through a name policy.
   * @param {HtmlSanitizerPolicy} namePolicy
   * @param {string} attrName
   * @param {HtmlSanitizerPolicyHints} policyHints
   * @return {?string} sanitizedAttrValue
   * @private
   */
  static sanitizeName_(
      namePolicy, attrName, policyHints) {
    var trimmed = strings.trim(attrName);
    /* NOTE(user):
     * There are two cases to be concerned about - escaped quotes in attribute
     * values which is the responsibility of the serializer and illegal
     * characters.  The latter does violate the spec but I do not believe it has
     * a security consequence.
     */
    return namePolicy(trimmed, policyHints);
  };

  /**
   * Ensures that the class prefix is present on all space-separated tokens
   * (i.e. all class names).
   * @param {HtmlSanitizerPolicy} tokenPolicy
   * @param {string} attrValue
   * @param {HtmlSanitizerPolicyHints} policyHints
   * @return {?string} sanitizedAttrValue
   * @private
   */
  static sanitizeClasses_(
      tokenPolicy, attrValue, policyHints) {
    var classes = attrValue.split(/(?:\s+)/);
    var sanitizedClasses = [];
    for (var i = 0; i < classes.length; i++) {
      var sanitizedClass = tokenPolicy(classes[i], policyHints);
      if (sanitizedClass) {
        sanitizedClasses.push(sanitizedClass);
      }
    }
    return sanitizedClasses.length == 0 ? null : sanitizedClasses.join(' ');
  };

  /**
   * Ensures that the id prefix is present.
   * @param {HtmlSanitizerPolicy} tokenPolicy
   * @param {string} attrValue
   * @param {HtmlSanitizerPolicyHints} policyHints
   * @return {?string} sanitizedAttrValue
   * @private
   */
  static sanitizeId_(
      tokenPolicy, attrValue, policyHints) {
    var trimmed = strings.trim(attrValue);
    return tokenPolicy(trimmed, policyHints);
  };

  /**
   * Retrieves a HtmlSanitizerPolicyContext from a dirty node given an attribute
   * name.
   * @param {string} attributeName
   * @param {!Element} dirtyElement
   * @return {!HtmlSanitizerPolicyContext}
   * @private
   */
  static getContext_(
      attributeName, dirtyElement) {
    var policyContext = {cssStyle: undefined};
    if (attributeName == 'style') {
      policyContext.cssStyle =
          noclobber.getElementStyle(dirtyElement);
    }
    return policyContext;
  };

  /**
   * Parses the DOM tree of a given HTML string, then walks the tree. For each
   * element, it creates a new sanitized version, applies sanitized attributes,
   * and returns a SafeHtml object representing the sanitized tree.
   * @param {string} unsanitizedHtml
   * @return {!SafeHtml} Sanitized HTML
   */
  sanitize(
      unsanitizedHtml) {
    this.currentStyleContainerId_ = this.getStyleContainerId_();
    var sanitizedString = this.processToString(unsanitizedHtml);
    return uncheckedconversions
        .safeHtmlFromStringKnownToSatisfyTypeContract(
            Const.from('Output of HTML sanitizer'), sanitizedString);
  };

  /**
   * Parses the DOM tree of a given HTML string, then walks the tree. For each
   * element, it creates a new sanitized version, applies sanitized attributes,
   * and returns a span element containing the sanitized content. The root element
   * might define a class name to restrict the visibility of CSS rules contained
   * in tree.
   * @param {string} unsanitizedHtml
   * @return {!HTMLSpanElement} Sanitized HTML
   */
  sanitizeToDomNode(
      unsanitizedHtml) {
    this.currentStyleContainerId_ = this.getStyleContainerId_();
    return SafeDomTreeProcessor.prototype.processToTree.call(
        this, unsanitizedHtml);
  };

  /** @override */
  processRoot(newRoot) {
    // If the container ID was manually specified, we let the caller add the
    // ancestor to activate the rules.
    if (this.currentStyleContainerId_ &&
        this.styleContainerId_ == RANDOM_CONTAINER_) {
      newRoot.id = this.currentStyleContainerId_;
    }
  };

  /** @override */
  preProcessHtml(
      unsanitizedHtml) {
    if (!this.inlineStyleRules_) {
      return unsanitizedHtml;
    }
    // Inline style rules on the unsanitized input, so that we don't have to
    // worry about customTokenPolicy and customNamePolicy interferring with
    // selectors.
    // TODO(pelizzi): To generate an inert document tree to walk on, we are going
    // to parse the document into a DOM tree twice --
    // first with DOMParser here, and then by setting innerHTML on a new TEMPLATE
    // element in the main sanitization loop (see getDomTreeWalker in
    // safedomtreeprocessor.js). It would be best if we used one technique
    // consistently, parsing the input string once and passing a single inert tree
    // from one phase to another, but the decision to use TEMPLATE rather than
    // DomParser or document.createHtmlImplementation as the inert HTML container
    // for the main sanitization logic predates the work on supporting STYLE tags,
    // and we later found on that TEMPLATE inert documents do not have computed
    // stylesheet information on STYLE tags.
    var inertUnsanitizedDom =
        CssSanitizer.safeParseHtmlAndGetInertElement(
            '<div>' + unsanitizedHtml + '</div>');
    goog_asserts.assert(
        inertUnsanitizedDom,
        'Older browsers that don\'t support inert ' +
            'parsing should not get to this branch');
    CssSanitizer.inlineStyleRules(inertUnsanitizedDom);
    return inertUnsanitizedDom.innerHTML;
  };

  /**
   * Gets the style container ID for the sanitized output, or creates a new random
   * one. If no style container is necessary or style containment is disabled,
   * returns null.
   * @return {?string}
   * @private
   */
  getStyleContainerId_() {
    var randomStyleContainmentEnabled =
        this.styleContainerId_ == RANDOM_CONTAINER_;
    var randomStyleContainmentNecessary =
        !('STYLE' in this.tagBlacklist_) && 'STYLE' in this.tagWhitelist_;
    // If the builder was configured to create a random unique ID, create one, but
    // do so only if STYLE is allowed to begin with.
    return randomStyleContainmentEnabled && randomStyleContainmentNecessary ?
        'sanitizer-' + strings.getRandomString() :
        this.styleContainerId_;
  };

  /** @override */
  createTextNode(
      dirtyNode) {
    // Text nodes don't need to be sanitized, unless they are children of STYLE
    // and STYLE tags are allowed.
    var textContent = dirtyNode.data;
    // If STYLE is allowed, apply a policy to its text content. Ideally
    // sanitizing text content of tags shouldn't be hardcoded for STYLE, but we
    // have no plans to support sanitizing the text content of other nodes for
    // now.
    var dirtyParent = noclobber.getParentNode(dirtyNode);
    if (dirtyParent &&
        noclobber.getNodeName(dirtyParent).toLowerCase() ==
            'style' &&
        !('STYLE' in this.tagBlacklist_) && 'STYLE' in this.tagWhitelist_) {
      // Note that we don't have access to the parsed CSS declarations inside a
      // TEMPLATE tag, so the CSS sanitizer accepts a string and parses it
      // on its own using DOMParser.
      textContent = SafeStyleSheet.unwrap(
          CssSanitizer.sanitizeStyleSheetString(
              textContent, this.currentStyleContainerId_,
              google.bind(function(uri, propName) {
                return this.networkRequestUrlPolicy_(
                    uri, {cssProperty: propName});
              }, this)));
    }
    return document.createTextNode(textContent);
  };

  /** @override */
  createElementWithoutAttributes(dirtyElement) {
    var dirtyName =
        noclobber.getNodeName(dirtyElement).toUpperCase();
    if (dirtyName in this.tagBlacklist_) {
      // If it's blacklisted, completely remove the tag and its descendants.
      return null;
    }
    if (this.tagWhitelist_[dirtyName]) {
      // If it's whitelisted, keep as is.
      return document.createElement(dirtyName);
    }
    // If it's neither blacklisted nor whitelisted, replace with span. If the
    // relevant builder option is enabled, the tag will bear the original tag
    // name in a data attribute.
    var spanElement = goog_dom.createElement(TagName.SPAN);
    if (this.shouldAddOriginalTagNames_) {
      noclobber.setElementAttribute(
          spanElement, HTML_SANITIZER_SANITIZED_ATTR_NAME_,
          dirtyName.toLowerCase());
    }
    return spanElement;
  };

  /** @override */
  processElementAttribute(
      dirtyElement, attribute) {
    var attributeName = attribute.name;
    if (strings.startsWith(
            attributeName,
            HTML_SANITIZER_BOOKKEEPING_PREFIX_)) {
      // This is the namespace for the data attributes added by the sanitizer. We
      // prevent untrusted content from setting them in the output.
      return null;
    }
  
    var elementName = noclobber.getNodeName(dirtyElement);
    var unsanitizedAttrValue = attribute.value;
  
    // Create policy hints object
    var policyHints = {
      tagName: strings.trim(elementName).toLowerCase(),
      attributeName: strings.trim(attributeName).toLowerCase()
    };
    var policyContext = HtmlSanitizer.getContext_(
        policyHints.attributeName, dirtyElement);
  
    // Prefer attribute handler for this specific tag.
    var tagHandlerIndex = HtmlSanitizer.attrIdentifier_(
        elementName, attributeName);
    if (tagHandlerIndex in this.attributeHandlers_) {
      var handler = this.attributeHandlers_[tagHandlerIndex];
      return handler(unsanitizedAttrValue, policyHints, policyContext);
    }
    // Fall back on attribute handler for wildcard tag.
    var genericHandlerIndex =
        HtmlSanitizer.attrIdentifier_(null, attributeName);
    if (genericHandlerIndex in this.attributeHandlers_) {
      var handler = this.attributeHandlers_[genericHandlerIndex];
      return handler(unsanitizedAttrValue, policyHints, policyContext);
    }
    return null;
  };

  /**
   * Sanitizes a HTML string using a sanitizer with default options.
   * @param {string} unsanitizedHtml
   * @return {!SafeHtml} sanitizedHtml
   */
  static sanitize(unsanitizedHtml) {
    var sanitizer = new Builder().build();
    return sanitizer.sanitize(unsanitizedHtml);
  };
}

/**
 * The builder for the HTML Sanitizer. All methods except build return
 * `this`.
 * @final @class
 */
class Builder {

  /**
   * The builder for the HTML Sanitizer. All methods except build return
   * `this`.
   */
  constructor() {
    /**
     * A set of attribute sanitization functions. Default built-in handlers are
     * all tag-agnostic by design. Note that some attributes behave differently
     * when attached to different nodes (for example, the href attribute will
     * generally not make a network request, but &lt;link href=""&gt; does), and
     * so when necessary a tag-specific handler can be used to override a
     * tag-agnostic one.
     * @private {!Object<string, !HtmlSanitizerPolicy>}
     */
    this.attributeWhitelist_ = {};
    googarray.forEach(
        [
          AttributeWhitelist,
          AttributeSanitizedWhitelist
        ],
        function(wl) {
          googarray.forEach(goog_object.getKeys(wl), function(attr) {
            this.attributeWhitelist_[attr] =
                /** @type {!HtmlSanitizerPolicy} */
                (HtmlSanitizer.cleanUpAttribute_);
          }, this);
        },
        this);
  
    /**
     * A set of attribute handlers that should not inherit their default policy
     * during build().
     * @private @const {!Object<string, boolean>}
     */
    this.attributeOverrideList_ = {};
  
    /**
     * List of data attributes to whitelist. Data-attributes are inert and don't
     * require sanitization.
     * @private @const {!Array<string>}
     */
    this.dataAttributeWhitelist_ = [];
  
    /**
     * List of custom element tags to whitelist. Custom elements are inert on
     * their own and require code to actually be dangerous, so the risk is similar
     * to data-attributes.
     * @private @const {!Array<string>}
     */
    this.customElementTagWhitelist_ = [];
  
    /**
     * A tag blacklist, to effectively remove an element and its children from the
     * dom.
     * @private @const {!Object<string, boolean>}
     */
    this.tagBlacklist_ = goog_object.clone(TagBlacklist);
  
    /**
     * A tag whitelist, to effectively allow an element and its children from the
     * dom.
     * @private {!Object<string, boolean>}
     */
    this.tagWhitelist_ = goog_object.clone(TagWhitelist);
  
    /**
     * Whether non-whitelisted and non-blacklisted tags that have been converted
     * to &lt;span&rt; tags will contain the original tag in a data attribute.
     * @private {boolean}
     */
    this.shouldAddOriginalTagNames_ = false;
  
    /**
     * A function to be applied to URLs found on the parsing process which do not
     * trigger requests.
     * @private {!HtmlSanitizerUrlPolicy}
     */
    this.urlPolicy_ = HtmlSanitizer.defaultUrlPolicy_;
  
    /**
     * A function to be applied to urls found on the parsing process which may
     * trigger requests.
     * @private {!HtmlSanitizerUrlPolicy}
     */
    this.networkRequestUrlPolicy_ =
        HtmlSanitizer.defaultNetworkRequestUrlPolicy_;
  
    /**
     * A function to be applied to names found on the parsing process.
     * @private {!HtmlSanitizerPolicy}
     */
    this.namePolicy_ = HtmlSanitizer.defaultNamePolicy_;
  
    /**
     * A function to be applied to other tokens (i.e. classes and IDs) found on
     * the parsing process.
     * @private {!HtmlSanitizerPolicy}
     */
    this.tokenPolicy_ = HtmlSanitizer.defaultTokenPolicy_;
  
    /**
     * A function to sanitize inline CSS styles. Defaults to deny all.
     * @private {function(
     *     !HtmlSanitizerPolicy,
     *     string,
     *     !HtmlSanitizerPolicyHints,
     *     !HtmlSanitizerPolicyContext):?string}
     */
    this.sanitizeInlineCssPolicy_ = goog_functions.NULL;
  
    /**
     * An optional ID to restrict the scope of CSS rules when STYLE tags are
     * allowed.
     * @private {?string}
     */
    this.styleContainerId_ = null;
  
    /**
     * Whether rules in STYLE tags should be inlined into style attributes.
     * @private {boolean}
     */
    this.inlineStyleRules_ = false;
  
    /**
     * True iff policies have been installed for the instance.
     * @private {boolean}
     */
    this.policiesInstalled_ = false;
  }

  /**
   * Extends the list of allowed data attributes.
   * @param {!Array<string>} dataAttributeWhitelist
   * @return {!Builder}
   */
  allowDataAttributes(dataAttributeWhitelist) {
    googarray.extend(this.dataAttributeWhitelist_, dataAttributeWhitelist);
    return this;
  };

  /**
   * Extends the list of allowed custom element tags.
   * @param {!Array<string>} customElementTagWhitelist
   * @return {!Builder}
   */
  allowCustomElementTags(customElementTagWhitelist) {
    googarray.extend(this.customElementTagWhitelist_, customElementTagWhitelist);
    return this;
  };

  /**
   * Allows form tags in the HTML. Without this all form tags and content will be
   * dropped.
   * @return {!Builder}
   */
  allowFormTag() {
    delete this.tagBlacklist_['FORM'];
    return this;
  };

  /**
   * Allows STYLE tags. Note that the sanitizer wraps the output of each call to
   * {@link sanitize} with a SPAN tag, give it a random ID unique across multiple
   * calls, and then restrict all CSS rules found inside STYLE tags to only apply
   * to children of the SPAN tag. This means that CSS rules in STYLE tags will
   * only apply to content provided in the same call to {@link sanitize}. This
   * feature is not compatible with {@link inlineStyleRules}.
   * @return {!Builder}
   */
  allowStyleTag() {
    if (this.inlineStyleRules_) {
      throw new Error('Rules from STYLE tags are already being inlined.');
    }
    delete this.tagBlacklist_['STYLE'];
    this.styleContainerId_ = RANDOM_CONTAINER_;
    return this;
  };

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
  withStyleContainer(opt_styleContainer) {
    if ('STYLE' in this.tagBlacklist_) {
      throw new Error('STYLE tags must first be allowed through allowStyleTag.');
    }
    if (opt_styleContainer != undefined) {
      if (!/^[a-zA-Z][\w-:\.]*$/.test(opt_styleContainer)) {
        throw new Error('Invalid ID.');
      }
      this.styleContainerId_ = opt_styleContainer;
    } else {
      this.styleContainerId_ = null;
    }
    return this;
  };

  /**
   * Converts rules in STYLE tags into style attributes on the tags they apply to.
   * This feature is not compatible with {@link withStyleContainer} and {@link
   * allowStyleTag}. This method requires {@link allowCssStyles} (otherwise rules
   * would be deleted after being inlined), and is not compatible with {@link
   * allowStyleTag}.
   * @return {!Builder}
   */
  inlineStyleRules() {
    if (this.sanitizeInlineCssPolicy_ == goog_functions.NULL) {
      throw new Error(
          'Inlining style rules requires allowing STYLE attributes ' +
          'first.');
    }
    if (!('STYLE' in this.tagBlacklist_)) {
      throw new Error(
          'You have already configured the builder to allow STYLE tags in the ' +
          'output. Inlining style rules would prevent STYLE tags from ' +
          'appearing in the output and conflict with such directive.');
    }
    this.inlineStyleRules_ = true;
    return this;
  };

  /**
   * Allows inline CSS styles.
   * @return {!Builder}
   */
  allowCssStyles() {
    this.sanitizeInlineCssPolicy_ =
        HtmlSanitizer.sanitizeCssDeclarationList_;
    return this;
  };

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
  onlyAllowTags(
      tagWhitelist) {
    this.tagWhitelist_ = {'SPAN': true};
    googarray.forEach(tagWhitelist, function(tag) {
      tag = tag.toUpperCase();
      if (TagWhitelist[tag]) {
        this.tagWhitelist_[tag] = true;
      } else {
        throw new Error(
            'Only whitelisted tags can be allowed. See ' +
            'goog.html.sanitizer.TagWhitelist.');
      }
    }, this);
    return this;
  };

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
  onlyAllowAttributes(attrWhitelist) {
    var oldWhitelist = this.attributeWhitelist_;
    this.attributeWhitelist_ = {};
    googarray.forEach(attrWhitelist, function(attr) {
      if (google.typeOf(attr) === 'string') {
        attr = {tagName: '*', attributeName: attr.toUpperCase(), policy: null};
      }
      var handlerName = HtmlSanitizer.attrIdentifier_(
          attr.tagName, attr.attributeName);
      if (!oldWhitelist[handlerName]) {
        throw new Error('Only whitelisted attributes can be allowed.');
      }
      this.attributeWhitelist_[handlerName] = attr.policy ?
          attr.policy :
          /** @type {HtmlSanitizerPolicy} */ (
              HtmlSanitizer.cleanUpAttribute_);
    }, this);
    return this;
  };

  /**
   * Adds the original tag name in the data attribute 'original-tag' when unknown
   * tags are sanitized to &lt;span&rt;, so that caller can distinguish them from
   * actual &lt;span&rt; tags.
   * @return {!Builder}
   */
  addOriginalTagNames() {
    this.shouldAddOriginalTagNames_ = true;
    return this;
  };

  /**
   * Sets a custom non-network URL policy.
   * @param {!HtmlSanitizerUrlPolicy} customUrlPolicy
   * @return {!Builder}
   */
  withCustomUrlPolicy(customUrlPolicy) {
    this.urlPolicy_ = customUrlPolicy;
    return this;
  };

  /**
   * Sets a custom name policy.
   * @param {!HtmlSanitizerPolicy} customNamePolicy
   * @return {!Builder}
   */
  withCustomNamePolicy(customNamePolicy) {
    this.namePolicy_ = customNamePolicy;
    return this;
  };

  /**
   * Sets a custom token policy.
   * @param {!HtmlSanitizerPolicy} customTokenPolicy
   * @return {!Builder}
   */
  withCustomTokenPolicy(customTokenPolicy) {
    this.tokenPolicy_ = customTokenPolicy;
    return this;
  };

  /**
   * Builds and returns a HtmlSanitizer object.
   * @return {!HtmlSanitizer}
   */
  build() {
    return new HtmlSanitizer(this);
  };

  /**
   * Installs the sanitization policies for the attributes.
   * May only be called once.
   * @private
   * @suppress {checkTypes}
   */
  installPolicies_() {
    if (this.policiesInstalled_) {
      throw new Error('HtmlSanitizer.Builder.build() can only be used once.');
    }
  
    var installPolicy = HtmlSanitizer.installDefaultPolicy_;
  
    // Binding all the non-trivial attribute sanitizers to the appropriate,
    // potentially customizable, handling functions at build().
    installPolicy(
        this.attributeWhitelist_, this.attributeOverrideList_, '* USEMAP',
        /** @type {!HtmlSanitizerPolicy} */ (
            HtmlSanitizer.sanitizeUrlFragment_));
  
    var urlAttributes = ['* ACTION', '* CITE', '* HREF'];
    var urlPolicy =
        HtmlSanitizer.wrapUrlPolicy_(this.urlPolicy_);
    googarray.forEach(urlAttributes, function(attribute) {
      installPolicy(
          this.attributeWhitelist_, this.attributeOverrideList_, attribute,
          urlPolicy);
    }, this);
  
    var networkUrlAttributes = [
      // LONGDESC can result in a network request. See b/23381636.
      '* LONGDESC', '* SRC', 'LINK HREF'
    ];
    var networkRequestUrlPolicy =
        HtmlSanitizer.wrapUrlPolicy_(
            this.networkRequestUrlPolicy_);
    googarray.forEach(networkUrlAttributes, function(attribute) {
      installPolicy(
          this.attributeWhitelist_, this.attributeOverrideList_, attribute,
          networkRequestUrlPolicy);
    }, this);
  
    var nameAttributes = ['* FOR', '* HEADERS', '* NAME'];
    googarray.forEach(nameAttributes, function(attribute) {
      installPolicy(
          this.attributeWhitelist_, this.attributeOverrideList_, attribute,
          /** @type {!HtmlSanitizerPolicy} */ (google.partial(
              HtmlSanitizer.sanitizeName_,
              this.namePolicy_)));
    }, this);
  
    installPolicy(
        this.attributeWhitelist_, this.attributeOverrideList_, 'A TARGET',
        /** @type {!HtmlSanitizerPolicy} */ (google.partial(
            HtmlSanitizer.allowedAttributeValues_,
            ['_blank', '_self'])));
  
    installPolicy(
        this.attributeWhitelist_, this.attributeOverrideList_, '* CLASS',
        /** @type {!HtmlSanitizerPolicy} */ (google.partial(
            HtmlSanitizer.sanitizeClasses_,
            this.tokenPolicy_)));
  
    installPolicy(
        this.attributeWhitelist_, this.attributeOverrideList_, '* ID',
        /** @type {!HtmlSanitizerPolicy} */ (google.partial(
            HtmlSanitizer.sanitizeId_, this.tokenPolicy_)));
  
    installPolicy(
        this.attributeWhitelist_, this.attributeOverrideList_, '* STYLE',
        /** @type {!HtmlSanitizerPolicy} */
        (google.partial(this.sanitizeInlineCssPolicy_, networkRequestUrlPolicy)));
  
    this.policiesInstalled_ = true;
  };
}

/**
 * Extends the tag whitelist (Package-internal utility method only).
 * @param {!Array<string>} tags The list of tags to be added to the whitelist.
 * @return {!Builder}
 * @package
 */
Builder.prototype
    .alsoAllowTagsPrivateDoNotAccessOrElse = function(tags) {
  googarray.forEach(tags, function(tag) {
    this.tagWhitelist_[tag.toUpperCase()] = true;
    delete this.tagBlacklist_[tag.toUpperCase()];
  }, this);
  return this;
};

/**
 * Extends the attribute whitelist (Package-internal utility method only).
 * @param {!Array<(string|!HtmlSanitizerAttributePolicy)>}
 *     attrs The list of attributes to be added to the whitelist.
 * @return {!Builder}
 * @package
 */
Builder.prototype
    .alsoAllowAttributesPrivateDoNotAccessOrElse = function(attrs) {
  googarray.forEach(attrs, function(attr) {
    if (typeof attr === 'string') {
      attr = {tagName: '*', attributeName: attr, policy: null};
    }
    var handlerName = HtmlSanitizer.attrIdentifier_(
        attr.tagName, attr.attributeName);
    this.attributeWhitelist_[handlerName] = attr.policy ?
        attr.policy :
        /** @type {!HtmlSanitizerPolicy} */ (
            HtmlSanitizer.cleanUpAttribute_);
    this.attributeOverrideList_[handlerName] = true;
  }, this);
  return this;
};

/**
 * Sets a custom network URL policy.
 * @param {!HtmlSanitizerUrlPolicy}
 *     customNetworkReqUrlPolicy
 * @return {!Builder}
 */
Builder.prototype
    .withCustomNetworkRequestUrlPolicy = function(customNetworkReqUrlPolicy) {
  this.networkRequestUrlPolicy_ = customNetworkReqUrlPolicy;
  return this;
};

/**
 * The default policy for URLs: allow any.
 * @private @const {!HtmlSanitizerUrlPolicy}
 */
HtmlSanitizer.defaultUrlPolicy_ =
    SafeUrl.sanitize;

/**
 * The default policy for URLs which cause network requests: drop all.
 * @private @const {!HtmlSanitizerUrlPolicy}
 */
HtmlSanitizer.defaultNetworkRequestUrlPolicy_ =
    goog_functions.NULL;

/**
 * The default policy for attribute names: drop all.
 * @private @const {!HtmlSanitizerPolicy}
 */
HtmlSanitizer.defaultNamePolicy_ = goog_functions.NULL;

/**
 * The default policy for other tokens (i.e. class names and IDs): drop all.
 * @private @const {!HtmlSanitizerPolicy}
 */
HtmlSanitizer.defaultTokenPolicy_ = goog_functions.NULL;

export {Builder, HtmlSanitizer, HtmlSanitizerAttributePolicy, HtmlSanitizerPolicy, HtmlSanitizerPolicyContext, HtmlSanitizerPolicyHints, HtmlSanitizerUrlPolicy};