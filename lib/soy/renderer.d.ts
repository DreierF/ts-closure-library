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
 */
export class Renderer {
    /**
     * @param {?InjectedDataSupplier=} injectedDataSupplier A supplier that
     *     provides an injected data.
     * @param {?dom.DomHelper=} domHelper Optional DOM helper; defaults to that
     *     provided by `dom.getDomHelper()`.
     */
    constructor(injectedDataSupplier?: (InjectedDataSupplier | null) | undefined, domHelper?: (dom.DomHelper | null) | undefined);
    /** @private @const {!dom.DomHelper} */
    private dom_;
    /** @private @const {?InjectedDataSupplier} */
    private supplier_;
    /**
     * Renders a Soy template into a single node or a document fragment.
     * Delegates to `soy.renderAsFragment`.
     * @param {function(ARG_TYPES, ?soy.CompatibleIj=): *} template The Soy
     *     template defining the element's content.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @return {!Node} The resulting node or document fragment.
     * @template ARG_TYPES
     */
    renderAsFragment<ARG_TYPES>(template: (arg0: ARG_TYPES, arg1?: (soy.CompatibleIj | null) | undefined) => any, templateData?: ARG_TYPES | undefined): Node;
    /**
     * Renders a Soy template into a single node. If the rendered HTML
     * string represents a single node, then that node is returned.
     * Otherwise, a DIV element is returned containing the rendered nodes.
     * Delegates to `soy.renderAsElement`.
     * @param {function(ARG_TYPES, ?soy.CompatibleIj=): *} template The Soy
     *     template defining the element's content.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @return {!Element} Rendered template contents, wrapped in a parent DIV
     *     element if necessary.
     * @template ARG_TYPES
     */
    renderAsElement<ARG_TYPES_1>(template: (arg0: ARG_TYPES_1, arg1?: (soy.CompatibleIj | null) | undefined) => any, templateData?: ARG_TYPES_1 | undefined): Element;
    /**
     * Renders a Soy template and then set the output string as the
     * innerHTML of the given element. Delegates to `soy.renderElement`.
     * @param {Element|null} element The element whose content we are rendering.
     * @param {function(ARG_TYPES, ?soy.CompatibleIj=): *} template The Soy
     *     template defining the element's content.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @template ARG_TYPES
     */
    renderElement<ARG_TYPES_2>(element: Element | null, template: (arg0: ARG_TYPES_2, arg1?: (soy.CompatibleIj | null) | undefined) => any, templateData?: ARG_TYPES_2 | undefined): void;
    /**
     * Renders a Soy template and returns the output string.
     * If the template is strict, it must be of kind HTML. To render strict
     * templates of other kinds, use `renderText` (for `kind="text"`) or
     * `renderStrictOfKind`.
     * @param {function(ARG_TYPES, ?Object<string, *>=): *} template The Soy
     *     template to render.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @return {string} The return value of rendering the template directly.
     * @template ARG_TYPES
     */
    render<ARG_TYPES_3>(template: (arg0: ARG_TYPES_3, arg1?: ({
        [x: string]: any;
    } | null) | undefined) => any, templateData?: ARG_TYPES_3 | undefined): string;
    /**
     * Renders a strict Soy template of kind="text" and returns the output string.
     * It is an error to use renderText on templates of kinds other than "text".
     * @param {function(ARG_TYPES, ?Object<string,*>=): string} template The Soy
     *     template to render.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @return {string} The return value of rendering the template directly.
     * @template ARG_TYPES
     */
    renderText<ARG_TYPES_4>(template: (arg0: ARG_TYPES_4, arg1?: ({
        [x: string]: any;
    } | null) | undefined) => string, templateData?: ARG_TYPES_4 | undefined): string;
    /**
     * Renders a strict Soy HTML template and returns the output SanitizedHtml
     * object.
     * @param {function(ARG_TYPES, ?Object<string,*>=):
     *     !SanitizedHtml} template The Soy template to render.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @return {!SanitizedHtml}
     * @template ARG_TYPES
     */
    renderStrict<ARG_TYPES_5>(template: (arg0: ARG_TYPES_5, arg1?: ({
        [x: string]: any;
    } | null) | undefined) => SanitizedHtml, templateData?: ARG_TYPES_5 | undefined): SanitizedHtml;
    /**
     * Renders a strict Soy template and returns the output SanitizedUri object.
     * @param {function(ARG_TYPES, ?Object<string, *>=):
     *     !SanitizedUri} template The Soy template to render.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @return {!SanitizedUri}
     * @template ARG_TYPES
     */
    renderStrictUri<ARG_TYPES_6>(template: (arg0: ARG_TYPES_6, arg1?: ({
        [x: string]: any;
    } | null) | undefined) => SanitizedUri, templateData?: ARG_TYPES_6 | undefined): SanitizedUri;
    /**
     * Renders a strict Soy template and returns the output SanitizedContent
     * object.
     * @param {function(ARG_TYPES, ?Object<string, *>=): RETURN_TYPE} template The
     *     Soy template to render.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @param {?SanitizedContentKind=} kind The output kind to assert. If null,
     *     the template must be of kind="html" (i.e., kind defaults to
     *     SanitizedContentKind.HTML).
     * @return {?RETURN_TYPE} The SanitizedContent object. This return type is
     *     generic based on the return type of the template, such as
     *     soy.data.SanitizedHtml.
     * @template ARG_TYPES, RETURN_TYPE
     */
    renderStrictOfKind<ARG_TYPES_7, RETURN_TYPE>(template: (arg0: ARG_TYPES_7, arg1?: ({
        [x: string]: any;
    } | null) | undefined) => RETURN_TYPE, templateData?: ARG_TYPES_7 | undefined, kind?: (SanitizedContentKind | null) | undefined): RETURN_TYPE | null;
    /**
     * Renders a strict Soy template of kind="html" and returns the result as
     * a SafeHtml object.
     * Rendering a template that is not a strict template of kind="html" results
     * in a runtime error.
     * @param {function(ARG_TYPES, ?Object<string, *>=):
     *     !SanitizedHtml} template The Soy template to render.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @return {!SafeHtml}
     * @template ARG_TYPES
     */
    renderSafeHtml<ARG_TYPES_8>(template: (arg0: ARG_TYPES_8, arg1?: ({
        [x: string]: any;
    } | null) | undefined) => SanitizedHtml, templateData?: ARG_TYPES_8 | undefined): SafeHtml;
    /**
     * Renders a strict Soy template of kind="css" and returns the result as
     * a SafeStyleSheet object.
     * Rendering a template that is not a strict template of kind="css" results in
     * a runtime and compile-time error.
     * @param {function(ARG_TYPES, ?Object<string, *>=):
     *     !SanitizedCss} template The Soy template to render.
     * @param {ARG_TYPES=} templateData The data for the template.
     * @return {!SafeStyleSheet}
     * @template ARG_TYPES
     */
    renderSafeStyleSheet<ARG_TYPES_9>(template: (arg0: ARG_TYPES_9, arg1?: ({
        [x: string]: any;
    } | null) | undefined) => SanitizedCss, templateData?: ARG_TYPES_9 | undefined): SafeStyleSheet;
    /**
     * @return {!dom.DomHelper}
     * @protected
     */
    protected getDom(): dom.DomHelper;
    /**
     * Observes rendering of non-text templates by this renderer.
     * @param {?Node} node Relevant node, if available. The node may or may not be
     *     in the document, depending on whether Soy is creating an element or
     *     writing into an existing one.
     * @param {?SanitizedContentKind} kind of the template, or null if it was not
     *     strict.
     * @protected
     */
    protected handleRender(node: Node | null, kind: SanitizedContentKind | null): void;
    /**
     * Creates the injectedParams map if necessary and calls the configuration
     * service to prepopulate it.
     * @return {?} The injected params.
     * @private
     */
    private getInjectedData_;
}
import * as soy from "./soy.js";
import { SanitizedHtml } from "./data.js";
import { SanitizedUri } from "./data.js";
import { SanitizedContentKind } from "./data.js";
import { SafeHtml } from "../html/safehtml.js";
import { SanitizedCss } from "./data.js";
import { SafeStyleSheet } from "../html/safestylesheet.js";
import * as dom from "../dom/dom.js";
import { InjectedDataSupplier } from "./injecteddatasupplier.js";
