/**
 * @return {string} The browser version or empty string if version cannot be
 *     determined. Note that for Internet Explorer, this returns the version of
 *     the browser, not the version of the rendering engine. (IE 8 in
 *     compatibility mode will return 8.0 rather than 7.0. To determine the
 *     rendering engine version, look at document.documentMode instead. See
 *     http://msdn.microsoft.com/en-us/library/cc196988(v=vs.85).aspx for more
 *     details.)
 */
export function getVersion(): string;
/**
 * @return {boolean} Whether the user's browser is the Android browser.
 */
export function isAndroidBrowser(): boolean;
/**
 * @return {boolean} Whether the user's browser is any Chromium based browser (
 * Chrome, Blink-based Opera (15+) and Edge Chromium).
 */
export function isChrome(): boolean;
/**
 * @return {boolean} Whether the user's browser is Coast (Opera's Webkit-based
 *     iOS browser).
 */
export function isCoast(): boolean;
/**
 * @return {boolean} Whether the user's browser is EdgeHTML based Edge.
 */
export function isEdge(): boolean;
/**
 * @return {boolean} Whether the user's browser is Chromium based Edge.
 */
export function isEdgeChromium(): boolean;
/**
 * @return {boolean} Whether the user's browser is Firefox.
 */
export function isFirefox(): boolean;
/**
 * @return {boolean} Whether the user's browser is IE.
 */
export function isIE(): boolean;
/**
 * @return {boolean} Whether the user's browser is iOS Webview.
 */
export function isIosWebview(): boolean;
/**
 * @return {boolean} Whether the user's browser is Opera.
 */
export function isOpera(): boolean;
/**
 * @return {boolean} Whether the user's browser is Chromium based Opera.
 */
export function isOperaChromium(): boolean;
/**
 * @return {boolean} Whether the user's browser is Safari.
 */
export function isSafari(): boolean;
/**
 * For more information, see:
 * http://docs.aws.amazon.com/silk/latest/developerguide/user-agent.html
 * @return {boolean} Whether the user's browser is Silk.
 */
export function isSilk(): boolean;
/**
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the browser version is higher or the same as the
 *     given version.
 */
export function isVersionOrHigher(version: string | number): boolean;
