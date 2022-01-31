/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview The TrustedResourceUrl type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */
/**
 * A URL which is under application control and from which script, CSS, and
 * other resources that represent executable code, can be fetched.
 *
 * Given that the URL can only be constructed from strings under application
 * control and is used to load resources, bugs resulting in a malformed URL
 * should not have a security impact and are likely to be easily detectable
 * during testing. Given the wide number of non-RFC compliant URLs in use,
 * stricter validation could prevent some applications from being able to use
 * this type.
 *
 * Instances of this type must be created via the factory method,
 * (`fromConstant`, `fromConstants`, `format` or `formatWithParams`), and not by
 * invoking its constructor. The constructor intentionally takes an extra
 * parameter that cannot be constructed outside of this file and the type is
 * immutable; hence only a default instance corresponding to the empty string
 * can be obtained via constructor invocation.
 *
 * Creating TrustedResourceUrl objects HAS SIDE-EFFECTS due to calling
 * Trusted Types Web API.
 *
 * @see TrustedResourceUrl#fromConstant
 * @final
 * @struct
 * @implements {DirectionalString}
 * @implements {TypedString}
 */
export class TrustedResourceUrl implements DirectionalString, TypedString {
    /**
     * @param {!TrustedScriptURL|string} value
     * @param {!Object} token package-internal implementation detail.
     */
    constructor(value: any | string, token: any);
    /**
     * The contained value of this TrustedResourceUrl.  The field has a
     * purposely ugly name to make (non-compiled) code that attempts to directly
     * access this field stand out.
     * @const
     * @private {!TrustedScriptURL|string}
     */
    private privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
    /**
     * @override
     * @const
     */
    implementsGoogStringTypedString: boolean;
    getTypedStringValue(): any;
    /**
     * @override
     * @const
     */
    implementsGoogI18nBidiDirectionalString: boolean;
    getDirection(): number;
    cloneWithParams(searchParams: string | (({
        [x: string]: any;
    } | undefined) | null), opt_hashParams?: (string | ({
        [x: string]: any;
    } | null)) | undefined): TrustedResourceUrl;
    toString(): string;
}
export namespace TrustedResourceUrl {
    function unwrap(trustedResourceUrl: TrustedResourceUrl): string;
    function unwrapTrustedScriptURL(trustedResourceUrl: TrustedResourceUrl): any;
    function format(format: Const, args: {
        [x: string]: string | number | Const;
    }): TrustedResourceUrl;
    const FORMAT_MARKER_: RegExp;
    const BASE_URL_: RegExp;
    const URL_PARAM_PARSER_: RegExp;
    function formatWithParams(format: Const, args: {
        [x: string]: string | number | Const;
    }, searchParams: string | {
        [x: string]: any;
    } | null | undefined, opt_hashParams?: string | {
        [x: string]: any;
    } | null | undefined): TrustedResourceUrl;
    function fromConstant(url: Const): TrustedResourceUrl;
    function fromConstants(parts: Const[]): TrustedResourceUrl;
    function fromSafeScript(safeScript: SafeScript): TrustedResourceUrl;
    const CONSTRUCTOR_TOKEN_PRIVATE_: {};
    function createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(url: string): TrustedResourceUrl;
    function stringifyParams_(prefix: string, currentString: string, params: string | {
        [x: string]: any;
    } | null | undefined): string;
}
import { DirectionalString } from "../i18n/bidi.js";
import { TypedString } from "../string/typedstring.js";
import { Const } from "../string/const.js";
import { SafeScript } from "./safescript.js";
