/**
 * The version of the platform. We don't determine the version of Linux.
 * For Windows, we only look at the NT version. Non-NT-based versions
 * (e.g. 95, 98, etc.) are given version 0.0.
 * @type {string}
 */
export let VERSION: string;
/**
 * Whether the user agent platform version is higher or the same as the given
 * version.
 *
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the user agent platform version is higher or the
 *     same as the given version.
 */
export function isVersion(version: string | number): boolean;
