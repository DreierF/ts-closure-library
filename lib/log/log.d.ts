/**
 * @fileoverview Basic strippable logging definitions.
 * @see http://go/closurelogging
 */
/** @type {boolean} Whether logging is enabled. */
export const ENABLED: boolean;
/**
 * @constructor
 * @final
 */
export let Level: typeof LoggerLevel;
/** @const {string} */
export let ROOT_LOGGER_NAME: string;
/**
 * Adds a handler to the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 * @param {log_Logger} logger
 * @param {?Function} handler Handler function to add.
 */
export function addHandler(logger: typeof DebugLogger, handler: Function | null): void;
/**
 * Logs a message at the Level.SEVERE level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {log_Logger} logger
 * @param {?Loggable} msg The message to log.
 * @param {Error=} opt_exception An exception associated with the message.
 */
export function error(logger: typeof DebugLogger, msg: Loggable | null, opt_exception?: Error | undefined): void;
/**
 * Logs a message at the Level.Fine level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {log_Logger} logger
 * @param {?Loggable} msg The message to log.
 * @param {Error=} opt_exception An exception associated with the message.
 */
export function fine(logger: typeof DebugLogger, msg: Loggable | null, opt_exception?: Error | undefined): void;
/**
 * Finds or creates a logger for a named subsystem. If a logger has already been
 * created with the given name it is returned. Otherwise a new logger is
 * created. If a new logger is created its log level will be configured based
 * on the LogManager configuration and it will configured to also
 * send logging output to its parent's handlers.
 * @see LogManager
 *
 * @param {string} name A name for the logger. This should be a dot-separated
 *     name and should normally be based on the package name or class name of
 *     the subsystem, such as goog.net.BrowserChannel.
 * @param {Level=} opt_level If provided, override the
 *     default logging level with the provided level.
 * @return {log_Logger} The named logger or null if logging is disabled.
 */
export function getLogger(name: string, opt_level?: typeof LoggerLevel | undefined): typeof DebugLogger;
/**
 * Logs a message at the Level.INFO level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {log_Logger} logger
 * @param {?Loggable} msg The message to log.
 * @param {Error=} opt_exception An exception associated with the message.
 */
export function info(logger: typeof DebugLogger, msg: Loggable | null, opt_exception?: Error | undefined): void;
/**
 * Logs a message. If the logger is currently enabled for the
 * given message level then the given message is forwarded to all the
 * registered output Handler objects.
 * @param {log_Logger} logger
 * @param {?Level} level One of the level identifiers.
 * @param {?Loggable} msg The message to log.
 * @param {Error|Object=} opt_exception An exception associated with the
 *     message.
 */
export function log(logger: typeof DebugLogger, level: typeof LoggerLevel | null, msg: Loggable | null, opt_exception?: (Error | any) | undefined): void;
/**
 * @constructor
 * @final
 */
declare let log_LogRecord: typeof DebugLogRecord;
/**
 * @constructor
 * @final
 */
declare let log_Logger: typeof DebugLogger;
/**
 * Removes a handler from the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 * @param {log_Logger} logger
 * @param {?Function} handler Handler function to remove.
 * @return {boolean} Whether the handler was removed.
 */
export function removeHandler(logger: typeof DebugLogger, handler: Function | null): boolean;
/**
 * Logs a message at the Level.WARNING level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {log_Logger} logger
 * @param {?Loggable} msg The message to log.
 * @param {Error=} opt_exception An exception associated with the message.
 */
export function warning(logger: typeof DebugLogger, msg: Loggable | null, opt_exception?: Error | undefined): void;
import { Level as LoggerLevel } from "../debug/logger.js";
import { Logger as DebugLogger } from "../debug/logger.js";
import { Loggable } from "../debug/logger.js";
import { LogRecord as DebugLogRecord } from "../debug/logrecord.js";
export { log_LogRecord as LogRecord, log_Logger as Logger };
