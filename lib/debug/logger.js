import * as googlog from './../log/log.js';
import {Level as LogLevel} from './../log/log.js';
import {Logger as LogLogger} from './../log/log.js';
import {LogRecord as LogLogRecord} from './../log/log.js';
import * as googdebug from './debug.js';
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
let Loggable;

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
class debug_Logger {
  /**
   * Construct a new Logger.
   *
   * Users should not construct their own instances of debug_Logger. They
   * should always use the {@link LogLogger.getLogger} function.
   *
   * @param {string} name The name of the Logger.
   */
  constructor(name) {
    /**
     * @type {string}
     * @private
     */
    this.name_ = name;
  }

  /**
   * @return {string}
   * @override
   */
  getName() {
    return this.name_;
  }

  /**
   * Adds a handler to the logger. This doesn't use the event system because
   * we want to be able to add logging to the event system.
   * @param {Function} handler Handler function to add.
   */
  addHandler(handler) {
    googlog.addHandler(
        this, /** @type {!googlog.LogRecordHandler} */ (handler));
  }

  /**
   * Removes a handler from the logger. This doesn't use the event system
   * because we want to be able to add logging to the event system.
   * @param {Function} handler Handler function to remove.
   * @return {boolean} Whether the handler was removed.
   */
  removeHandler(handler) {
    return googlog.removeHandler(
        this, /** @type {!googlog.LogRecordHandler} */ (handler));
  }

  /**
   * Set the log level specifying which message levels will be logged by this
   * logger. Message levels lower than this value will be discarded.
   * The level value Level.OFF can be used to turn off logging. If the new level
   * is null, it means that this node should inherit its level from its nearest
   * ancestor with a specific (non-null) level value.
   *
   * @param {!LogLevel|null} level The new level.
   */
  setLevel(level) {
    googlog.setLevel(this, level);
  }

  /**
   * Gets the log level specifying which message levels will be logged by this
   * logger. Message levels lower than this value will be discarded.
   * The level value Level.OFF can be used to turn off logging. If the level
   * is null, it means that this node should inherit its level from its nearest
   * ancestor with a specific (non-null) level value.
   *
   * @return {!LogLevel|null} The level.
   */
  getLevel() {
    return googlog.getLevel(this);
  }

  /**
   * Returns the effective level of the logger based on its ancestors' levels.
   * @return {!LogLevel} The level.
   */
  getEffectiveLevel() {
    return googlog.getEffectiveLevel(this);
  }

  /**
   * Checks if a message of the given level would actually be logged by this
   * logger. This check is based on the Loggers effective level, which may be
   * inherited from its parent.
   * @param {!LogLevel} level The level to check.
   * @return {boolean} Whether the message would be logged.
   */
  isLoggable(level) {
    const googLogLevel = LogLevel[level.toString()];
    return googlog.isLoggable(this, googLogLevel);
  }

  /**
   * Logs a message. If the logger is currently enabled for the
   * given message level then the given message is forwarded to all the
   * registered output Handler objects.
   * @param {!LogLevel} level One of the level identifiers.
   * @param {Loggable} msg The message to log.
   * @param {Error|Object=} opt_exception An exception associated with the
   *     message.
   */
  log(level, msg, opt_exception) {
    googlog.log(this, level, msg, opt_exception);
  }

  /**
   * Creates a new log record and adds the exception (if present) to it.
   * @param {!LogLevel} level One of the level identifiers.
   * @param {string} msg The string message.
   * @param {Error|Object=} opt_exception An exception associated with the
   *     message.
   * @return {!LogLogRecord} A log record.
   */
  getLogRecord(level, msg, opt_exception) {
    return googlog.getLogRecord(this, level, msg, opt_exception);
  }

  /**
   * Logs a message at the Logger.Level.SHOUT level.
   * If the logger is currently enabled for the given message level then the
   * given message is forwarded to all the registered output Handler objects.
   * @param {Loggable} msg The message to log.
   * @param {Error=} opt_exception An exception associated with the message.
   */
  shout(msg, opt_exception) {
    if (googdebug.LOGGING_ENABLED) {
      this.log(Level.SHOUT, msg, opt_exception);
    }
  }

  /**
   * Logs a message at the Logger.Level.SEVERE level.
   * If the logger is currently enabled for the given message level then the
   * given message is forwarded to all the registered output Handler objects.
   * @param {Loggable} msg The message to log.
   * @param {Error=} opt_exception An exception associated with the message.
   */
  severe(msg, opt_exception) {
    if (googdebug.LOGGING_ENABLED) {
      this.log(Level.SEVERE, msg, opt_exception);
    }
  }

  /**
   * Logs a message at the Logger.Level.WARNING level.
   * If the logger is currently enabled for the given message level then the
   * given message is forwarded to all the registered output Handler objects.
   * @param {Loggable} msg The message to log.
   * @param {Error=} opt_exception An exception associated with the message.
   */
  warning(msg, opt_exception) {
    if (googdebug.LOGGING_ENABLED) {
      this.log(Level.WARNING, msg, opt_exception);
    }
  }

  /**
   * Logs a message at the Logger.Level.INFO level.
   * If the logger is currently enabled for the given message level then the
   * given message is forwarded to all the registered output Handler objects.
   * @param {Loggable} msg The message to log.
   * @param {Error=} opt_exception An exception associated with the message.
   */
  info(msg, opt_exception) {
    if (googdebug.LOGGING_ENABLED) {
      this.log(Level.INFO, msg, opt_exception);
    }
  };

  /**
   * Logs a message at the Logger.Level.CONFIG level.
   * If the logger is currently enabled for the given message level then the
   * given message is forwarded to all the registered output Handler objects.
   * @param {Loggable} msg The message to log.
   * @param {Error=} opt_exception An exception associated with the message.
   */
  config(msg, opt_exception) {
    if (googdebug.LOGGING_ENABLED) {
      this.log(Level.CONFIG, msg, opt_exception);
    }
  };

  /**
   * Logs a message at the Logger.Level.FINE level.
   * If the logger is currently enabled for the given message level then the
   * given message is forwarded to all the registered output Handler objects.
   * @param {Loggable} msg The message to log.
   * @param {Error=} opt_exception An exception associated with the message.
   */
  fine(msg, opt_exception) {
    if (googdebug.LOGGING_ENABLED) {
      this.log(Level.FINE, msg, opt_exception);
    }
  }

  /**
   * Logs a message at the Logger.Level.FINER level.
   * If the logger is currently enabled for the given message level then the
   * given message is forwarded to all the registered output Handler objects.
   * @param {Loggable} msg The message to log.
   * @param {Error=} opt_exception An exception associated with the message.
   */
  finer(msg, opt_exception) {
    if (googdebug.LOGGING_ENABLED) {
      this.log(Level.FINER, msg, opt_exception);
    }
  }

  /**
   * Logs a message at the Logger.Level.FINEST level.
   * If the logger is currently enabled for the given message level then the
   * given message is forwarded to all the registered output Handler objects.
   * @param {Loggable} msg The message to log.
   * @param {Error=} opt_exception An exception associated with the message.
   */
  finest(msg, opt_exception) {
    if (googdebug.LOGGING_ENABLED) {
      this.log(Level.FINEST, msg, opt_exception);
    }
  }

  /**
   * Logs a LogRecord. If the logger is currently enabled for the
   * given message level then the given message is forwarded to all the
   * registered output Handler objects.
   * @param {!LogLogRecord} logRecord A log record to log.
   */
  logRecord(logRecord) {
    googlog.publishLogRecord(this, logRecord);
  }
};

/**
 * @constructor
 * @final
 */
let Level = LogLevel;

/** @const */
debug_Logger.ROOT_LOGGER_NAME = '';

/**
 * @type {boolean} Toggles whether loggers other than the root logger can have
 *     log handlers attached to them and whether they can have their log level
 *     set. Logging is a bit faster when this is set to false.
 */
const ENABLE_HIERARCHY = true;

/**
 * @type {boolean} Toggles whether active log statements are also recorded
 *     to the profiler.
 */
const ENABLE_PROFILER_LOGGING = false;

/**
 * Finds or creates a logger for a named subsystem. If a logger has already been
 * created with the given name it is returned. Otherwise a new logger is
 * created. If a new logger is created its log level will be configured based
 * on the LogManager configuration and it will configured to also send logging
 * output to its parent's handlers. It will be registered in the LogManager
 * global namespace.
 *
 * @param {string} name A name for the logger. This should be a dot-separated
 * name and should normally be based on the package name or class name of the
 * subsystem, such as goog.net.BrowserChannel.
 * @return {!debug_Logger} The named logger.
 * @deprecated use {@link googlog} instead.
 */
debug_Logger.getLogger = function(name) {
  return LogManager.getLogger(name);
};

/**
 * Logs a message to profiling tools, if available.
 * {@see https://developers.google.com/web-toolkit/speedtracer/logging-api}
 * {@see http://msdn.microsoft.com/en-us/library/dd433074(VS.85).aspx}
 * @param {string} msg The message to log.
 */
debug_Logger.logToProfilers = function(msg) {
  // Some browsers also log timeStamp calls to the console, only log
  // if actually asked.
  if (ENABLE_PROFILER_LOGGING) {
    var msWriteProfilerMark = window['msWriteProfilerMark'];
    if (msWriteProfilerMark) {
      // Logs a message to the Microsoft profiler
      // On IE, console['timeStamp'] may output to console
      msWriteProfilerMark(msg);
      return;
    }

    // Using window, as loggers might be used in window-less contexts.
    var console = window['console'];
    if (console && console['timeStamp']) {
      // Logs a message to Firebug, Web Inspector, SpeedTracer, etc.
      console['timeStamp'](msg);
    }
  }
};

/**
 * There is a single global LogManager object that is used to maintain a set of
 * shared state about Loggers and log services. This is loosely based on the
 * java class java.util.logging.LogManager.
 * @const
 */
let LogManager = {};

/**
 * Map of logger names to logger objects.
 *
 * @type {!Object<string, !debug_Logger>}
 * @private
 */
LogManager.loggers_ = {};

/**
 * The root logger which is the root of the logger tree.
 * @type {?debug_Logger}
 * @private
 */
LogManager.rootLogger_ = null;

/**
 * Initializes the LogManager if not already initialized.
 */
LogManager.initialize = function() {
  if (!LogManager.rootLogger_) {
    LogManager.rootLogger_ =
        new debug_Logger(debug_Logger.ROOT_LOGGER_NAME);
    LogManager.loggers_[debug_Logger.ROOT_LOGGER_NAME] =
        LogManager.rootLogger_;
    LogManager.rootLogger_.setLevel(Level.CONFIG);
  }
};

/**
 * Returns all the loggers.
 * @return {!Object<string, !debug_Logger>} Map of logger names to logger
 *     objects.
 */
LogManager.getLoggers = function() {
  return LogManager.loggers_;
};

/**
 * Returns the root of the logger tree namespace, the logger with the empty
 * string as its name.
 *
 * @return {!debug_Logger} The root logger.
 */
LogManager.getRoot = function() {
  LogManager.initialize();
  return /** @type {!debug_Logger} */ (LogManager.rootLogger_);
};

/**
 * Finds a named logger.
 *
 * @param {string} name A name for the logger. This should be a dot-separated
 * name and should normally be based on the package name or class name of the
 * subsystem, such as goog.net.BrowserChannel.
 * @return {!debug_Logger} The named logger.
 */
LogManager.getLogger = function(name) {
  LogManager.initialize();
  var ret = LogManager.loggers_[name];
  return ret || LogManager.createLogger_(name);
};

/**
 * Creates a function that can be passed to googdebug.catchErrors. The function
 * will log all reported errors using the given logger.
 * @param {?LogLogger=} opt_logger The logger to log the errors to.
 *     Defaults to the root logger.
 * @return {function(Object)} The created function.
 */
LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    var logger = opt_logger || LogManager.getRoot();
    googlog.error(
        logger,
        'Error: ' + info.message + ' (' + info.fileName +
            ' @ Line: ' + info.line + ')');
  };
};

/**
 * Creates the named logger. Will also create the parents of the named logger
 * if they don't yet exist.
 * @param {string} name The name of the logger.
 * @return {!debug_Logger} The named logger.
 * @private
 */
LogManager.createLogger_ = function(name) {
  // find parent logger
  var logger = new debug_Logger(name);
  LogManager.loggers_[name] = logger;
  return logger;
};

export {ENABLE_HIERARCHY, ENABLE_PROFILER_LOGGING, Level, LogManager, Loggable, debug_Logger as Logger};