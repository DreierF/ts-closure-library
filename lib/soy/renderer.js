import * as asserts from './../asserts/asserts.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {SafeHtml as Html_SafeHtml} from './../html/safehtml.js';
import {SafeStyleSheet} from './../html/safestylesheet.js';
import {SanitizedUri} from './data.js';
import {SanitizedCss} from './data.js';
import {SanitizedHtml} from './data.js';
import {SanitizedContent} from './data.js';
import {SanitizedContentKind} from './data.js';
import {InjectedDataSupplier} from './injecteddatasupplier.js';
import * as soy from './soy.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Provides a soy renderer that allows registration of
 * injected data ("globals") that will be passed into the rendered
 * templates.
 */

/**
 * Creates a new soy renderer. Note that the renderer will only be
 * guaranteed to work correctly within the document scope provided in
 * the DOM helper.
 *
 *     that provides an injected data.
 *     defaults to that provided by `goog_dom.getDomHelper()`.
 */
class Renderer {

  /**
   * Creates a new soy renderer. Note that the renderer will only be
   * guaranteed to work correctly within the document scope provided in
   * the DOM helper.
   *
   * @param {?InjectedDataSupplier=} opt_injectedDataSupplier A supplier
   *     that provides an injected data.
   * @param {?DomHelper=} opt_domHelper Optional DOM helper;
   *     defaults to that provided by `goog_dom.getDomHelper()`.
   */
  constructor(opt_injectedDataSupplier, opt_domHelper) {
    /**
     * @const {!DomHelper}
     * @private
     */
    this.dom_ = opt_domHelper || goog_dom.getDomHelper();
  
    /**
     * @const {?InjectedDataSupplier}
     * @private
     */
    this.supplier_ = opt_injectedDataSupplier || null;
  }

  /**
   * Renders a Soy template into a single node or a document fragment.
   * Delegates to `soy.renderAsFragment`.
   *
   * @param {function(ARG_TYPES, ?Object<string, *>=): *} template The Soy
   *     template defining the element's content.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @return {!Node} The resulting node or document fragment.
   * @template ARG_TYPES
   */
  renderAsFragment(
      template, opt_templateData) {
    const node = soy.renderAsFragment(
        template, opt_templateData, this.getInjectedData_(), this.dom_);
    this.handleRender(node, SanitizedContentKind.HTML);
    return node;
  };

  /**
   * Renders a Soy template into a single node. If the rendered HTML
   * string represents a single node, then that node is returned.
   * Otherwise, a DIV element is returned containing the rendered nodes.
   * Delegates to `soy.renderAsElement`.
   *
   * @param {function(ARG_TYPES, ?Object<string, *>=): *} template The Soy
   *     template defining the element's content.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @return {!Element} Rendered template contents, wrapped in a parent DIV
   *     element if necessary.
   * @template ARG_TYPES
   */
  renderAsElement(
      template, opt_templateData) {
    const element = soy.renderAsElement(
        template, opt_templateData, this.getInjectedData_(), this.dom_);
    this.handleRender(element, SanitizedContentKind.HTML);
    return element;
  };

  /**
   * Renders a Soy template and then set the output string as the
   * innerHTML of the given element. Delegates to `soy.renderElement`.
   *
   * @param {?Element} element The element whose content we are rendering.
   * @param {function(ARG_TYPES, ?Object<string, *>=): *} template The Soy
   *     template defining the element's content.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @template ARG_TYPES
   */
  renderElement(
      element, template, opt_templateData) {
    soy.renderElement(
        element, template, opt_templateData, this.getInjectedData_());
    this.handleRender(element, SanitizedContentKind.HTML);
  };

  /**
   * Renders a Soy template and returns the output string.
   * If the template is strict, it must be of kind HTML. To render strict
   * templates of other kinds, use `renderText` (for `kind="text"`) or
   * `renderStrictOfKind`.
   *
   * @param {function(ARG_TYPES, ?Object<string, *>=): *} template The Soy
   *     template to render.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @return {string} The return value of rendering the template directly.
   * @template ARG_TYPES
   */
  render(template, opt_templateData) {
    const result = template(opt_templateData || {}, this.getInjectedData_());
    asserts.assert(
        !(result instanceof SanitizedContent) ||
            result.contentKind === SanitizedContentKind.HTML,
        'render was called with a strict template of kind other than "html"' +
            ' (consider using renderText or renderStrict)');
    const contentKind = result instanceof SanitizedContent ?
        result.contentKind :
        null;
    this.handleRender(null /* node */, contentKind);
    return String(result);
  };

  /**
   * Renders a strict Soy template of kind="text" and returns the output string.
   * It is an error to use renderText on templates of kinds other than "text".
   *
   * @param {function(ARG_TYPES, ?Object<string,*>=): string} template The Soy
   *     template to render.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @return {string} The return value of rendering the template directly.
   * @template ARG_TYPES
   */
  renderText(template, opt_templateData) {
    const result = template(opt_templateData || {}, this.getInjectedData_());
    if (asserts.ENABLE_ASSERTS) {
      /** @suppress {checkTypes} Runtime check for untyped code. */
      const isSanitizedContent = result instanceof SanitizedContent;
      asserts.assertString(
          result,
          isSanitizedContent ?
              'renderText was called with a template of kind other than "text"' :
              'renderText was called with a non-template');
    }
    return String(result);
  };

  /**
   * Renders a strict Soy HTML template and returns the output SanitizedHtml
   * object.
   * @param {function(ARG_TYPES, ?Object<string,*>=):
   *     !SanitizedHtml} template The Soy template to render.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @return {!SanitizedHtml}
   * @template ARG_TYPES
   */
  renderStrict(
      template, opt_templateData) {
    return this.renderStrictOfKind(
        template, opt_templateData, SanitizedContentKind.HTML);
  };

  /**
   * Renders a strict Soy template and returns the output SanitizedUri object.
   *
   * @param {function(ARG_TYPES, ?Object<string, *>=):
   *     !SanitizedUri} template The Soy template to render.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @return {!SanitizedUri}
   * @template ARG_TYPES
   */
  renderStrictUri(
      template, opt_templateData) {
    return this.renderStrictOfKind(
        template, opt_templateData, SanitizedContentKind.URI);
  };

  /**
   * Renders a strict Soy template and returns the output SanitizedContent object.
   *
   * @param {function(ARG_TYPES, ?Object<string, *>=): RETURN_TYPE} template The
   *     Soy template to render.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @param {?SanitizedContentKind=} opt_kind The output kind to
   *     assert. If null, the template must be of kind="html" (i.e., opt_kind
   *     defaults to SanitizedContentKind.HTML).
   * @return {RETURN_TYPE} The SanitizedContent object. This return type is
   *     generic based on the return type of the template, such as
   *     SanitizedHtml.
   * @template ARG_TYPES, RETURN_TYPE
   */
  renderStrictOfKind(
      template, opt_templateData, opt_kind) {
    const result = template(opt_templateData || {}, this.getInjectedData_());
    asserts.assertInstanceof(
        result, SanitizedContent,
        'renderStrict cannot be called on a text soy template');
    asserts.assert(
        result.contentKind ===
            (opt_kind || SanitizedContentKind.HTML),
        'renderStrict was called with the wrong kind of template');
    this.handleRender(null /* node */, result.contentKind);
    return result;
  };

  /**
   * Renders a strict Soy template of kind="html" and returns the result as
   * a Html_SafeHtml object.
   *
   * Rendering a template that is not a strict template of kind="html" results in
   * a runtime error.
   *
   * @param {function(ARG_TYPES, ?Object<string, *>=):
   *     !SanitizedHtml} template The Soy template to render.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @return {!Html_SafeHtml}
   * @template ARG_TYPES
   */
  renderSafeHtml(
      template, opt_templateData) {
    const result = this.renderStrict(template, opt_templateData);
    // Convert from SanitizedHtml to SafeHtml.
    return result.toSafeHtml();
  };

  /**
   * Renders a strict Soy template of kind="css" and returns the result as
   * a SafeStyleSheet object.
   *
   * Rendering a template that is not a strict template of kind="css" results in
   * a runtime and compile-time error.
   *
   * @param {function(ARG_TYPES, ?Object<string, *>=):
   *     !SanitizedCss} template The Soy template to render.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @return {!SafeStyleSheet}
   * @template ARG_TYPES
   */
  renderSafeStyleSheet(
      template, opt_templateData) {
    const result = this.renderStrictOfKind(
        template, opt_templateData, SanitizedContentKind.CSS);
    return result.toSafeStyleSheet();
  };

  /**
   * @return {!DomHelper}
   * @protected
   */
  getDom() {
    return this.dom_;
  };

  /**
   * Observes rendering of non-text templates by this renderer.
   * @param {?Node} node Relevant node, if available. The node may or may
   *     not be in the document, depending on whether Soy is creating an element
   *     or writing into an existing one.
   * @param {?SanitizedContentKind} kind of the template, or null if
   *     it was not strict.
   * @protected
   */
  handleRender(node, kind) {}

  /**
   * Creates the injectedParams map if necessary and calls the configuration
   * service to prepopulate it.
   * @return {?} The injected params.
   * @private
   */
  getInjectedData_() {
    return this.supplier_ ? this.supplier_.getData() : {};
  };
}

export {Renderer};