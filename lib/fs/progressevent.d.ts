export { fs_ProgressEvent as ProgressEvent };
/**
 * @fileoverview A wrapper for the HTML5 File ProgressEvent objects.
 */
/**
 * A wrapper for the progress events emitted by the File APIs.
 *
 * @extends {EventsEvent}
 * @final
 */
declare class fs_ProgressEvent extends EventsEvent {
    /**
     * A wrapper for the progress events emitted by the File APIs.
     *
     * @param {!ProgressEvent} event The underlying event object.
     * @param {!Object} target The file access object emitting the event.
     */
    constructor(event: ProgressEvent, target: any);
    /**
     * The underlying event object.
     * @type {!ProgressEvent}
     * @private
     */
    private event_;
    /**
     * @return {boolean} Whether or not the total size of the of the file being
     *     saved is known.
     */
    isLengthComputable(): boolean;
    /**
     * @return {number} The number of bytes saved so far.
     */
    getLoaded(): number;
    /**
     * @return {number} The total number of bytes in the file being saved.
     */
    getTotal(): number;
}
import { Event as EventsEvent } from "../events/event.js";
