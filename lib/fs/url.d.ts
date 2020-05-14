export type UrlObject_ = {
    createObjectURL: ((arg0: Blob) => string);
    revokeObjectURL: (arg0: string) => void;
};
/**
 * Checks whether this browser supports Object Urls. If not, calls to
 * createObjectUrl and revokeObjectUrl will result in an error.
 *
 * @return {boolean} True if this browser supports Object Urls.
 */
export function browserSupportsObjectUrls(): boolean;
/**
 * @fileoverview Wrapper for URL and its createObjectUrl and revokeObjectUrl
 * methods that are part of the HTML5 File API.
 */
/**
 * Creates a blob URL for a blob object.
 * Throws an error if the browser does not support Object Urls.
 *
 * @param {!Blob} blob The object for which to create the URL.
 * @return {string} The URL for the object.
 */
export function createObjectUrl(blob: Blob): string;
/**
 * Revokes a URL created by {@link createObjectUrl}.
 * Throws an error if the browser does not support Object Urls.
 *
 * @param {string} url The URL to revoke.
 */
export function revokeObjectUrl(url: string): void;
