import * as asserts from './../asserts/asserts.js';
import * as debug from './../debug/debug.js';
import * as google from './../google.js';
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
let Loggable;

/** @type {boolean} Whether logging is enabled. */
const ENABLED = debug.LOGGING_ENABLED;

/** @const */
let ROOT_LOGGER_NAME = '';

// TODO(user): Make Level an enum.
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
   * @param {string} name The name of the level.
   * @param {number} value The numeric value of the level.
   */
  constructor(name, value) {
    /**
     * The name of the level
     * @type {string}
     * @const
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
  }
};

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
  Level.OFF, Level.SHOUT, Level.SEVERE,
  Level.WARNING, Level.INFO, Level.CONFIG,
  Level.FINE, Level.FINER, Level.FINEST,
  Level.ALL
];

/**
 * A lookup map used to find the level object based on the name or value of
 * the level object.
 * @type {?Object}
 * @private
 */
Level.predefinedLevelsCache_ = null;

/**
 * Creates the predefined levels cache and populates it.
 */
Level.createPredefinedLevelsCache_ = function() {
  Level.predefinedLevelsCache_ = {};
  for (let i = 0, level; level = Level.PREDEFINED_LEVELS[i]; i++) {
    Level.predefinedLevelsCache_[level.value] = level;
    Level.predefinedLevelsCache_[level.name] = level;
  }
};

/**
 * Gets the predefined level with the given name.
 * @param {string} name The name of the level.
 * @return {!Level|null} The level, or null if none found.
 */
Level.getPredefinedLevel = function(name) {
  if (!Level.predefinedLevelsCache_) {
    Level.createPredefinedLevelsCache_();
  }

  return Level.predefinedLevelsCache_[name] || null;
};

/**
 * Gets the highest predefined level <= #value.
 * @param {number} value Level value.
 * @return {!Level|null} The level, or null if none found.
 */
Level.getPredefinedLevelByValue = function(value) {
  if (!Level.predefinedLevelsCache_) {
    Level.createPredefinedLevelsCache_();
  }

  if (value in /** @type {!Object} */ (Level.predefinedLevelsCache_)) {
    return Level.predefinedLevelsCache_[value];
  }

  for (let i = 0; i < Level.PREDEFINED_LEVELS.length; ++i) {
    let level = Level.PREDEFINED_LEVELS[i];
    if (level.value <= value) {
      return level;
    }
  }
  return null;
};

/** @interface */
class log_Logger {
  /**
   * Gets the name of the Logger.
   * @return {string}
   * @public
   */
  getName() {}
};

/**
 * Only for compatibility with debug.Logger.Level, which is how many users
 * access Level.
 * TODO(user): Remove these definitions.
 * @final
 */
log_Logger.Level = Level;

/**
 * A buffer for log records. The purpose of this is to improve
 * logging performance by re-using old objects when the buffer becomes full and
 * to eliminate the need for each app to implement their own log buffer. The
 * disadvantage to doing this is that log handlers cannot maintain references to
 * log records and expect that they are not overwriten at a later point.
 * @final
 */
class LogBuffer {
  /**
   * @param {number=} capacity The capacity of this LogBuffer instance.
   */
  constructor(capacity) {
    /**
     * The buffer's capacity.
     * @type {number}
     * @private
     */
    this.capacity_ =
        typeof capacity === 'number' ? capacity : CAPACITY;

    /**
     * The array to store the records.
     * @type {!Array<!log_LogRecord|undefined>}
     * @private
     */
    this.buffer_;

    /**
     * The index of the most recently added record, or -1 if there are no
     * records.
     * @type {number}
     * @private
     */
    this.curIndex_;

    /**
     * Whether the buffer is at capacity.
     * @type {boolean}
     * @private
     */
    this.isFull_;

    this.clear();
  }

  /**
   * Adds a log record to the buffer, possibly overwriting the oldest record.
   * @param {!Level} level One of the level identifiers.
   * @param {string} msg The string message.
   * @param {string} loggerName The name of the source logger.
   * @return {!log_LogRecord} The log record.
   */
  addRecord(level, msg, loggerName) {
    if (!this.isBufferingEnabled()) {
      return new log_LogRecord(level, msg, loggerName);
    }
    const curIndex = (this.curIndex_ + 1) % this.capacity_;
    this.curIndex_ = curIndex;
    if (this.isFull_) {
      const ret = this.buffer_[curIndex];
      ret.reset(level, msg, loggerName);
      return ret;
    }
    this.isFull_ = curIndex == this.capacity_ - 1;
    return this.buffer_[curIndex] =
               new log_LogRecord(level, msg, loggerName);
  }

  /**
   * Calls the given function for each buffered log record, starting with the
   * oldest one.
   * TODO(user): Make this a [Symbol.iterator] once all usages of
   * debug.LogBuffer can be deleted.
   * @param {!LogRecordHandler} func The function to call.
   */
  forEachRecord(func) {
    const buffer = this.buffer_;
    // Corner case: no records.
    if (!buffer[0]) {
      return;
    }
    const curIndex = this.curIndex_;
    let i = this.isFull_ ? curIndex : -1;
    do {
      i = (i + 1) % this.capacity_;
      func(/** @type {!log_LogRecord} */ (buffer[i]));
    } while (i !== curIndex);
  }

  /**
   * @return {boolean} Whether the log buffer is enabled.
   */
  isBufferingEnabled() {
    return this.capacity_ > 0;
  }

  /**
   * @return {boolean} Return whether the log buffer is full.
   */
  isFull() {
    return this.isFull_;
  }

  /**
   * Removes all buffered log records.
   */
  clear() {
    this.buffer_ = new Array(this.capacity_);
    this.curIndex_ = -1;
    this.isFull_ = false;
  }
};

/**
 * @type {!LogBuffer|undefined}
 * @private
 */
LogBuffer.instance_;

/**
 * @type {number} The number of log records to buffer. 0 means disable
 * buffering.
 */
const CAPACITY = 0;

/**
 * A static method that always returns the same instance of LogBuffer.
 * @return {!LogBuffer} The LogBuffer singleton instance.
 */
LogBuffer.getInstance = function() {
  if (!LogBuffer.instance_) {
    LogBuffer.instance_ =
        new LogBuffer(CAPACITY);
  }
  return LogBuffer.instance_;
};

/**
 * Whether the log buffer is enabled.
 * @return {boolean}
 */
LogBuffer.isBufferingEnabled = function() {
  return LogBuffer.getInstance().isBufferingEnabled();
};

/**
 * LogRecord objects are used to pass logging requests between the logging
 * framework and individual log handlers. These objects should not be
 * constructed or reset by application code.
 */
class log_LogRecord {
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
  constructor(level, msg, loggerName, time, sequenceNumber) {
    /**
     * Level of the LogRecord.
     * @type {!Level}
     * @private
     */
    this.level_;

    /**
     * Name of the logger that created the record.
     * @type {string}
     * @private
     */
    this.loggerName_;

    /**
     * Message associated with the record
     * @type {string}
     * @private
     */
    this.msg_;

    /**
     * Time the LogRecord was created.
     * @type {number}
     * @private
     */
    this.time_;

    /**
     * Sequence number for the LogRecord. Each record has a unique sequence
     * number that is greater than all log records created before it.
     * @type {number}
     * @private
     */
    this.sequenceNumber_;

    /**
     * Exception associated with the record
     * @type {?Object}
     * @private
     */
    this.exception_ = null;

    this.reset(
        level || Level.OFF, msg, loggerName, time, sequenceNumber);
  };

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
  reset(level, msg, loggerName, time, sequenceNumber) {
    this.time_ = time || google.now();
    this.level_ = level;
    this.msg_ = msg;
    this.loggerName_ = loggerName;
    this.exception_ = null;
    this.sequenceNumber_ = typeof sequenceNumber === 'number' ?
        sequenceNumber :
        log_LogRecord.nextSequenceNumber_;
  };

  /**
   * Gets the source Logger's name.
   *
   * @return {string} source logger name (may be null).
   */
  getLoggerName() {
    return this.loggerName_;
  };

  /**
   * Sets the source Logger's name.
   *
   * @param {string} name The logger name.
   */
  setLoggerName(name) {
    this.loggerName_ = name;
  };

  /**
   * Gets the exception that is part of the log record.
   *
   * @return {?Object} the exception.
   */
  getException() {
    return this.exception_;
  };

  /**
   * Sets the exception that is part of the log record.
   * @param {?Object} exception the exception.
   */
  setException(exception) {
    this.exception_ = exception;
  };

  /**
   * Gets the logging message level, for example Level.SEVERE.
   * @return {!Level} the logging message level.
   */
  getLevel() {
    return this.level_;
  };

  /**
   * Sets the logging message level, for example Level.SEVERE.
   * @param {!Level} level the logging message level.
   */
  setLevel(level) {
    this.level_ = level;
  };

  /**
   * Gets the "raw" log message, before localization or formatting.
   * @return {string} the raw message string.
   */
  getMessage() {
    return this.msg_;
  };

  /**
   * Sets the "raw" log message, before localization or formatting.
   *
   * @param {string} msg the raw message string.
   */
  setMessage(msg) {
    this.msg_ = msg;
  };

  /**
   * Gets event time in milliseconds since 1970.
   * @return {number} event time in millis since 1970.
   */
  getMillis() {
    return this.time_;
  };

  /**
   * Sets event time in milliseconds since 1970.
   * @param {number} time event time in millis since 1970.
   */
  setMillis(time) {
    this.time_ = time;
  };

  /**
   * Gets the sequence number. Sequence numbers are normally assigned when a
   * LogRecord is constructed or reset in incrementally increasing order.
   * @return {number}
   */
  getSequenceNumber() {
    return this.sequenceNumber_;
  };
};

/**
 * A sequence counter for assigning increasing sequence numbers to LogRecord
 * objects.
 * @type {number}
 * @private
 */
log_LogRecord.nextSequenceNumber_ = 0;

/**
 * A type that describes a function that handles logs.
 * @typedef {function(!log_LogRecord): ?}
 */
let LogRecordHandler;

/**
 * A LogRegistryEntry contains data about a Logger.
 * @package
 * @final
 */
class LogRegistryEntry {
  /**
   * @param {string} name
   * @param {!LogRegistryEntry|null=} parent
   */
  constructor(name, parent = null) {
    /**
     * The minimum log level that a message must be for it to be logged by the
     * Logger corresponding to this LogRegistryEntry. If null, the parent's
     * log level is used instead.
     * @type {?Level}
     */
    this.level = null;

    /**
     * A list of functions that will be called when the Logger corresponding to
     * this LogRegistryEntry is used to log a message.
     * @type {!Array<!LogRecordHandler>}
     */
    this.handlers = [];

    /**
     * A reference to LogRegistryEntry objects that correspond to the direct
     * ancestor of the Logger represented by this LogRegistryEntry object
     * (via name, treated as a dot-separated namespace).
     * @type {!LogRegistryEntry|null}
     */
    this.parent = parent || null;

    /**
     * A list of references to LogRegistryEntry objects that correspond to the
     * direct descendants of the Logger represented by this LogRegistryEntry
     * object (via name, treated as a dot-separated namespace).
     * @type {!Array<!LogRegistryEntry>}
     */
    this.children = [];

    /**
     * A reference to the Logger itself.
     * @type {!log_Logger}
     */
    this.logger = /** @type {!log_Logger} */ ({getName: () => name});
  }

  /**
   * Returns the effective level of the logger based on its ancestors' levels.
   * @return {!Level} The level.
   */
  getEffectiveLevel() {
    if (this.level) {
      return this.level;
    } else if (this.parent) {
      return this.parent.getEffectiveLevel();
    }
    asserts.fail('Root logger has no level set.');
    return Level.OFF;
  };

  /**
   * Calls the log handlers associated with this Logger, followed by those of
   * its parents, etc. until the root Logger's associated log handlers are
   * called.
   * @param {!log_LogRecord} logRecord The log record to pass to each
   *     handler.
   */
  publish(logRecord) {
    let target = this;
    while (target) {
      target.handlers.forEach(handler => {
        handler(logRecord);
      });
      target = target.parent;
    }
  }
};

/**
 * A LogRegistry owns references to all loggers, and is responsible for storing
 * all the internal state needed for loggers to operate correctly.
 *
 * @package
 * @final
 */
class LogRegistry {
  constructor() {
    /**
     * Per-log information retained by this LogRegistry.
     * @type {!Object<string, !LogRegistryEntry>}
     */
    this.entries = {};

    // The root logger.
    const rootLogRegistryEntry =
        new LogRegistryEntry(ROOT_LOGGER_NAME);
    rootLogRegistryEntry.level = Level.CONFIG;
    this.entries[ROOT_LOGGER_NAME] = rootLogRegistryEntry;
  }

  /**
   * Gets the LogRegistry entry under the given name, creating the entry if one
   * doesn't already exist.
   * @param {string} name The name to look up.
   * @param {?Level=} level If provided, override the default logging
   *     level of the returned Logger with the provided level.
   * @return {!LogRegistryEntry}
   */
  getLogRegistryEntry(name, level) {
    const entry = this.entries[name];
    if (entry) {
      if (level !== undefined) {
        entry.level = level;
      }
      return entry;
    } else {
      // The logger and its associated registry entry needs to be created.

      // Get its parent first.
      const lastDotIndex = name.lastIndexOf('.');
      const parentName = name.substr(0, lastDotIndex);
      const parentLogRegistryEntry = this.getLogRegistryEntry(parentName);

      // Now create the new entry, linking it with its parent.
      const logRegistryEntry =
          new LogRegistryEntry(name, parentLogRegistryEntry);
      this.entries[name] = logRegistryEntry;
      parentLogRegistryEntry.children.push(logRegistryEntry);

      if (level !== undefined) {
        logRegistryEntry.level = level;
      }

      return logRegistryEntry;
    }
  }

  /**
   * Get a list of all loggers.
   * @return {!Array<!log_Logger>}
   */
  getAllLoggers() {
    return Object.keys(this.entries)
        .map(loggerName => this.entries[loggerName].logger);
  }
};

/**
 * A static method that always returns the same instance of LogRegistry.
 * @return {!LogRegistry} The LogRegistry singleton instance.
 */
LogRegistry.getInstance = function() {
  if (!LogRegistry.instance_) {
    LogRegistry.instance_ = new LogRegistry();
  }
  return /** @type {!LogRegistry} */ (LogRegistry.instance_);
};

/**
 * @type {!LogRegistry|undefined}
 * @private
 */
LogRegistry.instance_;

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
function getLogger(name, level) {
  if (ENABLED) {
    const loggerEntry =
        LogRegistry.getInstance().getLogRegistryEntry(name, level);
    return loggerEntry.logger;
  } else {
    return null;
  }
};

/**
 * Returns the root logger.
 *
 * @return {!log_Logger|null} The root logger, or null if logging is
 *     disabled.
 */
function getRootLogger() {
  if (ENABLED) {
    const loggerEntry = LogRegistry.getInstance().getLogRegistryEntry(
        ROOT_LOGGER_NAME);
    return loggerEntry.logger;
  } else {
    return null;
  }
};

// TODO(johnlenz): try to tighten the types to these functions.
/**
 * Adds a handler to the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 * @param {?log_Logger} logger
 * @param {!LogRecordHandler} handler Handler function to
 *     add.
 */
function addHandler(logger, handler) {
  if (ENABLED && logger) {
    const loggerEntry = LogRegistry.getInstance().getLogRegistryEntry(
        logger.getName());
    loggerEntry.handlers.push(handler);
  }
};

/**
 * Removes a handler from the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 * @param {?log_Logger} logger
 * @param {!LogRecordHandler} handler Handler function to
 *     remove.
 * @return {boolean} Whether the handler was removed.
 */
function removeHandler(logger, handler) {
  if (ENABLED && logger) {
    const loggerEntry = LogRegistry.getInstance().getLogRegistryEntry(
        logger.getName());
    const indexOfHandler = loggerEntry.handlers.indexOf(handler);
    if (indexOfHandler !== -1) {
      loggerEntry.handlers.splice(indexOfHandler, 1);
      return true;
    }
  }
  return false;
};

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
function setLevel(logger, level) {
  if (ENABLED && logger) {
    const loggerEntry = LogRegistry.getInstance().getLogRegistryEntry(
        logger.getName());
    loggerEntry.level = level;
  }
};

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
function getLevel(logger) {
  if (ENABLED && logger) {
    const loggerEntry = LogRegistry.getInstance().getLogRegistryEntry(
        logger.getName());
    return loggerEntry.level;
  }
  return null;
};

/**
 * Returns the effective level of the logger based on its ancestors' levels.
 * @param {?log_Logger} logger
 * @return {!Level} The level.
 */
function getEffectiveLevel(logger) {
  if (ENABLED && logger) {
    const loggerEntry = LogRegistry.getInstance().getLogRegistryEntry(
        logger.getName());
    return loggerEntry.getEffectiveLevel();
  }
  return Level.OFF;
};

/**
 * Checks if a message of the given level would actually be logged by this
 * logger. This check is based on the goog.log.Loggers effective level, which
 * may be inherited from its parent.
 * @param {?log_Logger} logger
 * @param {?Level} level The level to check.
 * @return {boolean} Whether the message would be logged.
 */
function isLoggable(logger, level) {
  if (ENABLED && logger && level) {
    return level.value >= getEffectiveLevel(logger).value;
  }
  return false;
};

/**
 * Gets a list of all loggers.
 * @return {!Array<!log_Logger>}
 */
function getAllLoggers() {
  if (ENABLED) {
    return LogRegistry.getInstance().getAllLoggers();
  }
  return [];
};

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
function getLogRecord(logger, level, msg, exception) {
  const logRecord = LogBuffer.getInstance().addRecord(
      level || Level.OFF, msg, logger.getName());
  if (exception) {
    logRecord.setException(exception);
  }
  return logRecord;
};

/**
 * Logs a log_LogRecord. If the logger is currently enabled for the
 * given message level then the given message is forwarded to all the
 * registered output Handler objects.
 * TODO(user): Delete this method from the public API.
 * @param {?log_Logger} logger
 * @param {!log_LogRecord} logRecord A log record to log.
 */
function publishLogRecord(logger, logRecord) {
  if (ENABLED && logger &&
      isLoggable(logger, logRecord.getLevel())) {
    const loggerEntry = LogRegistry.getInstance().getLogRegistryEntry(
        logger.getName());
    loggerEntry.publish(logRecord);
  }
};

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
function log(logger, level, msg, exception) {
  if (ENABLED && logger && isLoggable(logger, level)) {
    level = level || Level.OFF;
    const loggerEntry = LogRegistry.getInstance().getLogRegistryEntry(
        logger.getName());
    // Message callbacks can be useful when a log message is expensive to build.
    if (typeof msg === 'function') {
      msg = msg();
    }
    const logRecord = LogBuffer.getInstance().addRecord(
        level, msg, logger.getName());
    if (exception) {
      logRecord.setException(exception);
    }
    // Publish logs.
    loggerEntry.publish(logRecord);
  }
};

/**
 * Logs a message at the Level.SEVERE level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {?log_Logger} logger
 * @param {!Loggable} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 */
function error(logger, msg, exception) {
  if (ENABLED && logger) {
    log(logger, Level.SEVERE, msg, exception);
  }
};

/**
 * Logs a message at the Level.WARNING level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {?log_Logger} logger
 * @param {!Loggable} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 */
function warning(logger, msg, exception) {
  if (ENABLED && logger) {
    log(logger, Level.WARNING, msg, exception);
  }
};

/**
 * Logs a message at the Level.INFO level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {?log_Logger} logger
 * @param {!Loggable} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 */
function info(logger, msg, exception) {
  if (ENABLED && logger) {
    log(logger, Level.INFO, msg, exception);
  }
};

/**
 * Logs a message at the Level.FINE level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {?log_Logger} logger
 * @param {!Loggable} msg The message to log.
 * @param {?Error|?Object=} exception An exception associated with the
 *     message.
 */
function fine(logger, msg, exception) {
  if (ENABLED && logger) {
    log(logger, Level.FINE, msg, exception);
  }
};

export {CAPACITY, ENABLED, Level, LogBuffer, LogRecordHandler, LogRegistry, LogRegistryEntry, Loggable, ROOT_LOGGER_NAME, addHandler, error, fine, getAllLoggers, getEffectiveLevel, getLevel, getLogRecord, getLogger, getRootLogger, info, isLoggable, log, log_LogRecord as LogRecord, log_Logger as Logger, publishLogRecord, removeHandler, setLevel, warning};