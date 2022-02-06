/**
 * A helper function to check whether fullVersionList is available in the
 * current browser.
 * TODO(user): When fullVersionList is added, move hasFullVersionList()
 * to browser.js, and inline the browser version check. For example, if it is
 * implemented in Chromium 101, have hasFullVersionList simply return
 * `browser.versionOf(CHROMIUM) >= 101`.
 * @return {boolean}
 */
export function hasFullVersionList(): boolean;
/**
 * A test-only function to set whether it should be assumed fullVersionList is
 * available in the browser.
 * TODO(user): When fullVersionList is added, remove this function, as
 * behavior when fullVersionList is either present or absent would be testable
 * by setting the user agent and user agent data accordingly.
 * @param {boolean} value
 */
export function setHasFullVersionListForTesting(value: boolean): void;
/**
 * @type {!HighEntropyValue<!Array<!NavigatorUABrandVersion>>}
 */
export const fullVersionList: HighEntropyValue<Array<any>>;
/**
 * @type {!HighEntropyValue<string>}
 */
export const platformVersion: HighEntropyValue<string>;
/**
 * Reset all high-entropy values to their initial state.
 */
export function resetAllForTesting(): void;
import { HighEntropyValue } from "./highentropyvalue.js";
