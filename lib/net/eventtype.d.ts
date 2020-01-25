/**
 * Event names for network events
 */
export type EventType = string;
export namespace EventType {
    export const COMPLETE: string;
    export const SUCCESS: string;
    export const ERROR: string;
    export const ABORT: string;
    export const READY: string;
    export const READY_STATE_CHANGE: string;
    export const TIMEOUT: string;
    export const INCREMENTAL_DATA: string;
    export const PROGRESS: string;
    export const DOWNLOAD_PROGRESS: string;
    export const UPLOAD_PROGRESS: string;
}
