import * as google from './../google.js';
import {Level as Logger_Level} from './logger.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

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
class debug_LogRecord {

  /**
   * LogRecord objects are used to pass logging requests between
   * the logging framework and individual log Handlers.
   * @param {Logger_Level} level One of the level identifiers.
   * @param {string} msg The string message.
   * @param {string} loggerName The name of the source logger.
   * @param {number=} opt_time Time this log record was created if other than now.
   *     If 0, we use #goog.now.
   * @param {number=} opt_sequenceNumber Sequence number of this log record. This
   *     should only be passed in when restoring a log record from persistence.
   */
  constructor(
      level, msg, loggerName, opt_time, opt_sequenceNumber) {
    /**
     * Time the LogRecord was created.
     * @type {number}
     * @private
     */
    this.time_ = 0;
  
    /**
     * Level of the LogRecord
     * @type {Logger_Level}
     * @private
     */
    this.level_ = null;
  
    /**
     * Message associated with the record
     * @type {string}
     * @private
     */
    this.msg_ = '';
  
    /**
     * Name of the logger that created the record.
     * @type {string}
     * @private
     */
    this.loggerName_ = '';
  
    /**
     * Sequence number for the LogRecord. Each record has a unique sequence number
     * that is greater than all log records created before it.
     * @type {number}
     * @private
     */
    this.sequenceNumber_ = 0;
  
    /**
     * Exception associated with the record
     * @type {?Object}
     * @private
     */
    this.exception_ = null;
  
    this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber);
  }

  /**
   * Sets all fields of the log record.
   * @param {Logger_Level} level One of the level identifiers.
   * @param {string} msg The string message.
   * @param {string} loggerName The name of the source logger.
   * @param {number=} opt_time Time this log record was created if other than now.
   *     If 0, we use #goog.now.
   * @param {number=} opt_sequenceNumber Sequence number of this log record. This
   *     should only be passed in when restoring a log record from persistence.
   */
  reset(
      level, msg, loggerName, opt_time, opt_sequenceNumber) {
    if (ENABLE_SEQUENCE_NUMBERS) {
      this.sequenceNumber_ = typeof opt_sequenceNumber == 'number' ?
          opt_sequenceNumber :
          debug_LogRecord.nextSequenceNumber_++;
    }
  
    this.time_ = opt_time || google.now();
    this.level_ = level;
    this.msg_ = msg;
    this.loggerName_ = loggerName;
    delete this.exception_;
  };

  /**
   * Get the source Logger's name.
   *
   * @return {string} source logger name (may be null).
   */
  getLoggerName() {
    return this.loggerName_;
  };

  /**
   * Get the exception that is part of the log record.
   *
   * @return {Object} the exception.
   */
  getException() {
    return this.exception_;
  };

  /**
   * Set the exception that is part of the log record.
   *
   * @param {Object} exception the exception.
   */
  setException(exception) {
    this.exception_ = exception;
  };

  /**
   * Get the source Logger's name.
   *
   * @param {string} loggerName source logger name (may be null).
   */
  setLoggerName(loggerName) {
    this.loggerName_ = loggerName;
  };

  /**
   * Get the logging message level, for example Level.SEVERE.
   * @return {Logger_Level} the logging message level.
   */
  getLevel() {
    return this.level_;
  };

  /**
   * Set the logging message level, for example Level.SEVERE.
   * @param {Logger_Level} level the logging message level.
   */
  setLevel(level) {
    this.level_ = level;
  };

  /**
   * Get the "raw" log message, before localization or formatting.
   *
   * @return {string} the raw message string.
   */
  getMessage() {
    return this.msg_;
  };

  /**
   * Set the "raw" log message, before localization or formatting.
   *
   * @param {string} msg the raw message string.
   */
  setMessage(msg) {
    this.msg_ = msg;
  };

  /**
   * Get event time in milliseconds since 1970.
   *
   * @return {number} event time in millis since 1970.
   */
  getMillis() {
    return this.time_;
  };

  /**
   * Set event time in milliseconds since 1970.
   *
   * @param {number} time event time in millis since 1970.
   */
  setMillis(time) {
    this.time_ = time;
  };

  /**
   * Get the sequence number.
   * <p>
   * Sequence numbers are normally assigned in the LogRecord
   * constructor, which assigns unique sequence numbers to
   * each new LogRecord in increasing order.
   * @return {number} the sequence number.
   */
  getSequenceNumber() {
    return this.sequenceNumber_;
  };
}

/**
 * @type {boolean} Whether to enable log sequence numbers.
 */
const ENABLE_SEQUENCE_NUMBERS = true;

/**
 * A sequence counter for assigning increasing sequence numbers to LogRecord
 * objects.
 * @type {number}
 * @private
 */
debug_LogRecord.nextSequenceNumber_ = 0;

export {ENABLE_SEQUENCE_NUMBERS, debug_LogRecord as LogRecord};