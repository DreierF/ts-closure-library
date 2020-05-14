/**
 * @fileoverview Generator for unique element IDs.
 */
/**
 * Creates a new id generator.
 * @final
 */
export class IdGenerator {
    /** @return {!IdGenerator} @suppress {checkTypes} */
    static getInstance(): IdGenerator;
    /**
     * Next unique ID to use
     * @type {number}
     * @private
     */
    private nextId_;
    /**
     * Random ID prefix to help avoid collisions with other closure JavaScript on
     * the same page that may initialize its own IdGenerator singleton.
     * @type {string}
     * @private
     */
    private idPrefix_;
    /**
     * Sets the ID prefix for this singleton. This is a temporary workaround to be
     * backwards compatible with code relying on the undocumented, but consistent,
     * behavior. In the future this will be removed and the prefix will be set to
     * a randomly generated string.
     * @param {string} idPrefix
     */
    setIdPrefix(idPrefix: string): void;
    /**
     * Gets the next unique ID.
     * @return {string} The next unique identifier.
     */
    getNextUniqueId(): string;
}
export namespace IdGenerator {
    export const instance_: undefined | IdGenerator;
}
