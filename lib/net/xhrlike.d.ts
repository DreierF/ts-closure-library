/**
 * Interface for the common parts of XMLHttpRequest.
 *
 * Mostly copied from externs/w3c_xml.js.
 *
 * @interface
 * @see http://www.w3.org/TR/XMLHttpRequest/
 */
export class XhrLike {
    /**
     * @type {function()|null|undefined}
     * @see http://www.w3.org/TR/XMLHttpRequest/#handler-xhr-onreadystatechange
     */
    onreadystatechange: (() => void) | null | undefined;
    /**
     * @type {?ArrayBuffer|?Blob|?Document|?Object|?string}
     * @see https://xhr.spec.whatwg.org/#response-object
     */
    response: (ArrayBuffer | ((Blob | ((Document | ((Object | (string | null)) | null)) | null)) | null)) | null;
    /**
     * @type {string|null}
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-responsetext-attribute
     */
    responseText: string | null;
    /**
     * @type {string|null}
     * @see https://xhr.spec.whatwg.org/#the-responsetype-attribute
     */
    responseType: string | null;
    /**
     * @type {?Document}
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-responsexml-attribute
     */
    responseXML: Document | null;
    /**
     * @type {number|null}
     * @see http://www.w3.org/TR/XMLHttpRequest/#readystate
     */
    readyState: number | null;
    /**
     * @type {number|null}
     * @see http://www.w3.org/TR/XMLHttpRequest/#status
     */
    status: number | null;
    /**
     * @type {string|null}
     * @see http://www.w3.org/TR/XMLHttpRequest/#statustext
     */
    statusText: string | null;
    /**
     * @param {string} method
     * @param {string} url
     * @param {?boolean=} opt_async
     * @param {?string=} opt_user
     * @param {?string=} opt_password
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-open()-method
     */
    open(method: string, url: string, opt_async?: boolean, opt_user?: string, opt_password?: string): void;
    /**
     * @param {ArrayBuffer|ArrayBufferView|Blob|Document|FormData|string=} opt_data
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-send()-method
     */
    send(opt_data?: string | ArrayBuffer | ArrayBufferView | Blob | FormData | Document): void;
    /**
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-abort()-method
     */
    abort(): void;
    /**
     * @param {string} header
     * @param {string} value
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader()-method
     */
    setRequestHeader(header: string, value: string): void;
    /**
     * @param {string} header
     * @return {string}
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader()-method
     */
    getResponseHeader(header: string): string;
    /**
     * @return {string}
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders()-method
     */
    getAllResponseHeaders(): string;
}
export namespace XhrLike {
    /**
     * Typedef that refers to either native or custom-implemented XHR objects.
     */
    export type OrNative = XMLHttpRequest | XhrLike;
}
