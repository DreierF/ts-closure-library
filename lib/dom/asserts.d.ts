/**
 * Asserts that a given object is a HTMLAnchorElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not of type Location nor a subtype
 * of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLAnchorElement}
 * @deprecated Use asserts.dom.assertIsHtmlAnchorElement instead.
 */
export function assertIsHTMLAnchorElement(o: any | null): HTMLAnchorElement;
/**
 * Asserts that a given object is a HTMLAudioElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLAudioElement}
 * @deprecated Use asserts.dom.assertIsHtmlAudioElement instead.
 */
export function assertIsHTMLAudioElement(o: any | null): HTMLAudioElement;
/**
 * Asserts that a given object is a HTMLButtonElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLButtonElement}
 * @deprecated Use asserts.dom.assertIsHtmlButtonElement instead.
 */
export function assertIsHTMLButtonElement(o: any | null): HTMLButtonElement;
/**
 * Asserts that a given object is a HTMLCanvasElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLCanvasElement}
 * @deprecated Use asserts.dom.assertIsHtmlCanvasElement instead.
 */
export function assertIsHTMLCanvasElement(o: any | null): HTMLCanvasElement;
/**
 * Asserts that a given object is a HTMLEmbedElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLEmbedElement}
 * @deprecated Use asserts.dom.assertIsHtmlEmbedElement instead.
 */
export function assertIsHTMLEmbedElement(o: any | null): HTMLEmbedElement;
/**
 * Asserts that a given object is a HTMLFormElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLFormElement}
 * @deprecated Use asserts.dom.assertIsHtmlFormElement instead.
 */
export function assertIsHTMLFormElement(o: any | null): HTMLFormElement;
/**
 * Asserts that a given object is a HTMLFrameElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLFrameElement}
 * @deprecated Use asserts.dom.assertIsHtmlFrameElement instead.
 */
export function assertIsHTMLFrameElement(o: any | null): HTMLFrameElement;
/**
 * Asserts that a given object is a HTMLIFrameElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLIFrameElement}
 * @deprecated Use asserts.dom.assertIsHtmlIFrameElement instead.
 */
export function assertIsHTMLIFrameElement(o: any | null): HTMLIFrameElement;
/**
 * Asserts that a given object is a HTMLImageElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLImageElement}
 * @deprecated Use asserts.dom.assertIsHtmlImageElement instead.
 */
export function assertIsHTMLImageElement(o: any | null): HTMLImageElement;
/**
 * Asserts that a given object is a HTMLInputElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLInputElement}
 * @deprecated Use asserts.dom.assertIsHtmlInputElement instead.
 */
export function assertIsHTMLInputElement(o: any | null): HTMLInputElement;
/**
 * Asserts that a given object is a HTMLLinkElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLLinkElement}
 * @deprecated Use asserts.dom.assertIsHtmlLinkElement instead.
 */
export function assertIsHTMLLinkElement(o: any | null): HTMLLinkElement;
/**
 * Asserts that a given object is a HTMLObjectElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLObjectElement}
 * @deprecated Use asserts.dom.assertIsHtmlObjectElement instead.
 */
export function assertIsHTMLObjectElement(o: any | null): HTMLObjectElement;
/**
 * Asserts that a given object is a HTMLScriptElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLScriptElement}
 * @deprecated Use asserts.dom.assertIsHtmlScriptElement instead.
 */
export function assertIsHTMLScriptElement(o: any | null): HTMLScriptElement;
/**
 * Asserts that a given object is a HTMLTextAreaElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLTextAreaElement}
 * @deprecated Use asserts.dom.assertIsHtmlTextAreaElement instead.
 */
export function assertIsHTMLTextAreaElement(o: any | null): HTMLTextAreaElement;
/**
 * Asserts that a given object is a HTMLVideoElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLVideoElement}
 * @deprecated Use asserts.dom.assertIsHtmlVideoElement instead.
 */
export function assertIsHTMLVideoElement(o: any | null): HTMLVideoElement;
/**
 * @fileoverview Custom assertions to ensure that an element has the appropriate
 * type.
 *
 * Using a goog.dom.safe wrapper on an object on the incorrect type (via an
 * incorrect static type cast) can result in security bugs: For instance,
 * g.d.s.setAnchorHref ensures that the URL assigned to the .href attribute
 * satisfies the SafeUrl contract, i.e., is safe to dereference as a hyperlink.
 * However, the value assigned to a HTMLLinkElement's .href property requires
 * the stronger TrustedResourceUrl contract, since it can refer to a stylesheet.
 * Thus, using g.d.s.setAnchorHref on an (incorrectly statically typed) object
 * of type HTMLLinkElement can result in a security vulnerability.
 * Assertions of the correct run-time type help prevent such incorrect use.
 *
 * In some cases, code using the DOM API is tested using mock objects (e.g., a
 * plain object such as {'href': url} instead of an actual Location object).
 * To allow such mocking, the assertions permit objects of types that are not
 * relevant DOM API objects at all (for instance, not Element or Location).
 *
 * Note that instanceof checks don't work straightforwardly in older versions of
 * IE, or across frames (see,
 * http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object,
 * http://stackoverflow.com/questions/26248599/instanceof-htmlelement-in-iframe-is-not-element-or-object).
 *
 * Hence, these assertions may pass vacuously in such scenarios. The resulting
 * risk of security bugs is limited by the following factors:
 *  - A bug can only arise in scenarios involving incorrect static typing (the
 *    wrapper methods are statically typed to demand objects of the appropriate,
 *    precise type).
 *  - Typically, code is tested and exercised in multiple browsers.
 */
/**
 * Asserts that a given object is a Location.
 *
 * To permit this assertion to pass in the context of tests where DOM APIs might
 * be mocked, also accepts any other type except for subtypes of {!Element}.
 * This is to ensure that, for instance, HTMLLinkElement is not being used in
 * place of a Location, since this could result in security bugs due to stronger
 * contracts required for assignments to the href property of the latter.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!Location}
 */
export function assertIsLocation(o: any | null): Location;
