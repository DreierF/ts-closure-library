import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import * as google from './../google.js';
import * as googdebug from './debug.js';
import {LogBuffer} from './logbuffer.js';
import {LogRecord as DebugLogRecord} from './logrecord.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * The logger object should never be instantiated by application code. It
 * should always use the debug_Logger.getLogger function.
 *
 * @final
 */
class debug_Logger {

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
  constructor(name) {
    /**
     * Name of the Logger. Generally a dot-separated namespace
     * @private {string}
     */
    this.name_ = name;
  
    /**
     * Parent Logger.
     * @private {?debug_Logger}
     */
    this.parent_ = null;
  
    /**
     * Level that this logger only filters above. Null indicates it should
     * inherit from the parent.
     * @private {?Level}
     */
    this.level_ = null;
  
    /**
     * Map of children loggers. The keys are the leaf names of the children and
     * the values are the child loggers.
     * @private {?Object}
     */
    this.children_ = null;
  
    /**
     * Handlers that are listening to this logger.
     * @private {?Array<?Function>}
     */
    this.handlers_ = null;
  }

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
   * @deprecated use {@link google.log} instead.
   */
  static getLogger(name) {
    return LogManager.getLogger(name);
  };

  /**
   * Logs a message to profiling tools, if available.
   * {@see https://developers.google.com/web-toolkit/speedtracer/logging-api}
   * {@see http://msdn.microsoft.com/en-us/library/dd433074(VS.85).aspx}
   * @param {string} msg The message to log.
   */
  static logToProfilers(msg) {
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
   * Gets the name of this logger.
   * @return {string} The name of this logger.
   */
  getName() {
    return this.name_;
  };

  /**
   * Adds a handler to the logger. This doesn't use the event system because
   * we want to be able to add logging to the event system.
   * @param {Function} handler Handler function to add.
   */
  addHandler(handler) {
    if (googdebug.LOGGING_ENABLED) {
      if (ENABLE_HIERARCHY) {
        if (!this.handlers_) {
          this.handlers_ = [];
        }
        this.handlers_.push(handler);
      } else {
        asserts.assert(
            !this.name_, 'Cannot call addHandler on a non-root logger when ' +
                'goog.debug.Logger.ENABLE_HIERARCHY is false.');
        debug_Logger.rootHandlers_.push(handler);
      }
    }
  };

  /**
   * Removes a handler from the logger. This doesn't use the event system because
   * we want to be able to add logging to the event system.
   * @param {Function} handler Handler function to remove.
   * @return {boolean} Whether the handler was removed.
   */
  removeHandler(handler) {
    if (googdebug.LOGGING_ENABLED) {
      var handlers = ENABLE_HIERARCHY ?
          this.handlers_ :
          debug_Logger.rootHandlers_;
      return !!handlers && googarray.remove(handlers, handler);
    } else {
      return false;
    }
  };

  /**
   * Returns the parent of this logger.
   * @return {debug_Logger} The parent logger or null if this is the root.
   */
  getParent() {
    return this.parent_;
  };

  /**
   * Returns the children of this logger as a map of the child name to the logger.
   * @return {!Object} The map where the keys are the child leaf names and the
   *     values are the Logger objects.
   */
  getChildren() {
    if (!this.children_) {
      this.children_ = {};
    }
    return this.children_;
  };

  /**
   * Set the log level specifying which message levels will be logged by this
   * logger. Message levels lower than this value will be discarded.
   * The level value Level.OFF can be used to turn off logging. If the new level
   * is null, it means that this node should inherit its level from its nearest
   * ancestor with a specific (non-null) level value.
   *
   * @param {Level} level The new level.
   */
  setLevel(level) {
    if (googdebug.LOGGING_ENABLED) {
      if (ENABLE_HIERARCHY) {
        this.level_ = level;
      } else {
        asserts.assert(
            !this.name_, 'Cannot call setLevel() on a non-root logger when ' +
                'goog.debug.Logger.ENABLE_HIERARCHY is false.');
        debug_Logger.rootLevel_ = level;
      }
    }
  };

  /**
   * Gets the log level specifying which message levels will be logged by this
   * logger. Message levels lower than this value will be discarded.
   * The level value Level.OFF can be used to turn off logging. If the level
   * is null, it means that this node should inherit its level from its nearest
   * ancestor with a specific (non-null) level value.
   *
   * @return {Level} The level.
   */
  getLevel() {
    return googdebug.LOGGING_ENABLED ? this.level_ : Level.OFF;
  };

  /**
   * Returns the effective level of the logger based on its ancestors' levels.
   * @return {Level} The level.
   */
  getEffectiveLevel() {
    if (!googdebug.LOGGING_ENABLED) {
      return Level.OFF;
    }
  
    if (!ENABLE_HIERARCHY) {
      return debug_Logger.rootLevel_;
    }
    if (this.level_) {
      return this.level_;
    }
    if (this.parent_) {
      return this.parent_.getEffectiveLevel();
    }
    asserts.fail('Root logger has no level set.');
    return null;
  };

  /**
   * Checks if a message of the given level would actually be logged by this
   * logger. This check is based on the Loggers effective level, which may be
   * inherited from its parent.
   * @param {Level} level The level to check.
   * @return {boolean} Whether the message would be logged.
   */
  isLoggable(level) {
    return googdebug.LOGGING_ENABLED &&
        level.value >= this.getEffectiveLevel().value;
  };

  /**
   * Logs a message. If the logger is currently enabled for the
   * given message level then the given message is forwarded to all the
   * registered output Handler objects.
   * @param {Level} level One of the level identifiers.
   * @param {Loggable} msg The message to log.
   * @param {Error|Object=} opt_exception An exception associated with the
   *     message.
   */
  log(level, msg, opt_exception) {
    // java caches the effective level, not sure it's necessary here
    if (googdebug.LOGGING_ENABLED && this.isLoggable(level)) {
      // Message callbacks can be useful when a log message is expensive to build.
      if (google.isFunction(msg)) {
        msg = /** @type{!Function} */ (msg);
  	msg = msg();
      }
  
      this.doLogRecord_(this.getLogRecord(level, msg, opt_exception));
    }
  };

  /**
   * Creates a new log record and adds the exception (if present) to it.
   * @param {Level} level One of the level identifiers.
   * @param {string} msg The string message.
   * @param {Error|Object=} opt_exception An exception associated with the
   *     message.
   * @return {!DebugLogRecord} A log record.
   * @suppress {es5Strict}
   */
  getLogRecord(level, msg, opt_exception) {
    if (LogBuffer.isBufferingEnabled()) {
      var logRecord =
          LogBuffer.getInstance().addRecord(level, msg, this.name_);
    } else {
      logRecord = new DebugLogRecord(level, String(msg), this.name_);
    }
    if (opt_exception) {
      logRecord.setException(opt_exception);
    }
    return logRecord;
  };

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
  };

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
  };

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
  };

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
  };

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
  };

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
  };

  /**
   * Logs a LogRecord. If the logger is currently enabled for the
   * given message level then the given message is forwarded to all the
   * registered output Handler objects.
   * @param {DebugLogRecord} logRecord A log record to log.
   */
  logRecord(logRecord) {
    if (googdebug.LOGGING_ENABLED && this.isLoggable(logRecord.getLevel())) {
      this.doLogRecord_(logRecord);
    }
  };

  /**
   * Logs a LogRecord.
   * @param {DebugLogRecord} logRecord A log record to log.
   * @private
   */
  doLogRecord_(logRecord) {
    if (ENABLE_PROFILER_LOGGING) {
      debug_Logger.logToProfilers('log:' + logRecord.getMessage());
    }
    if (ENABLE_HIERARCHY) {
      var target = this;
      while (target) {
        target.callPublish_(logRecord);
        target = target.getParent();
      }
    } else {
      for (var i = 0, handler; handler = debug_Logger.rootHandlers_[i++];) {
        handler(logRecord);
      }
    }
  };

  /**
   * Calls the handlers for publish.
   * @param {DebugLogRecord} logRecord The log record to publish.
   * @private
   */
  callPublish_(logRecord) {
    if (this.handlers_) {
      for (var i = 0, handler; handler = this.handlers_[i]; i++) {
        handler(logRecord);
      }
    }
  };

  /**
   * Sets the parent of this logger. This is used for setting up the logger tree.
   * @param {debug_Logger} parent The parent logger.
   * @private
   */
  setParent_(parent) {
    this.parent_ = parent;
  };

  /**
   * Adds a child to this logger. This is used for setting up the logger tree.
   * @param {string} name The leaf name of the child.
   * @param {debug_Logger} logger The child logger.
   * @private
   */
  addChild_(name, logger) {
    this.getChildren()[name] = logger;
  };
}

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

if (!ENABLE_HIERARCHY) {
  /**
   * @type {!Array<Function>}
   * @private
   */
  debug_Logger.rootHandlers_ = [];

  /**
   * @type {Level}
   * @private
   */
  debug_Logger.rootLevel_;
}

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
class Level {

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
  constructor(name, value) {
    /**
     * The name of the level
     * @type {string}
     */
    this.name = name;
  
    /**
     * The numeric value of the level
     * @type {number}
     */
    this.value = value;
  }

  /**
   * @return {string} String representation of the logger level.
   * @override
   */
  toString() {
    return this.name;
  };

  /**
   * Creates the predefined levels cache and populates it.
   * @private
   */
  static createPredefinedLevelsCache_() {
    Level.predefinedLevelsCache_ = {};
    for (var i = 0, level; level = Level.PREDEFINED_LEVELS[i];
         i++) {
      Level.predefinedLevelsCache_[level.value] = level;
      Level.predefinedLevelsCache_[level.name] = level;
    }
  };

  /**
   * Gets the predefined level with the given name.
   * @param {string} name The name of the level.
   * @return {Level} The level, or null if none found.
   */
  static getPredefinedLevel(name) {
    if (!Level.predefinedLevelsCache_) {
      Level.createPredefinedLevelsCache_();
    }
  
    return Level.predefinedLevelsCache_[name] || null;
  };

  /**
   * Gets the highest predefined level <= #value.
   * @param {number} value Level value.
   * @return {Level} The level, or null if none found.
   */
  static getPredefinedLevelByValue(value) {
    if (!Level.predefinedLevelsCache_) {
      Level.createPredefinedLevelsCache_();
    }
  
    if (value in /** @type {!Object} */ (
            Level.predefinedLevelsCache_)) {
      return Level.predefinedLevelsCache_[value];
    }
  
    for (var i = 0; i < Level.PREDEFINED_LEVELS.length; ++i) {
      var level = Level.PREDEFINED_LEVELS[i];
      if (level.value <= value) {
        return level;
      }
    }
    return null;
  };
}

/**
 * OFF is a special level that can be used to turn off logging.
 * This level is initialized to <CODE>Infinity</CODE>.
 * @type {!Level}
 */
Level.OFF = new Level('OFF', Infinity);

/**
 * SHOUT is a message level for extra debugging loudness.
 * This level is initialized to <CODE>1200</CODE>.
 * @type {!Level}
 */
Level.SHOUT = new Level('SHOUT', 1200);

/**
 * SEVERE is a message level indicating a serious failure.
 * This level is initialized to <CODE>1000</CODE>.
 * @type {!Level}
 */
Level.SEVERE = new Level('SEVERE', 1000);

/**
 * WARNING is a message level indicating a potential problem.
 * This level is initialized to <CODE>900</CODE>.
 * @type {!Level}
 */
Level.WARNING = new Level('WARNING', 900);

/**
 * INFO is a message level for informational messages.
 * This level is initialized to <CODE>800</CODE>.
 * @type {!Level}
 */
Level.INFO = new Level('INFO', 800);

/**
 * CONFIG is a message level for static configuration messages.
 * This level is initialized to <CODE>700</CODE>.
 * @type {!Level}
 */
Level.CONFIG = new Level('CONFIG', 700);

/**
 * FINE is a message level providing tracing information.
 * This level is initialized to <CODE>500</CODE>.
 * @type {!Level}
 */
Level.FINE = new Level('FINE', 500);

/**
 * FINER indicates a fairly detailed tracing message.
 * This level is initialized to <CODE>400</CODE>.
 * @type {!Level}
 */
Level.FINER = new Level('FINER', 400);

/**
 * FINEST indicates a highly detailed tracing message.
 * This level is initialized to <CODE>300</CODE>.
 * @type {!Level}
 */

Level.FINEST = new Level('FINEST', 300);

/**
 * ALL indicates that all messages should be logged.
 * This level is initialized to <CODE>0</CODE>.
 * @type {!Level}
 */
Level.ALL = new Level('ALL', 0);

/**
 * The predefined levels.
 * @type {!Array<!Level>}
 * @final
 */
Level.PREDEFINED_LEVELS = [
  Level.OFF, Level.SHOUT,
  Level.SEVERE, Level.WARNING,
  Level.INFO, Level.CONFIG,
  Level.FINE, Level.FINER,
  Level.FINEST, Level.ALL
];

/**
 * A lookup map used to find the level object based on the name or value of
 * the level object.
 * @type {?Object}
 * @private
 */
Level.predefinedLevelsCache_ = null;

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
 * @param {debug_Logger=} opt_logger The logger to log the errors to.
 *     Defaults to the root logger.
 * @return {function(Object)} The created function.
 */
LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    var logger = opt_logger || LogManager.getRoot();
    logger.severe(
        'Error: ' + info.message + ' (' + info.fileName + ' @ Line: ' +
        info.line + ')');
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
  if (ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf('.');
    var parentName = name.substr(0, lastDotIndex);
    var leafName = name.substr(lastDotIndex + 1);
    var parentLogger = LogManager.getLogger(parentName);

    // tell the parent about the child and the child about the parent
    parentLogger.addChild_(leafName, logger);
    logger.setParent_(parentLogger);
  }

  LogManager.loggers_[name] = logger;
  return logger;
};

export {ENABLE_HIERARCHY, ENABLE_PROFILER_LOGGING, Level, LogManager, Loggable, debug_Logger as Logger};