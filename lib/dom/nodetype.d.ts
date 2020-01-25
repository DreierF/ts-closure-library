/**
 * Constants for the nodeType attribute in the Node interface.
 *
 * These constants match those specified in the Node interface. These are
 * usually present on the Node object in recent browsers, but not in older
 * browsers (specifically, early IEs) and thus are given here.
 *
 * In some browsers (early IEs), these are not defined on the Node object,
 * so they are provided here.
 *
 * See http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1950641247
 */
export type NodeType = number;
export namespace NodeType {
    export const ELEMENT: number;
    export const ATTRIBUTE: number;
    export const TEXT: number;
    export const CDATA_SECTION: number;
    export const ENTITY_REFERENCE: number;
    export const ENTITY: number;
    export const PROCESSING_INSTRUCTION: number;
    export const COMMENT: number;
    export const DOCUMENT: number;
    export const DOCUMENT_TYPE: number;
    export const DOCUMENT_FRAGMENT: number;
    export const NOTATION: number;
}
