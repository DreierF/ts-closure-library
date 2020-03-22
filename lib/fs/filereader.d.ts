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
     * The underlying FileReader object.
     *
     * @type {!FileReader}
     * @private
     */
    reader_: FileReader;
    /**
     * Abort the reading of the file.
     */
    abort(): void;
    /**
     * @return {?ReadyState} The current state of the FileReader.
     */
    getReadyState(): number | null;
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
    dispatchProgressEvent_(event: ProgressEvent<EventTarget>): void;
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
    actualEventTarget_: fs_FileReader;
}
declare namespace fs_FileReader { }
import { EventTarget as EventsEventTarget } from "../events/eventhandler.js";
import { Error as FsError } from "./error.js";
export { fs_FileReader as FileReader };
