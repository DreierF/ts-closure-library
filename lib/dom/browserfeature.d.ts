/**
 * @fileoverview Browser capability checks for the dom package.
 */
/**
 * @type {boolean} Whether we know at compile time that the browser doesn't
 * support OffscreenCanvas.
 */
export const ASSUME_NO_OFFSCREEN_CANVAS: boolean;
/**
 * @type {boolean} Whether we know at compile time that the browser supports
 * all OffscreenCanvas contexts.
 */
export const ASSUME_OFFSCREEN_CANVAS: boolean;
/**
 * Whether attributes 'name' and 'type' can be added to an element after it's
 * created. False in Internet Explorer prior to version 9.
 * @const {boolean}
 */
export let CAN_ADD_NAME_OR_TYPE_ATTRIBUTES: boolean;
/**
 * Whether we can use element.children to access an element's Element
 * children. Available since Gecko 1.9.1, IE 9. (IE<9 also includes comment
 * nodes in the collection.)
 * @const {boolean}
 */
export let CAN_USE_CHILDREN_ATTRIBUTE: boolean;
/**
 * Opera, Safari 3, and Internet Explorer 9 all support innerText but they
 * include text nodes in script and style tags. Not document-mode-dependent.
 * @const {boolean}
 */
export let CAN_USE_INNER_TEXT: boolean;
/**
 * MSIE, Opera, and Safari>=4 support element.parentElement to access an
 * element's parent if it is an Element.
 * @const {boolean}
 */
export let CAN_USE_PARENT_ELEMENT_PROPERTY: boolean;
/**
 * Whether NoScope elements need a scoped element written before them in
 * innerHTML.
 * MSDN: http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx#1
 * @const {boolean}
 */
export let INNER_HTML_NEEDS_SCOPED_ELEMENT: boolean;
/**
 * Whether we use legacy IE range API.
 * @const {boolean}
 */
export let LEGACY_IE_RANGES: boolean;
/**
 * Whether the browser supports OffscreenCanvas 2D context.
 * @const {boolean}
 */
export let OFFSCREEN_CANVAS_2D: boolean;
