/**
 * ARIA state values for AutoCompleteValues.
 */
export type AutoCompleteValues = string;
/**
 * ARIA state values for CheckedValues.
 */
export type CheckedValues = string;
/**
 * ARIA state values for DropEffectValues.
 */
export type DropEffectValues = string;
/**
 * ARIA state values for ExpandedValues.
 */
export type ExpandedValues = string;
/**
 * ARIA state values for GrabbedValues.
 */
export type GrabbedValues = string;
/**
 * ARIA state values for InvalidValues.
 */
export type InvalidValues = string;
/**
 * ARIA state values for LivePriority.
 */
export type LivePriority = string;
/**
 * ARIA state values for OrientationValues.
 */
export type OrientationValues = string;
/**
 * ARIA state values for PressedValues.
 */
export type PressedValues = string;
/**
 * ARIA state values for RelevantValues.
 */
export type RelevantValues = string;
/**
 * ARIA state values for SelectedValues.
 */
export type SelectedValues = string;
/**
 * ARIA state values for SortValues.
 */
export type SortValues = string;
/**
 * ARIA states and properties.
 */
export type State = string;
export namespace AutoCompleteValues {
    export const INLINE: string;
    export const LIST: string;
    export const BOTH: string;
    export const NONE: string;
}
export namespace CheckedValues {
    export const TRUE: string;
    export const FALSE: string;
    export const MIXED: string;
    export const UNDEFINED: string;
}
export namespace DropEffectValues {
    export const COPY: string;
    export const MOVE: string;
    export const LINK: string;
    export const EXECUTE: string;
    export const POPUP: string;
    const NONE_1: string;
    export { NONE_1 as NONE };
}
export namespace ExpandedValues {
    const TRUE_1: string;
    export { TRUE_1 as TRUE };
    const FALSE_1: string;
    export { FALSE_1 as FALSE };
    const UNDEFINED_1: string;
    export { UNDEFINED_1 as UNDEFINED };
}
export namespace GrabbedValues {
    const TRUE_2: string;
    export { TRUE_2 as TRUE };
    const FALSE_2: string;
    export { FALSE_2 as FALSE };
    const UNDEFINED_2: string;
    export { UNDEFINED_2 as UNDEFINED };
}
export namespace InvalidValues {
    const FALSE_3: string;
    export { FALSE_3 as FALSE };
    const TRUE_3: string;
    export { TRUE_3 as TRUE };
    export const GRAMMAR: string;
    export const SPELLING: string;
}
export namespace LivePriority {
    export const OFF: string;
    export const POLITE: string;
    export const ASSERTIVE: string;
}
export namespace OrientationValues {
    export const VERTICAL: string;
    export const HORIZONTAL: string;
}
export namespace PressedValues {
    const TRUE_4: string;
    export { TRUE_4 as TRUE };
    const FALSE_4: string;
    export { FALSE_4 as FALSE };
    const MIXED_1: string;
    export { MIXED_1 as MIXED };
    const UNDEFINED_3: string;
    export { UNDEFINED_3 as UNDEFINED };
}
export namespace RelevantValues {
    export const ADDITIONS: string;
    export const REMOVALS: string;
    export const TEXT: string;
    export const ALL: string;
}
export namespace SelectedValues {
    const TRUE_5: string;
    export { TRUE_5 as TRUE };
    const FALSE_5: string;
    export { FALSE_5 as FALSE };
    const UNDEFINED_4: string;
    export { UNDEFINED_4 as UNDEFINED };
}
export namespace SortValues {
    export const ASCENDING: string;
    export const DESCENDING: string;
    const NONE_2: string;
    export { NONE_2 as NONE };
    export const OTHER: string;
}
export namespace State {
    export const ACTIVEDESCENDANT: string;
    export const ATOMIC: string;
    export const AUTOCOMPLETE: string;
    export const BUSY: string;
    export const CHECKED: string;
    export const COLINDEX: string;
    export const CONTROLS: string;
    export const DESCRIBEDBY: string;
    export const DISABLED: string;
    export const DROPEFFECT: string;
    export const EXPANDED: string;
    export const FLOWTO: string;
    export const GRABBED: string;
    export const HASPOPUP: string;
    export const HIDDEN: string;
    export const INVALID: string;
    export const LABEL: string;
    export const LABELLEDBY: string;
    export const LEVEL: string;
    export const LIVE: string;
    export const MULTILINE: string;
    export const MULTISELECTABLE: string;
    export const ORIENTATION: string;
    export const OWNS: string;
    export const POSINSET: string;
    export const PRESSED: string;
    export const READONLY: string;
    export const RELEVANT: string;
    export const REQUIRED: string;
    export const ROWINDEX: string;
    export const SELECTED: string;
    export const SETSIZE: string;
    export const SORT: string;
    export const VALUEMAX: string;
    export const VALUEMIN: string;
    export const VALUENOW: string;
    export const VALUETEXT: string;
}
