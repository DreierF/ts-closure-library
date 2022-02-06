/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Utilities used by goog.labs.userAgent tools. These functions
 * should not be used outside of goog.labs.userAgent.*.
 *
 */
/**
 * @const {boolean} If true, use navigator.userAgentData without check.
 * TODO(user): FEATURESET_YEAR >= 2022 if it supports mobile and all the
 * brands we need.  See https://caniuse.com/mdn-api_navigator_useragentdata.
 */
export const ASSUME_CLIENT_HINTS_SUPPORT: false;
/**
 * Parses the user agent into tuples for each section.
 * @param {string} userAgent
 * @return {!Array<!Array<string>>} Tuples of key, version, and the contents of
 *     the parenthetical.
 */
export function extractVersionTuples(userAgent: string): Array<Array<string>>;
/**
 * Gets the native userAgent string from navigator if it exists.
 * If navigator or navigator.userAgent string is missing, returns an empty
 * string.
 * @return {string}
 */
export function getNativeUserAgentString(): string;
/** @return {string} The user agent string. */
export function getUserAgent(): string;
/** @return {?NavigatorUAData} Navigator.userAgentData if exist */
export function getUserAgentData(): any | null;
/**
 * @param {string} str
 * @return {boolean} Whether the user agent contains the given string.
 */
export function matchUserAgent(str: string): boolean;
/**
 * Checks if any string in userAgentData.brands matches str.
 * Returns false if userAgentData is not supported.
 * @param {string} str
 * @return {boolean} Whether any brand string from userAgentData contains the
 *     given string.
 */
export function matchUserAgentDataBrand(str: string): boolean;
/**
 * @param {string} str
 * @return {boolean} Whether the user agent contains the given string, ignoring
 *     case.
 */
export function matchUserAgentIgnoreCase(str: string): boolean;
/**
 * If the user agent data object was overridden using setUserAgentData,
 * reset it so that it uses the native browser object instead, if it exists.
 */
export function resetUserAgentData(): void;
/**
 * Override the user agent string with the given value.
 * This should only be used for testing within the goog.labs.userAgent
 * namespace.
 * Pass `null` to use the native browser object instead.
 * @param {?string=} userAgent The userAgent override.
 * @return {void}
 */
export function setUserAgent(userAgent?: (string | null) | undefined): void;
/**
 * Override the user agent data object with the given value.
 * This should only be used for testing within the goog.labs.userAgent
 * namespace.
 * Pass `null` to specify the absence of userAgentData. Note that this behavior
 * is different from setUserAgent.
 * @param {?NavigatorUAData} userAgentData The userAgentData override.
 */
export function setUserAgentData(userAgentData: any | null): void;
