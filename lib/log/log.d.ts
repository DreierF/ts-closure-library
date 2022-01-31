/**
 * @type {number} The number of log records to buffer. 0 means disable
 * buffering.
 */
export const CAPACITY: number;
/** @type {boolean} Whether logging is enabled. */
export const ENABLED: boolean;
/**
 * The Level class defines a set of standard logging levels that
 * can be used to control logging output.  The logging Level objects
 * are ordered and are specified by ordered integers.  Enabling logging
 * at a given level also enables logging at all higher levels.
 * <p>
 * Clients should normally use the predefined Level constants such
 * as Level.SEVERE.
 * <p>
 * The levels in descending order are:
 * <ul>
 * <li>SEVERE (highest value)
 * <li>WARNING
 * <li>INFO
 * <li>CONFIG
 * <li>FINE
 * <li>FINER
 * <li>FINEST  (lowest value)
 * </ul>
 * In addition there is a level OFF that can be used to turn
 * off logging, and a level ALL that can be used to enable
 * logging of all messages.
 *
 * @final
 */
export class Level {
    /**
     * @param {string} name The name of the level.
     * @param {number} value The numeric value of the level.
     */
    constructor(name: string, value: number);
    /**
     * The name of the level
     * @type {string}
     * @const
     */
    name: string;
    /**
     * The numeric value of the level
     * @type {number}
     */
    value: number;
    /**
     * @return {string} String representation of the logger level.
     * @override
     */
    toString(): string;
}
export namespace Level {
    const OFF: Level;
    const SHOUT: Level;
    const SEVERE: Level;
    const WARNING: Level;
    const INFO: Level;
    const CONFIG: Level;
    const FINE: Level;
    const FINER: Level;
    const FINEST: Level;
    const ALL: Level;
    const PREDEFINED_LEVELS: Array<Level>;
    const predefinedLevelsCache_: any | null;
    function createPredefinedLevelsCache_(): void;
    function getPredefinedLevel(name: string): Level | null;
    function getPredefinedLevelByValue(value: number): Level | null;
}
/**
 * A buffer for log records. The purpose of this is to improve
 * logging performance by re-using old objects when the buffer becomes full and
 * to eliminate the need for each app to implement their own log buffer. The
 * disadvantage to doing this is that log handlers cannot maintain references to
 * log records and expect that they are not overwriten at a later point.
 * @final
 */
export class LogBuffer {
    /**
     * @param {number=} capacity The capacity of this LogBuffer instance.
     */
    constructor(capacity?: number | undefined);
    /**
     * The buffer's capacity.
     * @type {number}
     * @private
     */
    private capacity_;
    /**
     * The array to store the records.
     * @type {!Array<!log_LogRecord|undefined>}
     * @private
     */
    private buffer_;
    /**
     * The index of the most recently added record, or -1 if there are no
     * records.
     * @type {number}
     * @private
     */
    private curIndex_;
    /**
     * Whether the buffer is at capacity.
     * @type {boolean}
     * @private
     */
    private isFull_;
    /**
     * Adds a log record to the buffer, possibly overwriting the oldest record.
     * @param {!Level} level One of the level identifiers.
     * @param {string} msg The string message.
     * @param {string} loggerName The name of the source logger.
     * @return {!log_LogRecord} The log record.
     */
    addRecord(level: Level, msg: string, loggerName: string): log_LogRecord;
    /**
     * Calls the given function for each buffered log record, starting with the
     * oldest one.
     * TODO(user): Make this a [Symbol.iterator] once all usages of
     * debug.LogBuffer can be deleted.
     * @param {!LogRecordHandler} func The function to call.
     */
    forEachRecord(func: LogRecordHandler): void;
    /**
     * @return {boolean} Whether the log buffer is enabled.
     */
    isBufferingEnabled(): boolean;
    /**
     * @return {boolean} Return whether the log buffer is full.
     */
    isFull(): boolean;
    /**
     * Removes all buffered log records.
     */
    clear(): void;
}
export namespace LogBuffer {
    const instance_: LogBuffer | undefined;
    function getInstance(): LogBuffer;
    function isBufferingEnabled(): boolean;
}
/**
 * A type that describes a function that handles logs.
 */
export type LogRecordHandler = (arg0: log_LogRecord) => unknown;
/**
 * A type that describes a function that handles logs.
 * @typedef {function(!log_LogRecord): ?}
 */
export let LogRecordHandler: any;
/**
 * A LogRegistry owns references to all loggers, and is responsible for storing
 * all the internal state needed for loggers to operate correctly.
 *
 * @package
 * @final
 */
export class LogRegistry {
    /**
     * Per-log information retained by this LogRegistry.
     * @type {!Object<string, !LogRegistryEntry>}
     */
    entries: {
        [x: string]: LogRegistryEntry;
    };
    /**
     * Gets the LogRegistry entry under the given name, creating the entry if one
     * doesn't already exist.
     * @param {string} name The name to look up.
     * @param {?Level=} level If provided, override the default logging
     *     level of the returned Logger with the provided level.
     * @return {!LogRegistryEntry}
     */
    getLogRegistryEntry(name: string, level?: (Level | null) | undefined): LogRegistryEntry;
    /**
     * Get a list of all loggers.
     * @return {!Array<!log_Logger>}
     */
    getAllLoggers(): Array<log_Logger>;
}
export namespace LogRegistry {
    export function getInstance(): LogRegistry;
    const instance__1: LogRegistry | undefined;
    export { instance__1 as instance_ };
}
/**
 * A LogRegistryEntry contains data about a Logger.
 * @package
 * @final
 */
export class LogRegistryEntry {
    /**
     * @param {string} name
     * @param {!LogRegistryEntry|null=} parent
     */
    constructor(name: string, parent?: (LogRegistryEntry | null) | undefined);
    /**
     * The minimum log level that a message must be for it to be logged by the
     * Logger corresponding to this LogRegistryEntry. If null, the parent's
     * log level is used instead.
     * @type {?Level}
     */
    level: Level | null;
    /**
     * A list of functions that will be called when the Logger corresponding to
     * this LogRegistryEntry is used to log a message.
     * @type {!Array<!LogRecordHandler>}
     */
    handlers: Array<LogRecordHandler>;
    /**
     * A reference to LogRegistryEntry objects that correspond to the direct
     * ancestor of the Logger represented by this LogRegistryEntry object
     * (via name, treated as a dot-separated namespace).
     * @type {!LogRegistryEntry|null}
     */
    parent: LogRegistryEntry | null;
    /**
     * A list of references to LogRegistryEntry objects that correspond to the
     * direct descendants of the Logger represented by this LogRegistryEntry
     * object (via name, treated as a dot-separated namespace).
     * @type {!Array<!LogRegistryEntry>}
     */
    children: Array<LogRegistryEntry>;
    /**
     * A reference to the Logger itself.
     * @type {!log_Logger}
     */
    logger: log_Logger;
    /**
     * Returns the effective level of the logger based on its ancestors' levels.
     * @return {!Level} The level.
     */
    getEffectiveLevel(): Level;
    /**
     * Calls the log handlers associated with this Logger, followed by those of
     * its parents, etc. until the root Logger's associated log handlers are
     * called.
     * @param {!log_LogRecord} logRecord The log record to pass to each
     *     handler.
     */
    publish(logRecord: log_LogRecord): void;
}
/**
 * A message value that can be handled by a log_Logger.
 *
 * Functions are treated like callbacks, but are only called when the event's
 * log level is enabled. This is useful for logging messages that are expensive
 * to construct.
 */
export type Loggable = string | (() => string);
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Basic strippable logging definitions.
 * @see http://go/closurelogging
 */
/**
 * A message value that can be handled by a log_Logger.
 *
 * Functions are treated like callbacks, but are only called when the event's
 * log level is enabled. This is useful for logging messages that are expensive
 * to construct.
 *
 * @typedef {string|function(): string}
 */
export let Loggable: any;
/** @const */
export let ROOT_LOGGER_NAME: string;
/**
 * Adds a handler to the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 * @param {?log_Logger} logger
 * @param {!LogRecordHandler} handler Handler function to
 *     add.
 */
export function addHandler(logger: log_Logger | null, handler: LogRecordHandler): void;
/**
 * Logs a message at the Level.SEVERE level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {?log_Logger} logger
 * @param {!Loggable} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 */
export function error(logger: log_Logger | null, msg: Loggable, exception?: ((Error | (any | null)) | null) | undefined): void;
/**
 * Logs a message at the Level.FINE level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {?log_Logger} logger
 * @param {!Loggable} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 */
export function fine(logger: log_Logger | null, msg: Loggable, exception?: ((Error | (any | null)) | null) | undefined): void;
/**
 * Gets a list of all loggers.
 * @return {!Array<!log_Logger>}
 */
export function getAllLoggers(): Array<log_Logger>;
/**
 * Returns the effective level of the logger based on its ancestors' levels.
 * @param {?log_Logger} logger
 * @return {!Level} The level.
 */
export function getEffectiveLevel(logger: log_Logger | null): Level;
/**
 * Gets the log level specifying which message levels will be logged by this
 * logger. Message levels lower than this value will be discarded.
 * The level value Level.OFF can be used to turn off logging. If the
 * level is null, it means that this node should inherit its level from its
 * nearest ancestor with a specific (non-null) level value.
 *
 * @param {?log_Logger} logger
 * @return {!Level|null} The level.
 */
export function getLevel(logger: log_Logger | null): Level | null;
/**
 * Creates a log record. If the logger is currently enabled for the
 * given message level then the given message is forwarded to all the
 * registered output Handler objects.
 * TODO(user): Delete this method from the public API.
 * @param {?log_Logger} logger
 * @param {?Level} level One of the level identifiers.
 * @param {string} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 * @return {!log_LogRecord}
 */
export function getLogRecord(logger: log_Logger | null, level: Level | null, msg: string, exception?: ((Error | (any | null)) | null) | undefined): log_LogRecord;
/**
 * Finds or creates a logger for a named subsystem. If a logger has already been
 * created with the given name it is returned. Otherwise, a new logger is
 * created. If a new logger is created, it will be configured to send logging
 * output to its parent's handlers.
 *
 * @param {string} name A name for the logger. This should be a dot-separated
 *     name and should normally be based on the package name or class name of
 *     the subsystem, such as goog.net.BrowserChannel.
 * @param {?Level=} level If provided, override the default logging
 *     level with the provided level. This parameter is deprecated; prefer using
 *     setLevel to set the logger's level instead.
 *     TODO(user): Delete this parameter.
 * @return {!log_Logger|null} The named logger, or null if logging is
 *     disabled.
 */
export function getLogger(name: string, level?: (Level | null) | undefined): log_Logger | null;
/**
 * Returns the root logger.
 *
 * @return {!log_Logger|null} The root logger, or null if logging is
 *     disabled.
 */
export function getRootLogger(): log_Logger | null;
/**
 * Logs a message at the Level.INFO level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {?log_Logger} logger
 * @param {!Loggable} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 */
export function info(logger: log_Logger | null, msg: Loggable, exception?: ((Error | (any | null)) | null) | undefined): void;
/**
 * Checks if a message of the given level would actually be logged by this
 * logger. This check is based on the goog.log.Loggers effective level, which
 * may be inherited from its parent.
 * @param {?log_Logger} logger
 * @param {?Level} level The level to check.
 * @return {boolean} Whether the message would be logged.
 */
export function isLoggable(logger: log_Logger | null, level: Level | null): boolean;
/**
 * Logs a message. If the logger is currently enabled for the
 * given message level then the given message is forwarded to all the
 * registered output Handler objects.
 * TODO(user): The level parameter should be made required.
 * @param {?log_Logger} logger
 * @param {?Level} level One of the level identifiers.
 * @param {!Loggable} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 */
export function log(logger: log_Logger | null, level: Level | null, msg: Loggable, exception?: ((Error | (any | null)) | null) | undefined): void;
/**
 * LogRecord objects are used to pass logging requests between the logging
 * framework and individual log handlers. These objects should not be
 * constructed or reset by application code.
 */
declare class log_LogRecord {
    /**
     * @param {?Level} level One of the level identifiers.
     * @param {string} msg The string message.
     * @param {string} loggerName The name of the source logger.
     * @param {number=} time Time this log record was created if other than
     *     now. If 0, we use #goog.now.
     * @param {number=} sequenceNumber Sequence number of this log record.
     *     This should only be passed in when restoring a log record from
     *     persistence.
     */
    constructor(level: Level | null, msg: string, loggerName: string, time?: number | undefined, sequenceNumber?: number | undefined);
    /**
     * Level of the LogRecord.
     * @type {!Level}
     * @private
     */
    private level_;
    /**
     * Name of the logger that created the record.
     * @type {string}
     * @private
     */
    private loggerName_;
    /**
     * Message associated with the record
     * @type {string}
     * @private
     */
    private msg_;
    /**
     * Time the LogRecord was created.
     * @type {number}
     * @private
     */
    private time_;
    /**
     * Sequence number for the LogRecord. Each record has a unique sequence
     * number that is greater than all log records created before it.
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
     * @param {!Level} level One of the level identifiers.
     * @param {string} msg The string message.
     * @param {string} loggerName The name of the source logger.
     * @param {number=} time Time this log record was created if other than
     *     now. If 0, we use #goog.now.
     * @param {number=} sequenceNumber Sequence number of this log record.
     *     This should only be passed in when restoring a log record from
     *     persistence.
     */
    reset(level: Level, msg: string, loggerName: string, time?: number | undefined, sequenceNumber?: number | undefined): void;
    /**
     * Gets the source Logger's name.
     *
     * @return {string} source logger name (may be null).
     */
    getLoggerName(): string;
    /**
     * Sets the source Logger's name.
     *
     * @param {string} name The logger name.
     */
    setLoggerName(name: string): void;
    /**
     * Gets the exception that is part of the log record.
     *
     * @return {?Object} the exception.
     */
    getException(): any | null;
    /**
     * Sets the exception that is part of the log record.
     * @param {?Object} exception the exception.
     */
    setException(exception: any | null): void;
    /**
     * Gets the logging message level, for example Level.SEVERE.
     * @return {!Level} the logging message level.
     */
    getLevel(): Level;
    /**
     * Sets the logging message level, for example Level.SEVERE.
     * @param {!Level} level the logging message level.
     */
    setLevel(level: Level): void;
    /**
     * Gets the "raw" log message, before localization or formatting.
     * @return {string} the raw message string.
     */
    getMessage(): string;
    /**
     * Sets the "raw" log message, before localization or formatting.
     *
     * @param {string} msg the raw message string.
     */
    setMessage(msg: string): void;
    /**
     * Gets event time in milliseconds since 1970.
     * @return {number} event time in millis since 1970.
     */
    getMillis(): number;
    /**
     * Sets event time in milliseconds since 1970.
     * @param {number} time event time in millis since 1970.
     */
    setMillis(time: number): void;
    /**
     * Gets the sequence number. Sequence numbers are normally assigned when a
     * LogRecord is constructed or reset in incrementally increasing order.
     * @return {number}
     */
    getSequenceNumber(): number;
}
declare namespace log_LogRecord {
    const nextSequenceNumber_: number;
}
/** @interface */
declare class log_Logger {
    /**
     * Gets the name of the Logger.
     * @return {string}
     * @public
     */
    public getName(): string;
}
declare namespace log_Logger {
    export { Level };
}
/**
 * Logs a log_LogRecord. If the logger is currently enabled for the
 * given message level then the given message is forwarded to all the
 * registered output Handler objects.
 * TODO(user): Delete this method from the public API.
 * @param {?log_Logger} logger
 * @param {!log_LogRecord} logRecord A log record to log.
 */
export function publishLogRecord(logger: log_Logger | null, logRecord: log_LogRecord): void;
/**
 * Removes a handler from the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 * @param {?log_Logger} logger
 * @param {!LogRecordHandler} handler Handler function to
 *     remove.
 * @return {boolean} Whether the handler was removed.
 */
export function removeHandler(logger: log_Logger | null, handler: LogRecordHandler): boolean;
/**
 * Set the log level specifying which message levels will be logged by this
 * logger. Message levels lower than this value will be discarded.
 * The level value Level.OFF can be used to turn off logging. If the
 * new level is null, it means that this node should inherit its level from its
 * nearest ancestor with a specific (non-null) level value.
 *
 * @param {?log_Logger} logger
 * @param {!Level|null} level The new level.
 */
export function setLevel(logger: log_Logger | null, level: Level | null): void;
/**
 * Logs a message at the Level.WARNING level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {?log_Logger} logger
 * @param {!Loggable} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 */
export function warning(logger: log_Logger | null, msg: Loggable, exception?: ((Error | (any | null)) | null) | undefined): void;
export { log_LogRecord as LogRecord, log_Logger as Logger };
