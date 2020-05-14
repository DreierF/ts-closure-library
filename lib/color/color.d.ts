/**
 * HSL color representation. An array containing three elements [h, s, l]:
 * h (hue) must be an integer in [0, 360], cyclic.
 * s (saturation) must be a number in [0, 1].
 * l (lightness) must be a number in [0, 1].
 */
export type Hsl = number[];
/**
 * HSV color representation. An array containing three elements [h, s, v]:
 * h (hue) must be an integer in [0, 360], cyclic.
 * s (saturation) must be a number in [0, 1].
 * v (value/brightness) must be an integer in [0, 255].
 */
export type Hsv = number[];
/**
 * RGB color representation. An array containing three elements [r, g, b],
 * each an integer in [0, 255], representing the red, green, and blue components
 * of the color respectively.
 */
export type Rgb = number[];
/**
 * HSL color representation. An array containing three elements [h, s, l]:
 * h (hue) must be an integer in [0, 360], cyclic.
 * s (saturation) must be a number in [0, 1].
 * l (lightness) must be a number in [0, 1].
 * @typedef {Array<number>}
 */
export let Hsl: any;
/**
 * HSV color representation. An array containing three elements [h, s, v]:
 * h (hue) must be an integer in [0, 360], cyclic.
 * s (saturation) must be a number in [0, 1].
 * v (value/brightness) must be an integer in [0, 255].
 * @typedef {Array<number>}
 */
export let Hsv: any;
/**
 * @fileoverview Utilities related to color and color conversion.
 */
/**
 * RGB color representation. An array containing three elements [r, g, b],
 * each an integer in [0, 255], representing the red, green, and blue components
 * of the color respectively.
 * @typedef {Array<number>}
 */
export let Rgb: any;
/**
 * Blend two colors together, using the specified factor to indicate the weight
 * given to the first color
 * @param {?Rgb} rgb1 First color represented in rgb.
 * @param {?Rgb} rgb2 Second color represented in rgb.
 * @param {number} factor The weight to be given to rgb1 over rgb2. Values
 *     should be in the range [0, 1]. If less than 0, factor will be set to 0.
 *     If greater than 1, factor will be set to 1.
 * @return {!Rgb} Combined color represented in rgb.
 */
export function blend(rgb1: Rgb | null, rgb2: Rgb | null, factor: number): Rgb;
/**
 * Adds black to the specified color, darkening it
 * @param {?Rgb} rgb rgb representation of the color.
 * @param {number} factor Number in the range [0, 1]. 0 will do nothing, while
 *     1 will return black. If less than 0, factor will be set to 0. If greater
 *     than 1, factor will be set to 1.
 * @return {!Rgb} Combined rgb color.
 */
export function darken(rgb: Rgb | null, factor: number): Rgb;
/**
 * Converts a hex representation of a color to HSL.
 * @param {string} hex Color to convert.
 * @return {!Hsl} hsl representation of the color.
 */
export function hexToHsl(hex: string): Hsl;
/**
 * Converts a hex representation of a color to HSV
 * @param {string} hex Color to convert.
 * @return {!Hsv} hsv representation of the color.
 */
export function hexToHsv(hex: string): Hsv;
/**
 * Converts a hex representation of a color to RGB.
 * @param {string} hexColor Color to convert.
 * @return {!Rgb} rgb representation of the color.
 */
export function hexToRgb(hexColor: string): Rgb;
/**
 * Converts a hex representation of a color to RGB.
 * @param {string} hexColor Color to convert.
 * @return {string} string of the form 'rgb(R,G,B)' which can be used in
 *    styles.
 */
export function hexToRgbStyle(hexColor: string): string;
/**
 * Find the "best" (highest-contrast) of the suggested colors for the prime
 * color. Uses W3C formula for judging readability and visual accessibility:
 * http://www.w3.org/TR/AERT#color-contrast
 * @param {?Rgb} prime Color represented as a rgb array.
 * @param {Array<Rgb>} suggestions Array of colors,
 *     each representing a rgb array.
 * @return {!Rgb} Highest-contrast color represented by an array..
 */
export function highContrast(prime: Rgb | null, suggestions: Array<Rgb>): Rgb;
/**
 * Converts from an hsl array to a hex string
 * @param {?Hsl} hsl hsl representation of the color.
 * @return {string} hex representation of the color.
 */
export function hslArrayToHex(hsl: Hsl | null): string;
/**
 * Converts a color from HSL color space to RGB color space.
 * @param {?Hsl} hsl hsl representation of the color.
 * @return {!Rgb} rgb representation of the color.
 */
export function hslArrayToRgb(hsl: Hsl | null): Rgb;
/**
 * Calculates the Euclidean distance between two color vectors on an HSL sphere.
 * A demo of the sphere can be found at:
 * http://en.wikipedia.org/wiki/HSL_color_space
 * In short, a vector for color (H, S, L) in this system can be expressed as
 * (S*L'*cos(2*PI*H), S*L'*sin(2*PI*H), L), where L' = abs(L - 0.5), and we
 * simply calculate the 1-2 distance using these coordinates
 * @param {?Hsl} hsl1 First color in hsl representation.
 * @param {?Hsl} hsl2 Second color in hsl representation.
 * @return {number} Distance between the two colors, in the range [0, 1].
 */
export function hslDistance(hsl1: Hsl | null, hsl2: Hsl | null): number;
/**
 * Converts from h,s,l values to a hex string
 * @param {number} h Hue, in [0, 360].
 * @param {number} s Saturation, in [0, 1].
 * @param {number} l Luminosity, in [0, 1].
 * @return {string} hex representation of the color.
 */
export function hslToHex(h: number, s: number, l: number): string;
/**
 * Converts a color from HSL color space to RGB color space.
 * Modified from {@link http://www.easyrgb.com/math.html}
 * @param {number} h Hue, in [0, 360].
 * @param {number} s Saturation, in [0, 1].
 * @param {number} l Luminosity, in [0, 1].
 * @return {!Rgb} rgb representation of the color.
 */
export function hslToRgb(h: number, s: number, l: number): Rgb;
/**
 * Converts from an HSV array to a hex string
 * @param {?Hsv} hsv hsv representation of the color.
 * @return {string} hex representation of the color.
 */
export function hsvArrayToHex(hsv: Hsv | null): string;
/**
 * Converts an HSV triplet to an RGB array.
 * @param {?Hsv} hsv hsv representation of the color.
 * @return {!Rgb} rgb representation of the color.
 */
export function hsvArrayToRgb(hsv: Hsv | null): Rgb;
/**
 * Converts from h,s,v values to a hex string
 * @param {number} h Hue, in [0, 360].
 * @param {number} s Saturation, in [0, 1].
 * @param {number} v Value, in [0, 255].
 * @return {string} hex representation of the color.
 */
export function hsvToHex(h: number, s: number, v: number): string;
/**
 * Converts an HSV triplet to an RGB array.  V is brightness because b is
 *   reserved for blue in RGB.
 * @param {number} h Hue value in [0, 360].
 * @param {number} s Saturation value in [0, 1].
 * @param {number} brightness brightness in [0, 255].
 * @return {!Rgb} rgb representation of the color.
 */
export function hsvToRgb(h: number, s: number, brightness: number): Rgb;
/**
 * Determines if the given string can be parsed as a color.
 *     {@see parse}.
 * @param {string} str Potential color string.
 * @return {boolean} True if str is in a format that can be parsed to a color.
 */
export function isValidColor(str: string): boolean;
/**
 * Adds white to the specified color, lightening it
 * @param {?Rgb} rgb rgb representation of the color.
 * @param {number} factor Number in the range [0, 1].  0 will do nothing, while
 *     1 will return white. If less than 0, factor will be set to 0. If greater
 *     than 1, factor will be set to 1.
 * @return {!Rgb} Combined rgb color.
 */
export function lighten(rgb: Rgb | null, factor: number): Rgb;
/**
 * Normalize an hex representation of a color
 * @param {string} hexColor an hex color string.
 * @return {string} hex color in the format '#rrggbb' with all lowercase
 *     literals.
 */
export function normalizeHex(hexColor: string): string;
/**
 * Parses a color out of a string.
 * @param {string} str Color in some format.
 * @return {{hex: string, type: string}} 'hex' is a string containing a hex
 *     representation of the color, 'type' is a string containing the type
 *     of color format passed in ('hex', 'rgb', 'named').
 */
export function parse(str: string): {
    hex: string;
    type: string;
};
/**
 * Parses red, green, blue components out of a valid rgb color string.
 * Throws Error if the color string is invalid.
 * @param {string} str RGB representation of a color.
 *    {@see isValidRgbColor_}.
 * @return {!Rgb} rgb representation of the color.
 */
export function parseRgb(str: string): Rgb;
/**
 * Takes a string a prepends a '#' sign if one doesn't exist.
 * Small helper method for use by google.color and friends.
 * @param {string} str String to check.
 * @return {string} The value passed in, prepended with a '#' if it didn't
 *     already have one.
 */
export function prependHashIfNecessaryHelper(str: string): string;
/**
 * Takes a hex value and prepends a zero if it's a single digit.
 * Small helper method for use by google.color and friends.
 * @param {string} hex Hex value to prepend if single digit.
 * @return {string} hex value prepended with zero if it was single digit,
 *     otherwise the same value that was passed in.
 */
export function prependZeroIfNecessaryHelper(hex: string): string;
/**
 * Converts a color from RGB to hex representation.
 * @param {?Rgb} rgb rgb representation of the color.
 * @return {string} hex representation of the color.
 */
export function rgbArrayToHex(rgb: Rgb | null): string;
/**
 * Converts a color from RGB color space to HSL color space.
 * @param {?Rgb} rgb rgb representation of the color.
 * @return {!Hsl} hsl representation of the color.
 */
export function rgbArrayToHsl(rgb: Rgb | null): Hsl;
/**
 * Converts from an array of RGB values to an array of HSV values.
 * @param {?Rgb} rgb rgb representation of the color.
 * @return {!Hsv} hsv representation of the color.
 */
export function rgbArrayToHsv(rgb: Rgb | null): Hsv;
/**
 * Converts a color from RGB to hex representation.
 * @param {number} r Amount of red, int between 0 and 255.
 * @param {number} g Amount of green, int between 0 and 255.
 * @param {number} b Amount of blue, int between 0 and 255.
 * @return {string} hex representation of the color.
 */
export function rgbToHex(r: number, g: number, b: number): string;
/**
 * Converts a color from RGB color space to HSL color space.
 * Modified from {@link http://en.wikipedia.org/wiki/HLS_color_space}.
 * @param {number} r Value of red, in [0, 255].
 * @param {number} g Value of green, in [0, 255].
 * @param {number} b Value of blue, in [0, 255].
 * @return {!Hsl} hsl representation of the color.
 */
export function rgbToHsl(r: number, g: number, b: number): Hsl;
/**
 * Converts from RGB values to an array of HSV values.
 * @param {number} red Red value in [0, 255].
 * @param {number} green Green value in [0, 255].
 * @param {number} blue Blue value in [0, 255].
 * @return {!Hsv} hsv representation of the color.
 */
export function rgbToHsv(red: number, green: number, blue: number): Hsv;
