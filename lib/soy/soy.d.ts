/**
 * Type definition for strict Soy HTML templates. Very useful when passing
 * a template as an argument.
 */
export type StrictHtmlTemplate = (arg0?: unknown | undefined, arg1?: (CompatibleIj_ | null) | undefined) => SanitizedHtml;
/**
 * Type definition for strict Soy templates. Very useful when passing a template
 * as an argument.
 */
export type StrictTemplate = (arg0?: unknown | undefined, arg1?: (CompatibleIj_ | null) | undefined) => (string | SanitizedContent);
/**
 * Type definition for text templates.
 */
export type TextTemplate = (arg0?: unknown | undefined, arg1?: (CompatibleIj_ | null) | undefined) => string;
/**
 * Helper typedef for ij parameters.  This is what soy generates.
 */
export type CompatibleIj_ = typeof IjData | {
    [x: string]: any;
};
/**
 * @fileoverview Provides utility methods to render soy template.
 */
/**
 * A structural interface for injected data.
 *
 * <p>Soy generated code contributes optional properties.
 *
 * @interface
 */
export function IjData(): void;
/**
 * Helper typedef for ij parameters.  This is what soy generates.
 * @private
 * @typedef {!IjData|!Object<string, *>}
 */
declare let CompatibleIj_: any;
import { SanitizedHtml } from "./data.js";
/**
 * Type definition for strict Soy HTML templates. Very useful when passing
 * a template as an argument.
 * @typedef {function(?=,
 * ?CompatibleIj_=):!SanitizedHtml}
 */
export let StrictHtmlTemplate: any;
import { SanitizedContent } from "./data.js";
/**
 * Type definition for strict Soy templates. Very useful when passing a template
 * as an argument.
 * @typedef {function(?=,
 * ?CompatibleIj_=):(string|!SanitizedContent)}
 */
export let StrictTemplate: any;
/**
 * Type definition for text templates.
 * @typedef {function(?=, ?CompatibleIj_=):string}
 */
export let TextTemplate: any;
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
export function convertToElement(templateResult: SanitizedContent, opt_domHelper?: (DomHelper | null) | undefined): Element;
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
export function renderAsElement<ARG_TYPES>(template: ((arg0: ARG_TYPES, arg1?: (CompatibleIj_ | null) | undefined) => any) | null, opt_templateData?: ARG_TYPES | undefined, opt_injectedData?: any | undefined, opt_domHelper?: DomHelper | undefined): Element;
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
export function renderAsFragment<ARG_TYPES>(template: any, opt_templateData?: ARG_TYPES | undefined, opt_injectedData?: any | undefined, opt_domHelper?: DomHelper | undefined): Node;
/**
 * Renders a Soy template and then set the output string as
 * the innerHTML of an element. It is recommended to use this helper function
 * instead of directly setting innerHTML in your hand-written code, so that it
 * will be easier to audit the code for cross-site scripting vulnerabilities.
 *
 * @param {?Element} element The element whose content we are rendering into.
 * @param {?function(ARG_TYPES, ?CompatibleIj_=):*|
 *     ?function(ARG_TYPES, null=, Object<string, *>=):*} template
 *     The Soy template defining the element's content.
 * @param {ARG_TYPES=} opt_templateData The data for the template.
 * @param {Object=} opt_injectedData The injected data for the template.
 * @template ARG_TYPES
 */
export function renderElement<ARG_TYPES>(element: Element | null, template: ((arg0: ARG_TYPES, arg1?: (CompatibleIj_ | null) | undefined) => any) | null, opt_templateData?: ARG_TYPES | undefined, opt_injectedData?: any | undefined): void;
/**
 * Sets the processed template as the innerHTML of an element. It is recommended
 * to use this helper function instead of directly setting innerHTML in your
 * hand-written code, so that it will be easier to audit the code for cross-site
 * scripting vulnerabilities.
 *
 * @param {Element|null} element The element whose content we are rendering into.
 * @param {!SanitizedContent} templateResult The processed
 *     template of kind HTML or TEXT (which will be escaped).
 * @template ARG_TYPES
 */
export function renderHtml<ARG_TYPES>(element: Element | null, templateResult: SanitizedContent): void;
import { DomHelper } from "../dom/dom.js";
export {};
