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
    const ELEMENT: number;
    const ATTRIBUTE: number;
    const TEXT: number;
    const CDATA_SECTION: number;
    const ENTITY_REFERENCE: number;
    const ENTITY: number;
    const PROCESSING_INSTRUCTION: number;
    const COMMENT: number;
    const DOCUMENT: number;
    const DOCUMENT_TYPE: number;
    const DOCUMENT_FRAGMENT: number;
    const NOTATION: number;
}
