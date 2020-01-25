/**
 * Type of options that an XmlHttp object can have.
 */
export type OptionType = number;
/**
 * Status constants for XMLHTTP, matches:
 * https://msdn.microsoft.com/en-us/library/ms534361(v=vs.85).aspx
 */
export type ReadyState = number;
/**
 * @type {boolean} Whether to assume XMLHttpRequest exists. Setting this to
 *     true eliminates the ActiveX probing code.
 */
export const ASSUME_NATIVE_XHR: boolean;
/**
 * Default factory to use when creating xhr objects.  You probably shouldn't be
 * instantiating this directly, but rather using it via XmlHttp.
 * @extends {NetXmlHttpFactory}
 */
export class DefaultXmlHttpFactory extends NetXmlHttpFactory {
    /**
     * The ActiveX PROG ID string to use to create xhr's in IE. Lazily initialized.
     * @type {string|undefined}
     * @private
     */
    ieProgId_: string | undefined;
    /** @override */
    createInstance(): any;
    /** @override */
    internalGetOptions(): {};
    /**
     * Initialize the private state used by other functions.
     * @return {string} The ActiveX PROG ID string to use to create xhr's in IE.
     * @private
     */
    getProgId_(): string;
}
export namespace OptionType {
    export const USE_NULL_FUNCTION: number;
    export const LOCAL_REQUEST_ERROR: number;
}
export namespace ReadyState {
    export const UNINITIALIZED: number;
    export const LOADING: number;
    export const LOADED: number;
    export const INTERACTIVE: number;
    export const COMPLETE: number;
}
/**
 * @fileoverview Low level handling of XMLHttpRequest.
 */
/**
 * Static class for creating XMLHttpRequest objects.
 * @return {!XhrLike.OrNative} A new XMLHttpRequest object.
 * @suppress {checkTypes}
 */
export function XmlHttp(): XMLHttpRequest | XhrLike;
export namespace XmlHttp {
    export const factory_: NetXmlHttpFactory | null;
}
/**
 * @type {boolean} Whether to assume XMLHttpRequest exists. Setting this to
 *     true bypasses the ActiveX probing code.
 * NOTE(ruilopes): Due to the way JSCompiler works, this define *will not* strip
 * out the ActiveX probing code from binaries.  To achieve this, use
 * `ASSUME_NATIVE_XHR` instead.
 * TODO(ruilopes): Collapse both defines.
 */
/** @const */
export let XmlHttpDefines: {};
import { XmlHttpFactory as NetXmlHttpFactory } from "./xmlhttpfactory.js";
import { XhrLike } from "./xhrlike.js";
