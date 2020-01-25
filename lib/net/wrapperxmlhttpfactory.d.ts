/**
 * @fileoverview Implementation of XmlHttpFactory which allows construction from
 * simple factory methods.
 */
/**  Typedef. */
/**
 * An xhr factory subclass which can be constructed using two factory methods.
 * This exists partly to allow the preservation of goog.net.XmlHttp.setFactory()
 * with an unchanged signature.
 *     A function which returns a new XHR object.
 *     options associated with xhr objects from this factory.
 * @extends {NetXmlHttpFactory}
 * @final
 */
export class WrapperXmlHttpFactory extends NetXmlHttpFactory {
    /**
     * An xhr factory subclass which can be constructed using two factory methods.
     * This exists partly to allow the preservation of goog.net.XmlHttp.setFactory()
     * with an unchanged signature.
     * @param {function():!XhrLike.OrNative} xhrFactory
     *     A function which returns a new XHR object.
     * @param {function():!Object} optionsFactory A function which returns the
     *     options associated with xhr objects from this factory.
     */
    constructor(xhrFactory: () => XMLHttpRequest | XhrLike, optionsFactory: () => any);
    /**
     * XHR factory method.
     * @type {function() : !XhrLike.OrNative}
     * @private
     */
    xhrFactory_: () => XhrLike.OrNative;
    /**
     * Options factory method.
     * @type {function() : !Object}
     * @private
     */
    optionsFactory_: () => Object;
    /**
     * Never called as the only callsite is overwritten.
     * @override
     */
    internalGetOptions(): void;
}
import { XmlHttpFactory as NetXmlHttpFactory } from "./xmlhttpfactory.js";
import { XhrLike } from "./xhrlike.js";
