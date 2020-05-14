/**
 * @type {boolean} Whether to enable log sequence numbers.
 */
export const ENABLE_SEQUENCE_NUMBERS: boolean;
/**
 * @fileoverview Definition of the LogRecord class. Please minimize
 * dependencies this file has on other closure classes as any dependency it
 * takes won't be able to use the logging infrastructure.
 */
/**
 * LogRecord objects are used to pass logging requests between
 * the logging framework and individual log Handlers.
 *     If 0, we use #goog.now.
 *     should only be passed in when restoring a log record from persistence.
 */
declare class debug_LogRecord {
    /**
     * LogRecord objects are used to pass logging requests between
     * the logging framework and individual log Handlers.
     * @param {?Logger_Level} level One of the level identifiers.
     * @param {string} msg The string message.
     * @param {string} loggerName The name of the source logger.
     * @param {number=} opt_time Time this log record was created if other than now.
     *     If 0, we use #goog.now.
     * @param {number=} opt_sequenceNumber Sequence number of this log record. This
     *     should only be passed in when restoring a log record from persistence.
     */
    constructor(level: Logger_Level | null, msg: string, loggerName: string, opt_time?: number | undefined, opt_sequenceNumber?: number | undefined);
    /**
     * Time the LogRecord was created.
     * @type {number}
     * @private
     */
    private time_;
    /**
     * Level of the LogRecord
     * @type {?Logger_Level}
     * @private
     */
    private level_;
    /**
     * Message associated with the record
     * @type {string}
     * @private
     */
    private msg_;
    /**
     * Name of the logger that created the record.
     * @type {string}
     * @private
     */
    private loggerName_;
    /**
     * Sequence number for the LogRecord. Each record has a unique sequence number
     * that is greater than all log records created before it.
     * @type {number}
     * @private
     */
    private sequenceNumber_;
    /**
     * Exception associated with the record
     * @type {?Object}
     * @private
     */
    private exception_;
    /**
     * Sets all fields of the log record.
     * @param {?Logger_Level} level One of the level identifiers.
     * @param {string} msg The string message.
     * @param {string} loggerName The name of the source logger.
     * @param {number=} opt_time Time this log record was created if other than now.
     *     If 0, we use #goog.now.
     * @param {number=} opt_sequenceNumber Sequence number of this log record. This
     *     should only be passed in when restoring a log record from persistence.
     */
    reset(level: Logger_Level | null, msg: string, loggerName: string, opt_time?: number | undefined, opt_sequenceNumber?: number | undefined): void;
    /**
     * Get the source Logger's name.
     *
     * @return {string} source logger name (may be null).
     */
    getLoggerName(): string;
    /**
     * Get the exception that is part of the log record.
     *
     * @return {?Object} the exception.
     */
    getException(): any | null;
    /**
     * Set the exception that is part of the log record.
     *
     * @param {?Object} exception the exception.
     */
    setException(exception: any | null): void;
    /**
     * Get the source Logger's name.
     *
     * @param {string} loggerName source logger name (may be null).
     */
    setLoggerName(loggerName: string): void;
    /**
     * Get the logging message level, for example Level.SEVERE.
     * @return {?Logger_Level} the logging message level.
     */
    getLevel(): Logger_Level | null;
    /**
     * Set the logging message level, for example Level.SEVERE.
     * @param {?Logger_Level} level the logging message level.
     */
    setLevel(level: Logger_Level | null): void;
    /**
     * Get the "raw" log message, before localization or formatting.
     *
     * @return {string} the raw message string.
     */
    getMessage(): string;
    /**
     * Set the "raw" log message, before localization or formatting.
     *
     * @param {string} msg the raw message string.
     */
    setMessage(msg: string): void;
    /**
     * Get event time in milliseconds since 1970.
     *
     * @return {number} event time in millis since 1970.
     */
    getMillis(): number;
    /**
     * Set event time in milliseconds since 1970.
     *
     * @param {number} time event time in millis since 1970.
     */
    setMillis(time: number): void;
    /**
     * Get the sequence number.
     * <p>
     * Sequence numbers are normally assigned in the LogRecord
     * constructor, which assigns unique sequence numbers to
     * each new LogRecord in increasing order.
     * @return {number} the sequence number.
     */
    getSequenceNumber(): number;
}
declare namespace debug_LogRecord {
    export const nextSequenceNumber_: number;
}
import { Level as Logger_Level } from "./logger.js";
export { debug_LogRecord as LogRecord };
