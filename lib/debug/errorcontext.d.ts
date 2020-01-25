/**
 * @fileoverview Provides methods dealing with context on error objects.
 */
/**
 * Adds key-value context to the error.
 * @param {!Error} err The error to add context to.
 * @param {string} contextKey Key for the context to be added.
 * @param {string} contextValue Value for the context to be added.
 */
export function addErrorContext(err: Error, contextKey: string, contextValue: string): void;
/**
 * @param {!Error} err The error to get context from.
 * @return {!Object<string, string>} The context of the provided error.
 */
export function getErrorContext(err: Error): {
    [x: string]: string;
};
