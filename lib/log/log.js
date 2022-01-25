import * as debug from './../debug/debug.js';
import {LogBuffer as DebugLogBuffer} from './../debug/logbuffer.js';
import {Logger as DebugLogger} from './../debug/logger.js';
import {Loggable} from './../debug/logger.js';
import {LogManager} from './../debug/logger.js';
import {Level as LoggerLevel} from './../debug/logger.js';
import {LogRecord as DebugLogRecord} from './../debug/logrecord.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Basic strippable logging definitions.
 * @see http://go/closurelogging
 */

/** @type {boolean} Whether logging is enabled. */
const ENABLED = debug.LOGGING_ENABLED;

/** @const {string} */
let ROOT_LOGGER_NAME = DebugLogger.ROOT_LOGGER_NAME;

/**
 * @constructor
 * @final
 */
let log_Logger = DebugLogger;

/**
 * @constructor
 * @final
 */
let Level = LoggerLevel;

/**
 * @constructor
 * @final
 */
let log_LogRecord = DebugLogRecord;

/**
 * For access of LogBuffer.CAPACITY only.
 * @constructor
 * @final
 */
let LogBuffer = DebugLogBuffer;

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
function getLogger(name, opt_level) {
  if (ENABLED) {
    var logger = LogManager.getLogger(name);
    if (opt_level && logger) {
      logger.setLevel(opt_level);
    }
    return logger;
  } else {
    return null;
  }
};

// TODO(johnlenz): try to tighten the types to these functions.
/**
 * Adds a handler to the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 * @param {log_Logger} logger
 * @param {Function} handler Handler function to add.
 */
function addHandler(logger, handler) {
  if (ENABLED && logger) {
    logger.addHandler(handler);
  }
};

/**
 * Removes a handler from the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 * @param {log_Logger} logger
 * @param {Function} handler Handler function to remove.
 * @return {boolean} Whether the handler was removed.
 */
function removeHandler(logger, handler) {
  if (ENABLED && logger) {
    return logger.removeHandler(handler);
  } else {
    return false;
  }
};

/**
 * Set the log level specifying which message levels will be logged by the
 * given logger.
 * @param {?log_Logger} logger
 * @param {?LoggerLevel} level The level to set.
 */
function setLevel(logger, level) {
  if (ENABLED && logger) {
    logger.setLevel(level);
  }
};

/**
 * Gets the log level specifying which message levels will be logged by this
 * logger. Message levels lower than this value will be discarded.
 * The level value Level.OFF can be used to turn off logging. If the level
 * is null, it means that this node should inherit its level from its
 * nearest ancestor with a specific (non-null) level value.
 * @param {?log_Logger} logger
 * @return {?LoggerLevel} The level.
 */
function getLevel(logger) {
  if (ENABLED && logger) {
    return logger.getLevel();
  }
  return null;
};

/**
 * Returns the effective level of the logger based on its ancestors'
 * levels.
 * @param {?log_Logger} logger
 * @return {?LoggerLevel} The level.
 */
function getEffectiveLevel(logger) {
  if (ENABLED && logger) {
    return logger.getEffectiveLevel();
  }
  return null;
};

/**
 * Checks if a message of the given level would actually be logged
 * by this logger. This check is based on the Loggers effective
 * level, which may be inherited from its parent.
 * @param {?log_Logger} logger
 * @param {?LoggerLevel} level The level to check.
 * @return {boolean} Whether the message would be logged.
 */
function isLoggable(logger, level) {
  if (ENABLED && logger) {
    return logger.isLoggable(level);
  }
  return false;
};

/**
 * Creates a new log record and adds the exception (if present) to it.
 * @param {?log_Logger} logger
 * @param {?LoggerLevel} level One of the level identifiers.
 * @param {string} msg The string message.
 * @param {?Error|?Object=} opt_exception An exception associated with the
 *     message.
 * @return {?DebugLogRecord} A log record.
 */
function getLogRecord(logger, level, msg, opt_exception) {
  if (ENABLED && logger) {
    return logger.getLogRecord(level, msg, opt_exception);
  }
  return null;
};

/**
 * Logs a LogRecord. If the logger is currently enabled for the
 * given message level then the given message is forwarded to all the
 * registered output Handler objects.
 * @param {?log_Logger} logger
 * @param {?DebugLogRecord} logRecord A log record to log.
 */
function publishLogRecord(logger, logRecord) {
  if (ENABLED && logger) {
    logger.logRecord(logRecord);
  }
};

/**
 * Logs a message. If the logger is currently enabled for the
 * given message level then the given message is forwarded to all the
 * registered output Handler objects.
 * @param {log_Logger} logger
 * @param {Level} level One of the level identifiers.
 * @param {Loggable} msg The message to log.
 * @param {Error|Object=} opt_exception An exception associated with the
 *     message.
 */
function log(logger, level, msg, opt_exception) {
  if (ENABLED && logger) {
    logger.log(level, msg, opt_exception);
  }
};

/**
 * Logs a message at the Level.SEVERE level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {log_Logger} logger
 * @param {Loggable} msg The message to log.
 * @param {Error=} opt_exception An exception associated with the message.
 */
function error(logger, msg, opt_exception) {
  if (ENABLED && logger) {
    logger.severe(msg, opt_exception);
  }
};

/**
 * Logs a message at the Level.WARNING level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {log_Logger} logger
 * @param {Loggable} msg The message to log.
 * @param {Error=} opt_exception An exception associated with the message.
 */
function warning(logger, msg, opt_exception) {
  if (ENABLED && logger) {
    logger.warning(msg, opt_exception);
  }
};

/**
 * Logs a message at the Level.INFO level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {log_Logger} logger
 * @param {Loggable} msg The message to log.
 * @param {Error=} opt_exception An exception associated with the message.
 */
function info(logger, msg, opt_exception) {
  if (ENABLED && logger) {
    logger.info(msg, opt_exception);
  }
};

/**
 * Logs a message at the Level.Fine level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {log_Logger} logger
 * @param {Loggable} msg The message to log.
 * @param {Error=} opt_exception An exception associated with the message.
 */
function fine(logger, msg, opt_exception) {
  if (ENABLED && logger) {
    logger.fine(msg, opt_exception);
  }
};

export {ENABLED, Level, LogBuffer, ROOT_LOGGER_NAME, addHandler, error, fine, getEffectiveLevel, getLevel, getLogRecord, getLogger, info, isLoggable, log, log_LogRecord as LogRecord, log_Logger as Logger, publishLogRecord, removeHandler, setLevel, warning};