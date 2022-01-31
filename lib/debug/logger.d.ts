/**
 * @type {boolean} Toggles whether loggers other than the root logger can have
 *     log handlers attached to them and whether they can have their log level
 *     set. Logging is a bit faster when this is set to false.
 */
export const ENABLE_HIERARCHY: boolean;
/**
 * @type {boolean} Toggles whether active log statements are also recorded
 *     to the profiler.
 */
export const ENABLE_PROFILER_LOGGING: boolean;
/**
 * @constructor
 * @final
 */
export let Level: typeof googlog.Level;
export namespace LogManager {
    const loggers_: {
        [x: string]: debug_Logger;
    };
    const rootLogger_: debug_Logger | null;
    function initialize(): void;
    function getLoggers(): {
        [x: string]: debug_Logger;
    };
    function getRoot(): debug_Logger;
    function getLogger(name: string): debug_Logger;
    function createFunctionForCatchErrors(opt_logger?: googlog.Logger | null | undefined): (arg0: any) => any;
    function createLogger_(name: string): debug_Logger;
}
/**
 * A message value that can be handled by a Logger.
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
 * @fileoverview Definition of the Logger class. Please minimize dependencies
 * this file has on other closure classes as any dependency it takes won't be
 * able to use the logging infrastructure.
 *
 * @see ../demos/debug.html
 */
/**
 * A message value that can be handled by a Logger.
 *
 * Functions are treated like callbacks, but are only called when the event's
 * log level is enabled. This is useful for logging messages that are expensive
 * to construct.
 *
 * @typedef {string|function(): string}
 */
export let Loggable: any;
/**
 * The Logger is an object used for logging debug messages. Loggers are
 * normally named, using a hierarchical dot-separated namespace. Logger names
 * can be arbitrary strings, but they should normally be based on the package
 * name or class name of the logged component, such as goog.net.BrowserChannel.
 *
 * The Logger object is loosely based on the java class
 * java.util.logging.Logger. It supports different levels of filtering for
 * different loggers.
 *
 * @implements {LogLogger}
 * @final
 */
declare class debug_Logger implements googlog.Logger {
    /**
     * Construct a new Logger.
     *
     * Users should not construct their own instances of debug_Logger. They
     * should always use the {@link LogLogger.getLogger} function.
     *
     * @param {string} name The name of the Logger.
     */
    constructor(name: string);
    /**
     * @type {string}
     * @private
     */
    private name_;
    /**
     * @return {string}
     * @override
     */
    getName(): string;
    /**
     * Adds a handler to the logger. This doesn't use the event system because
     * we want to be able to add logging to the event system.
     * @param {?Function} handler Handler function to add.
     */
    addHandler(handler: Function | null): void;
    /**
     * Removes a handler from the logger. This doesn't use the event system
     * because we want to be able to add logging to the event system.
     * @param {?Function} handler Handler function to remove.
     * @return {boolean} Whether the handler was removed.
     */
    removeHandler(handler: Function | null): boolean;
    /**
     * Set the log level specifying which message levels will be logged by this
     * logger. Message levels lower than this value will be discarded.
     * The level value Level.OFF can be used to turn off logging. If the new level
     * is null, it means that this node should inherit its level from its nearest
     * ancestor with a specific (non-null) level value.
     *
     * @param {!LogLevel|null} level The new level.
     */
    setLevel(level: LogLevel | null): void;
    /**
     * Gets the log level specifying which message levels will be logged by this
     * logger. Message levels lower than this value will be discarded.
     * The level value Level.OFF can be used to turn off logging. If the level
     * is null, it means that this node should inherit its level from its nearest
     * ancestor with a specific (non-null) level value.
     *
     * @return {!LogLevel|null} The level.
     */
    getLevel(): LogLevel | null;
    /**
     * Returns the effective level of the logger based on its ancestors' levels.
     * @return {!LogLevel} The level.
     */
    getEffectiveLevel(): LogLevel;
    /**
     * Checks if a message of the given level would actually be logged by this
     * logger. This check is based on the Loggers effective level, which may be
     * inherited from its parent.
     * @param {!LogLevel} level The level to check.
     * @return {boolean} Whether the message would be logged.
     */
    isLoggable(level: LogLevel): boolean;
    /**
     * Logs a message. If the logger is currently enabled for the
     * given message level then the given message is forwarded to all the
     * registered output Handler objects.
     * @param {!LogLevel} level One of the level identifiers.
     * @param {?Loggable} msg The message to log.
     * @param {Error|Object=} opt_exception An exception associated with the
     *     message.
     */
    log(level: LogLevel, msg: Loggable | null, opt_exception?: (Error | any) | undefined): void;
    /**
     * Creates a new log record and adds the exception (if present) to it.
     * @param {!LogLevel} level One of the level identifiers.
     * @param {string} msg The string message.
     * @param {Error|Object=} opt_exception An exception associated with the
     *     message.
     * @return {!LogLogRecord} A log record.
     */
    getLogRecord(level: LogLevel, msg: string, opt_exception?: (Error | any) | undefined): LogLogRecord;
    /**
     * Logs a message at the Logger.Level.SHOUT level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    shout(msg: Loggable | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.SEVERE level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    severe(msg: Loggable | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.WARNING level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    warning(msg: Loggable | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.INFO level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    info(msg: Loggable | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.CONFIG level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    config(msg: Loggable | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.FINE level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    fine(msg: Loggable | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.FINER level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    finer(msg: Loggable | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.FINEST level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    finest(msg: Loggable | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a LogRecord. If the logger is currently enabled for the
     * given message level then the given message is forwarded to all the
     * registered output Handler objects.
     * @param {!LogLogRecord} logRecord A log record to log.
     */
    logRecord(logRecord: LogLogRecord): void;
}
declare namespace debug_Logger {
    const ROOT_LOGGER_NAME: string;
    function getLogger(name: string): debug_Logger;
    function logToProfilers(msg: string): void;
}
import * as googlog from "../log/log.js";
import { Level as LogLevel } from "../log/log.js";
import { LogRecord as LogLogRecord } from "../log/log.js";
export { debug_Logger as Logger };
