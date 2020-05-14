/**
 * The detail of calling the stop callback for a trace.
 * @interface
 */
export function StopTraceDetail(): void;
export class StopTraceDetail {
    /**
     * The trace should be stopped since it has been cancelled. Note that this
     * field is optional so, not-specifying it is like setting it to false.
     * @type {boolean|undefined}
     */
    wasCancelled: boolean | undefined;
}
/**
 * Singleton trace object
 * @type {?Trace_}
 */
export let Trace: Trace_ | null;
/**
 * @fileoverview Definition of the Tracer class and associated classes.
 *
 * @see ../demos/tracer.html
 * @suppress {strictMissingProperties}
 */
/**
 * Class used for singleton Trace.  Used for timing slow points in
 * the code. Based on the java Tracer class but optimized for javascript.
 * See com.google.common.tracing.Tracer.
 * It is also possible to bridge from this class to other tracer classes via
 * adding listeners.
 * @private
 * @suppress {checkTypes}
 */
declare class Trace_ {
    /**
     * Converts 'v' to a string and pads it with up to 3 spaces for
     * improved alignment. TODO there must be a better way
     * @param {number} v A number.
     * @return {string} A padded string.
     * @private
     */
    private static longToPaddedString_;
    /**
     * Return the sec.ms part of time (if time = "20:06:11.566",  "11.566
     * @param {number} time The time in MS.
     * @return {string} A formatted string as sec.ms'.
     * @private
     */
    private static formatTime_;
    /**
     * Returns the current time. Done through a wrapper function so it can be
     * overridden by application code. Gmail has an ActiveX extension that provides
     * higher precision timing info.
     * @return {number} The current time in milliseconds.
     */
    static now(): number;
    /**
     * Logger for the tracer
     * @private @const {?LogLogger}
     */
    private logger_;
    /**
     * Events in order.
     * @private {!Array<!Event_>}
     */
    private events_;
    /**
     * Outstanding events that have started but haven't yet ended. The keys are
     * numeric ids and the values are Event_ objects.
     * @private {!StructsMap<number, !Event_>}
     */
    private outstandingEvents_;
    /**
     * Start time of the event trace
     * @private {number}
     */
    private startTime_;
    /**
     * Cummulative overhead of calls to startTracer
     * @private {number}
     */
    private tracerOverheadStart_;
    /**
     * Cummulative overhead of calls to endTracer
     * @private {number}
     */
    private tracerOverheadEnd_;
    /**
     * Cummulative overhead of calls to addComment
     * @private {number}
     */
    private tracerOverheadComment_;
    /**
     * Keeps stats on different types of tracers. The keys are strings and the
     * values are goog.debug.Stat
     * @private {!StructsMap}
     */
    private stats_;
    /**
     * Total number of traces created in the trace.
     * @private {number}
     */
    private tracerCount_;
    /**
     * Total number of comments created in the trace.
     * @private {number}
     */
    private commentCount_;
    /**
     * Next id to use for the trace.
     * @private {number}
     */
    private nextId_;
    /**
     * @private
     * @type {?Object}
     */
    private gcTracer_;
    /**
     * A pool for Event_ objects so we don't keep creating and
     * garbage collecting these (which is very expensive in IE6).
     * @private {!SimplePool}
     */
    private eventPool_;
    /**
     * A pool for Trace_.Stat_ objects so we don't keep creating and
     * garbage collecting these (which is very expensive in IE6).
     * @private {!SimplePool}
     */
    private statPool_;
    /** @private {!SimplePool<number>} */
    private idPool_;
    /**
     * Default threshold below which a tracer shouldn't be reported
     * @private {number}
     */
    private defaultThreshold_;
    /**
     * An object containing three callback functions to be called when starting or
     * stopping a trace, or creating a comment trace.
     * @private {!TracerCallbacks}
     */
    private traceCallbacks_;
    /**
     * Removes all registered callback functions. Mainly used for testing.
     */
    removeAllListeners(): void;
    /**
     * Adds up to three callback functions which are called on `startTracer`,
     * `stopTracer`, `clearOutstandingEvents_` and `addComment` in
     * order to bridge from the Closure tracer singleton object to any tracer class.
     * @param {!TracerCallbacks} callbacks An object literal
     *   containing the callback functions.
     */
    addTraceCallbacks(callbacks: typeof TracerCallbacks): void;
    /**
     * Add the ability to explicitly set the start time. This is useful for example
     * for measuring initial load time where you can set a variable as soon as the
     * main page of the app is loaded and then later call this function when the
     * Tracer code has been loaded.
     * @param {number} startTime The start time to set.
     */
    setStartTime(startTime: number): void;
    /**
     * Initializes and resets the current trace
     * @param {number} defaultThreshold The default threshold below which the
     * tracer output will be suppressed. Can be overridden on a per-Tracer basis.
     */
    initCurrentTrace(defaultThreshold: number): void;
    /**
     * Clears the current trace
     */
    clearCurrentTrace(): void;
    /**
     * Clears the open traces and calls stop callback for them.
     * @private
     */
    private clearOutstandingEvents_;
    /**
     * Resets the trace.
     * @param {number} defaultThreshold The default threshold below which the
     * tracer output will be suppressed. Can be overridden on a per-Tracer basis.
     */
    reset(defaultThreshold: number): void;
    /**
     * @private
     */
    private releaseEvents_;
    /**
     * Starts a tracer
     * @param {string} comment A comment used to identify the tracer. Does not
     *     need to be unique.
     * @param {string=} opt_type Type used to identify the tracer. If a Trace is
     *     given a type (the first argument to the constructor) and multiple Traces
     *     are done on that type then a "TOTAL line will be produced showing the
     *     total number of traces and the sum of the time
     *     ("TOTAL Database 2 (37 ms)" in our example). These traces should be
     *     mutually exclusive or else the sum won't make sense (the time will
     *     be double counted if the second starts before the first ends).
     * @return {number} The identifier for the tracer that should be passed to the
     *     the stopTracer method.
     */
    startTracer(comment: string, opt_type?: string | undefined): number;
    /**
     * Stops a tracer
     * @param {number|undefined|null} id The id of the tracer that is ending.
     * @param {number=} opt_silenceThreshold Threshold below which the tracer is
     *    silenced.
     * @return {?number} The elapsed time for the tracer or null if the tracer
     *    identitifer was not recognized.
     */
    stopTracer(id: number | undefined | null, opt_silenceThreshold?: number | undefined): number | null;
    /**
     * Sets the ActiveX object that can be used to get GC tracing in IE6.
     * @param {?Object} gcTracer GCTracer ActiveX object.
     */
    setGcTracer(gcTracer: any | null): void;
    /**
     * Returns the total number of allocations since the GC stats were reset. Only
     * works in IE.
     * @return {number} The number of allocaitons or -1 if not supported.
     */
    getTotalVarAlloc(): number;
    /**
     * Adds a comment to the trace. Makes it possible to see when a specific event
     * happened in relation to the traces.
     * @param {string} comment A comment that is inserted into the trace.
     * @param {?string=} opt_type Type used to identify the tracer. If a comment is
     *     given a type and multiple comments are done on that type then a "TOTAL
     *     line will be produced showing the total number of comments of that type.
     * @param {?number=} opt_timeStamp The timestamp to insert the comment. If not
     *    specified, the current time wil be used.
     */
    addComment(comment: string, opt_type?: (string | null) | undefined, opt_timeStamp?: (number | null) | undefined): void;
    /**
     * Gets a stat object for a particular type. The stat object is created if it
     * hasn't yet been.
     * @param {string} type The type of stat.
     * @return {Trace_.Stat_} The stat object.
     * @private
     */
    private getStat_;
    /**
     * Returns a formatted string for the current trace
     * @return {string} A formatted string that shows the timings of the current
     *     trace.
     */
    getFormattedTrace(): string;
    /**
     * Returns a formatted string that describes the thread trace.
     * @return {string} A formatted string.
     * @override
     */
    toString(): string;
    /**
     * Maximum size of the trace before we discard events
     * @type {number}
     */
    MAX_TRACE_SIZE: number;
}
declare namespace Trace_ {
    export namespace EventType {
        export const START: number;
        export const STOP: number;
        export const COMMENT: number;
    }
    /**
     * Event type supported by tracer
     */
    export type EventType = number;
    export { Stat_ };
    export const NORMAL_STOP_: {};
}
declare namespace TracerCallbacks {
    export function sequence_(fn1: Function | undefined, fn2: Function | undefined): Function | undefined;
}
declare class Stat_ {
    /**
     * @type {string|null|undefined}
     */
    type: string | null | undefined;
    /**
     * Number of tracers
     * @type {number}
     */
    count: number;
    /**
     * Cumulative time of traces
     * @type {number}
     */
    time: number;
    /**
     * Total number of allocations for this tracer type
     * @type {number}
     */
    varAlloc: number;
    /**
     * @return {string} A string describing the tracer stat.
     * @override
     */
    toString(): string;
}
export {};
