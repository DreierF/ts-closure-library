/**
 * @type {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production. It can be easily stripped
 * by specifying --define DEBUG=false to the Closure Compiler aka
 * JSCompiler. For example, most toString() methods should be declared inside an
 * "if (DEBUG)" conditional because they are generally used for debugging
 * purposes and it is difficult for the JSCompiler to statically determine
 * whether they are used.
 */
export const DEBUG: boolean;
/**
 * @type {boolean} Whether code that calls {@link setTestOnly} should
 *     be disallowed in the compilation unit.
 */
export const DISALLOW_TEST_ONLY_CODE: boolean;
/**
 * @type {boolean} Whether to use a Chrome app CSP-compliant method for
 *     loading scripts via goog.require. @see appendScriptSrcNode_.
 */
export const ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING: boolean;
/**
 * @type {number} Integer year indicating the set of browser features that are
 * guaranteed to be present.  This is defined to include exactly features that
 * work correctly on all "modern" browsers that are stable on January 1 of the
 * specified year.  For example,
 * ```js
 * if (FEATURESET_YEAR >= 2019) {
 *   // use APIs known to be available on all major stable browsers Jan 1, 2019
 * } else {
 *   // polyfill for older browsers
 * }
 * ```
 * This is intended to be the primary define for removing
 * unnecessary browser compatibility code (such as ponyfills and workarounds),
 * and should inform the default value for most other defines:
 * ```js
 * const ASSUME_NATIVE_PROMISE =
 *     google.define('ASSUME_NATIVE_PROMISE', FEATURESET_YEAR >= 2016);
 * ```
 *
 * The default assumption is that IE9 is the lowest supported browser, which was
 * first available Jan 1, 2012.
 *
 * TODO(user): Reference more thorough documentation when it's available.
 */
export const FEATURESET_YEAR: number;
/**
 * Options bag type for `getMsg()` third argument.
 *
 * It is important to note that these options need to be known at compile time,
 * so they must always be provided to `getMsg()` as an actual object
 * literal in the function call. Otherwise, closure-compiler will report an
 * error.
 * @interface
 */
export function GetMsgOptions(): void;
export class GetMsgOptions {
    /**
     * If `true`, escape '<' in the message string to '&lt;'.
     *
     * Used by Closure Templates where the generated code size and performance is
     * critical which is why {@link goog.html.SafeHtmlFormatter} is not used.
     * The value must be literal `true` or `false`.
     * @type {boolean|undefined}
     */
    html: boolean | undefined;
    /**
     * If `true`, unescape common html entities: &gt;, &lt;, &apos;, &quot; and
     * &amp;.
     *
     * Used for messages not in HTML context, such as with the `textContent`
     * property.
     * The value must be literal `true` or `false`.
     * @type {boolean|undefined}
     */
    unescapeHtmlEntities: boolean | undefined;
    /**
     * Associates placeholder names with strings showing how their values are
     * obtained.
     *
     * This field is intended for use in automatically generated JS code.
     * Human-written code should use meaningful placeholder names instead.
     *
     * closure-compiler uses this as the contents of the `<ph>` tag in the
     * XMB file it generates or defaults to `-` for historical reasons.
     *
     * Must be an object literal.
     * Ignored at runtime.
     * Keys are placeholder names.
     * Values are string literals indicating how the value is obtained.
     * Typically this is a snippet of source code.
     * @type {!Object<string, string>|undefined}
     */
    original_code: {
        [x: string]: string;
    } | undefined;
    /**
     * Associates placeholder names with example values.
     *
     * closure-compiler uses this as the contents of the `<ex>` tag in the
     * XMB file it generates or defaults to `-` for historical reasons.
     *
     * Must be an object literal.
     * Ignored at runtime.
     * Keys are placeholder names.
     * Values are string literals containing example placeholder values.
     * (e.g. "George McFly" for a name placeholder)
     * @type {!Object<string, string>|undefined}
     */
    example: {
        [x: string]: string;
    } | undefined;
}
/**
 * @type {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define LOCALE=<locale_name>" as a compiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he).
 *
 */
export const LOCALE: string;
/**
 * @type {boolean} Whether the instances returned by defineClass should
 *     be sealed when possible.
 *
 * When sealing is disabled the constructor function will not be wrapped by
 * defineClass, making it incompatible with ES6 class methods.
 */
export const SEAL_CLASS_INSTANCES: boolean;
/**
 * @type {boolean} Whether this code is running on trusted sites.
 *
 * On untrusted sites, several native functions can be defined or overridden by
 * external libraries like Prototype, Datejs, and JQuery and setting this flag
 * to false forces closure to use its own implementations when possible.
 *
 * If your JavaScript can be loaded by a third party site and you are wary about
 * relying on non-standard implementations, specify
 * "--define TRUSTED_SITE=false" to the compiler.
 */
export const TRUSTED_SITE: boolean;
/**
 * @type {string} Trusted Types policy name. If non-empty then Closure will
 * use Trusted Types.
 */
export let TRUSTED_TYPES_POLICY_NAME: string;
/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of this 'pre-specified'.
 *
 * Remaining arguments specified at call-time are appended to the pre-specified
 * ones.
 *
 * Also see: {@link #partial}.
 *
 * Usage:
 * <pre>var barMethBound = bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @template T
 * @suppress {deprecated} See above.
 * @deprecated use `=> {}` or Function.prototype.bind instead.
 */
export function bind<T>(fn: ((this: T, ...arg1: any[]) => any) | null, selfObj: T, ...args: any[]): Function;
/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated cloneObject is unsafe. Prefer the google.object methods.
 */
export function cloneObject(obj: any): any;
/**
 * Creates Trusted Types policy if Trusted Types are supported by the browser.
 * The policy just blesses any string as a Trusted Type. It is not visibility
 * restricted because anyone can also call trustedTypes.createPolicy directly.
 * However, the allowed names should be restricted by a HTTP header and the
 * reference to the created policy should be visibility restricted.
 * @param {string} name
 * @return {?TrustedTypePolicy}
 */
export function createTrustedTypesPolicy(name: string): any | null;
/**
 * Creates a restricted form of a Closure "class":
 *   - from the compiler's perspective, the instance returned from the
 *     constructor is sealed (no new properties may be added).  This enables
 *     better checks.
 *   - the compiler will rewrite this definition to a form that is optimal
 *     for type checking and optimization (initially this will be a more
 *     traditional form).
 *
 * @param {?Function} superClass The superclass, Object or null.
 * @param {defineClass.ClassDescriptor} def
 *     An object literal describing
 *     the class.  It may have the following properties:
 *     "constructor": the constructor function
 *     "statics": an object literal containing methods to add to the constructor
 *        as "static" methods or a function that will receive the constructor
 *        function as its only parameter to which static properties can
 *        be added.
 *     all other properties are added to the prototype.
 * @return {!Function} The class constructor.
 * @deprecated Use ECMAScript class syntax instead.
 */
export function defineClass(superClass: Function | null, def: defineClass.ClassDescriptor): Function;
export namespace defineClass {
    function createSealingConstructor_(ctr: Function, superClass: Function | null): Function;
    const OBJECT_PROTOTYPE_FIELDS_: Array<string>;
    function applyProperties_(target: any, source: any): void;
    type ClassDescriptor = {
        constructor: Function | undefined;
        statics: any;
    };
}
/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {?Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */
export function exportProperty(object: any | null, publicName: string, symbol: any): void;
/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated, unless they are
 * exported in turn via this function or exportProperty.
 *
 * Also handy for making public items that are defined in anonymous closures.
 *
 * ex. exportSymbol('public.path.Foo', Foo);
 *
 * ex. exportSymbol('public.path.Foo.staticFunction', Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {?Object=} objectToExportTo The object to add the path to; default
 *     is window.
 */
export function exportSymbol(publicPath: string, object: any, objectToExportTo?: (any | null) | undefined): void;
/**
 * Forward declares a symbol. This is an indication to the compiler that the
 * symbol may be used in the source yet is not required and may not be provided
 * in compilation.
 *
 * The most common usage of forward declaration is code that takes a type as a
 * function parameter but does not need to require it. By forward declaring
 * instead of requiring, no hard dependency is made, and (if not required
 * elsewhere) the namespace may never be required and thus, not be pulled
 * into the JavaScript binary. If it is required elsewhere, it will be type
 * checked as normal.
 *
 * Before using forwardDeclare, please read the documentation at
 * https://github.com/google/closure-compiler/wiki/Bad-Type-Annotation to
 * understand the options and tradeoffs when working with forward declarations.
 *
 * @param {string} name The namespace to forward declare in the form of
 *     "goog.package.part".
 * @deprecated See go/noforwarddeclaration, Use `google.requireType` instead.
 */
export function forwardDeclare(name: string): void;
/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a hyphen and
 * passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which these
 * mappings are used. In the BY_PART style, each part (i.e. in between hyphens)
 * of the passed in css name is rewritten according to the map. In the BY_WHOLE
 * style, the full css name is looked up in the map directly. If a rewrite is
 * not specified by the map, the compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls to
 * getCssName with the strings from the mapping, e.g.
 *     var x = getCssName('foo');
 *     var y = getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x = 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed only the
 * modifier will be processed, as it is assumed the first argument was generated
 * as a result of calling getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */
export function getCssName(className: string, opt_modifier?: string | undefined): string;
/**
 * Same as `LOCALE`, which should be used instead.
 *
 * Using this method just makes it harder for closure-compiler to optimize
 * your locale-specific code, since it has to take the extra step of inlining
 * this function to discover and remove code that is not used for the target
 * locale.
 *
 * @return {string}
 * @deprecated use `LOCALE`
 */
export function getLocale(): string;
/**
 * Gets a localized message.
 *
 * This function is a compiler primitive. If you give the compiler a localized
 * message bundle, it will replace the string at compile-time with a localized
 * version, and expand getMsg call to a concatenated string.
 *
 * Messages must be initialized in the form:
 * <code>
 * var MSG_NAME = getMsg('Hello {$placeholder}', {'placeholder': 'world'});
 * </code>
 *
 * This function produces a string which should be treated as plain text. Use
 * {@link goog.html.SafeHtmlFormatter} in conjunction with getMsg to
 * produce SafeHtml.
 *
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {!Object<string, string>=} opt_values Maps place holder name to value.
 * @param {!GetMsgOptions=} opt_options see `GetMsgOptions`
 * @return {string} message with placeholders filled.
 */
export function getMsg(str: string, opt_values?: {
    [x: string]: string;
} | undefined, opt_options?: GetMsgOptions | undefined): string;
/**
 * Gets a localized message. If the message does not have a translation, gives a
 * fallback message.
 *
 * This is useful when introducing a new message that has not yet been
 * translated into all languages.
 *
 * This function is a compiler primitive. Must be used in the form:
 * <code>var x = getMsgWithFallback(MSG_A, MSG_B);</code>
 * where MSG_A and MSG_B were initialized with getMsg.
 *
 * @param {string} a The preferred message.
 * @param {string} b The fallback message.
 * @return {string} The best translated message.
 */
export function getMsgWithFallback(a: string, b: string): string;
/**
 * Forward declare type information. Used to assign types to window
 * referenced object that would otherwise result in unknown type references
 * and thus block property disambiguation.
 */
/**
 * Returns an object based on its fully qualified external name.  The object
 * is not found if null or undefined.  If you are using a compilation pass that
 * renames property names beware that using this function will not find renamed
 * properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |window|.
 * @return {?} The value (object or primitive) or, if not found, null.
 */
export function getObjectByName(name: string, opt_obj?: any | undefined): unknown;
/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. The unique ID is
 * guaranteed to be unique across the current session amongst objects that are
 * passed into `getUid`. There is no guarantee that the ID is unique or
 * consistent across sessions. It is unsafe to generate unique ID for function
 * prototypes.
 *
 * @param {?Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
export function getUid(obj: any | null): number;
/**
 * Evals JavaScript in the global scope.
 *
 * Throws an exception if neither execScript or eval is defined.
 * @param {string|!TrustedScript} script JavaScript string.
 */
export function globalEval(script: string | any): void;
/**
 * Whether the given object is already assigned a unique ID.
 *
 * This does not modify the object.
 *
 * @param {!Object} obj The object to check.
 * @return {boolean} Whether there is an assigned unique id for the object.
 */
export function hasUid(obj: any): boolean;
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * @param {!Function} childCtor Child class.
 * @param {!Function} parentCtor Parent class.
 * @suppress {strictMissingProperties} superClass_ and base is not defined on
 *    Function.
 * @deprecated Use ECMAScript class syntax instead.
 */
export function inherits(childCtor: Function, parentCtor: Function): void;
/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property. Note that for this function neither strings nor functions are
 * considered "array-like".
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
export function isArrayLike(val: unknown): boolean;
/**
 * Returns true if the object looks like a Date. To qualify as Date-like the
 * value needs to be an object and have a getFullYear() function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
export function isDateLike(val: unknown): boolean;
/**
 * Returns true if the specified value is an object.  This includes arrays and
 * functions.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
export function isObject(val: unknown): val is object;
/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 * @deprecated Use Date.now
 */
export function now(): number;
/**
 * Like bind(), except that a 'this object' is not required. Useful when
 * the target function is already bound.
 *
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {?Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially applied to fn.
 * @return {!Function} A partially-applied form of the function partial()
 *     was invoked as a method of.
 */
export function partial(fn: Function | null, ...args: any[]): Function;
/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using `getUid` in which case the mutation is
 * undone.
 * @param {?Object} obj The object to remove the unique ID field from.
 */
export function removeUid(obj: any | null): void;
/**
 * Sets the map to check when returning a value from getCssName(). Example:
 * <pre>
 * setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = getCssName('goog');
 * // The following evaluates to: "a a-b".
 * getCssName('goog') + ' ' + getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to getCssName() using the supplied map if the
 * --process_closure_primitives flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} opt_style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see getCssName for a description.
 */
export function setCssNameMapping(mapping: any, opt_style?: string | undefined): void;
/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 *
 * In the case of unit tests, the message may optionally be an exact namespace
 * for the test (e.g. 'goog.stringTest'). The linter will then ignore the extra
 * provide (if not explicitly defined in the code).
 *
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
export function setTestOnly(opt_message?: string | undefined): void;
/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {?} value The value to get the type of.
 * @return {string} The name of the type.
 */
export function typeOf(value: unknown): string;
