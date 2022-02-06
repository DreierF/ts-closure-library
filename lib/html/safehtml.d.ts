/**
 * @type {boolean} Whether to strip out error messages or to leave them in.
 */
export const ENABLE_ERROR_MESSAGES: boolean;
/**
 * Whether the `style` attribute is supported. Set to false to avoid the byte
 * weight of `SafeStyle` where unneeded. An error will be thrown if
 * the `style` attribute is used.
 * @type {boolean}
 */
export const SUPPORT_STYLE_ATTRIBUTE: boolean;
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview The SafeHtml type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */
/**
 * A string that is safe to use in HTML context in DOM APIs and HTML documents.
 *
 * A SafeHtml is a string-like object that carries the security type contract
 * that its value as a string will not cause untrusted script execution when
 * evaluated as HTML in a browser.
 *
 * Values of this type are guaranteed to be safe to use in HTML contexts,
 * such as, assignment to the innerHTML DOM property, or interpolation into
 * a HTML template in HTML PC_DATA context, in the sense that the use will not
 * result in a Cross-Site-Scripting vulnerability.
 *
 * Instances of this type must be created via the factory methods
 * (`SafeHtml.create`, `SafeHtml.htmlEscape`),
 * etc and not by invoking its constructor. The constructor intentionally takes
 * an extra parameter that cannot be constructed outside of this file and the
 * type is immutable; hence only a default instance corresponding to the empty
 * string can be obtained via constructor invocation.
 *
 * Creating SafeHtml objects HAS SIDE-EFFECTS due to calling Trusted Types Web
 * API.
 *
 * Note that there is no `SafeHtml.fromConstant`. The reason is that
 * the following code would create an unsafe HTML:
 *
 * ```
 * SafeHtml.concat(
 *     SafeHtml.fromConstant(Const.from('<script>')),
 *     SafeHtml.htmlEscape(userInput),
 *     SafeHtml.fromConstant(Const.from('<\/script>')));
 * ```
 *
 * There's `goog.dom.constHtmlToNode` to create a node from constant strings
 * only.
 *
 * @see SafeHtml.create
 * @see SafeHtml.htmlEscape
 * @final
 * @struct
 * @implements {DirectionalString}
 * @implements {TypedString}
 */
export class SafeHtml implements DirectionalString, TypedString {
    /**
     * @param {!TrustedHTML|string} value
     * @param {?Dir} dir
     * @param {!Object} token package-internal implementation detail.
     */
    constructor(value: any | string, dir: Dir | null, token: any);
    /**
     * The contained value of this SafeHtml.  The field has a purposely ugly
     * name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {!TrustedHTML|string}
     */
    private privateDoNotAccessOrElseSafeHtmlWrappedValue_;
    /**
     * This SafeHtml's directionality, or null if unknown.
     * @private {?Dir}
     */
    private dir_;
    /**
     * @override
     * @const
     */
    implementsGoogI18nBidiDirectionalString: boolean;
    getDirection(): number | null;
    /**
     * @override
     * @const {boolean}
     */
    implementsGoogStringTypedString: boolean;
    getTypedStringValue(): any;
    toString(): string;
}
export namespace SafeHtml {
    export function unwrap(safeHtml: SafeHtml): string;
    export function unwrapTrustedHTML(safeHtml: SafeHtml): any;
    export function htmlEscape(textOrHtml: TextOrHtml_): SafeHtml;
    export function htmlEscapePreservingNewlines(textOrHtml: TextOrHtml_): SafeHtml;
    export function htmlEscapePreservingNewlinesAndSpaces(textOrHtml: TextOrHtml_): SafeHtml;
    import from = htmlEscape;
    export { from };
    export function comment(text: string): SafeHtml;
    export const VALID_NAMES_IN_TAG_: RegExp;
    export const URL_ATTRIBUTES_: any;
    export const NOT_ALLOWED_TAG_NAMES_: any;
    export function create(tagName: string | TagName<any>, opt_attributes?: {
        [x: string]: AttributeValue;
    } | null | undefined, opt_content?: string | number | boolean | DirectionalString | TypedString | TextOrHtml_[] | undefined): SafeHtml;
    export function verifyTagName(tagName: string): void;
    export function createIframe(opt_src?: Html_TrustedResourceUrl | null | undefined, opt_srcdoc?: SafeHtml | null | undefined, opt_attributes?: {
        [x: string]: AttributeValue;
    } | null | undefined, opt_content?: string | number | boolean | DirectionalString | TypedString | TextOrHtml_[] | undefined): SafeHtml;
    export function createSandboxIframe(opt_src?: string | Html_SafeUrl | undefined, opt_srcdoc?: string | undefined, opt_attributes?: {
        [x: string]: AttributeValue;
    } | undefined, opt_content?: string | number | boolean | DirectionalString | TypedString | TextOrHtml_[] | undefined): SafeHtml;
    export function canUseSandboxIframe(): boolean;
    export function createScriptSrc(src: Html_TrustedResourceUrl, opt_attributes?: {
        [x: string]: AttributeValue;
    } | null | undefined): SafeHtml;
    export function createScript(script: SafeScript | SafeScript[], opt_attributes?: {
        [x: string]: AttributeValue;
    } | null | undefined): SafeHtml;
    export function createStyle(styleSheet: SafeStyleSheet | SafeStyleSheet[], opt_attributes?: {
        [x: string]: AttributeValue;
    } | null | undefined): SafeHtml;
    export function createMetaRefresh(url: string | Html_SafeUrl, opt_secs?: number | undefined): SafeHtml;
    export function getAttrNameAndValue_(tagName: string, name: string, value: AttributeValue): string;
    export function getStyleValue_(value: AttributeValue): string;
    export function createWithDir(dir: number, tagName: string, opt_attributes?: {
        [x: string]: AttributeValue;
    } | null | undefined, opt_content?: string | number | boolean | DirectionalString | TypedString | TextOrHtml_[] | undefined): SafeHtml;
    export function join(separator: TextOrHtml_, parts: (string | number | boolean | DirectionalString | TypedString | TextOrHtml_[])[]): SafeHtml;
    export function concat(...args: (string | number | boolean | DirectionalString | TypedString | TextOrHtml_[])[]): SafeHtml;
    export function concatWithDir(dir: number, ...args: (string | number | boolean | DirectionalString | TypedString | TextOrHtml_[])[]): SafeHtml;
    export const CONSTRUCTOR_TOKEN_PRIVATE_: {};
    export function createSafeHtmlSecurityPrivateDoNotAccessOrElse(html: string, dir: number | null): SafeHtml;
    export function createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(tagName: string, opt_attributes?: {
        [x: string]: AttributeValue;
    } | null | undefined, opt_content?: string | number | boolean | DirectionalString | TypedString | TextOrHtml_[] | undefined): SafeHtml;
    export function stringifyAttributes(tagName: string, opt_attributes?: {
        [x: string]: AttributeValue;
    } | null | undefined): string;
    export function combineAttributes(fixedAttributes: {
        [x: string]: AttributeValue;
    }, defaultAttributes: {
        [x: string]: string;
    }, opt_attributes?: {
        [x: string]: AttributeValue;
    } | null | undefined): {
        [x: string]: AttributeValue;
    };
    export const DOCTYPE_HTML: SafeHtml;
    export const EMPTY: SafeHtml;
    export const BR: SafeHtml;
    /**
     * Shorthand for union of types that can sensibly be converted to strings
     * or might already be SafeHtml (as SafeHtml is a TypedString).
     */
    export type TextOrHtml_ = string | number | boolean | DirectionalString | TypedString;
    export type AttributeValue = string | number | TypedString | {
        [x: string]: string | Const | Html_SafeUrl | SafeStyle.PropertyValue[] | null;
    } | null | undefined;
}
import { DirectionalString } from "../i18n/bidi.js";
import { TypedString } from "../string/typedstring.js";
import { Dir } from "../i18n/bidi.js";
import { TagName } from "../dom/tagname.js";
import { TrustedResourceUrl as Html_TrustedResourceUrl } from "./trustedresourceurl.js";
import { SafeUrl as Html_SafeUrl } from "./safeurl.js";
import { SafeScript } from "./safescript.js";
import { SafeStyleSheet } from "./safestylesheet.js";
import { Const } from "../string/const.js";
import { SafeStyle } from "./safestyle.js";
