import * as asserts from './../asserts/asserts.js';
import * as googdom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {NodeType} from './../dom/nodetype.js';
import * as safe from './../dom/safe.js';
import {TagName} from './../dom/tagname.js';
import * as google from './../google.js';
import {SafeHtml} from './../html/safehtml.js';
import {SanitizedHtml} from './data.js';
import {SanitizedContent} from './data.js';
// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Provides utility methods to render soy template.
 */

/**
 * A structural interface for injected data.
 *
 * <p>Soy generated code contributes optional properties.
 *
 * @record
 */
function IjData() {};

/**
 * Helper typedef for ij parameters.  This is what soy generates.
 * @private
 * @typedef {!IjData|!Object<string, *>}
 */
let CompatibleIj_;

/**
 * Type definition for strict Soy templates. Very useful when passing a template
 * as an argument.
 * @typedef {function(?=,
 * ?CompatibleIj_=):(string|!SanitizedContent)}
 */
let StrictTemplate;

/**
 * Type definition for strict Soy HTML templates. Very useful when passing
 * a template as an argument.
 * @typedef {function(?=,
 * ?CompatibleIj_=):!SanitizedHtml}
 */
let StrictHtmlTemplate;

/**
 * Type definition for text templates.
 * @typedef {function(?=, ?CompatibleIj_=):string}
 */
let TextTemplate;

/**
 * Sets the processed template as the innerHTML of an element. It is recommended
 * to use this helper function instead of directly setting innerHTML in your
 * hand-written code, so that it will be easier to audit the code for cross-site
 * scripting vulnerabilities.
 *
 * @param {?Element} element The element whose content we are rendering into.
 * @param {!SanitizedContent} templateResult The processed
 *     template of kind HTML or TEXT (which will be escaped).
 * @template ARG_TYPES
 */
function renderHtml(element, templateResult) {
  safe.unsafeSetInnerHtmlDoNotUseOrElse(
      asserts.assert(element),
      ensureTemplateOutputHtml_(templateResult));
};

// TODO(b/36644846): remove the second half of the function type union
/**
 * Renders a Soy template and then set the output string as
 * the innerHTML of an element. It is recommended to use this helper function
 * instead of directly setting innerHTML in your hand-written code, so that it
 * will be easier to audit the code for cross-site scripting vulnerabilities.
 *
 * @param {Element} element The element whose content we are rendering into.
 * @param {?function(ARG_TYPES, ?CompatibleIj_=):*|
 *     ?function(ARG_TYPES, null=, Object<string, *>=):*} template
 *     The Soy template defining the element's content.
 * @param {ARG_TYPES=} opt_templateData The data for the template.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @template ARG_TYPES
 */
function renderElement(
    element, template, opt_templateData, opt_injectedData) {
  // Soy template parameter is only nullable for historical reasons.
  asserts.assert(template, 'Soy template may not be null.');
  var html = ensureTemplateOutputHtml_(template(
      opt_templateData || defaultTemplateData_, undefined,
      opt_injectedData));
  safe.unsafeSetInnerHtmlDoNotUseOrElse(
      asserts.assert(element), html);
};

// TODO(b/36644846): remove the second half of the function type union
/**
 * Renders a Soy template into a single node or a document
 * fragment. If the rendered HTML string represents a single node, then that
 * node is returned (note that this is *not* a fragment, despite them name of
 * the method). Otherwise a document fragment is returned containing the
 * rendered nodes.
 *
 * @param {
 *     ?function(ARG_TYPES,
 * ?CompatibleIj_=):!SanitizedContent|
 *     ?function(ARG_TYPES, null=, Object<string, *>=):
 *     SanitizedContent} template The Soy template defining the
 *     element's content. The kind of the template must be "html" or "text".
 * @param {ARG_TYPES=} opt_templateData The data for the template.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @param {DomHelper=} opt_domHelper The DOM helper used to
 *     create DOM nodes; defaults to `googdom.getDomHelper`.
 * @return {!Node} The resulting node or document fragment.
 * @template ARG_TYPES
 */
function renderAsFragment(
    template, opt_templateData, opt_injectedData, opt_domHelper) {
  // Soy template parameter is only nullable for historical reasons.
  asserts.assert(template, 'Soy template may not be null.');
  var dom = opt_domHelper || googdom.getDomHelper();
  var output = template(
      opt_templateData || defaultTemplateData_, undefined,
      opt_injectedData);
  var html = ensureTemplateOutputHtml_(output);
  assertFirstTagValid_(html.getTypedStringValue());
  return dom.safeHtmlToNode(html);
};

// TODO(b/36644846): remove the second half of the function type union
/**
 * Renders a Soy template into a single node. If the rendered
 * HTML string represents a single node, then that node is returned. Otherwise,
 * a DIV element is returned containing the rendered nodes.
 *
 * @param {?function(ARG_TYPES, ?CompatibleIj_=):*|
 *     ?function(ARG_TYPES, null=, Object<string, *>=):*} template
 *     The Soy template defining the element's content.
 * @param {ARG_TYPES=} opt_templateData The data for the template.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @param {DomHelper=} opt_domHelper The DOM helper used to
 *     create DOM nodes; defaults to `googdom.getDomHelper`.
 * @return {!Element} Rendered template contents, wrapped in a parent DIV
 *     element if necessary.
 * @template ARG_TYPES
 */
function renderAsElement(
    template, opt_templateData, opt_injectedData, opt_domHelper) {
  // Soy template parameter is only nullable for historical reasons.
  asserts.assert(template, 'Soy template may not be null.');
  return convertToElement_(
      template(
          opt_templateData || defaultTemplateData_, undefined,
          opt_injectedData),
      opt_domHelper);
};

/**
 * Converts a processed Soy template into a single node. If the rendered
 * HTML string represents a single node, then that node is returned. Otherwise,
 * a DIV element is returned containing the rendered nodes.
 *
 * @param {!SanitizedContent} templateResult The processed
 *     template of kind HTML or TEXT (which will be escaped).
 * @param {?DomHelper=} opt_domHelper The DOM helper used to
 *     create DOM nodes; defaults to `googdom.getDomHelper`.
 * @return {!Element} Rendered template contents, wrapped in a parent DIV
 *     element if necessary.
 */
function convertToElement(templateResult, opt_domHelper) {
  return convertToElement_(templateResult, opt_domHelper);
};

/**
 * Non-strict version of `convertToElement`.
 *
 * @param {*} templateResult The processed template.
 * @param {?DomHelper=} opt_domHelper The DOM helper used to
 *     create DOM nodes; defaults to `googdom.getDomHelper`.
 * @return {!Element} Rendered template contents, wrapped in a parent DIV
 *     element if necessary.
 * @private
 */
function convertToElement_(templateResult, opt_domHelper) {
  var dom = opt_domHelper || googdom.getDomHelper();
  var wrapper = dom.createElement(TagName.DIV);
  var html = ensureTemplateOutputHtml_(templateResult);
  assertFirstTagValid_(html.getTypedStringValue());
  safe.unsafeSetInnerHtmlDoNotUseOrElse(wrapper, html);

  // If the template renders as a single element, return it.
  if (wrapper.childNodes.length == 1) {
    var firstChild = wrapper.firstChild;
    if (firstChild.nodeType == NodeType.ELEMENT) {
      return /** @type {!Element} */ (firstChild);
    }
  }

  // Otherwise, return the wrapper DIV.
  return wrapper;
};

/**
 * Ensures the result is "safe" to insert as HTML.
 *
 * In the case the argument is a SanitizedContent object, it either must
 * already be of kind HTML, or if it is kind="text", the output will be HTML
 * escaped.
 *
 * @param {*} templateResult The template result.
 * @return {!SafeHtml} The assumed-safe HTML output string.
 * @private
 */
function ensureTemplateOutputHtml_(templateResult) {
  // Note we allow everything that isn't an object, because some non-escaping
  // templates end up returning non-strings if their only print statement is a
  // non-escaped argument, plus some unit tests spoof templates.
  // TODO(gboyer): Track down and fix these cases.
  if (!google.isObject(templateResult)) {
    return SafeHtml.htmlEscape(String(templateResult));
  }

  // Allow SanitizedContent of kind HTML.
  if (templateResult instanceof SanitizedContent) {
    return templateResult.toSafeHtml();
  }

  asserts.fail(
      'Soy template output is unsafe for use as HTML: ' + templateResult);

  // In production, return a safe string, rather than failing hard.
  return SafeHtml.htmlEscape('zSoyz');
};

/**
 * Checks that the rendered HTML does not start with an invalid tag that would
 * likely cause unexpected output from renderAsElement or renderAsFragment.
 * See {@link http://www.w3.org/TR/html5/semantics.html#semantics} for reference
 * as to which HTML elements can be parents of each other.
 * @param {string} html The output of a template.
 * @private
 */
function assertFirstTagValid_(html) {
  if (asserts.ENABLE_ASSERTS) {
    var matches = html.match(INVALID_TAG_TO_RENDER_);
    asserts.assert(
        !matches, 'This template starts with a %s, which ' +
            'cannot be a child of a <div>, as required by soy internals. ' +
            'Consider using renderElement instead.\nTemplate output: %s',
        matches && matches[0], html);
  }
};

/**
 * A pattern to find templates that cannot be rendered by renderAsElement or
 * renderAsFragment, as these elements cannot exist as the child of a <div>.
 * @type {!RegExp}
 * @private
 */
let INVALID_TAG_TO_RENDER_ =
    /^<(body|caption|col|colgroup|head|html|tr|td|th|tbody|thead|tfoot)>/i;

/**
 * Immutable object that is passed into templates that are rendered
 * without any data.
 * @private @const
 */
let defaultTemplateData_ = {};

export {IjData, StrictHtmlTemplate, StrictTemplate, TextTemplate, convertToElement, renderAsElement, renderAsFragment, renderElement, renderHtml};