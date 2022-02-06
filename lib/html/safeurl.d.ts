/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview The SafeUrl type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */
/**
 * A string that is safe to use in URL context in DOM APIs and HTML documents.
 *
 * A SafeUrl is a string-like object that carries the security type contract
 * that its value as a string will not cause untrusted script execution
 * when evaluated as a hyperlink URL in a browser.
 *
 * Values of this type are guaranteed to be safe to use in URL/hyperlink
 * contexts, such as assignment to URL-valued DOM properties, in the sense that
 * the use will not result in a Cross-Site-Scripting vulnerability. Similarly,
 * SafeUrls can be interpolated into the URL context of an HTML template (e.g.,
 * inside a href attribute). However, appropriate HTML-escaping must still be
 * applied.
 *
 * Note that, as documented in `SafeUrl.unwrap`, this type's
 * contract does not guarantee that instances are safe to interpolate into HTML
 * without appropriate escaping.
 *
 * Note also that this type's contract does not imply any guarantees regarding
 * the resource the URL refers to.  In particular, SafeUrls are <b>not</b>
 * safe to use in a context where the referred-to resource is interpreted as
 * trusted code, e.g., as the src of a script tag.
 *
 * Instances of this type must be created via the factory methods
 * (`SafeUrl.fromConstant`, `SafeUrl.sanitize`),
 * etc and not by invoking its constructor. The constructor intentionally takes
 * an extra parameter that cannot be constructed outside of this file and the
 * type is immutable; hence only a default instance corresponding to the empty
 * string can be obtained via constructor invocation.
 *
 * @see SafeUrl#fromConstant
 * @see SafeUrl#from
 * @see SafeUrl#sanitize
 * @final
 * @struct
 * @implements {DirectionalString}
 * @implements {TypedString}
 */
export class SafeUrl implements DirectionalString, TypedString {
    /**
     * @param {string} value
     * @param {!Object} token package-internal implementation detail.
     */
    constructor(value: string, token: any);
    /**
     * The contained value of this SafeUrl.  The field has a purposely ugly
     * name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {string}
     */
    private privateDoNotAccessOrElseSafeUrlWrappedValue_;
    /**
     * @override
     * @const
     */
    implementsGoogStringTypedString: boolean;
    getTypedStringValue(): string;
    /**
     * @override
     * @const {boolean}
     */
    implementsGoogI18nBidiDirectionalString: boolean;
    getDirection(): Dir;
    toString(): string;
}
export namespace SafeUrl {
    export const INNOCUOUS_STRING: string;
    export function unwrap(safeUrl: SafeUrl): string;
    export function fromConstant(url: Const): SafeUrl;
    export function isSafeMimeType(mimeType: string): boolean;
    export function fromBlob(blob: Blob): SafeUrl;
    export function revokeObjectUrl(safeUrl: SafeUrl): void;
    export function fromMediaSource(mediaSource: MediaSource): SafeUrl;
    export function tryFromDataUrl(dataUrl: string): SafeUrl | null;
    export function fromDataUrl(dataUrl: string): SafeUrl;
    export function fromTelUrl(telUrl: string): SafeUrl;
    export function fromSipUrl(sipUrl: string): SafeUrl;
    export function fromFacebookMessengerUrl(facebookMessengerUrl: string): SafeUrl;
    export function fromWhatsAppUrl(whatsAppUrl: string): SafeUrl;
    export function fromSmsUrl(smsUrl: string): SafeUrl;
    export function isSmsUrlBodyValid_(smsUrl: string): boolean;
    export function fromSshUrl(sshUrl: string): SafeUrl;
    export function sanitizeChromeExtensionUrl(url: string, extensionId: Const | Const[]): SafeUrl;
    export function sanitizeFirefoxExtensionUrl(url: string, extensionId: Const | Const[]): SafeUrl;
    export function sanitizeEdgeExtensionUrl(url: string, extensionId: Const | Const[]): SafeUrl;
    export function sanitizeExtensionUrl_(scheme: RegExp, url: string, extensionId: Const | Const[]): SafeUrl;
    export function fromTrustedResourceUrl(trustedResourceUrl: Html_TrustedResourceUrl): SafeUrl;
    export { SAFE_URL_PATTERN_ as SAFE_URL_PATTERN };
    export function trySanitize(url: string | TypedString): SafeUrl | null;
    export function sanitize(url: string | TypedString): SafeUrl;
    export function sanitizeAssertUnchanged(url: string | TypedString, opt_allowDataUrl?: boolean | undefined): SafeUrl;
    export const CONSTRUCTOR_TOKEN_PRIVATE_: {};
    export function createSafeUrlSecurityPrivateDoNotAccessOrElse(url: string): SafeUrl;
    export const INNOCUOUS_URL: SafeUrl;
    export const ABOUT_BLANK: SafeUrl;
}
import { DirectionalString } from "../i18n/bidi.js";
import { TypedString } from "../string/typedstring.js";
import { Dir } from "../i18n/bidi.js";
import { Const } from "../string/const.js";
import { TrustedResourceUrl as Html_TrustedResourceUrl } from "./trustedresourceurl.js";
/**
 * A pattern that recognizes a commonly useful subset of URLs that satisfy
 * the SafeUrl contract.
 *
 * This regular expression matches a subset of URLs that will not cause script
 * execution if used in URL context within a HTML document. Specifically, this
 * regular expression matches if (comment from here on and regex copied from
 * Soy's EscapingConventions):
 * (1) Either a protocol in a whitelist (http, https, mailto or ftp).
 * (2) or no protocol.  A protocol must be followed by a colon. The below
 *     allows that by allowing colons only after one of the characters [/?#].
 *     A colon after a hash (#) must be in the fragment.
 *     Otherwise, a colon after a (?) must be in a query.
 *     Otherwise, a colon after a single solidus (/) must be in a path.
 *     Otherwise, a colon after a double solidus (//) must be in the authority
 *     (before port).
 *
 * @private
 * @const {!RegExp}
 */
declare let SAFE_URL_PATTERN_: RegExp;
export {};
