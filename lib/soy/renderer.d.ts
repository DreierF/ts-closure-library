/**
 * An interface for a supplier that provides Soy injected data.
 * @interface
 */
export class InjectedDataSupplier {
    /**
     * Gets the injected data. Implementation may assume that
     * `Renderer` will treat the returned data as
     * immutable.  The renderer will call this every time one of its
     * `render*` methods is called.
     * @return {?} A key-value pair representing the injected data.
     */
    getData(): any;
}
/**
 * @fileoverview Provides a soy renderer that allows registration of
 * injected data ("globals") that will be passed into the rendered
 * templates.
 *
 * There is also an interface {@link InjectedDataSupplier} that
 * user should implement to provide the injected data for a specific
 * application. The injected data format is a JavaScript object:
 * <pre>
 * {'dataKey': 'value', 'otherDataKey': 'otherValue'}
 * </pre>
 *
 * The injected data can then be referred to in any soy templates as
 * part of a magic "ij" parameter. For example, `$ij.dataKey`
 * will evaluate to 'value' with the above injected data.
 */
/**
 * Creates a new soy renderer. Note that the renderer will only be
 * guaranteed to work correctly within the document scope provided in
 * the DOM helper.
 *
 *     that provides an injected data.
 *     defaults to that provided by `goog_dom.getDomHelper()`.
 */
export class Renderer {
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
    constructor(opt_injectedDataSupplier?: InjectedDataSupplier, opt_domHelper?: goog_dom.DomHelper);
    /**
     * @const {!DomHelper}
     * @private
     */
    dom_: goog_dom.DomHelper;
    /**
     * @const {?InjectedDataSupplier}
     * @private
     */
    supplier_: InjectedDataSupplier;
    /**
     * Renders a Soy template into a single node or a document fragment.
     * Delegates to `soy.renderAsFragment`.
     *
     * @param {?function(ARG_TYPES, ?Object<string, *>=):*|
     *     ?function(ARG_TYPES, null=, ?Object<string, *>=):*} template
     *     The Soy template defining the element's content.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @return {!Node} The resulting node or document fragment.
     * @template ARG_TYPES
     */
    renderAsFragment<ARG_TYPES>(template: (arg0: ARG_TYPES, arg1?: {
        [x: string]: any;
    }) => any, opt_templateData?: ARG_TYPES): Node;
    /**
     * Renders a Soy template into a single node. If the rendered HTML
     * string represents a single node, then that node is returned.
     * Otherwise, a DIV element is returned containing the rendered nodes.
     * Delegates to `soy.renderAsElement`.
     *
     * @param {?function(ARG_TYPES, ?Object<string, *>=):*|
     *     ?function(ARG_TYPES, null=, ?Object<string, *>=):*} template
     *     The Soy template defining the element's content.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @return {!Element} Rendered template contents, wrapped in a parent DIV
     *     element if necessary.
     * @template ARG_TYPES
     */
    renderAsElement<ARG_TYPES_1>(template: (arg0: ARG_TYPES_1, arg1?: {
        [x: string]: any;
    }) => any, opt_templateData?: ARG_TYPES_1): Element;
    /**
     * Renders a Soy template and then set the output string as the
     * innerHTML of the given element. Delegates to `soy.renderElement`.
     *
     * @param {?Element} element The element whose content we are rendering.
     * @param {?function(ARG_TYPES, ?Object<string, *>=):*|
     *     ?function(ARG_TYPES, null=, ?Object<string, *>=):*} template
     *     The Soy template defining the element's content.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @template ARG_TYPES
     */
    renderElement<ARG_TYPES_2>(element: Element, template: (arg0: ARG_TYPES_2, arg1?: {
        [x: string]: any;
    }) => any, opt_templateData?: ARG_TYPES_2): void;
    /**
     * Renders a Soy template and returns the output string.
     * If the template is strict, it must be of kind HTML. To render strict
     * templates of other kinds, use `renderText` (for `kind="text"`) or
     * `renderStrictOfKind`.
     *
     * @param {?function(ARG_TYPES, ?Object<string, *>=):*|
     *     ?function(ARG_TYPES, null=, ?Object<string, *>=):*} template
     *     The Soy template to render.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @return {string} The return value of rendering the template directly.
     * @template ARG_TYPES
     */
    render<ARG_TYPES_3>(template: (arg0: ARG_TYPES_3, arg1?: {
        [x: string]: any;
    }) => any, opt_templateData?: ARG_TYPES_3): string;
    /**
     * Renders a strict Soy template of kind="text" and returns the output string.
     * It is an error to use renderText on templates of kinds other than "text".
     *
     * @param {
     *     ?function(ARG_TYPES, ?Object<string,*>=): ?string|
     *     ?function(ARG_TYPES, null=, ?Object<string, *>=): ?string}
     *     template The Soy template to render.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @return {string} The return value of rendering the template directly.
     * @template ARG_TYPES
     */
    renderText<ARG_TYPES_4>(template: any, opt_templateData?: ARG_TYPES_4): string;
    /**
     * Renders a strict Soy HTML template and returns the output SanitizedHtml
     * object.
     * @param {
     *   ?function(ARG_TYPES, ?Object<string,*>=): ?SanitizedHtml|
     *   ?function(ARG_TYPES, ?Object=, ?Object<string, *>=):
     *       ?SanitizedHtml} template The Soy template to render.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @return {!SanitizedHtml}
     * @template ARG_TYPES
     */
    renderStrict<ARG_TYPES_5>(template: any, opt_templateData?: ARG_TYPES_5): SanitizedHtml;
    /**
     * Renders a strict Soy template and returns the output SanitizedUri object.
     *
     * @param {function(ARG_TYPES, ?Object<string, *>=):!SanitizedUri|
     *     function(ARG_TYPES, ?Object=, ?Object<string, *>=):
     *     !SanitizedUri} template The Soy template to render.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @return {!SanitizedUri}
     * @template ARG_TYPES
     */
    renderStrictUri<ARG_TYPES_6>(template: (arg0: ARG_TYPES_6, arg1?: {
        [x: string]: any;
    }) => SanitizedUri | ((arg0: ARG_TYPES_6, arg1?: any, arg2?: {
        [x: string]: any;
    }) => SanitizedUri), opt_templateData?: ARG_TYPES_6): SanitizedUri;
    /**
     * Renders a strict Soy template and returns the output SanitizedContent object.
     *
     * @param {?function(ARG_TYPES, ?Object<string, *>=): RETURN_TYPE|
     *     ?function(ARG_TYPES, ?Object=, ?Object<string, *>=): RETURN_TYPE}
     *     template The Soy template to render.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @param {?SanitizedContentKind=} opt_kind The output kind to
     *     assert. If null, the template must be of kind="html" (i.e., opt_kind
     *     defaults to SanitizedContentKind.HTML).
     * @return {?RETURN_TYPE} The SanitizedContent object. This return type is
     *     generic based on the return type of the template, such as
     *     SanitizedHtml.
     * @template ARG_TYPES, RETURN_TYPE
     */
    renderStrictOfKind<ARG_TYPES_7, RETURN_TYPE>(template: (arg0: ARG_TYPES_7, arg1?: {
        [x: string]: any;
    }) => RETURN_TYPE | ((arg0: ARG_TYPES_7, arg1?: any, arg2?: {
        [x: string]: any;
    }) => RETURN_TYPE), opt_templateData?: ARG_TYPES_7, opt_kind?: any): RETURN_TYPE;
    /**
     * Renders a strict Soy template of kind="html" and returns the result as
     * a Html_SafeHtml object.
     *
     * Rendering a template that is not a strict template of kind="html" results in
     * a runtime error.
     *
     * @param {?function(ARG_TYPES, ?Object<string, *>=):
     *     !SanitizedHtml| ?function(ARG_TYPES, null=, ?Object<string,
     *     *>=): !SanitizedHtml} template The Soy template to render.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @return {!Html_SafeHtml}
     * @template ARG_TYPES
     */
    renderSafeHtml<ARG_TYPES_8>(template: (arg0: ARG_TYPES_8, arg1?: {
        [x: string]: any;
    }) => SanitizedHtml | ((arg0: ARG_TYPES_8, arg1?: null, arg2?: {
        [x: string]: any;
    }) => SanitizedHtml), opt_templateData?: ARG_TYPES_8): Html_SafeHtml;
    /**
     * Renders a strict Soy template of kind="css" and returns the result as
     * a SafeStyleSheet object.
     *
     * Rendering a template that is not a strict template of kind="css" results in
     * a runtime and compile-time error.
     *
     * @param {?function(ARG_TYPES, ?Object<string, *>=):
     *     !SanitizedCss| ?function(ARG_TYPES, null=, ?Object<string,
     *     *>=): !SanitizedCss} template The Soy template to render.
     * @param {ARG_TYPES=} opt_templateData The data for the template.
     * @return {!SafeStyleSheet}
     * @template ARG_TYPES
     */
    renderSafeStyleSheet<ARG_TYPES_9>(template: (arg0: ARG_TYPES_9, arg1?: {
        [x: string]: any;
    }) => SanitizedCss | ((arg0: ARG_TYPES_9, arg1?: null, arg2?: {
        [x: string]: any;
    }) => SanitizedCss), opt_templateData?: ARG_TYPES_9): SafeStyleSheet;
    /**
     * @return {!DomHelper}
     * @protected
     */
    getDom(): goog_dom.DomHelper;
    /**
     * Observes rendering of non-text templates by this renderer.
     * @param {?Node} node Relevant node, if available. The node may or may
     *     not be in the document, depending on whether Soy is creating an element
     *     or writing into an existing one.
     * @param {?SanitizedContentKind} kind of the template, or null if
     *     it was not strict.
     * @protected
     */
    handleRender(node: Node, kind: any): void;
    /**
     * Creates the injectedParams map if necessary and calls the configuration
     * service to prepopulate it.
     * @return {?} The injected params.
     * @private
     */
    getInjectedData_(): any;
}
import * as goog_dom from "../dom/dom.js";
import { SanitizedHtml } from "./data.js";
import { SanitizedUri } from "./data.js";
import { SafeHtml as Html_SafeHtml } from "../html/safehtml.js";
import { SanitizedCss } from "./data.js";
import { SafeStyleSheet } from "../html/safestylesheet.js";
