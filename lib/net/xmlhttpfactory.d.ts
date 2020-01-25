export { net_XmlHttpFactory as XmlHttpFactory };
/**
 * @fileoverview Interface for a factory for creating XMLHttpRequest objects
 * and metadata about them.
 */
/**  Typedef. */
/**
 * Abstract base class for an XmlHttpRequest factory.
 * @abstract
 */
declare class net_XmlHttpFactory {
    /**
     * Cache of options - we only actually call internalGetOptions once.
     * @type {?Object}
     * @private
     */
    cachedOptions_: Object | null;
    /**
     * @return {!XhrLike.OrNative} A new XhrLike instance.
     * @abstract
     */
    createInstance(): XMLHttpRequest | XhrLike;
    /**
     * @return {?Object} Options describing how xhr objects obtained from this
     *     factory should be used.
     */
    getOptions(): any;
    /**
     * Override this method in subclasses to preserve the caching offered by
     * getOptions().
     * @return {?Object} Options describing how xhr objects obtained from this
     *     factory should be used.
     * @protected
     * @abstract
     */
    internalGetOptions(): any;
}
import { XhrLike } from "./xhrlike.js";
