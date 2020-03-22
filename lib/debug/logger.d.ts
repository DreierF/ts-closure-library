/**
 * A message value that can be handled by a Logger.
 *
 * Functions are treated like callbacks, but are only called when the event's
 * log level is enabled. This is useful for logging messages that are expensive
 * to construct.
 */
export type Loggable = string | (() => string);
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
     * @param {string} name The name of the level.
     * @param {number} value The numeric value of the level.
     */
    constructor(name: string, value: number);
    /**
     * The name of the level
     * @type {string}
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
    export const OFF: Level;
    export const SHOUT: Level;
    export const SEVERE: Level;
    export const WARNING: Level;
    export const INFO: Level;
    export const CONFIG: Level;
    export const FINE: Level;
    export const FINER: Level;
    export const FINEST: Level;
    export const ALL: Level;
    export const PREDEFINED_LEVELS: Array<Level>;
    export const predefinedLevelsCache_: Object | null;
}
export namespace LogManager {
    export const loggers_: {
        [x: string]: debug_Logger;
    };
    export const rootLogger_: debug_Logger | null;
}
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
 * The logger object should never be instantiated by application code. It
 * should always use the debug_Logger.getLogger function.
 *
 * @final
 */
declare class debug_Logger {
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
     * The logger object should never be instantiated by application code. It
     * should always use the debug_Logger.getLogger function.
     *
     * @param {string} name The name of the Logger.
     */
    constructor(name: string);
    /**
     * Name of the Logger. Generally a dot-separated namespace
     * @private {string}
     */
    name_: string;
    /**
     * Parent Logger.
     * @private {?debug_Logger}
     */
    parent_: debug_Logger | null;
    /**
     * Level that this logger only filters above. Null indicates it should
     * inherit from the parent.
     * @private {?Level}
     */
    level_: Level | null;
    /**
     * Map of children loggers. The keys are the leaf names of the children and
     * the values are the child loggers.
     * @private {?Object}
     */
    children_: {} | null;
    /**
     * Handlers that are listening to this logger.
     * @private {?Array<?Function>}
     */
    handlers_: any[] | null;
    /**
     * Gets the name of this logger.
     * @return {string} The name of this logger.
     */
    getName(): string;
    /**
     * Adds a handler to the logger. This doesn't use the event system because
     * we want to be able to add logging to the event system.
     * @param {?Function} handler Handler function to add.
     */
    addHandler(handler: Function | null): void;
    /**
     * Removes a handler from the logger. This doesn't use the event system because
     * we want to be able to add logging to the event system.
     * @param {?Function} handler Handler function to remove.
     * @return {boolean} Whether the handler was removed.
     */
    removeHandler(handler: Function | null): boolean;
    /**
     * Returns the parent of this logger.
     * @return {debug_Logger} The parent logger or null if this is the root.
     */
    getParent(): debug_Logger;
    /**
     * Returns the children of this logger as a map of the child name to the logger.
     * @return {!Object} The map where the keys are the child leaf names and the
     *     values are the Logger objects.
     */
    getChildren(): any;
    /**
     * Set the log level specifying which message levels will be logged by this
     * logger. Message levels lower than this value will be discarded.
     * The level value Level.OFF can be used to turn off logging. If the new level
     * is null, it means that this node should inherit its level from its nearest
     * ancestor with a specific (non-null) level value.
     *
     * @param {?Level} level The new level.
     */
    setLevel(level: Level | null): void;
    /**
     * Gets the log level specifying which message levels will be logged by this
     * logger. Message levels lower than this value will be discarded.
     * The level value Level.OFF can be used to turn off logging. If the level
     * is null, it means that this node should inherit its level from its nearest
     * ancestor with a specific (non-null) level value.
     *
     * @return {?Level} The level.
     */
    getLevel(): Level | null;
    /**
     * Returns the effective level of the logger based on its ancestors' levels.
     * @return {?Level} The level.
     */
    getEffectiveLevel(): Level | null;
    /**
     * Checks if a message of the given level would actually be logged by this
     * logger. This check is based on the Loggers effective level, which may be
     * inherited from its parent.
     * @param {?Level} level The level to check.
     * @return {boolean} Whether the message would be logged.
     */
    isLoggable(level: Level | null): boolean;
    /**
     * Logs a message. If the logger is currently enabled for the
     * given message level then the given message is forwarded to all the
     * registered output Handler objects.
     * @param {?Level} level One of the level identifiers.
     * @param {?Loggable} msg The message to log.
     * @param {Error|Object=} opt_exception An exception associated with the
     *     message.
     */
    log(level: Level | null, msg: string | (() => string) | null, opt_exception?: any): void;
    /**
     * Creates a new log record and adds the exception (if present) to it.
     * @param {?Level} level One of the level identifiers.
     * @param {string} msg The string message.
     * @param {Error|Object=} opt_exception An exception associated with the
     *     message.
     * @return {!DebugLogRecord} A log record.
     * @suppress {es5Strict}
     */
    getLogRecord(level: Level | null, msg: string, opt_exception?: any): DebugLogRecord;
    /**
     * Logs a message at the Logger.Level.SHOUT level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    shout(msg: string | (() => string) | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.SEVERE level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    severe(msg: string | (() => string) | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.WARNING level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    warning(msg: string | (() => string) | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.INFO level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    info(msg: string | (() => string) | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.CONFIG level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    config(msg: string | (() => string) | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.FINE level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    fine(msg: string | (() => string) | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.FINER level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    finer(msg: string | (() => string) | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a message at the Logger.Level.FINEST level.
     * If the logger is currently enabled for the given message level then the
     * given message is forwarded to all the registered output Handler objects.
     * @param {?Loggable} msg The message to log.
     * @param {Error=} opt_exception An exception associated with the message.
     */
    finest(msg: string | (() => string) | null, opt_exception?: Error | undefined): void;
    /**
     * Logs a LogRecord. If the logger is currently enabled for the
     * given message level then the given message is forwarded to all the
     * registered output Handler objects.
     * @param {?DebugLogRecord} logRecord A log record to log.
     */
    logRecord(logRecord: DebugLogRecord | null): void;
    /**
     * Logs a LogRecord.
     * @param {?DebugLogRecord} logRecord A log record to log.
     * @private
     */
    doLogRecord_(logRecord: DebugLogRecord | null): void;
    /**
     * Calls the handlers for publish.
     * @param {?DebugLogRecord} logRecord The log record to publish.
     * @private
     */
    callPublish_(logRecord: DebugLogRecord | null): void;
    /**
     * Sets the parent of this logger. This is used for setting up the logger tree.
     * @param {debug_Logger} parent The parent logger.
     * @private
     */
    setParent_(parent: debug_Logger): void;
    /**
     * Adds a child to this logger. This is used for setting up the logger tree.
     * @param {string} name The leaf name of the child.
     * @param {debug_Logger} logger The child logger.
     * @private
     */
    addChild_(name: string, logger: debug_Logger): void;
}
declare namespace debug_Logger {
    export const ROOT_LOGGER_NAME: string;
    export const rootHandlers_: Array<Function>;
}
import { LogRecord as DebugLogRecord } from "./logrecord.js";
export { debug_Logger as Logger };
