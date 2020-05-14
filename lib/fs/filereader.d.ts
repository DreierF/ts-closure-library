/**
 * Events emitted by a FileReader.
 */
export type EventType = string;
/**
 * Possible states for a FileReader.
 */
export type ReadyState = number;
export namespace EventType {
    export const LOAD_START: string;
    export const PROGRESS: string;
    export const LOAD: string;
    export const ABORT: string;
    export const ERROR: string;
    export const LOAD_END: string;
}
export namespace ReadyState {
    export const INIT: number;
    export const LOADING: number;
    export const DONE: number;
}
/**
 * @fileoverview A wrapper for the HTML5 FileReader object.
 */
/**
 * An object for monitoring the reading of files. This emits ProgressEvents of
 * the types listed in {@link EventType}.
 *
 * @extends {EventsEventTarget}
 * @final
 */
declare class fs_FileReader extends EventsEventTarget {
    /**
     * Reads a blob as a binary string.
     * @param {!Blob} blob The blob to read.
     * @return {!Deferred} The deferred Blob contents as a binary string.
     *     If an error occurs, the errback is called with a {@link FsError}.
     */
    static readAsBinaryString(blob: Blob): Deferred;
    /**
     * Reads a blob as an array buffer.
     * @param {!Blob} blob The blob to read.
     * @return {!Deferred} The deferred Blob contents as an array buffer.
     *     If an error occurs, the errback is called with a {@link FsError}.
     */
    static readAsArrayBuffer(blob: Blob): Deferred;
    /**
     * Reads a blob as text.
     * @param {!Blob} blob The blob to read.
     * @param {string=} opt_encoding The name of the encoding to use.
     * @return {!Deferred} The deferred Blob contents as text.
     *     If an error occurs, the errback is called with a {@link FsError}.
     */
    static readAsText(blob: Blob, opt_encoding?: string | undefined): Deferred;
    /**
     * Reads a blob as a data URL.
     * @param {!Blob} blob The blob to read.
     * @return {!Deferred} The deferred Blob contents as a data URL.
     *     If an error occurs, the errback is called with a {@link FsError}.
     */
    static readAsDataUrl(blob: Blob): Deferred;
    /**
     * Creates a new deferred object for the results of a read method.
     * @param {fs_FileReader} reader The reader to create a deferred for.
     * @return {!Deferred} The deferred results.
     * @private
     */
    private static createDeferred_;
    /**
     * The underlying FileReader object.
     *
     * @type {!FileReader}
     * @private
     */
    private reader_;
    /**
     * Abort the reading of the file.
     */
    abort(): void;
    /**
     * @return {?ReadyState} The current state of the FileReader.
     */
    getReadyState(): ReadyState | null;
    /**
     * @return {*} The result of the file read.
     */
    getResult(): any;
    /**
     * @return {?FsError} The error encountered while reading, if any.
     */
    getError(): FsError | null;
    /**
     * Wrap a progress event emitted by the underlying file reader and re-emit it.
     *
     * @param {!ProgressEvent} event The underlying event.
     * @private
     */
    private dispatchProgressEvent_;
    /**
     * Starts reading a blob as a binary string.
     * @param {!Blob} blob The blob to read.
     */
    readAsBinaryString(blob: Blob): void;
    /**
     * Starts reading a blob as an array buffer.
     * @param {!Blob} blob The blob to read.
     */
    readAsArrayBuffer(blob: Blob): void;
    /**
     * Starts reading a blob as text.
     * @param {!Blob} blob The blob to read.
     * @param {string=} opt_encoding The name of the encoding to use.
     */
    readAsText(blob: Blob, opt_encoding?: string | undefined): void;
    /**
     * Starts reading a blob as a data URL.
     * @param {!Blob} blob The blob to read.
     */
    readAsDataUrl(blob: Blob): void;
}
import { EventTarget as EventsEventTarget } from "../events/eventhandler.js";
import { Error as FsError } from "./error.js";
import { Deferred } from "../mochikit/async/deferred.js";
export { fs_FileReader as FileReader };
