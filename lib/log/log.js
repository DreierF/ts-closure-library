import * as debug from './../debug/debug.js';
import {Logger as DebugLogger} from './../debug/logger.js';
import {Loggable} from './../debug/logger.js';
import {LogManager} from './../debug/logger.js';
import {Level as LoggerLevel} from './../debug/logger.js';
import {LogRecord as DebugLogRecord} from './../debug/logrecord.js';
// Copyright 2013 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

export {ENABLED, Level, ROOT_LOGGER_NAME, addHandler, error, fine, getLogger, info, log, log_LogRecord as LogRecord, log_Logger as Logger, removeHandler, warning};