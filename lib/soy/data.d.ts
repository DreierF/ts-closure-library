/**
 * A type of textual content.
 *
 * This is an enum of type Object so that these values are unforgeable.
 */
export type SanitizedContentKind = any;
/**
 * A string-like object that carries a content-type and a content direction.
 *
 * IMPORTANT! Do not create these directly, nor instantiate the subclasses.
 * Instead, use a trusted, centrally reviewed library as endorsed by your team
 * to generate these objects. Otherwise, you risk accidentally creating
 * SanitizedContent that is attacker-controlled and gets evaluated unescaped in
 * templates.
 *
 * @abstract
 * @suppress {checkTypes}
 */
export class SanitizedContent {
    /**
     * The context in which this content is safe from XSS attacks.
     * @type {?SanitizedContentKind}
     */
    contentKind: SanitizedContentKind | null;
    /**
     * The content's direction; null if unknown and thus to be estimated when
     * necessary.
     * @type {?Dir}
     */
    contentDir: Dir | null;
    /**
     * The already-safe content.
     * @protected
      * @type {string}
     */
    protected content: string;
    /**
     * Gets the already-safe content.
     * @return {string}
     */
    getContent(): string;
    /** @override */
    toString(): string;
    /**
     * Converts sanitized content of kind HTML into SafeHtml
     * @return {!SafeHtml}
     * @throws {!Error} when the content kind is not HTML.
     */
    toSafeHtml(): SafeHtml;
    /**
     * Converts sanitized content of kind URI into SafeUrl without modification.
     * @return {!SafeUrl}
     * @throws {Error} when the content kind is not URI.
     */
    toSafeUrl(): SafeUrl;
}
export namespace SanitizedContentKind {
    export const HTML: {
        sanitizedContentKindHtml: boolean;
    } | {
        sanitizedContentKindHtml?: undefined;
    };
    export const JS: {
        sanitizedContentJsChars: boolean;
    } | {
        sanitizedContentJsChars?: undefined;
    };
    export const URI: {
        sanitizedContentUri: boolean;
    } | {
        sanitizedContentUri?: undefined;
    };
    export const TRUSTED_RESOURCE_URI: {
        sanitizedContentTrustedResourceUri: boolean;
    } | {
        sanitizedContentTrustedResourceUri?: undefined;
    };
    export const ATTRIBUTES: {
        sanitizedContentHtmlAttribute: boolean;
    } | {
        sanitizedContentHtmlAttribute?: undefined;
    };
    export const STYLE: {
        sanitizedContentStyle: boolean;
    } | {
        sanitizedContentStyle?: undefined;
    };
    export const CSS: {
        sanitizedContentCss: boolean;
    } | {
        sanitizedContentCss?: undefined;
    };
}
/**
 * Content of type {@link SanitizedContentKind.CSS}.
 *
 * The content is non-attacker-exploitable CSS, such as {@code @import url(x)}.
 * The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
export class SanitizedCss extends SanitizedContent {
    /**
     * Checks if the value could be used as the Soy type {css}.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWith(value: any): boolean;
    /**
     * Checks if the value could be used as the Soy type {css}.
     * Strict: disallows strings.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWithStrict(value: any): boolean;
    /**
     * Converts SanitizedCss into SafeStyleSheet.
     * Note: SanitizedCss in Soy represents both SafeStyle and SafeStyleSheet in
     * Closure. It's about to be split so that SanitizedCss represents only
     * SafeStyleSheet.
     * @return {!Html_SafeStyleSheet}
     */
    toSafeStyleSheet(): Html_SafeStyleSheet;
}
/**
 * Content of type {@link SanitizedContentKind.HTML}.
 *
 * The content is a string of HTML that can safely be embedded in a PCDATA
 * context in your app.  If you would be surprised to find that an HTML
 * sanitizer produced `s` (e.g.  it runs code or fetches bad URLs) and
 * you wouldn't write a template that produces `s` on security or privacy
 * grounds, then don't pass `s` here. The default content direction is
 * unknown, i.e. to be estimated when necessary.
 *
 * @extends {SanitizedContent}
 */
export class SanitizedHtml extends SanitizedContent {
    /**
     * Checks if the value could be used as the Soy type {html}.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWith(value: any): boolean;
    /**
     * Checks if the value could be used as the Soy type {html}.
     * Strict: disallows strings.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWithStrict(value: any): boolean;
}
/**
 * Content of type {@link SanitizedContentKind.ATTRIBUTES}.
 *
 * The content should be safely embeddable within an open tag, such as a
 * key="value" pair. The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
export class SanitizedHtmlAttribute extends SanitizedContent {
    /**
     * Checks if the value could be used as the Soy type {attribute}.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWith(value: any): boolean;
    /**
     * Checks if the value could be used as the Soy type {attribute}.
     * Strict: disallows strings.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWithStrict(value: any): boolean;
}
/**
 * Content of type {@link SanitizedContentKind.JS}.
 *
 * The content is JavaScript source that when evaluated does not execute any
 * attacker-controlled scripts. The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
export class SanitizedJs extends SanitizedContent {
    /**
     * Checks if the value could be used as the Soy type {js}.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWith(value: any): boolean;
    /**
     * Checks if the value could be used as the Soy type {js}.
     * Strict: disallows strings.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWithStrict(value: any): boolean;
}
/**
 * Content of type
 * {@link SanitizedContentKind.TRUSTED_RESOURCE_URI}.
 *
 * The content is a TrustedResourceUri chunk that is not under attacker control.
 * The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
export class SanitizedTrustedResourceUri extends SanitizedContent {
    /**
     * Checks if the value could be used as the Soy type {trusted_resource_uri}.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWith(value: any): boolean;
    /**
     * Checks if the value could be used as the Soy type {trusted_resource_uri}.
     * Strict: disallows strings.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWithStrict(value: any): boolean;
    /**
     * Converts sanitized content into TrustedResourceUrl without modification.
     * @return {!TrustedResourceUrl}
     */
    toTrustedResourceUrl(): TrustedResourceUrl;
}
/**
 * Content of type {@link SanitizedContentKind.URI}.
 *
 * The content is a URI chunk that the caller knows is safe to emit in a
 * template. The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
export class SanitizedUri extends SanitizedContent {
    /**
     * Checks if the value could be used as the Soy type {uri}.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWith(value: any): boolean;
    /**
     * Checks if the value could be used as the Soy type {uri}.
     * Strict: disallows strings.
     * @param {*} value
     * @return {boolean}
     */
    static isCompatibleWithStrict(value: any): boolean;
}
import { Dir } from "../i18n/bidi.js";
import { SafeHtml } from "../html/safehtml.js";
import { SafeUrl } from "../html/safeurl.js";
import { SafeStyleSheet as Html_SafeStyleSheet } from "../html/safestylesheet.js";
import { TrustedResourceUrl } from "../html/trustedresourceurl.js";
